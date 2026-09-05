/* SugarNote 公式サイト — トップ（index.html: data-page="hub"）/ メンバーページ（member.html: data-page="solo"） */
(function () {
  "use strict";
  var esc = SNSite.esc, url = SNSite.url, dot = SNSite.dot, imgAttr = SNSite.imgAttr;
  var page = document.body.getAttribute("data-page");

  /* ---------- ハブ: メンバー一覧 ---------- */
  function renderMembers() {
    var el = document.getElementById("members-list");
    if (!el) return;
    var lang = SNLang.current;
    el.innerHTML = SN.members.map(function (m, i) {
      var names = SN.memberNames(m, lang);
      return (
        '<li><a href="member.html?m=' + m.id + '">' +
        '<span class="mem-photo"><img src="assets/img/' + m.img + '" alt="' + esc(m.name) + '"' + imgAttr(m.img) + ' loading="lazy"></span>' +
        '<span class="mem-body">' +
        '<span class="mem-no">MEMBER ' + String(i + 1).padStart(2, "0") + "</span>" +
        '<span class="mem-name">' + esc(names.main) + "</span>" +
        '<span class="mem-kana">' + esc(names.sub) + "</span>" +
        '<span class="mem-foot"><span class="mem-enter">' + esc(SNLang.t("solo.enter")) + "</span></span>" +
        "</span></a></li>"
      );
    }).join("");
  }

  function renderNews() {
    var el = document.getElementById("news-list");
    if (!el) return;
    el.innerHTML = SN.news.map(function (n) {
      return (
        '<li><a href="' + url(n.url) + '" target="_blank" rel="noopener">' +
        '<span class="news-date">' + esc(dot(n.date)) + "</span>" +
        '<span class="news-cat">' + esc(n.category) + "</span>" +
        '<span class="news-title">' + esc(n.title) + "</span>" +
        "</a></li>"
      );
    }).join("");
  }

  function renderDisco() {
    var el = document.getElementById("disco-list");
    if (!el) return;
    el.innerHTML = SN.discography.map(function (d) {
      var cover = d.cover
        ? '<span class="disco-cover"><img src="assets/img/' + d.cover + '" alt="' + esc(d.title) + ' ジャケット"' + imgAttr(d.cover) + ' loading="lazy"></span>'
        : '<span class="disco-cover disco-cover--typo" aria-hidden="true"><span class="t1">' + esc(d.title) + '</span><span class="t2">' + esc(d.type) + "</span></span>";
      return (
        '<li><a href="' + url(d.link) + '" target="_blank" rel="noopener">' + cover +
        '<p class="disco-title">' + esc(d.title) + "</p>" +
        '<p class="disco-meta">' + esc(d.type) + " / " + esc(dot(d.date)) + "</p>" +
        '<span class="disco-listen">' + esc(SNLang.t("act.listen")) + "</span>" +
        "</a></li>"
      );
    }).join("");
  }

  /* トップの GOODS 欄: goods-data.js の featured 4点 → グッズページの該当商品を開くリンク */
  function renderGoodsPick() {
    var el = document.getElementById("goods-list");
    if (!el) return;
    el.innerHTML = GOODS.featured.map(function (id) {
      var p = GoodsUtil.product(id);
      return p ? SNSite.goodsCard(p, null, { href: "goods.html?p=" + p.id }) : "";
    }).join("");
  }

  function renderTypes() {
    var sel = document.getElementById("f-type");
    if (!sel) return;
    var cur = sel.value;
    var types = SN.contactTypes[SNLang.current] || SN.contactTypes.ja;
    sel.innerHTML = '<option value="">' + esc(SNLang.t("form.selectPh")) + "</option>" +
      types.map(function (t2, i) { return '<option value="' + i + '">' + esc(t2) + "</option>"; }).join("");
    if (cur) sel.value = cur;
  }

  function renderContactInfo() {
    var el = document.getElementById("contact-info");
    if (!el) return;
    var c = SN.brand.contact;
    el.innerHTML =
      '<p><span class="k">' + esc(SNLang.t("form.mail")) + '</span><a href="' + url("mailto:" + c.email) + '">' + esc(c.email) + "</a></p>" +
      '<p><span class="k">' + esc(SNLang.t("form.tel")) + '</span><a href="' + url("tel:" + c.tel.replace(/[^\d+]/g, "")) + '">' + esc(c.tel) + "</a><small>" + esc(SN.pick(c.hours, SNLang.current)) + "</small></p>" +
      "<p><small>" + esc(SNLang.t("form.orderHint")) + "</small></p>";
  }

  function setupVideo() {
    var btn = document.getElementById("video-play");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var id = String(SN.video.id).replace(/[^A-Za-z0-9_-]/g, "");
      document.getElementById("video-facade").innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/' + id +
        '?autoplay=1" title="' + esc(SN.video.title) + '" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" ' +
        'sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
    });
  }

  /* ---------- お問い合わせフォーム
     SN.contactForm.endpoint が空のあいだはデモ（送信しない）。設定方法は README「お問い合わせフォーム」 ---------- */
  function setupForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var confirmBox = document.getElementById("form-confirm");
    var doneBox = document.getElementById("form-done");
    var sendBtn = document.getElementById("btn-send");
    var live = !!(SN.contactForm && SN.contactForm.endpoint);
    if (!live) {
      sendBtn.setAttribute("data-i18n", "form.sendDemo");
      doneBox.querySelector("h3").setAttribute("data-i18n", "form.doneTitleDemo");
      doneBox.querySelector("p").setAttribute("data-i18n", "form.doneBodyDemo");
    }

    function err(id, key) {
      var field = document.getElementById("f-" + id);
      var box = document.getElementById("e-" + id);
      if (key) {
        field.setAttribute("aria-invalid", "true");
        box.textContent = SNLang.t(key);
        box.classList.add("show");
        return true;
      }
      field.removeAttribute("aria-invalid");
      box.textContent = "";
      box.classList.remove("show");
      return false;
    }
    function jump() {
      document.getElementById("contact").scrollIntoView({ behavior: SNSite.reduceMotion() ? "auto" : "smooth", block: "start" });
    }
    function values() {
      var types = SN.contactTypes[SNLang.current] || SN.contactTypes.ja;
      return {
        name: document.getElementById("f-name").value.trim(),
        company: document.getElementById("f-company").value.trim(),
        email: document.getElementById("f-email").value.trim(),
        type: types[Number(document.getElementById("f-type").value)] || "",
        message: document.getElementById("f-message").value.trim(),
      };
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var v = values();
      var bad = false;
      bad = err("name", v.name ? null : "form.errRequired") || bad;
      bad = err("email", !v.email ? "form.errRequired" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email) ? "form.errEmail" : null) || bad;
      bad = err("type", v.type ? null : "form.errType") || bad;
      bad = err("message", v.message ? null : "form.errRequired") || bad;
      bad = err("agree", document.getElementById("f-agree").checked ? null : "form.errAgree") || bad;
      if (bad) return;

      var rows = [
        [SNLang.t("form.name"), v.name],
        [SNLang.t("form.company"), v.company || "—"],
        [SNLang.t("form.email"), v.email],
        [SNLang.t("form.type"), v.type],
        [SNLang.t("form.message"), v.message],
      ];
      document.getElementById("confirm-list").innerHTML = rows.map(function (r) {
        return "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>";
      }).join("");
      form.hidden = true;
      confirmBox.hidden = false;
      jump();
    });

    document.getElementById("btn-back").addEventListener("click", function () {
      confirmBox.hidden = true; form.hidden = false; jump();
    });

    sendBtn.addEventListener("click", function () {
      /* ハニーポット: 人には見えないチェックボックスが入っていたら bot とみなし、送らずに完了画面だけ出す */
      var bot = document.getElementById("f-botcheck");
      if (!live || (bot && bot.checked)) { confirmBox.hidden = true; doneBox.hidden = false; jump(); return; }
      var v = values();
      var payload = Object.assign({}, SN.contactForm.fields || {}, {
        subject: "[SugarNote] " + v.type + " / " + v.name,
        name: v.name, company: v.company, email: v.email, type: v.type, message: v.message, lang: SNLang.current,
        botcheck: "",
      });
      sendBtn.disabled = true;
      fetch(SN.contactForm.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      }).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        confirmBox.hidden = true; doneBox.hidden = false; form.reset(); jump();
      }).catch(function () {
        SNSite.toast(SNLang.t("form.errSend"));
      }).finally(function () { sendBtn.disabled = false; });
    });
  }

  /* ---------- メンバーページ ---------- */
  function currentMember() {
    var id = new URLSearchParams(location.search).get("m");
    return SN.member(id) || SN.members[0];
  }

  function renderSolo() {
    var lang = SNLang.current;
    var m = currentMember();
    var i = SN.members.indexOf(m);
    var names = SN.memberNames(m, lang);

    document.title = names.main + " | SugarNote Official Website";

    document.getElementById("solo-no").textContent = String(i + 1).padStart(2, "0");
    document.getElementById("solo-kana").textContent = names.sub;
    document.getElementById("solo-name").textContent = names.main;
    document.getElementById("solo-roman").textContent = m.romaji;
    document.getElementById("solo-sns").innerHTML =
      '<a href="' + url(m.sns.x) + '" target="_blank" rel="noopener">X</a>' +
      '<a href="' + url(m.sns.instagram) + '" target="_blank" rel="noopener">INSTAGRAM</a>' +
      '<a href="' + url(m.sns.tiktok) + '" target="_blank" rel="noopener">TIKTOK</a>';

    var img = document.getElementById("solo-img");
    if (img.getAttribute("data-member") !== m.id) {
      img.src = "assets/img/" + m.img;
      img.alt = m.name;
      img.width = SN.imgSize[m.img][0];
      img.height = SN.imgSize[m.img][1];
      img.setAttribute("data-member", m.id);
    }

    var age = SNLang.fmt("prof.age", { n: SN.ageOf(m) });
    var twinRow = "";
    if (m.twin) {
      var tw = SN.member(m.twin);
      twinRow = '<li><span class="k">TWINS</span><span class="v"><a class="twin-link" href="member.html?m=' + tw.id + '">' +
        esc(SN.memberNames(tw, lang).main) + "（" + esc(SNLang.t("solo.twins")) + "）→</a></span></li>";
    }
    document.getElementById("data-rows").innerHTML =
      '<li><span class="k">' + esc(SNLang.t("prof.birth")) + '</span><span class="v">' + dot(m.birth) + "（" + esc(age) + "）・" + esc(SN.pick(m.origin, lang)) + "</span></li>" +
      '<li><span class="k">MBTI</span><span class="v"><strong>' + esc(m.mbti) + "</strong>・" + esc(SN.pick(m.mbtiLabel, lang)) + "</span></li>" +
      '<li><span class="k">LOVE TYPE</span><span class="v"><strong>' + esc(m.loveType) + "</strong>・" + esc(SN.pick(m.loveTypeLabel, lang)) + "</span></li>" +
      '<li><span class="k">' + esc(SNLang.t("prof.exp")) + '</span><span class="v">' + esc(SN.pick(m.career, lang)) + "</span></li>" + twinRow;

    var topics = m.topics ? (m.topics[lang] || m.topics.ja) : [];
    document.getElementById("memo-list").innerHTML = topics.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
    document.querySelector(".solo-memo").hidden = topics.length === 0;

    /* このメンバーのグッズ（goods-data.js から自動抽出・先頭4点） */
    var rows = GoodsUtil.productsFor(m.id);
    document.getElementById("her-goods-lead").textContent = SNLang.fmt("solo.herGoodsLead", { name: names.main });
    document.getElementById("her-goods").innerHTML = rows.slice(0, 4).map(function (r) {
      return SNSite.goodsCard(r.product, r.variant, { href: "goods.html?p=" + r.product.id + "&v=" + r.variant.key });
    }).join("");
    var more = document.getElementById("her-goods-more");
    more.href = "goods.html?m=" + m.id;
    more.textContent = SNLang.fmt("solo.seeAllGoods", { name: names.main });
    document.querySelector(".solo-goods").hidden = rows.length === 0;

    var prev = SN.members[(i + SN.members.length - 1) % SN.members.length];
    var next = SN.members[(i + 1) % SN.members.length];
    document.getElementById("solo-next").innerHTML =
      '<a href="member.html?m=' + prev.id + '"><span class="sn-dir">← ' + esc(SNLang.t("solo.prev")) + '</span><span class="sn-name">' + esc(SN.memberNames(prev, lang).main) + "</span></a>" +
      '<a class="sn-all" href="index.html#members">' + esc(SNLang.t("solo.allMembers")) + "</a>" +
      '<a href="member.html?m=' + next.id + '"><span class="sn-dir">' + esc(SNLang.t("solo.next")) + ' →</span><span class="sn-name">' + esc(SN.memberNames(next, lang).main) + "</span></a>";
  }

  function setupShare() {
    var btn = document.getElementById("share-btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var m = currentMember();
      var names = SN.memberNames(m, SNLang.current);
      var text = names.main + " | SugarNote Official Website " + location.href + " " + SN.brand.hashtag;
      var done = document.getElementById("share-done");
      function ok() {
        done.textContent = SNLang.t("solo.shareCopied");
        setTimeout(function () { done.textContent = ""; }, 2600);
      }
      try { navigator.clipboard.writeText(text).then(ok, ok); } catch (e) { ok(); }
    });
  }

  /* ---------- 起動 ---------- */
  function renderAll() {
    if (page === "hub") {
      renderMembers();
      renderNews();
      renderDisco();
      renderGoodsPick();
      renderTypes();
      renderContactInfo();
    } else {
      renderSolo();
    }
  }

  SNSite.boot(renderAll, function () {
    var tt = document.getElementById("timetree");
    if (tt) tt.src = SN.timetreeUrl("565252");
    setupVideo();
    setupForm();
    setupShare();
  });
})();
