/* SugarNote 公式サイト — サイト共通データ（メンバー・お知らせ・楽曲・動画・SNS）
 * 出典: sugarnote.jp (ja/en/th)。メンバーカラーは公式物販「メンバーカラーアクリルスタンド」の表記。
 * 商品データは goods-data.js、UI文言は i18n.js。更新手順は README.md「コンテンツの更新」。
 */
const SN = {
  brand: {
    name: "SugarNote",
    siteUrl: "https://sugarnote.jp/",
    tagline: "Pure. Bright. Unstoppable.",
    taglineLocal: {
      ja: "ピュアが、世界を動かす。",
      en: "Purity moves the world.",
      th: "ความบริสุทธิ์ขับเคลื่อนโลก",
    },
    concept: {
      ja: "日本人の持つ精神性を主軸にしたクリエイティブを発信していくアイドルグループ。",
      en: "An idol group that expresses creativity rooted in the Japanese spirit.",
      th: "กลุ่มไอดอลที่สร้างสรรค์ผลงานโดยยึดจิตวิญญาณของชาวญี่ปุ่นเป็นแกนหลัก",
    },
    hashtag: "#SugarNote",
    /* 運営会社・連絡先（変更手順は README を参照） */
    company: "株式会社LINDO",
    companyUrl: "https://styledbylindo.com/",
    contact: {
      email: "info@sugarnote.jp",
      tel: "03-5308-5822",
      hours: { ja: "受付時間 10:00-18:00（土日祝を除く）", en: "10:00–18:00 JST, weekdays", th: "10:00–18:00 (เวลาญี่ปุ่น) วันจันทร์–ศุกร์" },
    },
    sns: {
      x: "https://x.com/sugarnote_ofc?s=21",
      instagram: "https://www.instagram.com/sugarnote_ofc",
      youtube: "https://www.youtube.com/@SugarNote_OFC",
    },
  },

  /* グッズ機能の公開スイッチ。false のあいだは GOODS への導線をオンラインストア（Shopify）へ向け、
     goods.html / legal.html はストアへ転送する（?preview を付けると確認用に開ける）。
     2026-11 のグッズ公開で true にする（手順は README「グッズの公開（2026-11）」） */
  goodsLive: false,
  store: {
    url: "https://www.sugarnote.store/",
    legal: "https://www.sugarnote.store/policies/legal-notice",
  },

  /* メンバーカラー。hex = 本来の色（チップ用）、ui = 白背景で AA(4.5:1) を満たす濃色（文字・線用） */
  colors: {
    Pink:   { hex: "#F7A8C4", ui: "#C13F76" },
    Blue:   { hex: "#8EB8E5", ui: "#2F66A6" },
    White:  { hex: "#F7F5F2", ui: "#6E6B78" },
    Red:    { hex: "#E8848B", ui: "#BC3844" },
    Yellow: { hex: "#F5D67B", ui: "#8F6A0A" },
    Purple: { hex: "#B9A5DC", ui: "#6C50B4" },
  },

  /* 表示順は運営指定の順。img = 縦位置のアー写、face = 正方形の顔写真。
     skills = 特技（1要素 = 1行）、memo = MEMO 欄の箇条書き */
  members: [
    {
      id: "ririho", name: "白咲里莉穂", short: "里莉穂", kana: "シロサキリリホ", romaji: "SHIROSAKI RIRIHO", thai: "ชิโรซากิ ริริโฮะ",
      birth: "2007-06-26", origin: { ja: "富山県", en: "Toyama", th: "โทยามะ" },
      mbti: "ESFP", mbtiLabel: { ja: "エンターテイナー", en: "The Entertainer", th: "นักบันเทิง" },
      color: "White", img: "member-ririho.jpg", face: "face-ririho.jpg",
      skills: {
        ja: ["ピアノ（歴8年）/ 書道（歴4年）/ フルート（歴3年）"],
        en: ["Piano (8 yrs) / Calligraphy (4 yrs) / Flute (3 yrs)"],
        th: ["เปียโน (8 ปี) / เขียนพู่กัน (4 ปี) / ฟลุต (3 ปี)"],
      },
      memo: {
        ja: ["ダンス（歴3年）", "趣味：歌うこと / お菓子作り"],
        en: ["Dance (3 yrs)", "Hobbies: singing / making sweets"],
        th: ["เต้น (3 ปี)", "งานอดิเรก: ร้องเพลง / ทำขนม"],
      },
      sns: { x: "https://x.com/SugarNote_ririh?s=20", instagram: "https://www.instagram.com/sugarnote_ririho/", tiktok: "https://www.tiktok.com/@sugarnote_ririho" },
    },
    {
      id: "nanako", name: "櫻井那奈子", short: "那奈子", kana: "サクライナナコ", romaji: "SAKURAI NANAKO", thai: "ซากุไร นานาโกะ",
      birth: "2007-01-29", origin: { ja: "東京都", en: "Tokyo", th: "โตเกียว" },
      mbti: "INFP", mbtiLabel: { ja: "仲介者", en: "The Mediator", th: "ผู้ไกล่เกลี่ย" },
      color: "Red", img: "member-nanako.jpg", face: "face-nanako.jpg",
      skills: {
        ja: ["フィギュアスケート（歴14年）", "ダンス（歴9年）", "バレエ（歴3年）"],
        en: ["Figure skating (14 yrs)", "Dance (9 yrs)", "Ballet (3 yrs)"],
        th: ["สเก็ตลีลา (14 ปี)", "เต้น (9 ปี)", "บัลเลต์ (3 ปี)"],
      },
      memo: {
        ja: ["趣味：シール探し"],
        en: ["Hobby: hunting for stickers"],
        th: ["งานอดิเรก: ตามหาสติกเกอร์"],
      },
      sns: { x: "https://x.com/SugarNote_nana?s=20", instagram: "https://www.instagram.com/sugarnote_nanako/", tiktok: "https://www.tiktok.com/@sugarnote_nanako" },
    },
    {
      id: "hinata", name: "坂東日奈多", short: "日奈多", kana: "バンドウヒナタ", romaji: "BANDO HINATA", thai: "บันโด ฮินาตะ",
      birth: "2004-08-31", origin: { ja: "東京都", en: "Tokyo", th: "โตเกียว" },
      mbti: "ISTP", mbtiLabel: { ja: "巨匠", en: "The Virtuoso", th: "ช่างฝีมือ" },
      color: "Pink", img: "member-hinata.jpg", face: "face-hinata.jpg",
      twin: "fuka",
      skills: {
        ja: ["ダンス（歴4年）/ バレエ（歴15年）", "ソフトクリームをきれいに巻くこと"],
        en: ["Dance (4 yrs) / Ballet (15 yrs)", "Swirling soft-serve ice cream perfectly"],
        th: ["เต้น (4 ปี) / บัลเลต์ (15 ปี)", "บีบซอฟต์ครีมให้เป็นเกลียวสวย"],
      },
      memo: {
        ja: ["坂東楓夏と双子", "趣味：ショッピング"],
        en: ["Twins with FUKA", "Hobby: shopping"],
        th: ["ฝาแฝดกับฟูกะ", "งานอดิเรก: ช้อปปิ้ง"],
      },
      sns: { x: "https://x.com/SugarNote_hina?s=20", instagram: "https://www.instagram.com/sugarnote_hina/", tiktok: "https://www.tiktok.com/@sugarnote_hina" },
    },
    {
      id: "fuka", name: "坂東楓夏", short: "楓夏", kana: "バンドウフウカ", romaji: "BANDO FUKA", thai: "บันโด ฟูกะ",
      birth: "2004-08-31", origin: { ja: "東京都", en: "Tokyo", th: "โตเกียว" },
      mbti: "ESFP", mbtiLabel: { ja: "エンターテイナー", en: "The Entertainer", th: "นักบันเทิง" },
      color: "Yellow", img: "member-fuka.jpg", face: "face-fuka.jpg",
      twin: "hinata",
      skills: {
        ja: ["ダンス（歴4年）/ バレエ（歴15年）", "表情管理（歌詞を人に伝えることが好きです）"],
        en: ["Dance (4 yrs) / Ballet (15 yrs)", "Facial expressions (loves conveying the lyrics to listeners)"],
        th: ["เต้น (4 ปี) / บัลเลต์ (15 ปี)", "การควบคุมสีหน้า (ชอบถ่ายทอดเนื้อเพลงให้ผู้คน)"],
      },
      memo: {
        ja: ["坂東日奈多と双子", "PRODUCE 101 JAPAN THE GIRLS 出身", "趣味：食べること / 寝ること"],
        en: ["Twins with HINATA", "Ex-PRODUCE 101 JAPAN THE GIRLS", "Hobbies: eating / sleeping"],
        th: ["ฝาแฝดกับฮินาตะ", "อดีตผู้เข้าแข่งขัน PRODUCE 101 JAPAN THE GIRLS", "งานอดิเรก: กิน / นอน"],
      },
      sns: { x: "https://x.com/sugarnote_fuka?s=20", instagram: "https://www.instagram.com/sugarnote_fuka/", tiktok: "https://www.tiktok.com/@sugarnote_fuka" },
    },
    {
      id: "airi", name: "西条藍里", short: "藍里", kana: "サイジョウアイリ", romaji: "SAIJO AIRI", thai: "ไซโจ ไอริ",
      birth: "2003-09-17", origin: { ja: "京都府", en: "Kyoto", th: "เกียวโต" },
      mbti: "INFJ", mbtiLabel: { ja: "提唱者", en: "The Advocate", th: "นักสนับสนุน" },
      color: "Blue", img: "member-airi.jpg", face: "face-airi.jpg",
      skills: {
        ja: ["早起き"],
        en: ["Waking up early"],
        th: ["ตื่นเช้า"],
      },
      memo: {
        ja: ["ダンス（歴2年）", "趣味：水泳"],
        en: ["Dance (2 yrs)", "Hobby: swimming"],
        th: ["เต้น (2 ปี)", "งานอดิเรก: ว่ายน้ำ"],
      },
      sns: { x: "https://x.com/sugarnote_airi?s=20", instagram: "https://www.instagram.com/sugarnote_airi/", tiktok: "https://www.tiktok.com/@sugarnote_airi" },
    },
    {
      id: "rana", name: "月城蘭花", short: "蘭花", kana: "ツキシロラナ", romaji: "TSUKISHIRO RANA", thai: "สึกิชิโระ ราน่า",
      birth: "2007-11-06", origin: { ja: "東京都", en: "Tokyo", th: "โตเกียว" },
      mbti: "ISFP", mbtiLabel: { ja: "冒険家", en: "The Adventurer", th: "นักผจญภัย" },
      color: "Purple", img: "member-rana.jpg", face: "face-rana.jpg",
      skills: {
        ja: ["韓国語（韓国人のため日本語・韓国語の2カ国語話せます）", "絵を描くこと"],
        en: ["Korean (being Korean, speaks both Japanese and Korean)", "Drawing"],
        th: ["ภาษาเกาหลี (เป็นคนเกาหลี จึงพูดได้ทั้งภาษาญี่ปุ่นและเกาหลี)", "วาดรูป"],
      },
      memo: {
        ja: ["ダンス（歴3年）", "趣味：ゲーム"],
        en: ["Dance (3 yrs)", "Hobby: gaming"],
        th: ["เต้น (3 ปี)", "งานอดิเรก: เล่นเกม"],
      },
      sns: { x: "https://x.com/sugarnote_rana", instagram: "https://www.instagram.com/sugarnote_rana/", tiktok: "https://www.tiktok.com/@sugarnote_rana" },
    },
  ],

  /* お知らせ。url は現行サイトの記事ページ（移行後は自サイトの記事URLへ置換する） */
  news: [
    { date: "2026-07-08", category: "NEWS", title: "【Dance Practice Video】 ニュアンスブルー", url: "./ja/information/4fbd778d-badb-4cf9-84ce-c82a2fe29148/" },
    { date: "2026-07-08", category: "RELEASE", title: "『ニュアンスブルー』Release", url: "./ja/information/e2bab15c-8d71-4282-bf4d-c76bfecf2b72/" },
    { date: "2026-07-07", category: "RELEASE", title: "『who I am』(2026ver) Release", url: "./ja/information/2c1b6c2f-04b6-4a24-83d8-2c19ab7a86ef/" },
    { date: "2026-07-07", category: "NEWS", title: "【Dance Practice Video】嘘だよ(2026ver)", url: "./ja/information/b70c2bb8-a093-4d95-bd5d-60008c4571f7/" },
    { date: "2026-07-07", category: "NEWS", title: "【Dance Practice Video】who I am(2026ver)", url: "./ja/information/fa58bbde-09d9-468a-9a53-98f2a48549fe/" },
  ],

  discography: [
    { title: "ニュアンスブルー", type: "DIGITAL SINGLE", date: "2026-07-08", cover: "cd-03.jpg", link: "https://linkco.re/Xvt2eE2u" },
    { title: "嘘だよ", type: "DIGITAL SINGLE", date: "2026-03-29", cover: "cd-01.jpg", link: "https://linkco.re/4BQpe5ZZ" },
    { title: "who I am", type: "DIGITAL SINGLE", date: "2026-03-29", cover: "cd-02.jpg", link: "https://linkco.re/N5xXM2Ne" },
  ],

  video: { id: "bKjkPWKCHgU", title: "【SugarNote】Anime Festival Asia Thailand 2026 Digest Movie", thumb: "video-afa.jpg" },

  timetree: {
    embedBase: "https://timetreeapp.com/public_calendars/sugarnote_ofc/embed/monthly?calendar_name=true",
    publicUrl: "https://timetreeapp.com/public_calendars/sugarnote_ofc",
  },

  /* お問い合わせフォームの送信先。endpoint が空のあいだはデモ動作（送信しない）。
     Web3Forms を使う場合: endpoint = "https://api.web3forms.com/submit", fields = { access_key: "…" } */
  contactForm: { endpoint: "", fields: {} },

  contactTypes: {
    ja: ["出演依頼", "取材・メディア関連", "ファンレター・プレゼントについて", "グッズのご注文について", "その他"],
    en: ["Performance Request", "Press / Media", "Fan Mail / Gifts", "Merchandise Orders", "Other"],
    th: ["ขอการแสดง", "สื่อมวลชน / สื่อสิ่งพิมพ์", "แฟนเมล / ของขวัญ", "การสั่งซื้อสินค้า", "อื่นๆ"],
  },
};

/* 画像の実寸（width/height 属性・CLS対策用）。商品画像はすべて 1080×1080 */
SN.imgSize = {
  "group-760.jpg": [760, 509],
  "group-1400.jpg": [1400, 938],
  "group-1920.jpg": [1920, 1287],
  "logo-heart.png": [800, 800],
  "logo-ribbon.png": [800, 800],
  "member-hinata.jpg": [1214, 1700],
  "member-airi.jpg": [1077, 1508],
  "member-ririho.jpg": [1354, 1896],
  "member-nanako.jpg": [1339, 1875],
  "member-fuka.jpg": [1031, 1444],
  "member-rana.jpg": [1066, 1600],
  "face-hinata.jpg": [480, 480],
  "face-airi.jpg": [480, 480],
  "face-ririho.jpg": [480, 480],
  "face-nanako.jpg": [480, 480],
  "face-fuka.jpg": [480, 480],
  "face-rana.jpg": [480, 480],
  "cd-01.jpg": [612, 615],
  "cd-02.jpg": [1200, 1200],
  "cd-03.jpg": [1200, 1200],
  "video-afa.jpg": [1280, 720],
};

/* ---- 共通ヘルパー ---- */

/** id からメンバーを引く */
SN.member = function (id) {
  return SN.members.find(function (m) { return m.id === id; }) || null;
};

/** メンバーカラー定義 { hex, ui } */
SN.colorOf = function (member) {
  return SN.colors[member.color];
};

/** 満年齢（誕生日当日を含む） */
SN.ageOf = function (member, now) {
  const today = now || new Date();
  const b = new Date(member.birth + "T00:00:00");
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age -= 1;
  return age;
};

/** 言語別フィールド取得: SN.pick(member.origin, "th") */
SN.pick = function (field, lang) {
  if (field == null || typeof field === "string") return field;
  return field[lang] || field.ja;
};

/** 言語別のメンバー表示名 { main, sub } */
SN.memberNames = function (member, lang) {
  if (lang === "en") return { main: member.romaji, sub: member.name };
  if (lang === "th") return { main: member.thai, sub: member.name };
  return { main: member.name, sub: member.kana };
};

/** 言語別の短い呼び名（チップ・見出し用）: 日奈多 / HINATA / ฮินาตะ */
SN.memberShort = function (member, lang) {
  if (lang === "en") return member.romaji.split(" ").pop();
  if (lang === "th") return member.thai.split(" ").pop();
  return member.short;
};

/** TimeTree 埋め込みURL（枠色を指定） */
SN.timetreeUrl = function (hexNoHash) {
  return SN.timetree.embedBase + "&frame_color=%23" + String(hexNoHash).replace("#", "");
};
