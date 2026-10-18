# 旧ストアの移行告知（sugarnote.store）

2026-09-04 の MTG で「旧ストアに移行告知を出してから閉じる」と決定。2026-10-18 時点でストアに告知は出ていない（トップページを実測）。

- 掲載するのは制作担当（コラボレーター権限が承認されたら）。承認前なら伊藤さんに依頼
- 移る日が決まるまでは「11月上旬」と書く。日が決まったら日付に差し替える
- 決済は引き続き Shopify なので「ストアが無くなる」とは書かない。注文済みの発送・問い合わせ先が変わらないことを添える

## 1. アナウンスバー（ページ上部の帯）

**場所**: オンラインストア → テーマ → カスタマイズ → ヘッダーの「アナウンスバー」（テーマ Rise）。1件ずつ追加し、リンク先は `https://sugarnote.jp/`。

海外のお客様（シンガポール・タイ）が多いので3言語。アナウンスを3件にすると帯で切り替わって表示される。

```
【お知らせ】11月上旬より、SugarNote のグッズは公式サイト（sugarnote.jp）でのお取り扱いに移ります
```

```
Notice: From early November, SugarNote merchandise will be available on our official website (sugarnote.jp).
```

```
ประกาศ: ตั้งแต่ต้นเดือนพฤศจิกายน สินค้า SugarNote จะย้ายไปจำหน่ายที่เว็บไซต์ทางการ (sugarnote.jp)
```

## 2. 詳しい案内（トップのテキスト欄・SNS 用）

アナウンスバーだけで足りなければ、トップページにテキストのセクションを1つ足して載せる。SNS で告知するときにも使える。

```
【グッズ販売の移行について】

いつも SugarNote を応援いただきありがとうございます。
11月上旬より、SugarNote のグッズは公式サイト（https://sugarnote.jp）でのお取り扱いに移ります。

・移行後も、お支払いはこれまでと同じ Shopify の決済画面で行います
・すでにご注文いただいた商品は、これまでどおり発送いたします
・お問い合わせ先（info@sugarnote.jp）は変わりません

今後とも SugarNote をよろしくお願いいたします。
```

```
[Moving our online store]

Thank you for always supporting SugarNote.
From early November, SugarNote merchandise will be available on our official website (https://sugarnote.jp).

- Payment will still be handled through the same Shopify checkout.
- Orders already placed will be shipped as usual.
- Our contact address (info@sugarnote.jp) stays the same.

Thank you for your continued support.
```

```
[แจ้งย้ายร้านค้าออนไลน์]

ขอบคุณที่สนับสนุน SugarNote เสมอมา
ตั้งแต่ต้นเดือนพฤศจิกายน สินค้า SugarNote จะย้ายไปจำหน่ายที่เว็บไซต์ทางการ (https://sugarnote.jp)

・การชำระเงินยังคงใช้หน้าชำระเงินของ Shopify เหมือนเดิม
・คำสั่งซื้อที่สั่งไว้แล้วจะจัดส่งตามปกติ
・ช่องทางติดต่อ (info@sugarnote.jp) ยังคงเหมือนเดิม

ขอบคุณที่ติดตาม SugarNote ต่อไป
```

## 切り替え後

旧ストアに転送コード（`old-store-redirect.liquid`）を貼ると、ストアのページはどれも新サイトへ移るので、アナウンスバーは見えなくなる。外す必要はない（元に戻すときにそのまま使える）。
