/* SNCart — カートのロジック（UIは goods.js が描画する）
 * ・localStorage に永続（キー sn-cart）
 * ・合計 / 点数 / まとめ買い特典（¥10,000 / ¥20,000）の進捗を算出
 * ・購入手続きは lines() を SNShop.checkout（Shopify にカートを作らせる）へ渡す。
 *   通信できないときの予備が Shopify のカートパーマリンク（checkoutUrl）
 *   例: https://www.sugarnote.store/cart/47393203257580:1,47393174913260:2
 * ・売り切れ（variant.soldOut。shopify.js が反映）の行はカートに残すが、合計・購入手続きには含めない
 * ・宛名（n。goods-data.js の nickname がある商品だけ）は行ごとに持つ。同じバリアントでも宛名が違えば別の行。
 *   Shopify には lines[].attributes で渡す（カートパーマリンクでは渡せない）
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
        var nick = GoodsUtil.nicknameOf(GoodsUtil.product(p));
        var n = nick ? GoodsUtil.cleanNickname(it.n, nick.max) : "";
        return n ? { p: p, v: v, q: q, n: n } : { p: p, v: v, q: q };
      }).filter(Boolean);
    } catch (e) {
      return [];
    }
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(items)); } catch (e) { /* private mode 等では永続なしで続行 */ }
  }
  function emit() { save(); listeners.forEach(function (fn) { fn(api); }); }
  function find(p, v, n) { return items.find(function (it) { return it.p === p && it.v === v && (it.n || "") === n; }); }
  /* 宛名が必須の商品なのに宛名が無い行（あとから required にした等）。購入手続きには含めない */
  function needsNickname(it) {
    var nick = GoodsUtil.nicknameOf(GoodsUtil.product(it.p));
    return !!(nick && nick.required && !it.n);
  }
  function buyable(it) {
    var v = GoodsUtil.variant(it.p, it.v);
    return v && !v.soldOut && !needsNickname(it) ? v : null;
  }
  function sidOf(v) { return String(v.sid).replace(/\D/g, ""); }

  save(); /* 正規化した内容で保存し直す */

  var api = {
    onChange: function (fn) { listeners.push(fn); },
    entries: function () {
      return items.map(function (it, i) {
        return { index: i, product: GoodsUtil.product(it.p), variant: GoodsUtil.variant(it.p, it.v), qty: it.q, p: it.p, v: it.v,
          nickname: it.n || "", needsNickname: needsNickname(it) };
      });
    },
    /* nickname: 宛名（nickname 設定の無い商品では無視）。required の商品で空なら入れない（false を返す） */
    add: function (p, v, qty, nickname) {
      var variant = GoodsUtil.variant(p, v);
      if (!variant || variant.soldOut) return false;
      var nick = GoodsUtil.nicknameOf(GoodsUtil.product(p));
      var n = nick ? GoodsUtil.cleanNickname(nickname, nick.max) : "";
      if (nick && nick.required && !n) return false;
      qty = clampQty(qty) || 1;
      var hit = find(p, v, n);
      if (hit) hit.q = Math.min(hit.q + qty, 99);
      else items.push(n ? { p: p, v: v, q: qty, n: n } : { p: p, v: v, q: qty });
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
    /* SNShop.checkout に渡す行（売り切れを除く）。宛名は attributes に Shopify の項目名で入れる */
    lines: function () {
      return items.map(function (it) {
        var v = buyable(it);
        if (!v) return null;
        var line = { sid: sidOf(v), qty: clampQty(it.q) };
        var nick = it.n && GoodsUtil.nicknameOf(GoodsUtil.product(it.p));
        if (nick) line.attributes = [{ key: nick.key, value: it.n }];
        return line;
      }).filter(Boolean);
    },
    /* 宛名の入った行があるか（あればカートパーマリンクでは代わりにならない） */
    hasNicknames: function () { return this.lines().some(function (l) { return !!l.attributes; }); },
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
