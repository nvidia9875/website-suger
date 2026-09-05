/* SugarNote 公式サイト — 推し
 * 推しは複数選べる。選んだ子は
 *   ・グッズページの上部に「推しの棚」（その子の全アイテム）としてまとまる
 *   ・トップのメンバーカードとメンバーページに MY OSHI の印が付く
 *   ・最後に選んだ1人の色が、サイトのアクセント（下線・リボン・番号・TimeTree の枠）になる
 * 文字色はグレーのまま。色を付けるのは線と面だけ。
 *
 * 保存先: localStorage（キー sn-oshi、メンバー id の配列を JSON で。選んだ順）。この端末に残るだけで、どこにも送られない。
 * CSS 側は var(--oshi, …) / var(--oshi-soft, …) で参照し、未設定なら第2引数（モノトーン）に落ちる。
 *   --oshi      … 白背景で AA を満たす濃色（線・小さな文字用）
 *   --oshi-soft … 本来のメンバーカラー（顔写真の縁・面のティント用）
 * 変更は document の "sn:oshi" イベントで各ページに知らせる。
 */
const SNOshi = (function () {
  "use strict";
  var KEY = "sn-oshi";
  var esc = SNSite.esc, imgAttr = SNSite.imgAttr;

  /* 保存値を「実在するメンバー id の配列（重複なし・選んだ順）」に正規化して読む。
     旧形式（id の文字列）もそのまま受ける */
  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return [];
      var v = raw;
      if (raw[0] === "[" || raw[0] === '"') v = JSON.parse(raw);
      var arr = Array.isArray(v) ? v : [v];
      var out = [];
      arr.forEach(function (id) {
        id = String(id);
        if (SN.member(id) && out.indexOf(id) < 0) out.push(id);
      });
      return out;
    } catch (e) { return []; }
  }
  function write(ids) {
    try { if (ids.length) localStorage.setItem(KEY, JSON.stringify(ids)); else localStorage.removeItem(KEY); } catch (e) { /* private mode */ }
  }
  function list() { return read(); }
  /* アクセント色に使う1人 = 最後に選んだ子 */
  function get() { var ids = read(); return ids.length ? ids[ids.length - 1] : null; }
  function has(id) { return read().indexOf(id) >= 0; }
  function member() { var id = get(); return id ? SN.member(id) : null; }

  function commit(ids) {
    write(ids);
    apply();
    document.dispatchEvent(new CustomEvent("sn:oshi", { detail: { ids: ids } }));
  }
  /* 追加 / 解除を切り替える。追加したら true */
  function toggle(id) {
    if (!SN.member(id)) return false;
    var ids = read();
    var added = ids.indexOf(id) < 0;
    commit(added ? ids.concat(id) : ids.filter(function (x) { return x !== id; }));
    return added;
  }
  /* 追加して、その子をアクセント色にする（末尾へ） */
  function add(id) {
    if (!SN.member(id)) return;
    commit(read().filter(function (x) { return x !== id; }).concat(id));
  }
  function clear() { commit([]); }

  /* <html> に data-oshi と CSS 変数を当てる（CSSOM 経由なので CSP の style-src 'self' でも動く） */
  function apply() {
    var m = member(), root = document.documentElement;
    if (m) {
      var c = SN.colorOf(m);
      root.setAttribute("data-oshi", m.id);
      root.style.setProperty("--oshi", c.ui);
      root.style.setProperty("--oshi-soft", c.hex);
    } else {
      root.removeAttribute("data-oshi");
      root.style.removeProperty("--oshi");
      root.style.removeProperty("--oshi-soft");
    }
    renderButton();
    renderDialog();
  }

  /* ---------- ヘッダーの推しボタン ---------- */
  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.8 3.6 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.4 0 5.6 3.3 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2Z"/></svg>';
  function renderButton() {
    var btn = document.getElementById("oshi-btn");
    if (!btn) return;
    var ids = read(), m = member(), lang = SNLang.current;
    var face = document.getElementById("oshi-btn-face");
    face.innerHTML = m
      ? '<img src="assets/img/' + m.face + '" alt=""' + imgAttr(m.face) + ">"
      : HEART;
    var count = document.getElementById("oshi-btn-count");
    if (count) { count.textContent = ids.length > 1 ? "+" + (ids.length - 1) : ""; count.hidden = ids.length <= 1; }
    var names = ids.map(function (id) { return SN.memberShort(SN.member(id), lang); }).join(", ");
    btn.setAttribute("aria-label", SNLang.t("oshi.label") + ": " + (names || SNLang.t("oshi.none")));
  }

  /* ---------- 選択ダイアログ（JS で1回だけ組み立てる。HTML には書かない） ---------- */
  function ensureDialog() {
    var d = document.getElementById("oshi-dialog");
    if (d) return d;
    d = document.createElement("dialog");
    d.className = "oshi-dialog";
    d.id = "oshi-dialog";
    d.setAttribute("aria-labelledby", "oshi-title");
    d.innerHTML =
      '<form method="dialog" class="dialog-close"><button class="icon-close" id="oshi-close" aria-label="閉じる">×</button></form>' +
      '<div class="oshi-body">' +
      '<p class="oshi-eyebrow">MY OSHI</p>' +
      '<h2 id="oshi-title"></h2>' +
      '<p class="oshi-hint" id="oshi-hint"></p>' +
      '<div class="oshi-grid" id="oshi-grid" role="group"></div>' +
      '<div class="oshi-foot">' +
      '<button type="button" class="btn btn-ghost" id="oshi-clear"></button>' +
      '<button type="button" class="btn" id="oshi-done"></button>' +
      "</div></div>";
    document.body.appendChild(d);
    d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
    d.querySelector("#oshi-clear").addEventListener("click", function () {
      clear();
      SNSite.toast(SNLang.t("oshi.cleared"));
    });
    d.querySelector("#oshi-done").addEventListener("click", function () { d.close(); });
    return d;
  }

  function renderDialog() {
    var d = document.getElementById("oshi-dialog");
    if (!d) return;
    var ids = read(), lang = SNLang.current;
    d.querySelector("#oshi-title").textContent = SNLang.t("oshi.choose");
    d.querySelector("#oshi-hint").textContent = SNLang.t("oshi.hint");
    d.querySelector("#oshi-close").setAttribute("aria-label", SNLang.t("oshi.close"));
    d.querySelector("#oshi-done").textContent = SNLang.t("oshi.close");
    var clearBtn = d.querySelector("#oshi-clear");
    clearBtn.textContent = SNLang.t("oshi.unset");
    clearBtn.hidden = ids.length === 0;
    var grid = d.querySelector("#oshi-grid");
    grid.setAttribute("aria-label", SNLang.t("oshi.choose"));
    grid.innerHTML = SN.members.map(function (m) {
      var c = SN.colorOf(m);
      return '<button type="button" class="oshi-opt" data-id="' + m.id + '" aria-pressed="' + (ids.indexOf(m.id) >= 0) + '" data-color="' + c.hex + '">' +
        '<img src="assets/img/' + m.face + '" alt=""' + imgAttr(m.face) + ' loading="lazy">' +
        '<span class="oshi-opt-name">' + esc(SN.memberShort(m, lang)) + "</span>" +
        '<span class="oshi-opt-color"><span class="vc" aria-hidden="true"></span>' + esc(m.color) + "</span>" +
        "</button>";
    }).join("");
    SNSite.applyColors(grid, "--vc");
    grid.querySelectorAll(".oshi-opt").forEach(function (b) {
      b.addEventListener("click", function () {
        var m = SN.member(b.dataset.id);
        var added = toggle(m.id);
        SNSite.toast(SNLang.fmt(added ? "oshi.added" : "oshi.removed", { name: SN.memberShort(m, SNLang.current) }));
        /* 複数選べるように、ダイアログは閉じない */
      });
    });
  }

  function open() {
    var d = ensureDialog();
    renderDialog();
    d.showModal();
  }

  /* ---------- 起動（SNSite.boot から呼ばれる） ---------- */
  function mount() {
    var btn = document.getElementById("oshi-btn");
    if (btn) btn.addEventListener("click", open);
    ensureDialog();
    document.addEventListener("sn:lang", apply);
    apply();
  }

  return { KEY: KEY, list: list, get: get, has: has, member: member, toggle: toggle, add: add, clear: clear, apply: apply, open: open, mount: mount };
})();
