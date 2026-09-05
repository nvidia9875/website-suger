/* SugarNote 公式サイト — 3言語UI辞書 + 言語切替
 * ja/en/th の実訳は sugarnote.jp の各ページから取得。グッズ関連は本サイトで追加。
 *
 * 使い方:
 *   HTML側: <span data-i18n="sub.profile">メンバープロフィール</span>
 *           <button data-i18n-attr="aria-label:goods.cart">
 *           <button data-lang-switch="en">EN</button>
 *   JS側:   SNLang.init() を DOMContentLoaded 後に呼ぶ。
 *           動的描画は SNLang.t("act.listen") / SNLang.current を使い、
 *           document の "sn:lang" イベントで再描画する。
 */
const SN_I18N = {
  ja: {
    nav: { concept: "CONCEPT", member: "MEMBER", information: "INFORMATION", schedule: "SCHEDULE", goods: "GOODS", contact: "CONTACT" },
    menu: { label: "メニュー", open: "MENU", close: "CLOSE" },
    sub: { concept: "コンセプト", member: "メンバー", information: "最新情報", schedule: "スケジュール", profile: "メンバープロフィール", video: "動画コンテンツ", discography: "楽曲情報", goods: "オフィシャルグッズ", contact: "お問い合わせ" },
    hero: { tagline: "ピュアが、世界を動かす。", concept: "日本人の持つ精神性を主軸にしたクリエイティブを発信していくアイドルグループ。" },
    act: { viewAll: "VIEW ALL", listen: "LISTEN", openTimetree: "TimeTreeで開く", play: "動画を再生" },
    prof: { birth: "BIRTH / ORIGIN", exp: "EXPERIENCE", age: "{n}歳" },
    sched: { lead: "ライブ・フェス・オンライン特典会の予定はこちらから。" },
    form: {
      name: "お名前", company: "貴社名 / 法人名（任意）", email: "メールアドレス", type: "お問い合わせ種別", message: "お問い合わせ内容",
      agreePre: "", agreeLink: "プライバシーポリシー", agreePost: "に同意の上、送信してください。",
      submit: "送信内容を確認する", back: "修正する", send: "送信する",
      confirmTitle: "送信内容の確認", doneTitle: "送信が完了しました",
      doneBody: "お問い合わせありがとうございます。内容を確認のうえ、担当よりご連絡いたします。",
      sendDemo: "送信する（デモ）", doneTitleDemo: "送信が完了しました（デモ）",
      doneBodyDemo: "お問い合わせフォームは準備中のため、実際の送信は行われず、入力内容はどこにも保存されません。",
      errSend: "送信に失敗しました。時間をおいて再度お試しください。",
      selectPh: "選択してください",
      errRequired: "入力してください", errEmail: "メールアドレスの形式で入力してください", errType: "種別を選択してください", errAgree: "プライバシーポリシーへの同意が必要です",
      orderHint: "グッズのご注文・配送に関するお問い合わせは、ご注文番号を添えていただくとスムーズです。",
      mail: "メール", tel: "お電話",
    },
    foot: { terms: "利用規約", privacy: "プライバシーポリシー", legal: "特定商取引法に基づく表記", company: "運営会社", backHome: "トップへ戻る", copyright: "© 2026 SugarNote Official. All Rights Reserved." },
    oshi: {
      label: "推し", choose: "推しをえらぶ",
      hint: "推しを選ぶと、サイトの下線やリボンがその子のメンバーカラーになります。この端末にだけ保存されます。",
      set: "{name}を推しにする", unset: "推しを解除", isOshi: "MY OSHI", none: "未設定",
      done: "{name}を推しに設定しました", cleared: "推しを解除しました", close: "閉じる",
    },
    solo: {
      share: "このページをシェア", shareCopied: "コピーしました！SNSに貼ってね",
      twins: "双子", enter: "詳しく見る →", allMembers: "全員を見る",
      herGoods: "GOODS", herGoodsLead: "{name}と一緒に楽しむオフィシャルグッズ。", seeAllGoods: "{name}のグッズをすべて見る →",
      prev: "PREV", next: "NEXT",
    },
    goods: {
      lead: "SugarNote のオフィシャルグッズ。お支払いは Shopify の安全なチェックアウトで行われます。",
      jaOnly: "",
      category: "CATEGORY", member: "MEMBER", allMembers: "ALL",
      cat: { all: "すべて", bromide: "ブロマイド", tcard: "トレカ", poster: "ポスター", acryl: "アクスタ・アクキー", tshirt: "Tシャツ" },
      countItems: "{n}点", forMember: "{name}のグッズ", noItems: "該当する商品はありません。",
      detail: "くわしく見る", memberSelectable: "メンバーが選べます", sizeLabel: "サイズ", random: "ランダム",
      chooseMember: "メンバーをえらぶ", chooseSize: "サイズをえらぶ", contents: "内容",
      outfitMv: "MV衣装", outfitNormal: "通常衣装", allMember: "全員集合",
      priceRange: "{label}は{price}",
      qty: "数量", qtyMinus: "数量を減らす", qtyPlus: "数量を増やす",
      addCart: "カートに入れる", added: "カートに入れました",
      cart: "カート", cartCount: "カートの点数", close: "閉じる", closeCart: "カートを閉じる",
      empty: "カートはまだ空です。", remove: "削除", total: "合計", taxNote: "（税込・送料別）",
      checkout: "レジにすすむ", checkoutNote: "Shopify の安全なチェックアウトが開きます。送料はお会計時に計算されます。",
      bonus: "まとめ買い特典", bonusSub: "お会計の合計金額に応じて、もれなくプレゼント", bonusPer: "ご購入ごと",
      bonusAuto: "カートの合計金額に応じて自動で進呈します。", bonusPrizes: "くじの内容",
      bonusNote: "※特典の絵柄はランダムです。くじの内容は商品ページの記載に基づきます。",
      meterStart: "{a}で「{an}」、{b}で「{bn}」", meterNext: "あと{amount}で「{name}」", meterEarned: "獲得予定",
      guide: "ご案内",
      guide1t: "ランダム商品について", guide1d: "絵柄はお選びいただけません。「全◯種」の内訳は各商品ページに記載しています。",
      guide2t: "販売状況について", guide2d: "数量限定のため、無くなり次第終了となります。",
      guide3t: "お支払いについて", guide3d: "「レジにすすむ」から Shopify の安全なチェックアウトが開きます。まとめ買い特典はお会計の合計金額に応じて進呈します。",
      guideContact: "ご不明な点は", guideContactLink: "お問い合わせ", guideContactPost: "まで。",
    },
  },

  en: {
    nav: { concept: "CONCEPT", member: "MEMBER", information: "INFORMATION", schedule: "SCHEDULE", goods: "GOODS", contact: "CONTACT" },
    menu: { label: "Menu", open: "MENU", close: "CLOSE" },
    sub: { concept: "Concept", member: "Members", information: "Latest News", schedule: "Schedule", profile: "Member Profiles", video: "Video Content", discography: "Music", goods: "Official Merchandise", contact: "Contact Us" },
    hero: { tagline: "Purity moves the world.", concept: "An idol group that expresses creativity rooted in the Japanese spirit." },
    act: { viewAll: "VIEW ALL", listen: "LISTEN", openTimetree: "Open in TimeTree", play: "Play video" },
    prof: { birth: "BIRTH / ORIGIN", exp: "EXPERIENCE", age: "age {n}" },
    sched: { lead: "Lives, festivals and online photo sessions — check the calendar here." },
    form: {
      name: "Full Name", company: "Company / Organization (optional)", email: "Email Address", type: "Inquiry Type", message: "Message",
      agreePre: "Please agree to the ", agreeLink: "Privacy Policy", agreePost: " before submitting.",
      submit: "Review & Submit", back: "Edit", send: "Send",
      confirmTitle: "Review your message", doneTitle: "Message sent",
      doneBody: "Thank you. We will get back to you after reviewing your message.",
      sendDemo: "Send (demo)", doneTitleDemo: "Sent (demo)",
      doneBodyDemo: "The contact form is not live yet — nothing was sent or stored.",
      errSend: "Sending failed. Please try again later.",
      selectPh: "Select one",
      errRequired: "This field is required", errEmail: "Please enter a valid email address", errType: "Please select a type", errAgree: "You must agree to the Privacy Policy",
      orderHint: "For merchandise orders and shipping, please include your order number.",
      mail: "Email", tel: "Phone",
    },
    foot: { terms: "Terms of Use", privacy: "Privacy Policy", legal: "Legal Notice", company: "About Us", backHome: "Back to top", copyright: "© 2026 SugarNote Official. All Rights Reserved." },
    oshi: {
      label: "Oshi", choose: "Choose your oshi",
      hint: "Pick your oshi and the site's underlines and ribbon take her member color. Saved on this device only.",
      set: "Make {name} my oshi", unset: "Clear oshi", isOshi: "MY OSHI", none: "Not set",
      done: "{name} is now your oshi", cleared: "Oshi cleared", close: "Close",
    },
    solo: {
      share: "Share this page", shareCopied: "Copied! Paste it on your SNS",
      twins: "Twins", enter: "VIEW PROFILE →", allMembers: "All members",
      herGoods: "GOODS", herGoodsLead: "Official goods to enjoy with {name}.", seeAllGoods: "See all goods for {name} →",
      prev: "PREV", next: "NEXT",
    },
    goods: {
      lead: "Official SugarNote merchandise. Payment is handled by Shopify's secure checkout.",
      jaOnly: "Product names and descriptions are in Japanese.",
      category: "CATEGORY", member: "MEMBER", allMembers: "ALL",
      cat: { all: "All", bromide: "Bromide photos", tcard: "Trading cards", poster: "Posters", acryl: "Acrylic stands & keychains", tshirt: "T-shirts" },
      countItems: "{n} items", forMember: "Goods for {name}", noItems: "No items match.",
      detail: "VIEW", memberSelectable: "Choose a member", sizeLabel: "Size", random: "Random",
      chooseMember: "Choose a member", chooseSize: "Choose a size", contents: "Contents",
      outfitMv: "MV outfit", outfitNormal: "Regular outfit", allMember: "All members",
      priceRange: "{label}: {price}",
      qty: "Qty", qtyMinus: "Decrease quantity", qtyPlus: "Increase quantity",
      addCart: "Add to cart", added: "Added to cart",
      cart: "Cart", cartCount: "Items in cart", close: "Close", closeCart: "Close cart",
      empty: "Your cart is empty.", remove: "Remove", total: "Total", taxNote: "(tax incl., shipping extra)",
      checkout: "Checkout", checkoutNote: "Opens Shopify's secure checkout. Shipping is calculated at checkout.",
      bonus: "Bundle bonus", bonusSub: "A free gift for every purchase over each threshold", bonusPer: "per purchase",
      bonusAuto: "Added automatically based on your cart total.", bonusPrizes: "Lottery prizes",
      bonusNote: "Bonus designs are random. Lottery details follow each product page.",
      meterStart: "{an} at {a}, {bn} at {b}", meterNext: "{amount} more for {name}", meterEarned: "You'll receive",
      guide: "Information",
      guide1t: "Random items", guide1d: "Designs cannot be chosen. The breakdown of each set is listed on the product.",
      guide2t: "Availability", guide2d: "Quantities are limited; sales end when sold out.",
      guide3t: "Payment", guide3d: "\"Checkout\" opens Shopify's secure checkout. Bundle bonuses are based on your order total.",
      guideContact: "Questions? ", guideContactLink: "Contact us", guideContactPost: ".",
    },
  },

  th: {
    nav: { concept: "คอนเซปต์", member: "สมาชิก", information: "ข่าวสาร", schedule: "กำหนดการ", goods: "สินค้า", contact: "ติดต่อ" },
    menu: { label: "เมนู", open: "MENU", close: "CLOSE" },
    sub: { concept: "คอนเซปต์", member: "สมาชิก", information: "ข่าวล่าสุด", schedule: "ตารางกิจกรรม", profile: "โปรไฟล์สมาชิก", video: "คอนเทนต์วิดีโอ", discography: "เพลง", goods: "สินค้าออฟิเชียล", contact: "ติดต่อเรา" },
    hero: { tagline: "ความบริสุทธิ์ขับเคลื่อนโลก", concept: "กลุ่มไอดอลที่สร้างสรรค์ผลงานโดยยึดจิตวิญญาณของชาวญี่ปุ่นเป็นแกนหลัก" },
    act: { viewAll: "ดูทั้งหมด", listen: "ฟัง", openTimetree: "เปิดใน TimeTree", play: "เล่นวิดีโอ" },
    prof: { birth: "วันเกิด / บ้านเกิด", exp: "ประสบการณ์", age: "อายุ {n} ปี" },
    sched: { lead: "เช็คตารางไลฟ์ เฟสติวัล และงานถ่ายรูปออนไลน์ได้ที่นี่" },
    form: {
      name: "ชื่อ-นามสกุล", company: "บริษัท / องค์กร (ถ้ามี)", email: "อีเมล", type: "ประเภทการติดต่อ", message: "ข้อความ",
      agreePre: "กรุณายอมรับ", agreeLink: "นโยบายความเป็นส่วนตัว", agreePost: "ก่อนส่ง",
      submit: "ตรวจสอบและส่ง", back: "แก้ไข", send: "ส่ง",
      confirmTitle: "ตรวจสอบข้อความของคุณ", doneTitle: "ส่งเรียบร้อยแล้ว",
      doneBody: "ขอบคุณสำหรับการติดต่อ ทีมงานจะติดต่อกลับหลังตรวจสอบข้อความ",
      sendDemo: "ส่ง (เดโม)", doneTitleDemo: "ส่งเรียบร้อย (เดโม)",
      doneBodyDemo: "แบบฟอร์มติดต่อยังไม่เปิดใช้งาน ไม่มีการส่งหรือบันทึกข้อมูล",
      errSend: "ส่งไม่สำเร็จ กรุณาลองใหม่ภายหลัง",
      selectPh: "เลือก",
      errRequired: "กรุณากรอกข้อมูล", errEmail: "กรุณากรอกอีเมลให้ถูกต้อง", errType: "กรุณาเลือกประเภท", errAgree: "ต้องยอมรับนโยบายความเป็นส่วนตัว",
      orderHint: "หากสอบถามเรื่องการสั่งซื้อหรือการจัดส่งสินค้า กรุณาระบุหมายเลขคำสั่งซื้อ",
      mail: "อีเมล", tel: "โทรศัพท์",
    },
    foot: { terms: "ข้อกำหนดการใช้งาน", privacy: "นโยบายความเป็นส่วนตัว", legal: "ข้อมูลตามกฎหมายการค้า", company: "เกี่ยวกับเรา", backHome: "กลับหน้าแรก", copyright: "© 2026 SugarNote Official. All Rights Reserved." },
    oshi: {
      label: "โอชิ", choose: "เลือกโอชิของคุณ",
      hint: "เลือกโอชิแล้วเส้นใต้และริบบิ้นของเว็บไซต์จะเปลี่ยนเป็นสีประจำตัวของเธอ บันทึกไว้ในอุปกรณ์นี้เท่านั้น",
      set: "ตั้ง {name} เป็นโอชิ", unset: "ยกเลิกโอชิ", isOshi: "MY OSHI", none: "ยังไม่ได้ตั้ง",
      done: "ตั้ง {name} เป็นโอชิแล้ว", cleared: "ยกเลิกโอชิแล้ว", close: "ปิด",
    },
    solo: {
      share: "แชร์หน้านี้", shareCopied: "คัดลอกแล้ว! นำไปแปะบน SNS ได้เลย",
      twins: "ฝาแฝด", enter: "ดูโปรไฟล์ →", allMembers: "สมาชิกทั้งหมด",
      herGoods: "GOODS", herGoodsLead: "สินค้าออฟิเชียลของ {name}", seeAllGoods: "ดูสินค้าทั้งหมดของ {name} →",
      prev: "ก่อนหน้า", next: "ถัดไป",
    },
    goods: {
      lead: "สินค้าออฟิเชียลของ SugarNote ชำระเงินผ่านระบบเช็กเอาต์ที่ปลอดภัยของ Shopify",
      jaOnly: "ชื่อและรายละเอียดสินค้าเป็นภาษาญี่ปุ่น",
      category: "หมวดหมู่", member: "สมาชิก", allMembers: "ทั้งหมด",
      cat: { all: "ทั้งหมด", bromide: "โบรไมด์", tcard: "การ์ดสะสม", poster: "โปสเตอร์", acryl: "อะคริลิกสแตนด์ & พวงกุญแจ", tshirt: "เสื้อยืด" },
      countItems: "{n} รายการ", forMember: "สินค้าของ {name}", noItems: "ไม่มีสินค้าที่ตรงกัน",
      detail: "ดูรายละเอียด", memberSelectable: "เลือกสมาชิกได้", sizeLabel: "ไซซ์", random: "สุ่ม",
      chooseMember: "เลือกสมาชิก", chooseSize: "เลือกไซซ์", contents: "รายละเอียดสินค้า",
      outfitMv: "ชุด MV", outfitNormal: "ชุดปกติ", allMember: "สมาชิกทั้งหมด",
      priceRange: "{label}: {price}",
      qty: "จำนวน", qtyMinus: "ลดจำนวน", qtyPlus: "เพิ่มจำนวน",
      addCart: "ใส่ตะกร้า", added: "ใส่ตะกร้าแล้ว",
      cart: "ตะกร้า", cartCount: "จำนวนในตะกร้า", close: "ปิด", closeCart: "ปิดตะกร้า",
      empty: "ตะกร้ายังว่างอยู่", remove: "ลบ", total: "รวม", taxNote: "(รวมภาษี ไม่รวมค่าจัดส่ง)",
      checkout: "ไปชำระเงิน", checkoutNote: "จะเปิดหน้าเช็กเอาต์ที่ปลอดภัยของ Shopify ค่าจัดส่งคำนวณตอนชำระเงิน",
      bonus: "ของแถมเมื่อซื้อครบ", bonusSub: "รับของแถมตามยอดรวมในการสั่งซื้อ", bonusPer: "ต่อยอดซื้อ",
      bonusAuto: "มอบให้อัตโนมัติตามยอดรวมในตะกร้า", bonusPrizes: "รางวัลจับฉลาก",
      bonusNote: "ลายของแถมเป็นแบบสุ่ม รายละเอียดฉลากเป็นไปตามที่ระบุในหน้าสินค้า",
      meterStart: "{an} เมื่อครบ {a}, {bn} เมื่อครบ {b}", meterNext: "อีก {amount} รับ {name}", meterEarned: "จะได้รับ",
      guide: "ข้อมูลเพิ่มเติม",
      guide1t: "สินค้าแบบสุ่ม", guide1d: "ไม่สามารถเลือกลายได้ รายละเอียดของแต่ละชุดระบุไว้ในหน้าสินค้า",
      guide2t: "สถานะการจำหน่าย", guide2d: "สินค้ามีจำนวนจำกัด หมดแล้วหมดเลย",
      guide3t: "การชำระเงิน", guide3d: "ปุ่ม “ไปชำระเงิน” จะเปิดหน้าเช็กเอาต์ของ Shopify ของแถมมอบให้ตามยอดรวมของคำสั่งซื้อ",
      guideContact: "มีคำถาม? ", guideContactLink: "ติดต่อเรา", guideContactPost: "",
    },
  },
};

const SNLang = (function () {
  "use strict";
  const KEY = "sn-lang";
  const LANGS = ["ja", "en", "th"];
  let current = "ja";

  function resolve(dict, path) {
    return path.split(".").reduce(function (o, p) { return o == null ? o : o[p]; }, dict);
  }

  /** 現在言語（または指定言語）の文言。無ければ ja にフォールバック */
  function t(key, lang) {
    const l = lang || current;
    let v = resolve(SN_I18N[l] || SN_I18N.ja, key);
    if (v == null && l !== "ja") v = resolve(SN_I18N.ja, key);
    return v == null ? key : v;
  }

  /** {n} などのプレースホルダを差し込む */
  function fmt(key, params, lang) {
    let s = t(key, lang);
    Object.keys(params || {}).forEach(function (k) {
      s = s.split("{" + k + "}").join(params[k]);
    });
    return s;
  }

  function applyStatic() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const v = t(el.getAttribute("data-i18n"));
      if (typeof v === "string") el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        const i = pair.indexOf(":");
        if (i < 0) return;
        const attr = pair.slice(0, i).trim();
        const v = t(pair.slice(i + 1).trim());
        if (typeof v === "string") el.setAttribute(attr, v);
      });
    });
  }

  function apply(lang) {
    if (LANGS.indexOf(lang) < 0) lang = "ja";
    current = lang;
    document.documentElement.lang = lang;
    applyStatic();
    document.querySelectorAll("[data-lang-switch]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang-switch") === lang));
    });
    try { localStorage.setItem(KEY, lang); } catch (e) { /* private mode */ }
    /* sn:lang はマイクロタスクで通知する。同期発火だと、init() の直後に登録した
       リスナーへ初回（保存言語の復元）が届かず、JS描画部分が ja のまま残る */
    queueMicrotask(function () {
      document.dispatchEvent(new CustomEvent("sn:lang", { detail: { lang: lang } }));
    });
  }

  /** 言語切替ボタンの配線 + 保存済み言語の適用。DOMContentLoaded 後に呼ぶ */
  function init() {
    document.querySelectorAll("[data-lang-switch]").forEach(function (b) {
      b.addEventListener("click", function () { apply(b.getAttribute("data-lang-switch")); });
    });
    let saved = "ja";
    try { saved = localStorage.getItem(KEY) || "ja"; } catch (e) { /* private mode */ }
    apply(saved);
  }

  return {
    t: t,
    fmt: fmt,
    apply: apply,
    init: init,
    LANGS: LANGS,
    get current() { return current; },
  };
})();
