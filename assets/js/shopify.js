/* SNShop — Shopify Storefront API（トークン不要の公開アクセス）
 * ・ページ表示時に goods-data.js の全バリアントの価格・在庫を Shopify から取り直し、画面を描き直す（sn:goods）。
 *   請求額は Shopify が正なので、表示もそれに揃える。商品の構成・写真・説明は goods-data.js のまま
 * ・購入手続きは cartCreate で Shopify にカートを作らせ、返ってきた checkoutUrl へ移動する。
 *   商品ごとの属性（宛名など）を lines[].attributes で付けられる
 * ・通信に失敗したら goods-data.js の値で表示し、購入はカートパーマリンク（cart.js の checkoutUrl）で続ける
 */
const SNShop = (function () {
  "use strict";
  var ENDPOINT = "https://1ufd2p-j3.myshopify.com/api/2025-10/graphql.json";
  var TIMEOUT_MS = 8000;
  /* checkoutUrl はこのホストのものだけ受け付ける（API の応答で任意のサイトへ飛ばされないように） */
  var CHECKOUT_HOSTS = ["www.sugarnote.store", "sugarnote.store", "1ufd2p-j3.myshopify.com"];

  var VARIANTS_QUERY =
    "query SNVariants($ids: [ID!]!) { nodes(ids: $ids) { ... on ProductVariant { id availableForSale price { amount } } } }";
  var CART_MUTATION =
    "mutation SNCartCreate($input: CartInput!) { cartCreate(input: $input) { cart { checkoutUrl } userErrors { message } } }";

  function gid(sid) { return "gid://shopify/ProductVariant/" + String(sid).replace(/\D/g, ""); }

  function request(query, variables) {
    var ctrl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS) : null;
    return fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query: query, variables: variables }),
      signal: ctrl ? ctrl.signal : undefined,
    }).then(function (res) {
      if (!res.ok) throw new Error("Storefront API HTTP " + res.status);
      return res.json();
    }).then(function (json) {
      if (json.errors && json.errors.length) throw new Error("Storefront API: " + json.errors[0].message);
      return json.data;
    }).finally(function () {
      if (timer) clearTimeout(timer);
    });
  }

  /* nodes は ids と同じ順で返り、Shopify に無い（削除・非公開の）バリアントは null になる → 購入不可として扱う */
  function toLive(sids, nodes) {
    var live = {};
    sids.forEach(function (sid, i) {
      var n = nodes[i];
      if (!n || !n.id) { live[sid] = { price: null, available: false }; return; }
      var price = Math.round(Number(n.price && n.price.amount));
      live[sid] = { price: isFinite(price) && price >= 0 ? price : null, available: n.availableForSale === true };
    });
    return live;
  }

  function loadLive() {
    var sids = [];
    GOODS.products.forEach(function (p) {
      p.variants.forEach(function (v) { sids.push(String(v.sid).replace(/\D/g, "")); });
    });
    return request(VARIANTS_QUERY, { ids: sids.map(gid) }).then(function (data) {
      GoodsUtil.applyLive(toLive(sids, (data && data.nodes) || []));
      document.dispatchEvent(new CustomEvent("sn:goods"));
    });
  }

  function safeCheckoutUrl(raw) {
    try {
      var u = new URL(raw);
      return u.protocol === "https:" && CHECKOUT_HOSTS.indexOf(u.hostname) >= 0 ? u.href : null;
    } catch (e) {
      return null;
    }
  }

  /* lines: [{ sid, qty, attributes?: [{ key, value }] }] → Promise<checkoutUrl> */
  function checkout(lines) {
    var input = {
      lines: lines.map(function (l) {
        return { merchandiseId: gid(l.sid), quantity: l.qty, attributes: l.attributes || [] };
      }),
    };
    return request(CART_MUTATION, { input: input }).then(function (data) {
      var r = data && data.cartCreate;
      if (!r || !r.cart || (r.userErrors && r.userErrors.length)) {
        throw new Error("cartCreate: " + (r && r.userErrors && r.userErrors.length ? r.userErrors[0].message : "no cart"));
      }
      var url = safeCheckoutUrl(r.cart.checkoutUrl);
      if (!url) throw new Error("cartCreate: unexpected checkoutUrl");
      return url;
    });
  }

  /* グッズを出すページだけ取りにいく（goodsLive 前はグッズページの ?preview のみ。それ以外はストアへ転送される） */
  function shouldLoad() {
    var page = document.body.getAttribute("data-page");
    if (SN.goodsLive) return page === "goods" || page === "hub" || page === "solo";
    return page === "goods" && new URLSearchParams(location.search).has("preview");
  }

  function refresh() {
    if (!shouldLoad()) return;
    loadLive().catch(function (err) {
      /* 表示は goods-data.js の値のまま続ける。原因は開発者ツールで追えるように残す */
      console.warn("[SNShop] 価格・在庫の取得に失敗しました。サイト内のデータで表示します。", err);
    });
  }
  document.addEventListener("DOMContentLoaded", refresh);
  /* 戻るボタンで戻ってきたとき（bfcache）は前の在庫のままなので取り直す */
  window.addEventListener("pageshow", function (e) { if (e.persisted) refresh(); });

  return { checkout: checkout, loadLive: loadLive };
})();
