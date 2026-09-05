# SugarNote 公式サイト 引き継ぎ資料

作成: 2026-09-05（酒井）
対象: `/Users/shun/Desktop/website/sugarnote/`（このディレクトリが今後の正）
関連: 2026-09-04 伊藤さん MTG の整理 → `/Users/shun/Documents/AudioRec/2026-09-04_211107_9月4日_21-11_の録音/todo.md`

## 1. 経緯と方針

- SugarNote は FLAP entertainment から LINDO（伊藤さんの会社）へ移籍する。現行 sugarnote.jp は FLAP の Vercel マルチサイトに統合されているため、サイトも LINDO 側へ作り直す
- 2026-09-04 の MTG で **グッズストア（sugarnote.store / Shopify）を公式サイトに統合して1本化** することが決定。伊藤さん「それが一番理想」「1本にしたい」
- ドメイン sugarnote.jp は維持。sugarnote.store の URL は変わってよい。旧ストアには移行告知を約1か月出してから閉じる
- 決済の裏方は **Shopify を残す**（ユーザー指示「shopify はベースにしておいて」）。売上の入金先を LINDO 名義にするのは Shopify Payments の口座変更で対応する
- 期限: 10月中旬に公開。11月頭の新曲・MV リリースが絶対期限

## 2. このディレクトリで何ができているか

| ページ | 状態 |
|---|---|
| トップ `index.html` | O案「ソロルーム」をそのまま移植。GOODS 欄は `goods-data.js` の `featured` 4点を出し、VIEW ALL でグッズページへ |
| メンバー `member.html?m=<id>` | プロフィール・MEMO・**そのメンバーのグッズ**（商品データから自動抽出、先頭4点＋「すべて見る」）・前後ナビ |
| グッズ `goods.html` | 旧 sugernote_goods A案を O案のモノトーンに作り直し。カテゴリ × メンバーの絞り込み、商品ダイアログ（写真つきバリアント選択）、カート、まとめ買い特典メーター、Shopify チェックアウトへの遷移 |
| 利用規約 / プライバシー / 特商法 | 現行 sugarnote.jp と Shopify ストアの文面を移植。運営会社は FLAP のまま（移籍後に差し替え） |
| 共通 | ヘッダー（モバイルメニューあり）・フッター・3言語切替（JP/EN/TH）・トースト |
| 推し・推しの棚 | 推しは複数選べる（グッズページの顔写真タイル / メンバーページのトグル。ヘッダーのボタンは外した）。グッズページ上部にメンバーごとの棚（全アイテム＋カートへ）がまとまり、最後に選んだ子の色が下線・リボン・番号・TimeTree の枠になる。文字色はグレーのまま。localStorage `sn-oshi`（id の配列）に保存（`assets/js/oshi.js`） |

まだ無いもの / 意図的に残していること

- お問い合わせフォームは **デモ**（送信しない）。`SN.contactForm.endpoint` を設定すると本送信になる
- お知らせの記事ページは無い（`SN.news[].url` は現行サイトの記事 URL）
- 売り切れの自動反映は無い（商品データから外す運用）
- 商品名・説明、法務ページは日本語のみ。UI 文言だけ3言語
- 検索避け中（noindex + robots.txt Disallow）
- 運営会社・特商法は FLAP のまま（変更箇所は README の grep で一覧できる）

## 3. 旧ディレクトリとの関係

| ディレクトリ | 中身 | 今後 |
|---|---|---|
| `../sugernote/` | 公式サイト提案16案＋セレクター。`o-solo/` が採用案 | 参考。修正は入れない |
| `../sugernote_goods/` | グッズストア提案3案。ルートの A案が Shopify 連携済み。`NEEDED-IMAGES.md`（素材依頼リスト）と `tools/`（画像生成）はこちらに移植済み | 参考。GitHub Pages `nvidia9875/sugernote-goods` の元 |
| `../web-sample/` | o-solo の公開用コピー（GitHub Pages `nvidia9875/web-sample`） | 伊藤さんに見せた URL。差し替え時はこのディレクトリの中身で更新 |

## 4. 仕組みの要点

### データの流れ
- 画面はすべて `assets/js/*.js` の JS が `data.js` / `goods-data.js` から描画する。HTML は器だけ
- 言語切替は `i18n.js` の `SNLang`。`data-i18n="キー"` の静的テキストと、`sn:lang` イベントで再描画される JS 描画部分の2系統
- 起動順序は `site.js` の `SNSite.boot()` に統一（先に `sn:lang` を購読 → 描画 → `SNLang.init()`）。順序を変えると保存言語の初回復元を取りこぼす

### Shopify 連携
- カートはこのサイトの `localStorage`（`sn-cart`）。チェックアウトは **カートパーマリンク** `https://www.sugarnote.store/cart/<variantId>:<qty>,…` に飛ばすだけ
- `goods-data.js` の `variants[].sid` が Shopify のバリアント ID。商品を作り直すと ID が変わるので、追加・変更のたびに反映が必要
- 請求額は Shopify の価格。サイトの価格は表示用なので Shopify と揃える
- 備考欄アプリ（月額）はパーマリンクの `note` / `attributes` で置き換えられる可能性がある（未検証）

### 画像
- 商品画像は 1080×1080 JPEG。`tools/run_build.py` で提供素材（透過 PNG・アー写）から生成する（Pillow が必要）
- 素材の入稿仕様は `../sugernote_goods/NEEDED-IMAGES.md`。MTG で決めた Drive のフォルダ構成（商品ごと＋テキスト）と SAMPLE 焼き込みを追記して1枚にする作業が残っている

## 5. 運用フロー（公開後）

| 誰が | 何を | どこで |
|---|---|---|
| 事務所（南さん） | 商品の追加・価格・在庫・注文・発送 | Shopify 管理画面 |
| 事務所 or 酒井 | サイト側の商品一覧に反映（バリアント ID・画像・説明） | `goods-data.js` を編集して push |
| 事務所 or 酒井 | お知らせ・メンバー・楽曲の更新 | `data.js` を編集して push |
| 酒井 | 大きな改修・デザイン変更 | このディレクトリ |

将来的には LINDO サイトと同じ **microCMS × GitHub Actions × GitHub Pages** 構成に載せ、`data.js` / `goods-data.js` を microCMS から生成する想定（正典は `/Users/shun/Desktop/lindo/HANDOVER-DEV.md`）。その際の論点は 3言語・反映の遅延（最大10分）・記事の個別 URL の3つ。

## 6. 公開までの手順

1. 伊藤さん・南さんにこのサイトをレビューしてもらう（GitHub Pages の Source を GitHub Actions にして `.github/workflows/pages.yml` で公開。`../web-sample` の差し替えでも可）
2. 素材（文字なし PNG・ブロマイド個別 JPG・商品テキスト）を受け取り、`assets/img/goods/` と `goods-data.js` を更新
3. Shopify にログインして確認: バリアント ID 一覧、プラン、アプリ、Markets（通貨・言語）、配送設定、入金口座名義、ストアオーナー
4. 法務ページを LINDO の情報に差し替え（README「移籍時に差し替える箇所」）。Shopify の `policies/legal-notice` も揃える
5. `SN.contactForm` を設定してフォームを本送信に
6. 旧ストア（sugarnote.store）のトップに移行告知を掲載（公開の約1か月前）
7. noindex / robots.txt を外し、OGP の URL を確認
8. GitHub Pages に `CNAME` を置き、ムームードメインで A / CNAME を切替（MX / TXT は触らない）。同じ時間帯に FLAP 側で Vercel からドメインを外してもらう
9. 公開後、旧ストアの通常ページを非公開にして sugarnote.jp へ転送（チェックアウトは残す）。**ストアフロントをパスワードで閉じるとカートパーマリンクもパスワード画面に飛ぶ可能性がある**ので、閉じる前に `https://www.sugarnote.store/cart/47393203257580:1` が通ることを確認する。通らなければ「テーマでトップ・コレクションを転送」など、パスワード以外の方法で隠す

## 7. 未決事項（判断が要るもの）

- **売り切れ表示**: Shopify Storefront API（公開トークン）で自動反映するか、手動運用のままにするか
- **グッズの3言語**: 海外購入者向けに商品名・説明の EN / TH を誰が用意するか。Shopify Markets の設定
- **sugarnote.store ドメイン**: 登録者・更新期限。チェックアウト用に残す前提
- **Shopify ストアの名義**: ストアオーナー・請求カード・入金口座が FLAP 名義なら LINDO へ移す手続き
- **お知らせの記事ページ**: microCMS 移行時に `/{lang}/information/<uuid>` を再現するか、新 URL にするか
- **本番リポジトリ**: public のままだと実素材がネット上に置かれる。private にするか、画像の扱いを決める

## 8. 検証ログ（2026-09-05, Playwright）

| 確認 | 結果 |
|---|---|
| 320 / 768 / 1024 / 1440 px の横はみ出し（全6ページ） | なし |
| コンソールエラー・警告 | 0 |
| 画像の読み込み失敗 | 0 |
| グッズ: メンバー絞り込み → ダイアログ（該当バリアント初期選択）→ 数量 2 → カート | OK |
| チェックアウト URL | `https://www.sugarnote.store/cart/47393203257580:2` |
| 言語切替 JP / EN / TH（ヘッダー・チップ・カート・フッター・メンバーページのタイトル） | OK |
| モバイルメニュー開閉、`?p=stand&v=rana` ディープリンク、`?m=` / `?c=` の絞り込み URL | OK |
| お問い合わせフォーム: 空送信で4件のエラー → 入力 → 確認画面 → デモ送信完了 | OK |

スクリーンショット: `docs/verify/`（`home-*.jpeg` / `goods-*.jpeg` / `member-*.jpeg` / `legal-*.jpeg`）

## 9. セキュリティ（2026-09-05 見直し）

静的サイト＋Shopify チェックアウトという構成なので、サイト側に認証・決済・個人情報の保存は無い。守るべきは「改ざんされた表示で誤解させない」「外部から余計なものを読まない」「内部資料を公開しない」の3点。

| 項目 | 対応 |
|---|---|
| 外部依存 | 外部スクリプトなし。Noto Sans Thai も `assets/fonts/` に自前ホスト（OFL）。外部通信は TimeTree と YouTube の iframe のみ |
| CSP | 全6ページに meta で設定。script / style / font / img は self のみ、frame は youtube-nocookie と timetreeapp、connect は self と Web3Forms、object なし、base-uri self。**インライン script・style 属性は使えない** |
| XSS | 描画は `esc()` でエスケープ、href は `SNSite.url()` で http(s)/mailto/tel/サイト内だけ許可。URL パラメータは実在する値のみ受理（`?m=<img onerror>` 等は無視されることを確認済み） |
| カート改ざん | localStorage を読み込むとき、実在する商品・バリアントと 1〜99 の整数数量だけに正規化。チェックアウト URL のバリアント ID は数字のみ。請求額は Shopify 側の価格 |
| 埋め込み | YouTube は youtube-nocookie ＋ sandbox、外部リンクは noopener、referrer は strict-origin-when-cross-origin |
| フォーム | ハニーポット（botcheck）。Web3Forms 導入時はダッシュボードでドメイン制限をかける |
| 内部資料 | `docs/` `tools/` `README.md` はデプロイに含めない（pages.yml）。HTML / JS のコメントから移籍等の内部事情を除去済み |
| GitHub Pages の限界 | ヘッダーを出せないので frame-ancestors と HSTS は設定不可。ログイン等が無いので影響は限定的。Enforce HTTPS を ON にする |
| リポジトリ | public だと実素材が公開状態。private から Pages を出すには有料プラン |

検証（Playwright）: CSP 適用後もコンソールエラー 0、注入プローブ無効、細工したカートが正規化されることを確認。

## 10. URL・連絡先

- **このサイトのリポジトリ**: https://github.com/nvidia9875/website-suger （public、main ブランチ、Pages の Source は GitHub Actions）
- **このサイトの公開 URL（レビュー用）**: https://nvidia9875.github.io/website-suger/ （docs / tools / README は 404 になることを確認済み）
- 現行公式サイト: https://sugarnote.jp （FLAP の Vercel。ムームードメイン管理）
- 現行ストア: https://www.sugarnote.store （Shopify。南さんが構築）
- 公開サンプル: https://nvidia9875.github.io/web-sample/ （本体）/ https://nvidia9875.github.io/sugernote-goods/ （旧グッズ案）
- 商品データの元: https://www.sugarnote.store/products.json
- TimeTree: https://timetreeapp.com/public_calendars/sugarnote_ofc
