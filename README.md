# SugarNote 公式サイト（sugarnote.jp）

公式サイトとオフィシャルグッズを **1つのサイト** にまとめたソースです。
静的 HTML / CSS / JS だけで動き、ビルド不要。決済だけ Shopify（sugarnote.store）のチェックアウトに渡します。

- リポジトリ: https://github.com/nvidia9875/website-suger / 公開 URL: https://nvidia9875.github.io/website-suger/
- デザイン: 提案16案のうち採用された O案「ソロルーム」（モノトーン #565252）
- 言語: JP / EN / TH（UI 文言のみ。商品名・説明と法務ページは日本語）
- 引き継ぎ資料: [docs/HANDOVER.md](docs/HANDOVER.md)
- 検証スクリーンショット: [docs/verify/](docs/verify/)

旧ディレクトリ（`../sugernote` 提案16案、`../sugernote_goods` グッズ3案、`../web-sample` 公開サンプル）は参考用で、**今後の作業はこのディレクトリが正**です。

## 構成

```
sugarnote/
├── index.html            トップ（CONCEPT / MEMBER / INFORMATION / SCHEDULE / VIDEO / DISCOGRAPHY / GOODS 抜粋 / CONTACT）
├── member.html           メンバー個人ページ（?m=<id>。hinata / airi / ririho / nanako / fuka / rana）
├── goods.html            グッズ（?c=<カテゴリ> ?m=<メンバー> で絞り込み、?p=<商品id>&v=<バリアント> で商品を開く）
├── terms.html            利用規約
├── privacy.html          プライバシーポリシー（1. 公式サイト / 2. オンラインストア＝Shopify）
├── legal.html            特定商取引法に基づく表記
├── robots.txt            公開前は Disallow: /（公開時に外す）
├── assets/
│   ├── css/
│   │   ├── fonts.css     Noto Sans Thai の @font-face（自前ホスト。TH 表示時だけ使う）
│   │   ├── site.css      トークン・ヘッダー・フッター・ボタン・商品カード・サブページ（全ページ共通）
│   │   ├── home.css      トップとメンバーページ
│   │   └── goods.css     グッズページ（絞り込み・ダイアログ・カート）
│   ├── js/
│   │   ├── data.js       サイトデータ（メンバー・お知らせ・楽曲・動画・SNS・連絡先・フォーム設定）
│   │   ├── goods-data.js 商品データ（Shopify バリアント ID・価格・説明・特典）
│   │   ├── i18n.js       3言語の UI 辞書と言語切替（SNLang）
│   │   ├── site.js       共通部品（フッター SNS・モバイルメニュー・トースト・商品カード・起動）
│   │   ├── oshi.js       推しカラー（選択ダイアログ・保存・CSS 変数の適用）
│   │   ├── home.js       トップ・メンバーページの描画とフォーム
│   │   ├── cart.js       カート（localStorage）と Shopify チェックアウト URL
│   │   ├── goods.js      グッズページの描画
│   │   └── page.js       静的サブページ用の起動
│   └── img/
│       ├── group-{760,1400,1920}.jpg   トップの群像写真（srcset）
│       ├── member-<id>.jpg             メンバー縦位置アー写
│       ├── face-<id>.jpg               メンバー顔写真（480 角。絞り込みチップ用）
│       ├── cd-*.jpg / video-afa.jpg / logo-*.png
│       └── goods/                      商品画像（1080×1080 WebP）
│   └── fonts/            Noto Sans Thai の woff2 3ファイル＋OFL.txt（SIL Open Font License）
├── .github/workflows/pages.yml   GitHub Pages へのデプロイ（docs/ tools/ README.md は公開対象から除外）
├── tools/                商品画像の書き出しスクリプト（Python / Pillow）。素材は tools/src/（Git 管理外）
└── docs/                 引き継ぎ資料・検証スクリーンショット（公開されない）
```

読み込み順は `data.js → goods-data.js → i18n.js → site.js → oshi.js → (home.js | goods.js | page.js)`。全ページ同じです。
外部スクリプトは読み込んでいません（フォントも自前ホスト）。外部と通信するのは TimeTree と YouTube の埋め込みだけです。

## ローカルで見る

TimeTree / YouTube の埋め込みがあるので、ローカルサーバー経由で開いてください。

```bash
cd /Users/shun/Desktop/website/sugarnote
python3 -m http.server 8000
# http://127.0.0.1:8000/
```

## デザインのルール

- 文字色はグレー `#565252` 一色。面は紙白 `#F4F3F1`、カードは白、フッターは `#EBE9E6`
- メンバーカラーは **商品のバリアント選択チップと絞り込みチップの色点だけ** に使う（写真はフルカラーのまま）
- フォントは和文=ヒラギノ角ゴシック / 欧文・数字=Avenir。TH だけ Noto Sans Thai（`assets/fonts/` に自前ホスト）
- 角丸・影は使わない。区切りは 1px のヘアライン
- トークンは `assets/css/site.css` の `:root` にまとめてある
- **HTML の `style` 属性・インライン `<script>`・`onclick` は使えない**（CSP で禁止している）。色や幅を動的に変えるときは JS から `el.style.setProperty()` で当てる（`goods.js` の `applyColors` を参照）

## 推し（複数OK）と推しの棚

推しは**複数**選べます。選ぶ場所は、グッズページ上部「推しの棚」の顔写真タイル（メンバーカラーの輪、選択中は ♡）と、メンバーページの「◯◯を推しにする」の2つ。選んだ子は次のように扱われます。

- **グッズページの上部「MY OSHI / 推しの棚」に、その子の全アイテムがメンバーごとにまとまる。** カードの下に「カートへ」があり、そこから直接カートに入る。棚の「棚から外す」で解除
- トップのメンバーカードに枠と「♡ MY OSHI」タグ（その子自身の色）、メンバーページの番号と写真の縁もその子の色
- **最後に選んだ1人の色**が、サイトのアクセントになる: ヘッダー上端の 3px のリボン、ナビと VIEW ALL / くわしく見る / LISTEN の下線、TimeTree の枠色。商品ダイアログもその子のバリアントを初期選択
- 文字色はグレーのまま。色が付くのは線と面だけ

仕組み: `assets/js/oshi.js` が `localStorage`（キー `sn-oshi`、メンバー id の配列・選んだ順）に保存し、`<html>` に `data-oshi` と CSS 変数 `--oshi`（AA を満たす濃色）/ `--oshi-soft`（本来の色）を当てる。CSS は `var(--oshi, var(--ink))` のように書き、未設定ならモノトーンに落ちる。カード・メンバーページの「その子自身の色」は `--own` を要素ごとに当てる。変更は `sn:oshi` イベントで各ページに伝わる。ヘッダーの推しボタンと選択ダイアログはコードだけ残してあり（`oshi.js` の `open()`）、HTML に `#oshi-btn` を置けば復活する。この端末にだけ保存され、どこにも送られません。`goods.html?m=<id>` で開くとその子を推しに追加して棚を出す（メンバーページの「すべて見る」から使う）。

## コンテンツの更新

**変更したら、そのファイルを読み込んでいる HTML の `?v=` を上げる**（例 `data.js?v=1` → `?v=2`）。上げないとブラウザや GitHub Pages のキャッシュで古いままになります。

| 更新したいもの | 触るファイル | メモ |
|---|---|---|
| お知らせ | `assets/js/data.js` の `SN.news` | 新しい順に並べる。`url` は記事ページ（現状は現行サイトの URL） |
| メンバー | `SN.members` | 画像は `assets/img/member-<id>.jpg`（縦）と `face-<id>.jpg`（480 角）。サイズを `SN.imgSize` にも書く |
| 楽曲 | `SN.discography` | `cover` が無いときは文字だけのジャケットになる |
| 動画 | `SN.video` | YouTube の動画 ID とサムネイル |
| SNS・連絡先・運営会社 | `SN.brand` | フッターと CONTACT に出る |
| お問い合わせの種別 | `SN.contactTypes` | 3言語ぶん |
| グッズ | `assets/js/goods-data.js` | 下の「グッズの更新」 |
| UI の文言 | `assets/js/i18n.js` | ja / en / th を同じキーで揃える |
| 利用規約・プライバシー・特商法 | 各 HTML に直書き | 日本語のみ |

### グッズの更新

1. Shopify 管理画面で商品を作る（価格・在庫・配送は Shopify が正）
2. **バリアント ID** を控える。商品 → バリアントを開いたときの URL 末尾の数字（例 `47393203257580`）。まとめて見るなら `https://www.sugarnote.store/products.json`
3. 商品画像を 1080×1080 の WebP にして `assets/img/goods/` に置く（下の「商品画像の書き出し」）
4. `goods-data.js` の `products` に追記する。`variants[].sid` にバリアント ID。`price` は Shopify と同じ額（表示時に Shopify の額で上書きされるので、通信できないときの予備）
5. トップの GOODS 欄に出したい商品は `featured` に id を並べる（4点）
6. HTML の `goods-data.js?v=` を上げる

**価格の変更と売り切れは Shopify 側だけで済む**（2026-10-18〜）。ページを開くたびに `assets/js/shopify.js` が全バリアントの価格・在庫を Shopify から取り直し、売り切れのバリアントには「売り切れ」を出してカートに入れられなくする。販売終了で Shopify から消した（非公開にした）バリアントも売り切れ扱いになる。

サイトの更新が要るのは、**商品やバリアントを新しく足すとき**だけ（写真・説明・メンバーとの対応はサイト側で持っているため）。

### 商品画像の書き出し

素材（先方提供の透過PNG・写真）を `tools/src/` に置いて、レシピを走らせる。`tools/src/` と `out/` は Git 管理外。

```bash
GOODS_SRC="$PWD/tools/src/オンライン商品写真" python3 tools/run_build_online.py out
cp out/*.webp assets/img/goods/
```

- `tools/build_images.py` が共通ヘルパー（背景合成・接地影・SAMPLE 透かし・保存）。保存形式は出力ファイル名の拡張子で決まる
- `tools/run_build.py` は 2026-08「グッズまとめ」用の旧レシピ（アー写・顔写真はこちらで生成）
- `tools/run_build_online.py` が現行レシピ。2026-09-09 提供「オンライン商品写真（改訂版）」に対応
- macOS のファイル名は濁点が分解された形（NFD）で返ることがある。名前で突き合わせるときは NFC に正規化する

### Shopify 連携の仕組み

- 一覧・詳細・カートはこのサイトが描画し、カートは `localStorage`（キー `sn-cart`）に保存
- **Storefront API をトークン無しで使っている**（`assets/js/shopify.js`、宛先 `https://1ufd2p-j3.myshopify.com/api/2025-10/graphql.json`）。Shopify の公開アクセスで、Headless アプリもトークンも要らない（2026-10-18 実測。CORS も `*`）
  - 表示時: `nodes(ids)` で全バリアントの価格・`availableForSale` を取り、`GoodsUtil.applyLive` で反映 → `sn:goods` で描き直す。グッズ公開前（`goodsLive = false`）はグッズページの `?preview` でだけ取りにいく
  - 「レジにすすむ」: `cartCreate` で Shopify にカートを作らせ、返ってきた `checkoutUrl`（`www.sugarnote.store` 等の許可したホストのみ）へ移動。売り切れの行は送らない
  - 商品ごとの属性（宛名・ニックネームなど）は `cartCreate` の `lines[].attributes` で付けられる（実測済み。入力欄は未実装）
- **通信できないとき**は `goods-data.js` の価格で表示し、購入は **カートパーマリンク** `https://www.sugarnote.store/cart/<バリアントID>:<数量>,…` で続ける（従来の方式）
- 支払い・送料計算・注文管理はすべて Shopify。請求額は Shopify の価格で決まる
- `checkoutBase` を変えるときは `goods-data.js` の `GOODS.store.checkoutBase`。API の宛先は `shopify.js` の `ENDPOINT`、CSP の `connect-src`（goods / index / member の3ページ）も合わせて変える

### お問い合わせフォーム

**2026-10 時点はフォームを外している**（受信先のメールアドレスが未定のため。メニューの CONTACT とトップの CONTACT 欄も削除）。規約・プライバシー・特商法の問い合わせ先は info@sugarnote.jp。
戻すときは、`git log -S 'id="contact-form"' -- index.html` でフォームを外す前のコミットを探して CONTACT 欄とメニューの CONTACT を戻し、`data.js` の `SN.contactForm` を設定する（未設定のままだと CONTACT 欄は表示されない）。Web3Forms を使う場合:

```js
contactForm: { endpoint: "https://api.web3forms.com/submit", fields: { access_key: "（Web3Forms のキー）" } },
```

## グッズの公開（2026-11）

2026-10-01 はグッズ機能なしで公開した（`assets/js/data.js` の `SN.goodsLive = false`）。このあいだは:
- GOODS メニュー・トップの VIEW ALL・フッターの特商法リンクは、**HTML の時点で**オンラインストア（sugarnote.store）を向いている（`data-goods-link` / `data-legal-link` の付いたリンク。記事ページは `tools/build_news.py` のテンプレート）
- トップの GOODS 欄は「オンラインストアへ」の案内だけ、メンバーページのグッズ欄は `hidden`
- `goods.html` / `legal.html` は本文（`main[data-goods-gated]`）を `hidden` にしてあり、JS がストアへ転送する。`?preview` を付けると確認用に開ける（例: `goods.html?preview`）。JS が無いと `<noscript>` の案内だけが出る

11月上旬にグッズを公開するときの手順。**旧ストアの転送（手順 7）は、新サイトの公開を本番で確かめてから**行う。
順番を逆にすると、古い `data.js`（`goodsLive = false`）が残っている人は「旧ストア → goods.html → 旧ストア …」と転送が往復して開けなくなる。

**新サイト側を公開する**

1. `goods.html?preview` で商品・価格・在庫が Shopify と合っているか確認し、`goods-data.js` を最新にする（Shopify から自動で読み込む作りにした場合も、掲載する商品と除外する商品が意図どおりかは確認する）
2. `legal.html` の販売業者を確認する（Shopify の持ち主は 2026-10-10 に LINDO へ移ったので LINDO のまま）
3. `data.js` の `goodsLive` を `true` にする
4. リンクを内部ページに戻す: `data-goods-link` の付いたリンクを `goods.html`（記事テンプレートは `{up}goods.html`）へ、`data-legal-link` を `legal.html` へ。`target="_blank" rel="noopener"` も外す（`grep -rn "data-goods-link\|data-legal-link" --include="*.html" --include="*.py" .` で全部出る）
5. `goods.html` と `legal.html` から `<noscript>…</noscript>`・その下のコメント行・`<meta name="robots" content="noindex">` とその上のコメント行を消し、`<main id="main" data-goods-gated hidden>` の `hidden` を外す
6. `data.js` を読み込んでいる全 HTML と `tools/build_news.py` の `data.js?v=` を上げ、`python3 tools/build_news.py` で記事ページを再生成して push

**本番で確かめてから、旧ストアを転送する**

7. Actions のデプロイ完了を待ち、本番（https://sugarnote.jp）で確認する。ここで NG なら旧ストアには触らない
   - `GOODS_LIVE=yes bash tools/verify_cutover.sh final` が全部 OK
   - ブラウザ（シークレットウィンドウ）で `goods.html` が転送されずに開き、カート → Shopify の決済画面まで進める（支払いはしない）
8. 旧ストアのテーマに `docs/shopify/old-store-redirect.liquid` を貼る（オンラインストア → テーマ → コードを編集 → `layout/theme.liquid` の `<head>` の直後）。貼る前にテーマを複製しておく
9. 旧ストアの商品ページ（例: `https://sugarnote.store/products/メンバーカラーアクリルスタンド`）とトップを開き、新サイトの同じ商品・グッズ一覧へ移ることを確認する。`/policies/legal-notice` と、公式サイトに載せていない商品（送料の払い直し用の ¥0 商品 `https://sugarnote.store/products/送料無料を選択されたお客様へ` など）は転送されないこと

**元に戻すとき**は逆の順番: 先に旧ストアのテーマから転送コードを外す（手順 8 で複製したテーマを公開に戻すのが早い）→ その後で `goodsLive` を `false` に戻して push。逆にすると転送が往復する。

## 公開（GitHub Pages）

1. このディレクトリを GitHub リポジトリにして `main` に push
2. Settings → Pages → Source を **GitHub Actions** にする（`.github/workflows/pages.yml` が動き、`docs/` `tools/` `README.md` を除いたファイルだけを公開する）
3. Settings → Pages → **Enforce HTTPS** を ON
4. 独自ドメインは Settings → Pages → Custom domain で設定する（Actions デプロイなので `CNAME` ファイルは不要）。sugarnote.jp の切り替え手順は `docs/CUTOVER-2026-10-01.md`。**MX と TXT（メール）は触らない**

### 公開前チェック

公開当日の作業順は `docs/CUTOVER-2026-10-01.md` が正（切り替え → 動作確認 → 検索避け解除）。

- [ ] （当日・切り替えと動作確認の後）`bash tools/go_live.sh` で本体4ページ・記事15ページの noindex を外し、`robots.txt` を `Allow` にする（転送ページ9つと goods.html・legal.html は noindex のまま）
- [ ] `og:image` / `og:url` が本番 URL になっている（index.html / goods.html）
- [ ] （フォームを戻すとき）`SN.contactForm.endpoint` を設定する。Web3Forms 側でドメイン制限（Allowed domains）を sugarnote.jp に設定する
- [x] `SN.news[].url` を自サイトの記事 URL に置き換える（2026-09-19 済み。旧サイトと同じパスで移設）
- [ ] 特商法・利用規約・プライバシーの運営会社が正しい（下の「移籍時に差し替える箇所」）
- [ ] Shopify 側: 旧ストアのトップに移行告知 → 落ち着いたら通常ページを非公開にして sugarnote.jp へ転送（チェックアウトは残す）。**ストアフロントをパスワードで閉じるとカートパーマリンクもパスワード画面に飛ぶ可能性がある**ので、閉じる前に `https://www.sugarnote.store/cart/47393203257580:1` が通ることを必ず確認する
- [ ] Playwright で全ページのコンソールエラー 0 を確認（CSP 違反はコンソールに出る）

## セキュリティ

本番（GitHub Pages ＋ Shopify）を想定して 2026-09-05 に見直した内容。

**守っていること**

- 外部スクリプトを一切読まない。フォントも自前ホスト。外部と通信するのは TimeTree と YouTube の埋め込みだけ
- 全ページに CSP（`<meta http-equiv="Content-Security-Policy">`）。`default-src 'self'` / `script-src 'self'` / `style-src 'self'` / `frame-src` は youtube-nocookie と timetreeapp のみ / `connect-src` は self と Web3Forms（goods / index / member の3ページは Shopify の Storefront API `https://1ufd2p-j3.myshopify.com` も） / `object-src 'none'` / `base-uri 'self'` / `form-action 'self'`
- 描画はすべて `esc()` でエスケープし、`href` は `SNSite.url()` で http(s) / mailto / tel / サイト内相対だけ通す（`javascript:` は `#` になる）。URL パラメータ（`?m` `?c` `?p` `?v`）はデータに実在する値だけ受け付け、それ以外は無視
- カート（localStorage）は読み込み時に正規化する。実在する商品・バリアントだけ、数量は 1〜99 の整数。チェックアウト URL のバリアント ID は数字以外を除去
- 請求額は Shopify が決めるので、サイト側で価格や数量を書き換えても注文には影響しない
- 外部リンクは `rel="noopener"`。YouTube は youtube-nocookie ＋ `sandbox`。`referrer` は strict-origin-when-cross-origin
- お問い合わせフォームにハニーポット（`botcheck`）。Web3Forms の access_key は公開前提のキーだが、Web3Forms 側でドメイン制限をかける
- `docs/` `tools/` `README.md` はデプロイに含めない（内部資料が `sugarnote.jp/docs/...` で見えないように）

**GitHub Pages の制約**

- レスポンスヘッダーを設定できないため CSP は meta で入れている。`frame-ancestors`（クリックジャッキング対策）と HSTS は meta では効かない。ログインや決済の操作がサイト内に無いので影響は限定的。Enforce HTTPS は必ず ON
- GA4 などのスクリプトや新しい埋め込みを足すときは、**6つの HTML の CSP に許可先を追加する**。追加しないと黙って動かない

**運用上の注意**

- public リポジトリだと実素材（写真）がネット上に置かれる。private リポジトリから Pages を出すには GitHub の有料プランが要る
- 変更のたびに Playwright でコンソールエラー 0 を確認する

## 運営会社の表記（LINDO）

**2026-10-01 の公開時点は FLAP entertainment のまま**（先方指示「契約書が今日までに間に合わず、運営会社の部分だけ FLAP のままに」）。フッターの「運営会社」リンク（https://flapinc.jp/）・利用規約・プライバシーポリシー・`data.js` の `company` を FLAP に戻した。`legal.html`（10月は非表示）は LINDO / 伊藤麻衣 のまま。契約が済んだら、この戻しのコミットを `git revert` すれば LINDO の表記に戻る。

2026-09 に FLAP entertainment → 株式会社LINDO へ差し替え済み。所在地・電話番号は LINDO の公式サイト（styledbylindo.com）の表記どおりで、旧表記と同じ。

- `assets/js/data.js` … `SN.brand.company` / `companyUrl` / `contact.tel`
- `legal.html` … 販売業者・代表責任者・所在地・電話番号
- `terms.html` / `privacy.html` … 「株式会社LINDO（以下「当社」）」と連絡先
- 全 HTML のフッター … 運営会社リンク（`https://styledbylindo.com/`）。記事ページは `tools/build_news.py` のテンプレートを直して再生成する
- Shopify 側の `policies/legal-notice` は Shopify 管理画面で別途揃える（サイトからは変えられない）

## 検証（2026-09-05）

Playwright で 320 / 768 / 1024 / 1440 px を確認。結果は `docs/verify/` のスクリーンショット。

- 全6ページで横はみ出しなし、コンソールエラー 0
- グッズ: 絞り込み（カテゴリ × メンバー）→ 商品ダイアログ → カート → チェックアウト URL `https://www.sugarnote.store/cart/47393203257580:2` の生成を確認
- 言語切替 JP / EN / TH でヘッダー・チップ・カート・フッターが追従
- モバイルメニュー、`?p=&v=` の商品ディープリンク、お問い合わせフォームの検証（必須・メール形式・同意）と確認画面
- 推しカラー（同日）: メンバーページのトグル → ヘッダー・トップのカード・グッズの初期選択・TimeTree の枠色に反映、解除で完全にモノトーンへ戻る、320 幅でもはみ出しなし。White 担当（里莉穂）は濃色 `#6E6B78` の線で見える。スクリーンショットは `docs/verify/oshi-*.jpeg`
- 推しの棚（同日）: 2人選ぶと棚が2つ（日奈多 8点 / 蘭花 3点）、「カートへ」でチェックアウト URL に反映、「棚から外す」と全解除、ダイアログは複数選択で閉じない、`?m=` からの追加、320 幅で2列。スクリーンショットは `docs/verify/shelf-*.jpeg`
- セキュリティ（同日）: CSP 適用後も全ページでコンソールエラー 0。`?m=<img onerror>` 等の注入は無視される。localStorage に細工したカート（文字列・負数・小数・存在しない商品）は 1〜99 の整数と実在バリアントだけに正規化される。外部通信は TimeTree と YouTube の iframe のみ
