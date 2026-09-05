/* SNCart — カートのロジック（UIは goods.js が描画する）
 * ・localStorage に永続（キー sn-cart）
 * ・合計 / 点数 / まとめ買い特典（¥10,000 / ¥20,000）の進捗を算出
 * ・チェックアウトは Shopify のカートパーマリンク（checkoutUrl）で実決済へ
 *   例: https://www.sugarnote.store/cart/47393203257580:1,47393174913260:2
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
        return GoodsUtil.variant(p, v) && q ? { p: p, v: v, q: q } : null;
      }).filter(Boolean);
    } catch (e) {
      return [];
    }
  }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(items)); } catch (e) { /* private mode 等では永続なしで続行 */ }
  }
  function emit() { save(); listeners.forEach(function (fn) { fn(api); }); }
  function find(p, v) { return items.find(function (it) { return it.p === p && it.v === v; }); }

  save(); /* 正規化した内容で保存し直す */

  var api = {
    onChange: function (fn) { listeners.push(fn); },
    entries: function () {
      return items.map(function (it) {
        return { product: GoodsUtil.product(it.p), variant: GoodsUtil.variant(it.p, it.v), qty: it.q, p: it.p, v: it.v };
      });
    },
    add: function (p, v, qty) {
      if (!GoodsUtil.variant(p, v)) return;
      qty = clampQty(qty) || 1;
      var hit = find(p, v);
      if (hit) hit.q = Math.min(hit.q + qty, 99);
      else items.push({ p: p, v: v, q: qty });
      emit();
    },
    setQty: function (p, v, qty) {
      var hit = find(p, v);
      if (!hit) return;
      hit.q = clampQty(qty);
      if (hit.q <= 0) items = items.filter(function (it) { return it !== hit; });
      emit();
    },
    remove: function (p, v) { items = items.filter(function (it) { return !(it.p === p && it.v === v); }); emit(); },
    clear: function () { items = []; emit(); },
    count: function () { return items.reduce(function (s, it) { return s + it.q; }, 0); },
    total: function () {
      return items.reduce(function (s, it) {
        var variant = GoodsUtil.variant(it.p, it.v);
        return s + (variant ? variant.price * it.q : 0);
      }, 0);
    },
    /* Shopify チェックアウトURL。空カート時はストアのカートページ */
    checkoutUrl: function () {
      var parts = items.map(function (it) {
        var v = GoodsUtil.variant(it.p, it.v);
        var sid = v && String(v.sid).replace(/\D/g, "");
        return sid ? sid + ":" + clampQty(it.q) : null;
      }).filter(Boolean);
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
