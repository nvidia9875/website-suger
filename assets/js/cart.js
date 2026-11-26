/* SNCart — カートのロジック（UIは goods.js が描画する）
 * ・localStorage に永続（キー sn-cart）
 * ・合計 / 点数 / まとめ買い特典（¥10,000 / ¥20,000）の進捗を算出
 * ・購入手続きは lines() を SNShop.checkout（Shopify にカートを作らせる）へ渡す。
 *   通信できないときの予備が Shopify のカートパーマリンク（checkoutUrl）
 *   例: https://www.sugarnote.store/cart/47393203257580:1,47393174913260:2
 * ・売り切れ（variant.soldOut。shopify.js が反映）の行はカートに残すが、合計・購入手続きには含めない
 * ・入力欄の値（f = { id: 値 }。goods-data.js の fields がある商品だけ。宛名・希望コメントなど）は行ごとに持つ。
 *   同じバリアントでも値が違えば別の行。Shopify には lines[].attributes（項目名 = 欄の key）で渡す（カートパーマリンクでは渡せない）
 * ・行の操作（setQty / remove）は entries() の index で指す
 */
function SNCart(storageKey) {
  "use strict";
  var items = load();
  var listeners = [];

  function clampQty(n) {
    n = Math.floor(Number(n));
    return n >= 1 ? Math.min(n, 99) : 0;
  }
  function load() {
    try {
      var raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      /* 実在する商品・バリアントだけ、数量は 1〜99 の整数に正規化して復元する（商品改訂・改ざんに耐える） */
      return parsed.map(function (it) {
        if (!it || typeof it !== "object") return null;
        var p = String(it.p || ""), v = String(it.v || ""), q = clampQty(it.q);
        if (!GoodsUtil.variant(p, v) || !q) return null;
        var prod = GoodsUtil.product(p);
        /* 旧形式（宛名だけを n に持っていた）は宛名欄の値として読む */
        var raw = it.f && typeof it.f === "object" ? it.f : it.n ? { nickname: it.n } : null;
        var f = GoodsUtil.cleanFields(prod, raw);
        return f ? { p: p, v: v, q: q, f: f } : { p: p, v: v, q: q };
      }).filter(Boolean);
    } catch (e) {
      return [];
    }
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(items)); } catch (e) { /* private mode 等では永続なしで続行 */ }
  }
  function emit() { save(); listeners.forEach(function (fn) { fn(api); }); }
  function fieldsKey(f) { return f ? JSON.stringify(f) : ""; }
  function find(p, v, f) {
    var k = fieldsKey(f);
    return items.find(function (it) { return it.p === p && it.v === v && fieldsKey(it.f) === k; });
  }
  /* 必須の欄が空の行（あとから required にした等）。購入手続きには含めない */
  function needsFields(it) {
    return GoodsUtil.fieldsOf(GoodsUtil.product(it.p)).some(function (fd) { return fd.required && !(it.f && it.f[fd.id]); });
  }
  function buyable(it) {
    var v = GoodsUtil.variant(it.p, it.v);
    return v && !v.soldOut && !needsFields(it) ? v : null;
  }
  function sidOf(v) { return String(v.sid).replace(/\D/g, ""); }

  save(); /* 正規化した内容で保存し直す */

  var api = {
    onChange: function (fn) { listeners.push(fn); },
    entries: function () {
      return items.map(function (it, i) {
        var prod = GoodsUtil.product(it.p);
        /* fields: 入力のある欄だけ [{ id, value }]（欄の順） */
        var fields = GoodsUtil.fieldsOf(prod).filter(function (fd) { return it.f && it.f[fd.id]; })
          .map(function (fd) { return { id: fd.id, value: it.f[fd.id] }; });
        return { index: i, product: prod, variant: GoodsUtil.variant(it.p, it.v), qty: it.q, p: it.p, v: it.v,
          fields: fields, needsFields: needsFields(it) };
      });
    },
    /* values: { 欄の id: 値 }（欄の無い商品では無視）。必須の欄が空なら入れない（false を返す） */
    add: function (p, v, qty, values) {
      var variant = GoodsUtil.variant(p, v);
      if (!variant || variant.soldOut) return false;
      var prod = GoodsUtil.product(p);
      var f = GoodsUtil.cleanFields(prod, values);
      if (GoodsUtil.fieldsOf(prod).some(function (fd) { return fd.required && !(f && f[fd.id]); })) return false;
      qty = clampQty(qty) || 1;
      var hit = find(p, v, f);
      if (hit) hit.q = Math.min(hit.q + qty, 99);
      else items.push(f ? { p: p, v: v, q: qty, f: f } : { p: p, v: v, q: qty });
      emit();
      return true;
    },
    setQty: function (index, qty) {
      var hit = items[index];
      if (!hit) return;
      hit.q = clampQty(qty);
      if (hit.q <= 0) items = items.filter(function (it) { return it !== hit; });
      emit();
    },
    remove: function (index) { items = items.filter(function (it, i) { return i !== index; }); emit(); },
    clear: function () { items = []; emit(); },
    count: function () { return items.reduce(function (s, it) { return s + it.q; }, 0); },
    /* 購入手続きに進める点数（売り切れを除く） */
    buyableCount: function () { return items.reduce(function (s, it) { return s + (buyable(it) ? it.q : 0); }, 0); },
    total: function () {
      return items.reduce(function (s, it) {
        var variant = buyable(it);
        return s + (variant ? variant.price * it.q : 0);
      }, 0);
    },
    /* SNShop.checkout に渡す行（売り切れを除く）。入力欄の値は attributes に Shopify の項目名（欄の key）で入れる */
    lines: function () {
      return items.map(function (it) {
        var v = buyable(it);
        if (!v) return null;
        var line = { sid: sidOf(v), qty: clampQty(it.q) };
        var attrs = GoodsUtil.fieldsOf(GoodsUtil.product(it.p))
          .filter(function (fd) { return it.f && it.f[fd.id]; })
          .map(function (fd) { return { key: fd.key, value: it.f[fd.id] }; });
        if (attrs.length) line.attributes = attrs;
        return line;
      }).filter(Boolean);
    },
    /* 入力欄の値が入った行があるか（あればカートパーマリンクでは代わりにならない） */
    hasAttributes: function () { return this.lines().some(function (l) { return !!l.attributes; }); },
    /* 予備の購入手続き URL（カートパーマリンク）。空カート時はストアのカートページ */
    checkoutUrl: function () {
      var parts = this.lines().map(function (l) { return l.sid + ":" + l.qty; });
      return parts.length ? GOODS.store.checkoutBase + "/cart/" + parts.join(",") : GOODS.store.checkoutBase + "/cart";
    },
    /* 特典進捗: 各ティアの獲得枚数と「次まであといくら」 */
    bonus: function () {
      var total = this.total();
      var tiers = GOODS.bonus.tiers.map(function (t) {
        return Object.assign({}, t, {
          earned: Math.floor(total / t.threshold),
          next: t.threshold - (total % t.threshold),
          progress: (total % t.threshold) / t.threshold,
        });
      });
      return { total: total, tiers: tiers };
    },
  };
  return api;
}
