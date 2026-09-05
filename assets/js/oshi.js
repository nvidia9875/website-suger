/* SugarNote 公式サイト — 推しカラー
 * 推しを1人選ぶと、サイトのアクセント（下線・ヘッダーのリボン・メンバー番号・TimeTree の枠）が
 * その子のメンバーカラーになる。文字色はグレーのまま、色を付けるのは線と面だけ。
 *
 * 保存先: localStorage（キー sn-oshi、メンバー id の文字列）。この端末に残るだけで、どこにも送られない。
 * CSS 側は var(--oshi, …) / var(--oshi-soft, …) で参照し、未設定なら第2引数（モノトーン）に落ちる。
 *   --oshi      … 白背景で AA を満たす濃色（線・小さな文字用）
 *   --oshi-soft … 本来のメンバーカラー（顔写真の縁・面のティント用）
 * 変更は document の "sn:oshi" イベントで各ページに知らせる。
 */
const SNOshi = (function () {
  "use strict";
  var KEY = "sn-oshi";
  var esc = SNSite.esc, imgAttr = SNSite.imgAttr;

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var v = raw;
      /* 旧サンプルサイト（同じ origin）が配列で保存していたことがあるので、その場合は最後の1人を使う */
      if (raw[0] === "[" || raw[0] === '"') {
        var parsed = JSON.parse(raw);
        v = Array.isArray(parsed) ? parsed[parsed.length - 1] : parsed;
      }
      return SN.member(v) ? String(v) : null;
    } catch (e) { return null; }
  }
  function member() { var id = read(); return id ? SN.member(id) : null; }

  function set(id) {
    id = SN.member(id) ? id : null;
    try { if (id) localStorage.setItem(KEY, id); else localStorage.removeItem(KEY); } catch (e) { /* private mode */ }
    apply();
    document.dispatchEvent(new CustomEvent("sn:oshi", { detail: { id: id } }));
  }

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
    var m = member(), lang = SNLang.current;
    var face = document.getElementById("oshi-btn-face");
    face.innerHTML = m
      ? '<img src="assets/img/' + m.face + '" alt=""' + imgAttr(m.face) + ">"
      : HEART;
    btn.setAttribute("aria-label", SNLang.t("oshi.label") + ": " + (m ? SN.memberShort(m, lang) : SNLang.t("oshi.none")));
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
      '<div class="oshi-foot"><button type="button" class="btn btn-ghost" id="oshi-clear"></button></div>' +
      "</div>";
    document.body.appendChild(d);
    d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
    d.querySelector("#oshi-clear").addEventListener("click", function () {
      set(null);
      SNSite.toast(SNLang.t("oshi.cleared"));
      d.close();
    });
    return d;
  }

  function renderDialog() {
    var d = document.getElementById("oshi-dialog");
    if (!d) return;
    var cur = read(), lang = SNLang.current;
    d.querySelector("#oshi-title").textContent = SNLang.t("oshi.choose");
    d.querySelector("#oshi-hint").textContent = SNLang.t("oshi.hint");
    d.querySelector("#oshi-close").setAttribute("aria-label", SNLang.t("oshi.close"));
    var clear = d.querySelector("#oshi-clear");
    clear.textContent = SNLang.t("oshi.unset");
    clear.hidden = !cur;
    var grid = d.querySelector("#oshi-grid");
    grid.setAttribute("aria-label", SNLang.t("oshi.choose"));
    grid.innerHTML = SN.members.map(function (m) {
      var c = SN.colorOf(m);
      return '<button type="button" class="oshi-opt" data-id="' + m.id + '" aria-pressed="' + (m.id === cur) + '" data-color="' + c.hex + '">' +
        '<img src="assets/img/' + m.face + '" alt=""' + imgAttr(m.face) + ' loading="lazy">' +
        '<span class="oshi-opt-name">' + esc(SN.memberShort(m, lang)) + "</span>" +
        '<span class="oshi-opt-color"><span class="vc" aria-hidden="true"></span>' + esc(m.color) + "</span>" +
        "</button>";
    }).join("");
    SNSite.applyColors(grid, "--vc");
    grid.querySelectorAll(".oshi-opt").forEach(function (b) {
      b.addEventListener("click", function () {
        var m = SN.member(b.dataset.id);
        set(m.id);
        SNSite.toast(SNLang.fmt("oshi.done", { name: SN.memberShort(m, SNLang.current) }));
        d.close();
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

  return { KEY: KEY, get: read, member: member, set: set, clear: function () { set(null); }, apply: apply, open: open, mount: mount };
})();
