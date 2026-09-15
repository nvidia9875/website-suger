/* SugarNote 公式サイト — 商品データ（Shopify 連携）
 * 出典: sugarnote.store products.json / 2026-09-09 提供「オンライン商品写真」フォルダ準拠（13点）
 *   商品画像は assets/img/goods/*.webp（1080角）。
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
      img: "seifuku-main.webp", price: 1000,
      variantType: "fixed",
      variants: [{ key: "default", sid: 47721611198700, label: "全35種ランダム", price: 1000, img: "seifuku-main.webp" }],
      desc: "SugarNote制服衣装ランダムブロマイドが登場しました。\nメンバーそれぞれの魅力が詰まったソロショットから、ここでしか見られない全員集合ショットまで収録しています。\n制服衣装ならではの、爽やかで特別な雰囲気をお楽しみいただけます。\nどの絵柄が届くかは、開けてからのお楽しみです。\nぜひコレクションしてください。",
      contents: ["ランダムブロマイド 3枚入り", "各個人ブロマイド 6種 / ALLメンバーブロマイド 5種＝全35種"],
      notes: ["月城蘭花のブロマイドは含まれておりません", "ランダム封入のため絵柄はお選びいただけません"],
      random: { label: "全35種" },
    },
    {
      id: "retro-bromide",
      name: "レトロワンピース衣装ランダムブロマイド（3枚入り）",
      deco: "レトロワンピース衣装ランダムブロマイド(3枚入り)全41種",
      category: "ブロマイド", series: "retro",
      img: "retro-main.webp", price: 1000,
      variantType: "fixed",
      variants: [{ key: "default", sid: 48200347779308, label: "全41種ランダム", price: 1000, img: "retro-main.webp" }],
      desc: "SugarNoteレトロワンピース衣装ランダムブロマイドが登場しました。\nメンバーそれぞれの魅力が詰まったソロショットから、ここでしか見られない全員集合ショットまで収録しています。\nレトロワンピース衣装ならではの、爽やかで特別な雰囲気をお楽しみいただけます。\nどの絵柄が届くかは、開けてからのお楽しみです。ぜひコレクションしてください。",
      contents: ["ランダムブロマイド 3枚入り", "各個人ブロマイド 6種 / ALLメンバーブロマイド 5種＝全41種"],
      notes: ["ランダム封入のため絵柄はお選びいただけません"],
      random: { label: "全41種" },
      random: { label: "全35種" },
    },
    /* TODO(浴衣): Shopify に「浴衣ランダムブロマイド(3枚入り)全41種」が未登録。
       バリアントIDを sid に入れてコメントを外せばそのまま出せる（画像は yukata-main.webp を配置済み）
    {
      id: "yukata-bromide",
      name: "浴衣ランダムブロマイド（3枚入り）",
      deco: "浴衣ランダムブロマイド(3枚入り)全41種",
      category: "ブロマイド", series: "yukata",
      img: "yukata-main.webp", price: 1000,
      variantType: "fixed",
      variants: [{ key: "default", sid: 0, label: "全41種ランダム", price: 1000, img: "yukata-main.webp" }],
      desc: "SugarNote浴衣ランダムブロマイドが登場しました。\nメンバーそれぞれの魅力が詰まったソロショットから、ここでしか見られない全員集合ショットまで収録しています。\n華やかな浴衣に身を包んだ、涼やかで特別な雰囲気をお楽しみいただけます。\n夏の思い出が詰まった特別な一枚です。どの絵柄が届くかは、開けてからのお楽しみです。\nぜひコレクションしてください。",
      contents: ["ランダムブロマイド 3枚入り", "各個人ブロマイド 6種 / ALLメンバーブロマイド 5種＝全41種"],
      notes: ["ランダム封入のため絵柄はお選びいただけません"],
      random: { label: "全41種" },
    },
    */
    {
      id: "danpra-bromide",
      name: "ダンプラ衣装ランダムブロマイド（3枚入り）",
      deco: "ダンプラ衣装ランダムブロマイド(3枚入り)全35種",
      category: "ブロマイド", series: "danpra",
      img: "danpra-main.webp", price: 1000,
      variantType: "fixed",
      variants: [{ key: "default", sid: 47721618112748, label: "全35種ランダム", price: 1000, img: "danpra-main.webp" }],
      desc: "SugarNoteダンプラ衣装ランダムブロマイドが登場しました。\nダンスプラクティス動画で着用した衣装姿を、ブロマイドにしました。\nパフォーマンス中とはまた違った表情や、メンバーそれぞれの魅力が詰まった特別な一枚です。\nソロショットから全員集合ショットまで、どの絵柄が届くかは、開けてからのお楽しみです。\nぜひコレクションしてください。",
      contents: ["ランダムブロマイド 3枚入り", "各個人ブロマイド 6種 / ALLメンバーブロマイド 5種＝全35種"],
      notes: ["月城蘭花のブロマイドは含まれておりません", "ランダム封入のため絵柄はお選びいただけません", "数量限定"],
    },
    {
      id: "debut-bromide",
      name: "Debut/嘘だよMV記念ランダムブロマイド（3枚入り）",
      deco: "Debut/嘘だよMV記念ランダムブロマイド(3枚入り)全13種",
      category: "ブロマイド", series: "mv",
      img: "debut-main.webp", price: 1000,
      variantType: "fixed",
      variants: [{ key: "default", sid: 47721619947756, label: "全13種ランダム", price: 1000, img: "debut-main.webp" }],
      desc: "SugarNote「Debut／嘘だよ」MV公開記念ランダムブロマイドが登場しました。\nMV撮影時の特別なカットを、ブロマイドにしました。\nメンバーそれぞれの魅力が詰まったソロショットから、MVの世界観を感じられる特別なカットまで収録しています。\nここでしか手に入らない、MVの思い出が詰まった記念アイテムです。\nどの絵柄が届くかは、開けてからのお楽しみです。ぜひコレクションしてください。",
      contents: ["ランダムブロマイド 3枚入り", "絵柄 全13種"],
      notes: ["ランダム封入のため絵柄はお選びいただけません", "数量限定"],
      random: { label: "全13種" },
    },
    {
      id: "hinafu-bromide",
      name: "ひなふうらんどランダムブロマイド（3枚入り）",
      deco: "ひなふうらんどランダムブロマイド(3枚入り)各全6種",
      category: "ブロマイド", series: "hinafu",
      img: "hinafu-brm-main.webp", price: 1000,
      variantType: "member",
      variants: [
        { key: "fuka",   sid: 48156384657644, label: "坂東 楓夏",   sub: "全6種", price: 1000, img: "hinafu-brm-fuka.webp", },
        { key: "hinata", sid: 48156384690412, label: "坂東 日奈多", sub: "全6種", price: 1000, img: "hinafu-brm-hinata.webp", },
        { key: "pair",   sid: 48156384723180, label: "ひなふうペア", sub: "ペア全6種", price: 1000, img: "hinafu-brm-pair.webp", chip: "ひなふう", members: ["hinata", "fuka"], },
      ],
      desc: "「ひなふうらんど Happy Birthday」の開催を記念した、限定ランダムブロマイドです。\nひなたとふうかの特別な生誕衣装で撮影したカットをブロマイドにしました。\nそれぞれの魅力を収めたソロショットから、ひなふうらんどの世界観を感じられるペアショットまでお楽しみいただけます。\nここでしか手に入らない、ひなたとふうかの特別な記念アイテムです。",
      contents: ["ランダムブロマイド 3枚入り", "ひなふうペア 全6種 / ひなた 全6種 / ふうか 全6種（合計18種）"],
      notes: ["ランダム封入のため絵柄はお選びいただけません", "数量限定商品のため、なくなり次第、販売終了となります。"],   /* 先方テキストの価格は「要確認」。Shopify の 1,000円のままにしている */
      random: { label: "各全6種" },
    },
    {
      id: "hinafu-tcard",
      name: "ひなふうランダムトレーディングカード（3枚入り）",
      deco: "ひなふうランダムトレーディングカード（3枚入り）",
      category: "トレーディングカード", series: "hinafu",
      img: "hinafu-tcard.webp", price: 1000,
      variantType: "fixed",
      variants: [{ key: "default", sid: 48165375508716, label: "全12種ランダム", price: 1000, img: "hinafu-tcard.webp" }],
      shelfMembers: ["hinata", "fuka"],
      desc: "ひなたとふうかのさまざまな表情を収めた、ひなふうらんど限定のオリジナルトレーディングカードです。\n全12種の中から、ランダムで3枚を封入しています。\nお気に入りのカードを集めるほか、全12種を揃えてコレクションするのもおすすめです。",
      contents: ["ランダムトレーディングカード 3枚入り", "全12種"],
      notes: ["絵柄はランダムとなります。", "同じ絵柄が入っている場合がございます。", "数量限定"],
      random: { label: "全12種" },
    },
    {
      id: "poster",
      name: "衣装ビジュアルポスター",
      deco: "衣装ビジュアルポスター",
      category: "ポスター", series: "mv",
      img: "poster-main.webp", price: 3000,
      variantType: "member",
      /* MV衣装の6名＋ALL の7種。通常衣装の個別5種は掲載しない（2026-09-09 先方指定）。
         Shopify 側には通常衣装のバリアントも残っているが、サイトからは出さない */
      variants: [
        { key: "ririho", sid: 47724643156204, label: "白咲 里莉穂", price: 3000, img: "poster-mv-ririho.webp" },
        { key: "nanako", sid: 47724643090668, label: "櫻井 那奈子", price: 3000, img: "poster-mv-nanako.webp" },
        { key: "fuka",   sid: 47724643025132, label: "坂東 楓夏",   price: 3000, img: "poster-mv-fuka.webp" },
        { key: "hinata", sid: 47724643123436, label: "坂東 日奈多", price: 3000, img: "poster-mv-hinata.webp" },
        { key: "airi",   sid: 47724643057900, label: "西条 藍里",   price: 3000, img: "poster-mv-airi.webp" },
        { key: "rana",   sid: 47724643188972, label: "月城 蘭花",   price: 3000, img: "poster-mv-rana.webp" },
        { key: "all",    sid: 47724643221740, label: "All Member",  price: 3000, img: "poster-mv-all.webp" },
      ],
      desc: "SugarNote衣装のビジュアルポスターです。\n「Pure. Bright. Unstoppable. ― ピュアが、世界を動かす。」\nSugarNoteが描くのは、誰かの理想に合わせた完璧な姿ではなく、自分自身の感情や衝動を信じる「純粋な強さ」。\n純粋で、まっすぐで、どこか危うくも輝くSugarNoteの魅力を、一枚のビジュアルに込めました。\nお部屋やコレクションスペースに飾り、SugarNoteの特別な瞬間をお楽しみください。",
      contents: ["ビジュアルポスター 1枚", "A4サイズ", "全7種（メンバー6名＋ALLメンバー）"],
      notes: ["数量限定商品のため、なくなり次第、販売終了となります。"],
    },
    {
      id: "stand",
      name: "メンバーカラーアクリルスタンド",
      deco: "メンバーカラーアクリルスタンド",
      category: "アクリルスタンド", series: "mcolor",
      img: "stand-main.webp", price: 1500,
      variantType: "member",
      variants: [
        { key: "fuka",   sid: 47393203159276, label: "坂東 楓夏",   price: 1500, img: "stand-fuka.webp" },
        { key: "airi",   sid: 47393203192044, label: "西条 藍里",   price: 1500, img: "stand-airi.webp" },
        { key: "nanako", sid: 47393203224812, label: "櫻井 那奈子", price: 1500, img: "stand-nanako.webp" },
        { key: "hinata", sid: 47393203257580, label: "坂東 日奈多", price: 1500, img: "stand-hinata.webp" },
        { key: "ririho", sid: 47393203290348, label: "白咲 里莉穂", price: 1500, img: "stand-ririho.webp" },
        { key: "rana",   sid: 47721429729516, label: "月城 蘭花",   price: 1500, img: "stand-rana.webp" },
      ],
      desc: "SugarNoteメンバーの実写ビジュアルを使用した、メンバー別アクリルスタンドです。\n土台には星形を採用し、各メンバーのメンバーカラーをイメージしたデザインに仕上げました。\nデスクや棚などに飾り、SugarNoteの世界観を身近にお楽しみいただけます。\nお気に入りのメンバーを選んで飾るほか、全メンバーを揃えてコレクションするのもおすすめです。",
      contents: ["アクリルスタンド 1点", "サイズ 約70mm・星形メンバーカラー台座"],
      notes: [],
    },
    {
      id: "hinafu-stand",
      name: "ひなふうアクリルスタンド",
      deco: "ひなふうアクリルスタンド",
      category: "アクリルスタンド", series: "hinafu",
      img: "hinafu-stand.webp", price: 3000,
      variantType: "fixed",
      variants: [{ key: "default", sid: 48165306925292, label: "ひなふうらんど限定", price: 3000, img: "hinafu-stand.webp" }],
      shelfMembers: ["hinata", "fuka"],
      desc: "ひなたとふうかの実写ビジュアルを使用した、ひなふうらんど限定のアクリルスタンドです。\nクリア素材を使用し、ひなふうらんどの世界観をイメージした特別なデザインに仕上げました。\nデスクや棚などに飾り、いつでもひなふうらんどの世界観をお楽しみいただけます。",
      contents: ["アクリルスタンド 1個", "サイズ 約70mm・クリア素材", "ひなた＆ふうか 実写ビジュアル"],
      notes: [],
    },
    {
      id: "charm",
      name: "メンバーキャラクターアクリルキーホルダー",
      deco: "メンバーキャラクターアクリルキーホルダー",
      category: "アクリルキーホルダー", series: "mcolor",
      img: "charm-main.webp", price: 1000,
      variantType: "member",
      variants: [
        { key: "fuka",   sid: 47393174749420, label: "坂東 楓夏",   price: 1000, img: "charm-fuka.webp" },
        { key: "airi",   sid: 47393174782188, label: "西条 藍里",   price: 1000, img: "charm-airi.webp" },
        { key: "nanako", sid: 47393174814956, label: "櫻井 那奈子", price: 1000, img: "charm-nanako.webp" },
        { key: "hinata", sid: 47393174847724, label: "坂東 日奈多", price: 1000, img: "charm-hinata.webp" },
        { key: "ririho", sid: 47393174880492, label: "白咲 里莉穂", price: 1000, img: "charm-ririho.webp" },
        { key: "rana",   sid: 47721424781548, label: "月城 蘭花",   price: 1000, img: "charm-rana.webp" },
        { key: "all",    sid: 47393174913260, label: "All Member",  price: 1000, img: "charm-all.webp" },   /* 先方テキストは 2,000円。Shopify は 1,000円のまま（請求は Shopify が正）*/
      ],
      desc: "SugarNoteメンバーをイメージしたオリジナルキャラクターのアクリルキーホルダーです。\nそれぞれのメンバーの個性を生かした、ここでしか手に入らないオリジナルデザインに仕上げました。\nシルバーの星型チャームが付いており、バッグやポーチ、鍵などに取り付けて、いつでもSugarNoteを身近に感じていただけます。\nお気に入りのメンバーを選んで持ち歩くほか、全種類を揃えてコレクションするのもおすすめです。",
      contents: ["アクリルキーホルダー 1点", "サイズ 約70mm・星型チャーム付き"],
      notes: [],
    },
    {
      id: "hinafu-charm",
      name: "ひなふうアクリルキーホルダー",
      deco: "ひなふうアクリルキーホルダー",
      category: "アクリルキーホルダー", series: "hinafu",
      img: "hinafu-charm-main.webp", price: 1500, priceMax: 2000,
      variantType: "member",
      variants: [
        { key: "fuka",   sid: 48165292671212, label: "坂東 楓夏",   price: 1500, img: "hinafu-charm-fuka.webp" },
        { key: "hinata", sid: 48165292769516, label: "坂東 日奈多", price: 1500, img: "hinafu-charm-hinata.webp" },
        { key: "pair",   sid: 48165292867820, label: "ひなふうペア", sub: "ペア", price: 2000, img: "hinafu-charm-pair.webp", chip: "ひなふう", members: ["hinata", "fuka"] },
      ],
      desc: "ひなたとふうかの魅力を詰め込んだ、「ひなふうらんど」オリジナルアクリルキーホルダーです。\nひなた、ふうかの個別デザインに加え、2人の可愛い2ショットを使用したペアデザインをご用意しました。\nひなた、ふうかの個別デザインには星型チャーム、ペアデザインにはリボン型チャームが付いた特別仕様です。\nバッグやポーチ、鍵などに取り付けて、いつでもひなふうを身近に感じていただけます。\nお気に入りのデザインを選んで持ち歩くほか、全3種を揃えてコレクションするのもおすすめです。",
      contents: ["アクリルキーホルダー 1個（全3種）", "サイズ 約70mm", "ひなた・ふうか：星型チャーム付き / ペア：リボン型チャーム付き"],
      notes: [],
    },
    {
      id: "tshirt",
      name: "オリジナルTシャツ",
      deco: "オリジナルTシャツ",
      category: "Tシャツ", series: "logo",
      img: "tshirt-main.webp", price: 4000,
      variantType: "size",
      variants: [
        { key: "m",  sid: 47390754013420, label: "M",  price: 4000, img: "tshirt-main.webp" },
        { key: "l",  sid: 47390754046188, label: "L",  price: 4000, img: "tshirt-main.webp" },
        { key: "xl", sid: 47390754078956, label: "XL", price: 4000, img: "tshirt-main.webp" },
      ],
      desc: "SugarNoteの世界観を、いつでも身に着けられる一枚です。\nシンプルで着やすいデザインの、SugarNoteオリジナルTシャツです。\nライブへの参加はもちろん、普段のコーディネートにも取り入れやすいデザインに仕上げました。\nライブの日には仲間とのお揃いアイテムとして、日常ではさりげなく「推し」を感じられる一着として、さまざまなシーンでお楽しみいただけます。\nSugarNoteファンにおすすめの特別なアイテムです。",
      contents: ["オリジナルTシャツ 1枚", "サイズ M / L / XL"],
      notes: ["数量限定アイテムのため、無くなり次第終了となります。"],
    },
    {
      id: "hinafu-tshirt",
      name: "ひなふうらんどTシャツ",
      deco: "ひなふうらんどTシャツ",
      category: "Tシャツ", series: "hinafu",
      img: "hinafu-tshirt.webp", price: 5000,
      variantType: "size",
      variants: [
        { key: "m", sid: 48165477482732, label: "M", price: 5000, img: "hinafu-tshirt.webp" },
        { key: "l", sid: 48165477515500, label: "L", price: 5000, img: "hinafu-tshirt.webp" },
      ],
      shelfMembers: ["hinata", "fuka"],
      desc: "ひなたとふうかの可愛さを詰め込んだ、「ひなふうらんど」オリジナルTシャツです。\nひなふうらんどの世界観をイメージした、特別なデザインに仕上げました。\nイベントやライブでの着用はもちろん、普段のコーディネートにも取り入れやすく、いつでもひなふうを身近に感じていただけます。\nひなた、ふうかとのお揃い気分も楽しめる、ひなふうらんど限定アイテムです。",
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
