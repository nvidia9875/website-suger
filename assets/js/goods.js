/* SugarNote 公式サイト — グッズページ（goods.html）
 * 絞り込み（カテゴリ × メンバー）/ 一覧 / 商品ダイアログ / カート → Shopify チェックアウト
 * URL: ?c=<category> ?m=<memberId> で絞り込み、?p=<productId>&v=<variantKey> で商品を開く
 */
(function () {
  "use strict";
  var esc = SNSite.esc, imgAttr = SNSite.imgAttr, toast = SNSite.toast;
  var $ = function (sel) { return document.querySelector(sel); };
  var cart = SNCart("sn-cart");

  var params = new URLSearchParams(location.search);
  var state = {
    cat: GOODS.categories.some(function (c) { return c.key === params.get("c"); }) ? params.get("c") : "all",
    member: SN.member(params.get("m")) ? params.get("m") : null,
  };

  function syncUrl() {
    var q = new URLSearchParams();
    if (state.cat !== "all") q.set("c", state.cat);
    if (state.member) q.set("m", state.member);
    var s = q.toString();
    history.replaceState(null, "", location.pathname + (s ? "?" + s : "") + location.hash);
  }

  /* ---------- 絞り込みチップ ---------- */
  function renderFilters() {
    var lang = SNLang.current;
    $("#cat-chips").innerHTML = GOODS.categories.map(function (c) {
      var count = GoodsUtil.byCategory(c.key).length;
      return '<button type="button" class="chip" data-cat="' + c.key + '" aria-pressed="' + (c.key === state.cat) + '">' +
        esc(SNLang.t("goods.cat." + c.key)) + "<small>" + count + "</small></button>";
    }).join("");
    $("#member-chips").innerHTML =
      '<button type="button" class="chip" data-member="" aria-pressed="' + (state.member === null) + '">' + esc(SNLang.t("goods.allMembers")) + "</button>" +
      SN.members.map(function (m) {
        var col = SN.colorOf(m);
        return '<button type="button" class="chip chip-face" data-member="' + m.id + '" aria-pressed="' + (m.id === state.member) + '" data-color="' + col.hex + '">' +
          '<img src="assets/img/' + m.face + '" alt=""' + imgAttr(m.face) + ' loading="lazy">' +
          esc(SN.memberShort(m, lang)) + '<span class="chip-dot" aria-hidden="true"></span></button>';
      }).join("");
    applyColors($("#member-chips"), "--c");

    document.querySelectorAll("[data-cat]").forEach(function (b) {
      b.addEventListener("click", function () { state.cat = b.dataset.cat; syncUrl(); renderFilters(); renderItems(); });
    });
    document.querySelectorAll("[data-member]").forEach(function (b) {
      b.addEventListener("click", function () { state.member = b.dataset.member || null; syncUrl(); renderFilters(); renderItems(); });
    });
  }

  /* ---------- 一覧 ---------- */
  function currentRows() {
    var products = GoodsUtil.byCategory(state.cat);
    if (!state.member) return products.map(function (p) { return { product: p, variant: null }; });
    var forMember = GoodsUtil.productsFor(state.member);
    return forMember.filter(function (r) { return products.indexOf(r.product) >= 0; });
  }

  function renderItems() {
    var rows = currentRows();
    var status = $("#items-status");
    var label = state.member
      ? SNLang.fmt("goods.forMember", { name: SN.memberShort(SN.member(state.member), SNLang.current) })
      : SNLang.t("goods.cat." + state.cat);
    status.innerHTML = esc(label) + "<small>" + esc(SNLang.fmt("goods.countItems", { n: rows.length })) + "</small>";

    var grid = $("#items-grid");
    if (!rows.length) {
      grid.innerHTML = '<li class="items-empty">' + esc(SNLang.t("goods.noItems")) + "</li>";
      return;
    }
    grid.innerHTML = rows.map(function (r) { return SNSite.goodsCard(r.product, r.variant); }).join("");
    grid.querySelectorAll(".goods-card").forEach(function (card) {
      card.addEventListener("click", function () { openProduct(card.dataset.product, card.dataset.variant, card); });
    });
  }

  /* ---------- 商品ダイアログ ---------- */
  var dialog = $("#product-dialog");
  var current = { product: null, variant: null, qty: 1, opener: null };

  function openProduct(id, variantKey, opener) {
    var p = GoodsUtil.product(id);
    if (!p) return;
    var pre = variantKey ? GoodsUtil.variant(id, variantKey) : null;
    if (!pre && state.member) pre = p.variants.find(function (v) { return GoodsUtil.variantHas(v, state.member); }) || null;
    current = { product: p, variant: pre || p.variants[0], qty: 1, opener: opener || null };
    renderDialog();
    if (!dialog.open) dialog.showModal();
  }

  function variantChipLabel(p, v) {
    var lang = SNLang.current;
    var m = GoodsUtil.variantMember(v);
    if (v.chip) return v.chip;
    if (m) return SN.memberShort(m, lang);
    if (v.member === "all" || /^all/i.test(v.label)) return SNLang.t("goods.allMember");
    return v.label;
  }
  function variantChipSub(p, v) {
    if (p.id === "poster") return SNLang.t(v.outfit === "mv" ? "goods.outfitMv" : "goods.outfitNormal");
    return v.sub || "";
  }
  function variantColor(v) {
    var m = GoodsUtil.variantMember(v);
    if (m) return SN.colorOf(m).hex;
    if (v.members && v.members.length) return SN.colorOf(SN.member(v.members[0])).hex;
    return null;
  }

  function renderDialog() {
    var p = current.product, v = current.variant;
    if (!p) return;
    var isPhoto = p.variantType === "member" || p.variantType === "member2";
    var chips = p.variants.map(function (vv) {
      var col = variantColor(vv);
      var style = col ? ' data-color="' + col + '"' : "";
      var pressed = ' aria-pressed="' + (vv.key === v.key) + '"';
      if (isPhoto) {
        var sub = variantChipSub(p, vv);
        return '<button type="button" class="pd-photo" data-variant="' + vv.key + '"' + pressed + style + ">" +
          '<img src="assets/img/goods/' + vv.img + '" alt=""' + imgAttr(vv.img) + ' loading="lazy">' +
          "<span>" + esc(variantChipLabel(p, vv)) + (sub ? "<small>" + esc(sub) + "</small>" : "") +
          (col ? '<span class="vc" aria-hidden="true"></span>' : "") + "</span></button>";
      }
      return '<button type="button" class="pd-variant" data-variant="' + vv.key + '"' + pressed + style + ">" +
        (col ? '<span class="vc" aria-hidden="true"></span>' : "") + esc(vv.label) +
        (vv.sub ? " <small>" + esc(vv.sub) + "</small>" : "") + "</button>";
    }).join("");

    var top = p.priceMax && p.priceMax !== p.price ? p.variants.find(function (vv) { return vv.price === p.priceMax; }) : null;
    var priceHtml = GoodsUtil.yen(v.price) +
      (top ? '<span class="price-range">' + esc(SNLang.fmt("goods.priceRange", { label: top.label, price: GoodsUtil.yen(p.priceMax) })) + "</span>" : "");
    var variantsLabel = p.variantType === "size" ? "goods.chooseSize" : p.variantType === "fixed" ? "goods.contents" : "goods.chooseMember";

    $("#pd-body").innerHTML =
      '<div class="pd-media"><img src="assets/img/goods/' + v.img + '" alt="' + esc(p.name + " " + v.label) + '"' + imgAttr(v.img) + "></div>" +
      '<div class="pd-info">' +
      '<p class="pd-cat">' + esc(p.category) + "</p>" +
      '<h2 id="pd-title">' + esc(p.deco) + "</h2>" +
      '<p class="pd-price">' + priceHtml + "</p>" +
      '<p class="pd-desc">' + esc(p.desc).replace(/\n/g, "<br>") + "</p>" +
      '<p class="pd-variants-label">' + esc(SNLang.t(variantsLabel)) + "</p>" +
      '<div class="pd-variants' + (isPhoto ? " is-photo" : "") + '">' + chips + "</div>" +
      '<ul class="pd-contents">' + p.contents.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>" +
      (p.notes.length ? '<ul class="pd-notes">' + p.notes.map(function (n) { return "<li>※ " + esc(n) + "</li>"; }).join("") + "</ul>" : "") +
      '<div class="pd-buy"><div class="qty" role="group" aria-label="' + esc(SNLang.t("goods.qty")) + '">' +
      '<button type="button" id="pd-minus" aria-label="' + esc(SNLang.t("goods.qtyMinus")) + '">−</button>' +
      '<output id="pd-qty" aria-live="polite">' + current.qty + "</output>" +
      '<button type="button" id="pd-plus" aria-label="' + esc(SNLang.t("goods.qtyPlus")) + '">＋</button></div>' +
      '<button type="button" class="btn" id="pd-add">' + esc(SNLang.t("goods.addCart")) + "</button></div>" +
      "</div>";
    applyColors($("#pd-body"), "--vc");

    $("#pd-body").querySelectorAll("[data-variant]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        current.variant = GoodsUtil.variant(p.id, chip.dataset.variant);
        renderDialog();
      });
    });
    $("#pd-minus").addEventListener("click", function () { current.qty = Math.max(1, current.qty - 1); $("#pd-qty").textContent = current.qty; });
    $("#pd-plus").addEventListener("click", function () { current.qty = Math.min(99, current.qty + 1); $("#pd-qty").textContent = current.qty; });
    $("#pd-add").addEventListener("click", function () {
      cart.add(p.id, current.variant.key, current.qty);
      dialog.close();
      toast(SNLang.t("goods.added") + " — " + p.name + (p.variants.length > 1 ? "（" + current.variant.label + "）" : ""));
    });
  }

  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("close", function () {
    if (current.opener && document.body.contains(current.opener)) current.opener.focus();
  });

  /* ---------- まとめ買い特典 ---------- */
  function renderBonus() {
    $("#bonus-rows").innerHTML = GOODS.bonus.tiers.map(function (t) {
      return "<li>" +
        '<p class="bonus-threshold">' + GoodsUtil.yen(t.threshold) + "<small>" + esc(SNLang.t("goods.bonusPer")) + "</small></p>" +
        "<div>" +
        '<p class="bonus-name">「' + esc(t.name) + "」" + esc(t.detail) + "</p>" +
        '<p class="bonus-detail">' + esc(SNLang.t("goods.bonusAuto")) + "</p>" +
        '<p class="bonus-prizes">' + esc(SNLang.t("goods.bonusPrizes")) + ": <b>" + esc(t.prizes) + "</b></p>" +
        "</div></li>";
    }).join("");
  }

  /* ---------- カート ---------- */
  var drawer = $("#cart-drawer");
  $("#cart-open").addEventListener("click", function () { renderCart(); drawer.showModal(); });
  drawer.addEventListener("click", function (e) { if (e.target === drawer) drawer.close(); });

  function renderCart() {
    var entries = cart.entries();
    var list = $("#cd-list");
    if (!entries.length) {
      list.innerHTML = '<li class="cd-empty">' + esc(SNLang.t("goods.empty")) + "</li>";
    } else {
      list.innerHTML = entries.map(function (e) {
        var k = e.p + ":" + e.v;
        return '<li class="cd-item"><img src="assets/img/goods/' + e.variant.img + '" alt=""' + imgAttr(e.variant.img) + ' loading="lazy">' +
          "<div>" +
          '<p class="cd-item-name">' + esc(e.product.name) + "</p>" +
          '<p class="cd-item-variant">' + esc(e.variant.label) + (e.variant.sub ? "・" + esc(e.variant.sub) : "") +
          " / " + GoodsUtil.yen(e.variant.price) + " × " + e.qty + " = <b>" + GoodsUtil.yen(e.variant.price * e.qty) + "</b></p>" +
          '<div class="cd-item-row"><div class="qty">' +
          '<button type="button" data-dec="' + k + '" aria-label="' + esc(SNLang.t("goods.qtyMinus")) + '">−</button>' +
          "<output>" + e.qty + "</output>" +
          '<button type="button" data-inc="' + k + '" aria-label="' + esc(SNLang.t("goods.qtyPlus")) + '">＋</button></div>' +
          '<button type="button" class="cd-remove" data-remove="' + k + '">' + esc(SNLang.t("goods.remove")) + "</button>" +
          "</div></div></li>";
      }).join("");
    }
    function entryOf(key) {
      var k = key.split(":");
      return cart.entries().find(function (x) { return x.p === k[0] && x.v === k[1]; });
    }
    list.querySelectorAll("[data-dec]").forEach(function (b) {
      b.addEventListener("click", function () { var it = entryOf(b.dataset.dec); if (it) cart.setQty(it.p, it.v, it.qty - 1); });
    });
    list.querySelectorAll("[data-inc]").forEach(function (b) {
      b.addEventListener("click", function () { var it = entryOf(b.dataset.inc); if (it) cart.setQty(it.p, it.v, it.qty + 1); });
    });
    list.querySelectorAll("[data-remove]").forEach(function (b) {
      b.addEventListener("click", function () { var k = b.dataset.remove.split(":"); cart.remove(k[0], k[1]); });
    });
    renderMeter();
    $("#cd-total").textContent = GoodsUtil.yen(cart.total());
  }

  function renderMeter() {
    var b = cart.bonus();
    var earned = [];
    b.tiers.forEach(function (t) {
      for (var i = 0; i < t.earned; i++) earned.push('<span class="ticket">' + esc(t.name) + "</span>");
    });
    var up = b.tiers.find(function (t) { return t.earned === 0; }) || b.tiers[b.tiers.length - 1];
    var label, pct;
    if (b.total === 0) {
      var t0 = b.tiers[0], t1 = b.tiers[1] || b.tiers[0];
      label = SNLang.fmt("goods.meterStart", { a: GoodsUtil.yen(t0.threshold), an: t0.name, b: GoodsUtil.yen(t1.threshold), bn: t1.name });
      pct = 0;
    } else {
      label = SNLang.fmt("goods.meterNext", { amount: GoodsUtil.yen(up.next), name: up.name });
      pct = up.progress * 100;
    }
    $("#cd-meter").innerHTML =
      '<p class="meter-label"><span>' + esc(SNLang.t("goods.bonus")) + "</span><span>" + esc(label) + "</span></p>" +
      '<div class="meter-track"><div class="meter-fill"></div></div>' +
      (earned.length ? '<div class="meter-earned">' + esc(SNLang.t("goods.meterEarned")) + ": " + earned.join("") + "</div>" : "");
    $("#cd-meter .meter-fill").style.width = Math.max(0, Math.min(100, pct)) + "%";
  }

  /* CSP（style-src 'self'）のもとでは HTML の style 属性が効かないので、色は data-color から CSSOM で当てる */
  function applyColors(root, prop) {
    root.querySelectorAll("[data-color]").forEach(function (el) {
      if (/^#[0-9a-f]{6}$/i.test(el.dataset.color)) el.style.setProperty(prop, el.dataset.color);
    });
  }

  function syncHeaderCart() {
    $("#cart-count").textContent = cart.count();
    $("#cart-total-mini").textContent = GoodsUtil.yen(cart.total());
    var checkout = $("#btn-checkout");
    checkout.href = cart.checkoutUrl();
    checkout.setAttribute("aria-disabled", cart.count() === 0 ? "true" : "false");
  }
  cart.onChange(function () {
    syncHeaderCart();
    if (drawer.open) renderCart();
  });

  /* ---------- 起動 ---------- */
  function renderAll() {
    renderFilters();
    renderItems();
    renderBonus();
    syncHeaderCart();
    if (dialog.open) renderDialog();
    if (drawer.open) renderCart();
  }

  SNSite.boot(renderAll, function () {
    /* ?p=<productId>&v=<variantKey> で商品を開いた状態にする（URLはそのまま残す） */
    var p = params.get("p");
    if (p && GoodsUtil.product(p)) {
      /* 言語復元の後に開く（初回の sn:lang を待つ） */
      document.addEventListener("sn:lang", function once() {
        document.removeEventListener("sn:lang", once);
        openProduct(p, params.get("v"));
      });
    }
  });
})();
