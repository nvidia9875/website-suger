/* SugarNote 公式サイト — 商品データ（Shopify 連携）
 * 出典: sugarnote.store products.json / 2026-08-19 提供「グッズまとめ」フォルダ準拠（12点）
 *
 * 仕組み: 商品一覧・カートはこのサイトで描画し、決済だけ Shopify のチェックアウトへ渡す。
 *   variants[].sid = Shopify のバリアントID。カートパーマリンク
 *   https://www.sugarnote.store/cart/<sid>:<数量>,<sid>:<数量> で Shopify のチェックアウトが開く。
 *   請求額は Shopify 側の価格で決まる。ここに書く price は表示用なので Shopify と必ず揃えること。
 *
 * メンバー情報（名前・色・顔写真）は data.js の SN.members を参照する。ここでは id だけを持つ。
 * 商品の追加・変更手順は README.md「グッズの更新」。
 */
const GOODS = {
  store: {
    /* Shopify ストア。チェックアウトの遷移先 */
    checkoutBase: "https://www.sugarnote.store",
    /* 支払い方法（特商法ページ・ご案内で使用） */
    payment: "クレジットカード決済・コンビニ決済",
  },

  /* トップページ GOODS 欄に出す4点（product id） */
  featured: ["stand", "charm", "poster", "seifuku-bromide"],

  /* カテゴリ絞り込み。label は i18n の goods.cat.<key> */
  categories: [
    { key: "all", cats: null },
    { key: "bromide", cats: ["ブロマイド"] },
    { key: "tcard", cats: ["トレーディングカード"] },
    { key: "poster", cats: ["ポスター"] },
    { key: "acryl", cats: ["アクリルスタンド", "アクリルキーホルダー"] },
    { key: "tshirt", cats: ["Tシャツ"] },
  ],

  /* まとめ買い特典（全商品共通・商品説明原文より） */
  bonus: {
    tiers: [
      { threshold: 10000, name: "トレカ写真券", detail: "1枚プレゼント（ランダム）＋当たりくじ", prizes: "写メ券 / チェキ券 / サイン券 / TikTok撮影(15秒)" },
      { threshold: 20000, name: "トレカキラチェキ券", detail: "1枚プレゼント（ランダム）＋当たりくじ", prizes: "サイン券 / 動画メッセージ(10秒) / TikTok撮影(15秒) / 全員サインポスター / 名前呼びボイス(10秒)" },
    ],
  },

  /* 商品。img は assets/img/goods/ 配下。variantType: fixed | member | member2 | size
   *   member  … バリアント key がメンバー id（"pair" のような複数人バリアントは members[] を持つ）
   *   member2 … 衣装 × メンバー（variant.member でメンバーを指す）
   *   size    … サイズ違い。shelfMembers があるものは特定メンバーの棚にも出す */
  products: [
    {
      id: "seifuku-bromide",
      name: "制服衣装ランダムブロマイド（3枚入り）",
      deco: "制服衣装ランダムブロマイド(3枚入り)全35種",
      category: "ブロマイド", series: "seifuku",
      img: "seifuku-main.jpg", price: 1000,
      variantType: "fixed",
      variants: [{ key: "default", sid: 47721611198700, label: "全35種ランダム", price: 1000, img: "seifuku-main.jpg" }],
      desc: "SugarNote制服衣装ランダムブロマイドが登場♡\nメンバーそれぞれの魅力が詰まったソロショットから、ここでしか見られない全員集合ショットまで✧˖°\n制服衣装ならではの爽やかで特別な雰囲気をお楽しみいただけます⋆.˚\nどの絵柄が届くかは開けてからのお楽しみ♡ ぜひコレクションしてください✰",
      contents: ["ランダムブロマイド 3枚入り", "各個人ブロマイド 6種 / ALLメンバーブロマイド 5種＝全35種"],
      notes: ["月城蘭花のブロマイドは含まれておりません", "ランダム封入のため絵柄はお選びいただけません"],
      random: { label: "全35種" },
    },
    {
      id: "danpra-bromide",
      name: "ダンプラ衣装ランダムブロマイド（3枚入り）",
      deco: "ダンプラ衣装ランダムブロマイド(3枚入り)全35種",
      category: "ブロマイド", series: "danpra",
      img: "danpra-main.jpg", price: 1000,
      variantType: "fixed",
      variants: [{ key: "default", sid: 47721618112748, label: "全35種ランダム", price: 1000, img: "danpra-main.jpg" }],
      desc: "SugarNoteダンプラ衣装ランダムブロマイドが登場♡\nダンスプラクティス動画で着用した衣装姿をブロマイドにしました✧˖°\nパフォーマンス中とはまた違った表情や、メンバーそれぞれの魅力が詰まった特別な一枚⋆.˚\nソロショットから全員集合ショットまで、どの絵柄が届くかは開けてからのお楽しみ♡ ぜひコレクションしてください✰",
      contents: ["ランダムブロマイド 3枚入り", "各個人ブロマイド 6種 / ALLメンバーブロマイド 5種＝全35種"],
      notes: ["月城蘭花のブロマイドは含まれておりません", "ランダム封入のため絵柄はお選びいただけません", "数量限定"],
      random: { label: "全35種" },
    },
    {
      id: "debut-bromide",
      name: "Debut/嘘だよMV記念ランダムブロマイド（3枚入り）",
      deco: "Debut/嘘だよMV記念ランダムブロマイド(3枚入り)全13種",
      category: "ブロマイド", series: "mv",
      img: "debut-main.jpg", price: 1000,
      variantType: "fixed",
      variants: [{ key: "default", sid: 47721619947756, label: "全13種ランダム", price: 1000, img: "debut-main.jpg" }],
      desc: "SugarNote「Debut/嘘だよ」MV公開記念ランダムブロマイドが登場♡\nMV撮影時の特別なカットをブロマイドにしました✧˖°\nメンバーそれぞれの魅力が詰まったソロショットから、MVの世界観を感じられる特別なカットまで⋆.˚\nここでしか手に入らないMVの思い出が詰まった記念アイテムです♡\nどの絵柄が届くかは開けてからのお楽しみ✰ ぜひコレクションしてください♪",
      contents: ["ランダムブロマイド 3枚入り", "絵柄 全13種"],
      notes: ["ランダム封入のため絵柄はお選びいただけません", "数量限定"],
      random: { label: "全13種" },
    },
    {
      id: "hinafu-bromide",
      name: "ひなふうらんどランダムブロマイド（3枚入り）",
      deco: "ひなふうらんどランダムブロマイド(3枚入り)各全6種",
      category: "ブロマイド", series: "hinafu",
      img: "hinafu-brm-main.jpg", price: 1000,
      variantType: "member",
      variants: [
        { key: "fuka",   sid: 48156384657644, label: "坂東 楓夏",   sub: "全6種", price: 1000, img: "hinafu-brm-fuka.jpg" },
        { key: "hinata", sid: 48156384690412, label: "坂東 日奈多", sub: "全6種", price: 1000, img: "hinafu-brm-hinata.jpg" },
        { key: "pair",   sid: 48156384723180, label: "ひなふうペア", sub: "ペア全6種", price: 1000, img: "hinafu-brm-pair.jpg", chip: "ひなふう", members: ["hinata", "fuka"] },
      ],
      desc: "⟡˖ ひなふうらんど⟡˖〜Happy Birthday〜を記念した限定ランダムブロマイドが登場♡\nひなた＆ふうかの特別な生誕衣装、特別衣装姿で撮影したカットをブロマイドにしました𓂃 𓈒𓏸 𝜗𝜚\n可愛さたっぷりのソロショットから、2人の「ひなふうらんど」の世界観を感じられる特別なカットまで✧˖°\nここでしか手に入らない、ひなた＆ふうかとの思い出が詰まった記念アイテムです໒꒱˚⟡˖\nどの絵柄が届くかは開けてからのお楽しみ✰ ぜひ全種類コレクションしてください♪",
      contents: ["ランダムブロマイド 3枚入り", "ひなふうペア 全6種 / ひなた 全6種 / ふうか 全6種"],
      notes: ["ランダム封入のため絵柄はお選びいただけません", "数量限定"],
      random: { label: "各全6種" },
    },
    {
      id: "hinafu-tcard",
      name: "ひなふうランダムトレーディングカード（3枚入り）",
      deco: "ひなふうランダムトレーディングカード（3枚入り）",
      category: "トレーディングカード", series: "hinafu",
      img: "hinafu-tcard.jpg", price: 1000,
      variantType: "fixed",
      variants: [{ key: "default", sid: 48165375508716, label: "全12種ランダム", price: 1000, img: "hinafu-tcard.jpg" }],
      shelfMembers: ["hinata", "fuka"],
      desc: "ひなふうらんどのランダムトレーディングカードが登場♡\nひなた＆ふうかの可愛い瞬間をぎゅっと詰め込んだ、ここでしか手に入らないオリジナルトレーディングカードです。\n全12種の中からランダムで3枚入り！\nどのひなふうが出るかは開けてからのお楽しみ♡ お気に入りのカードを狙うのはもちろん、全12種コンプリートして並べても可愛いアイテムです。",
      contents: ["ランダムトレーディングカード 3枚入り", "全12種"],
      notes: ["絵柄はランダムとなります。", "同じ絵柄が入っている場合がございます。", "数量限定"],
      random: { label: "全12種" },
    },
    {
      id: "poster",
      name: "衣装ビジュアルポスター",
      deco: "衣装ビジュアルポスター",
      category: "ポスター", series: "mv",
      img: "poster-main.jpg", price: 3000,
      variantType: "member2",
      /* MV衣装 / 通常衣装 × メンバー。通常衣装は個別アー写が未提供のためメイン画像で代替
         （蘭花は通常衣装バリアント自体が Shopify に無い） */
      variants: [
        { key: "mv-fuka",   sid: 47724643025132, label: "MV 坂東 楓夏",   member: "fuka",   outfit: "mv",     price: 3000, img: "poster-mv-fuka.jpg" },
        { key: "fuka",      sid: 47393539752172, label: "坂東 楓夏",      member: "fuka",   outfit: "normal", price: 3000, img: "poster-main.jpg" },
        { key: "mv-airi",   sid: 47724643057900, label: "MV 西条 藍里",   member: "airi",   outfit: "mv",     price: 3000, img: "poster-mv-airi.jpg" },
        { key: "airi",      sid: 47393539784940, label: "西条 藍里",      member: "airi",   outfit: "normal", price: 3000, img: "poster-main.jpg" },
        { key: "mv-nanako", sid: 47724643090668, label: "MV 櫻井 那奈子", member: "nanako", outfit: "mv",     price: 3000, img: "poster-mv-nanako.jpg" },
        { key: "nanako",    sid: 47393539817708, label: "櫻井 那奈子",    member: "nanako", outfit: "normal", price: 3000, img: "poster-main.jpg" },
        { key: "mv-hinata", sid: 47724643123436, label: "MV 坂東 日奈多", member: "hinata", outfit: "mv",     price: 3000, img: "poster-mv-hinata.jpg" },
        { key: "hinata",    sid: 47393539850476, label: "坂東 日奈多",    member: "hinata", outfit: "normal", price: 3000, img: "poster-main.jpg" },
        { key: "mv-ririho", sid: 47724643156204, label: "MV 白咲 里莉穂", member: "ririho", outfit: "mv",     price: 3000, img: "poster-mv-ririho.jpg" },
        { key: "ririho",    sid: 47393539883244, label: "白咲 里莉穂",    member: "ririho", outfit: "normal", price: 3000, img: "poster-main.jpg" },
        { key: "mv-rana",   sid: 47724643188972, label: "MV 月城 蘭花",   member: "rana",   outfit: "mv",     price: 3000, img: "poster-mv-rana.jpg" },
        { key: "mv-all",    sid: 47724643221740, label: "MV All Member",  member: "all",    outfit: "mv",     price: 3000, img: "poster-mv-all.jpg" },
      ],
      desc: "SugarNote衣装のビジュアルポスターが登場。\nPure. Bright. Unstoppable. — ピュアが、世界を動かす。\nSugarNoteが描くのは、誰かの理想に合わせた完璧な姿ではなく、自分自身の感情や衝動を信じる「純粋な強さ」。\n純粋で、まっすぐで、どこか危うくも輝く SugarNote の魅力を一枚のビジュアルに込めました。\nお部屋やコレクションスペースに飾って、SugarNoteの特別な瞬間をぜひお楽しみください。",
      contents: ["ビジュアルポスター 1枚", "A4サイズ"],
      notes: ["数量限定"],
    },
    {
      id: "stand",
      name: "メンバーカラーアクリルスタンド",
      deco: "メンバーカラーアクリルスタンド",
      category: "アクリルスタンド", series: "mcolor",
      img: "stand-main.jpg", price: 1500,
      variantType: "member",
      variants: [
        { key: "fuka",   sid: 47393203159276, label: "坂東 楓夏",   price: 1500, img: "stand-fuka.jpg" },
        { key: "airi",   sid: 47393203192044, label: "西条 藍里",   price: 1500, img: "stand-airi.jpg" },
        { key: "nanako", sid: 47393203224812, label: "櫻井 那奈子", price: 1500, img: "stand-nanako.jpg" },
        { key: "hinata", sid: 47393203257580, label: "坂東 日奈多", price: 1500, img: "stand-hinata.jpg" },
        { key: "ririho", sid: 47393203290348, label: "白咲 里莉穂", price: 1500, img: "stand-ririho.jpg" },
        { key: "rana",   sid: 47721429729516, label: "月城 蘭花",   price: 1500, img: "stand-rana.jpg" },
      ],
      desc: "SugarNoteメンバーがアクリルスタンドになって登場！\nSugarNoteメンバーの実写ビジュアルを使用した、ここでしか手に入らない特別なアクリルスタンドです。\n土台は星形で、各メンバーのメンバーカラーをイメージしたデザイン。デスクや棚に飾るだけで、SugarNoteの世界観をいつでも楽しめます。\nお気に入りの“推しメンバー”を選んで飾るのはもちろん、全メンバーを集めて並べれば、より可愛いコレクションになります。",
      contents: ["アクリルスタンド 1点", "サイズ 約70mm・星形メンバーカラー台座"],
      notes: [],
    },
    {
      id: "hinafu-stand",
      name: "ひなふうアクリルスタンド",
      deco: "ひなふうアクリルスタンド",
      category: "アクリルスタンド", series: "hinafu",
      img: "hinafu-stand.jpg", price: 3000,
      variantType: "fixed",
      variants: [{ key: "default", sid: 48165306925292, label: "ひなふうらんど限定", price: 3000, img: "hinafu-stand.jpg" }],
      shelfMembers: ["hinata", "fuka"],
      desc: "ひなふうらんど限定アクリルスタンドになって登場！\n実写ビジュアルを使用した、ここでしか手に入らない特別なクリア素材のアクリルスタンドです。\nひなふうらんどをイメージしたデザイン。デスクや棚に飾るだけで、ひなふうらんどの世界観をいつでも楽しめます。",
      contents: ["アクリルスタンド 1点", "サイズ 約70mm"],
      notes: [],
    },
    {
      id: "charm",
      name: "メンバーキャラクターアクリルキーホルダー",
      deco: "メンバーキャラクターアクリルキーホルダー",
      category: "アクリルキーホルダー", series: "mcolor",
      img: "charm-all.jpg", price: 1000,
      variantType: "member",
      variants: [
        { key: "fuka",   sid: 47393174749420, label: "坂東 楓夏",   price: 1000, img: "charm-fuka.jpg" },
        { key: "airi",   sid: 47393174782188, label: "西条 藍里",   price: 1000, img: "charm-airi.jpg" },
        { key: "nanako", sid: 47393174814956, label: "櫻井 那奈子", price: 1000, img: "charm-nanako.jpg" },
        { key: "hinata", sid: 47393174847724, label: "坂東 日奈多", price: 1000, img: "charm-hinata.jpg" },
        { key: "ririho", sid: 47393174880492, label: "白咲 里莉穂", price: 1000, img: "charm-ririho.jpg" },
        { key: "rana",   sid: 47721424781548, label: "月城 蘭花",   price: 1000, img: "charm-rana.jpg" },
        { key: "all",    sid: 47393174913260, label: "All Member",  price: 1000, img: "charm-all.jpg" },
      ],
      desc: "SugarNoteメンバーのキャラクターがアクリルキーホルダーになって登場！\nそれぞれのメンバーをイメージしたオリジナルキャラクターをデザインした、ここでしか手に入らない特別なアクリルキーホルダーです。\nシルバーの星型チャームが付いた仕様で、バッグやポーチ、鍵などにつけていつでもSugarNoteを身近に感じられます。\n推しメンバーを選んで持ち歩くのはもちろん、全メンバー集めて並べても可愛いアイテムです。",
      contents: ["アクリルキーホルダー 1点", "サイズ 約70mm・星型チャーム付き"],
      notes: [],
    },
    {
      id: "hinafu-charm",
      name: "ひなふうアクリルキーホルダー",
      deco: "ひなふうアクリルキーホルダー",
      category: "アクリルキーホルダー", series: "hinafu",
      img: "hinafu-charm-main.jpg", price: 1500, priceMax: 2000,
      variantType: "member",
      variants: [
        { key: "fuka",   sid: 48165292671212, label: "坂東 楓夏",   price: 1500, img: "hinafu-charm-fuka.jpg" },
        { key: "hinata", sid: 48165292769516, label: "坂東 日奈多", price: 1500, img: "hinafu-charm-hinata.jpg" },
        { key: "pair",   sid: 48165292867820, label: "ひなふうペア", sub: "ペア", price: 2000, img: "hinafu-charm-pair.jpg", chip: "ひなふう", members: ["hinata", "fuka"] },
      ],
      desc: "ひなふうの2人がアクリルキーホルダーになって登場！\nひなた＆ふうかの可愛い2ショットをそのまま楽しめる、「ひなふうらんど」オリジナルアクリルキーホルダーです♡\nピンク×イエローのおそろい衣装デザインした特別仕様。\nリボン型のナスカン付きで、バッグやポーチ、鍵などにつけて、いつでもひなふうを身近に感じられます୨୧\n2人の可愛さをぎゅっと詰め込んだ、ここでしか手に入らないひなふうグッズです♡",
      contents: ["アクリルキーホルダー 1点", "サイズ 約70mm・リボン型ナスカン付き"],
      notes: [],
    },
    {
      id: "tshirt",
      name: "オリジナルTシャツ",
      deco: "オリジナルTシャツ",
      category: "Tシャツ", series: "logo",
      img: "tshirt-main.jpg", price: 4000,
      variantType: "size",
      variants: [
        { key: "m",  sid: 47390754013420, label: "M",  price: 4000, img: "tshirt-main.jpg" },
        { key: "l",  sid: 47390754046188, label: "L",  price: 4000, img: "tshirt-main.jpg" },
        { key: "xl", sid: 47390754078956, label: "XL", price: 4000, img: "tshirt-main.jpg" },
      ],
      desc: "SugarNoteの世界観を、いつでも身に着けられる一枚。\nシンプルで着やすいデザインのSugarNoteオリジナルTシャツ。ライブ参戦はもちろん、普段のコーディネートにも取り入れやすいデザインに仕上げました。\nファンなら一枚は持っておきたい、SugarNoteの特別なアイテムです。\nライブの日は仲間とお揃いで。日常ではさりげなく「推し」を感じられる一着として。",
      contents: ["Tシャツ 1枚（M / L / XL）"],
      notes: ["数量限定アイテムのため、無くなり次第終了となります。"],
    },
    {
      id: "hinafu-tshirt",
      name: "ひなふうらんどTシャツ",
      deco: "ひなふうらんどTシャツ",
      category: "Tシャツ", series: "hinafu",
      img: "hinafu-tshirt.jpg", price: 5000,
      variantType: "size",
      variants: [
        { key: "m", sid: 48165477482732, label: "M", price: 5000, img: "hinafu-tshirt.jpg" },
        { key: "l", sid: 48165477515500, label: "L", price: 5000, img: "hinafu-tshirt.jpg" },
      ],
      shelfMembers: ["hinata", "fuka"],
      desc: "ひなふうらんどの世界観を、いつでも身に着けられる一枚♡\nひなた＆ふうかの可愛さを詰め込んだ、「ひなふうらんど」オリジナルTシャツが登場！\n可愛い世界観を楽しめる特別なデザインに仕上げました。\nイベントやライブで着るのはもちろん、普段のコーディネートにも取り入れて、いつでもひなふうを身近に感じられる一着です♡\nひなふうとお揃い気分で着るのもおすすめ！ ここでしか手に入らない特別なアイテムをぜひゲットしてください୨୧",
      contents: ["Tシャツ 1枚（M / L）"],
      notes: ["数量限定のため、無くなり次第終了となります。"],
    },
  ],
};

/* ---- 参照ヘルパー ---- */
const GoodsUtil = {
  yen(n) { return "¥" + n.toLocaleString("ja-JP"); },
  product(id) { return GOODS.products.find((p) => p.id === id) || null; },
  variant(productId, key) {
    const p = this.product(productId);
    return (p && p.variants.find((v) => v.key === key)) || null;
  },
  /* バリアントが指すメンバー（単独のとき）。ポスターの mv- 接頭辞や複数人バリアントに対応 */
  variantMember(variant) {
    if (!variant) return null;
    const id = variant.member || variant.key;
    return SN.member(id);
  },
  /* バリアントがそのメンバーのものか */
  variantHas(variant, memberId) {
    return variant.key === memberId || variant.member === memberId ||
      (Array.isArray(variant.members) && variant.members.includes(memberId));
  },
  /* メンバーに紐づく商品と、その代表バリアント（一覧カード・メンバーページ用） */
  productsFor(memberId) {
    return GOODS.products.map((p) => {
      const v = p.variants.find((vv) => this.variantHas(vv, memberId));
      if (v) return { product: p, variant: v };
      if (p.shelfMembers && p.shelfMembers.includes(memberId)) return { product: p, variant: p.variants[0] };
      return null;
    }).filter(Boolean);
  },
  /* カテゴリ絞り込み */
  byCategory(key) {
    const c = GOODS.categories.find((x) => x.key === key);
    if (!c || !c.cats) return GOODS.products.slice();
    return GOODS.products.filter((p) => c.cats.includes(p.category));
  },
};
