# SugarNote 公式サイト（sugarnote.jp）

公式サイトとオフィシャルグッズを **1つのサイト** にまとめたソースです。
静的 HTML / CSS / JS だけで動き、ビルド不要。決済だけ Shopify（sugarnote.store）のチェックアウトに渡します。

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
│   │   ├── home.js       トップ・メンバーページの描画とフォーム
│   │   ├── cart.js       カート（localStorage）と Shopify チェックアウト URL
│   │   ├── goods.js      グッズページの描画
│   │   └── page.js       静的サブページ用の起動
│   └── img/
│       ├── group-{760,1400,1920}.jpg   トップの群像写真（srcset）
│       ├── member-<id>.jpg             メンバー縦位置アー写
│       ├── face-<id>.jpg               メンバー顔写真（480 角。絞り込みチップ用）
│       ├── cd-*.jpg / video-afa.jpg / logo-*.png
│       └── goods/                      商品画像（すべて 1080×1080 JPEG）
│   └── fonts/            Noto Sans Thai の woff2 3ファイル＋OFL.txt（SIL Open Font License）
├── .github/workflows/pages.yml   GitHub Pages へのデプロイ（docs/ tools/ README.md は公開対象から除外）
├── tools/                商品画像の書き出しスクリプト（Python / Pillow）
└── docs/                 引き継ぎ資料・検証スクリーンショット（公開されない）
```

読み込み順は `data.js → goods-data.js → i18n.js → site.js → (home.js | goods.js | page.js)`。全ページ同じです。
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
3. 商品画像を 1080×1080 の JPEG にして `assets/img/goods/` に置く（`tools/` で透過 PNG から生成できる）
4. `goods-data.js` の `products` に追記する。`variants[].sid` にバリアント ID、`price` は Shopify と同じ額
5. トップの GOODS 欄に出したい商品は `featured` に id を並べる（4点）
6. HTML の `goods-data.js?v=` を上げる

売り切れ・販売終了は、現状は `products` から外す（または該当 `variants` を消す）ことで対応します。Shopify の在庫を自動で反映する仕組みはまだありません（[docs/HANDOVER.md](docs/HANDOVER.md) の未決事項）。

### Shopify 連携の仕組み

- 一覧・詳細・カートはこのサイトが描画し、カートは `localStorage`（キー `sn-cart`）に保存
- 「レジにすすむ」は Shopify の **カートパーマリンク** `https://www.sugarnote.store/cart/<バリアントID>:<数量>,…` に飛ばすだけ。支払い・送料計算・注文管理はすべて Shopify
- 請求額は Shopify の価格で決まる。サイトの表示価格は見た目だけなので、ずれないように同じ額を書く
- `checkoutBase` を変えるときは `goods-data.js` の `GOODS.store.checkoutBase`

### お問い合わせフォーム

`data.js` の `SN.contactForm.endpoint` が空のあいだは **デモ動作**（送信しない・ボタンに「デモ」と出る）。
Web3Forms を使うなら次のように設定すると本送信になります。

```js
contactForm: { endpoint: "https://api.web3forms.com/submit", fields: { access_key: "（Web3Forms のキー）" } },
```

## 公開（GitHub Pages）

1. このディレクトリを GitHub リポジトリにして `main` に push
2. Settings → Pages → Source を **GitHub Actions** にする（`.github/workflows/pages.yml` が動き、`docs/` `tools/` `README.md` を除いたファイルだけを公開する）
3. Settings → Pages → **Enforce HTTPS** を ON
4. 独自ドメインにするときは、ルートに `CNAME`（中身は `sugarnote.jp`）を置き、DNS の A / CNAME を GitHub Pages に向ける。**MX と TXT（メール）は触らない**

### 公開前チェック

- [ ] 6つの HTML から `<meta name="robots" content="noindex">` を外し、`robots.txt` を `Allow` にする
- [ ] `og:image` / `og:url` が本番 URL になっている（index.html / goods.html）
- [ ] `SN.contactForm.endpoint` を設定してフォームを本送信にする。Web3Forms 側でドメイン制限（Allowed domains）を sugarnote.jp に設定する
- [ ] `SN.news[].url` を自サイトの記事 URL に置き換える（現状は現行 sugarnote.jp の記事ページ）
- [ ] 特商法・利用規約・プライバシーの運営会社が正しい（下の「移籍時に差し替える箇所」）
- [ ] Shopify 側: 旧ストアのトップに移行告知 → 落ち着いたら通常ページを非公開にして sugarnote.jp へ転送（チェックアウトは残す）。**ストアフロントをパスワードで閉じるとカートパーマリンクもパスワード画面に飛ぶ可能性がある**ので、閉じる前に `https://www.sugarnote.store/cart/47393203257580:1` が通ることを必ず確認する
- [ ] Playwright で全ページのコンソールエラー 0 を確認（CSP 違反はコンソールに出る）

## セキュリティ

本番（GitHub Pages ＋ Shopify）を想定して 2026-09-05 に見直した内容。

**守っていること**

- 外部スクリプトを一切読まない。フォントも自前ホスト。外部と通信するのは TimeTree と YouTube の埋め込みだけ
- 全ページに CSP（`<meta http-equiv="Content-Security-Policy">`）。`default-src 'self'` / `script-src 'self'` / `style-src 'self'` / `frame-src` は youtube-nocookie と timetreeapp のみ / `connect-src` は self と Web3Forms / `object-src 'none'` / `base-uri 'self'` / `form-action 'self'`
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

## 移籍時に差し替える箇所（FLAP entertainment → LINDO）

次のコマンドで全部出ます（zsh では `--include` の値を引用符で囲む）。

```bash
grep -rn "FLAP\|flapinc\|渋谷区西原\|03-5308" --include="*.html" --include="*.js" .
```

- `assets/js/data.js` … `SN.brand.company` / `companyUrl` / `contact.tel`
- `legal.html` … 販売業者・代表責任者・所在地・電話番号
- `terms.html` / `privacy.html` … 「FLAP entertainment（以下「当社」）」と連絡先住所
- 6つの HTML のフッター … 運営会社リンク（`https://flapinc.jp/`）
- Shopify 側の `policies/legal-notice` も同じ内容に揃える

## 検証（2026-09-05）

Playwright で 320 / 768 / 1024 / 1440 px を確認。結果は `docs/verify/` のスクリーンショット。

- 全6ページで横はみ出しなし、コンソールエラー 0
- グッズ: 絞り込み（カテゴリ × メンバー）→ 商品ダイアログ → カート → チェックアウト URL `https://www.sugarnote.store/cart/47393203257580:2` の生成を確認
- 言語切替 JP / EN / TH でヘッダー・チップ・カート・フッターが追従
- モバイルメニュー、`?p=&v=` の商品ディープリンク、お問い合わせフォームの検証（必須・メール形式・同意）と確認画面
- セキュリティ（同日）: CSP 適用後も全ページでコンソールエラー 0。`?m=<img onerror>` 等の注入は無視される。localStorage に細工したカート（文字列・負数・小数・存在しない商品）は 1〜99 の整数と実在バリアントだけに正規化される。外部通信は TimeTree と YouTube の iframe のみ
