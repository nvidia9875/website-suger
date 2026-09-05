/* SugarNote 公式サイト — 全ページ共通の小さな部品
 * エスケープ / フッターSNS / モバイルメニュー / トースト / 商品カード / 起動順序
 * 読み込み順: data.js → goods-data.js → i18n.js → site.js → (home.js | goods.js)
 */
const SNSite = (function () {
  "use strict";

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  /* href 用: http(s) / mailto / tel / サイト内相対パスだけ通し、それ以外（javascript: 等）は "#" にする。
     いまはデータが静的ファイルなので保険だが、将来 CMS からデータを流すときの XSS 対策になる */
  function url(u) {
    u = String(u == null ? "" : u).trim();
    if (/^(https?:|mailto:|tel:)/i.test(u) || /^(\/|\.\/|\.\.\/|#|[A-Za-z0-9_-]+\.html)/.test(u)) return esc(u);
    return "#";
  }
  /* 2026-07-08 → 2026.07.08 */
  function dot(dateStr) { return String(dateStr).replace(/-/g, "."); }
  /* CLS対策の width/height 属性。商品画像は全て 1080 角 */
  function imgAttr(file) {
    var s = SN.imgSize[file] || [1080, 1080];
    return ' width="' + s[0] + '" height="' + s[1] + '"';
  }
  function reduceMotion() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  /* ---------- フッターSNS ---------- */
  function renderFoot() {
    var el = document.getElementById("foot-sns");
    if (!el) return;
    var s = SN.brand.sns;
    el.innerHTML =
      '<li><a href="' + url(s.x) + '" target="_blank" rel="noopener">X</a></li>' +
      '<li><a href="' + url(s.instagram) + '" target="_blank" rel="noopener">INSTAGRAM</a></li>' +
      '<li><a href="' + url(s.youtube) + '" target="_blank" rel="noopener">YOUTUBE</a></li>' +
      '<li><a class="foot-hash" href="https://x.com/hashtag/SugarNote" target="_blank" rel="noopener">' + esc(SN.brand.hashtag) + "</a></li>";
  }

  /* ---------- モバイルメニュー（≤960px） ---------- */
  function setupMenu() {
    var btn = document.getElementById("menu-btn");
    var head = document.querySelector(".head");
    if (!btn || !head) return;
    function set(open) {
      head.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = SNLang.t(open ? "menu.close" : "menu.open");
    }
    btn.addEventListener("click", function () { set(!head.classList.contains("is-open")); });
    head.querySelectorAll(".head-nav a").forEach(function (a) {
      a.addEventListener("click", function () { set(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && head.classList.contains("is-open")) set(false);
    });
    document.addEventListener("sn:lang", function () { set(head.classList.contains("is-open")); });
  }

  /* ---------- トースト ---------- */
  var toastTimer = null;
  function toast(msg) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  /* ---------- 商品カード（トップ / メンバーページ / グッズページ共用）
     product: 商品, variant: 代表バリアント（null なら商品のメイン画像）
     opts.href を渡すとリンク、無ければ button（data-product / data-variant 付き） ---------- */
  function goodsCard(product, variant, opts) {
    opts = opts || {};
    var img = variant ? variant.img : product.img;
    var note = opts.note != null ? opts.note : cardNote(product, variant);
    var inner =
      '<span class="goods-img"><img src="' + (opts.root || "") + 'assets/img/goods/' + img + '" alt="' + esc(product.name) + '"' + imgAttr(img) + ' loading="lazy"></span>' +
      '<span class="goods-cat">' + esc(product.category) + "</span>" +
      '<span class="goods-name">' + esc(product.name) + "</span>" +
      (note ? '<span class="goods-note">' + esc(note) + "</span>" : "") +
      '<span class="goods-price">' + GoodsUtil.yen(variant ? variant.price : product.price) + (product.priceMax && !variant ? "〜" : "") + "</span>" +
      '<span class="goods-cta">' + esc(SNLang.t("goods.detail")) + "</span>";
    if (opts.href) return '<li><a class="goods-card" href="' + url(opts.href) + '">' + inner + "</a></li>";
    var btn = '<button type="button" class="goods-card" data-product="' + product.id + '"' +
      (variant ? ' data-variant="' + variant.key + '"' : "") + ' aria-haspopup="dialog">' + inner + "</button>";
    /* quickAdd: 推しの棚用。カードの下に「カートへ」を兄弟要素として置く（button の入れ子を避ける） */
    if (opts.quickAdd && variant) {
      return '<li class="has-add">' + btn +
        '<button type="button" class="goods-add" data-add="' + product.id + ":" + variant.key + '">' + esc(SNLang.t("goods.addCartShort")) + "</button></li>";
    }
    return "<li>" + btn + "</li>";
  }
  /* カードの補足行: メンバー指定時はそのバリアント名、それ以外は商品の性格（選べる / サイズ / ランダム / 限定） */
  function cardNote(p, v) {
    var isMember = p.variantType === "member" || p.variantType === "member2";
    if (v && isMember) return v.label + (v.sub ? "（" + v.sub + "）" : "");
    if (isMember) return SNLang.t("goods.memberSelectable");
    if (p.variantType === "size") return SNLang.t("goods.sizeLabel") + " " + p.variants.map(function (x) { return x.label; }).join(" / ");
    if (p.random) return p.random.label + " " + SNLang.t("goods.random");
    if (p.variants.length === 1 && p.variants[0].label) return p.variants[0].label;
    return "";
  }

  /* CSP（style-src 'self'）のもとでは HTML の style 属性が効かないので、色は data-color から CSSOM で当てる */
  function applyColors(root, prop) {
    root.querySelectorAll("[data-color]").forEach(function (el) {
      if (/^#[0-9a-f]{6}$/i.test(el.dataset.color)) el.style.setProperty(prop, el.dataset.color);
    });
  }

  /* ---------- 起動: 保存言語の復元（SNLang.init）が sn:lang を発火するので先に購読する ---------- */
  function boot(renderAll, setup) {
    document.addEventListener("DOMContentLoaded", function () {
      renderFoot();
      setupMenu();
      /* const 宣言のグローバルは window のプロパティにならないので typeof で確認する */
      if (typeof SNOshi !== "undefined") SNOshi.mount();
      if (setup) setup();
      document.addEventListener("sn:lang", renderAll);
      document.addEventListener("sn:oshi", renderAll);
      renderAll();
      SNLang.init();
    });
  }

  return { esc: esc, url: url, dot: dot, imgAttr: imgAttr, reduceMotion: reduceMotion, toast: toast, goodsCard: goodsCard, cardNote: cardNote, applyColors: applyColors, boot: boot };
})();
