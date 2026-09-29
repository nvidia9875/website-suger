#!/bin/bash
# sugarnote.jp 切り替えの確認スクリプト（手順書: docs/CUTOVER-2026-10-01.md）
#
#   bash tools/verify_cutover.sh dns      DNS（ムームーの権威サーバー dns01 / dns02）
#   bash tools/verify_cutover.sh public   DNS（Google / Cloudflare。反映待ちのあいだは A・www が FAIL で正常）
#   bash tools/verify_cutover.sh tls      sugarnote.jp / www の証明書が有効か（GitHub の証明書が出たか）
#   bash tools/verify_cutover.sh site     新サイトのページ・旧URL・転送
#   bash tools/verify_cutover.sh final    site ＋ 検索避け解除・HTTP→HTTPS まで必須（本番ドメイン専用）
#   bash tools/verify_cutover.sh old      旧サイト（Vercel）がまだ生きているか＝切り戻しの保険
#
#   BASE=https://nvidia9875.github.io/website-suger bash tools/verify_cutover.sh site
#     … 切り替え前に確認用URLでページ群だけ試す（ドメイン固有の確認は飛ばす）
#   GOODS_LIVE=yes bash tools/verify_cutover.sh final
#     … グッズ公開（2026-11）後。goods.html / legal.html も noindex が外れていることを確認する
#   CHALLENGE=（GitHub の検証 TXT の値） bash tools/verify_cutover.sh dns
#     … 検証 TXT を値まで照合する（省略時は「値がある」ことだけ確認）
#
# 各ページは「このリポジトリの同じファイルの <title>」と一致するかで判定する（別ページが 200 で返るのを見逃さない）。
# 最後に FAIL が1つでもあれば終了コード 1。ERR は通信失敗（レコードやページの問題とは限らない。再実行する）。
set -u
cd "$(dirname "$0")/.."

DOMAIN="sugarnote.jp"
PROD="https://${DOMAIN}"
BASE="${BASE:-${PROD}}"
BASE="${BASE%/}"
GH_IPS="185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153"
OLD_APEX_IP="216.198.79.1"
OLD_WWW_IP="76.76.21.123"
MX_WANT="50 mx01.muumuu-mail.com."
SPF_WANT="v=spf1 include:_spf.muumuu-mail.com ~all"
DMARC_WANT="v=DMARC1; p=none;"
CHALLENGE="${CHALLENGE:-}"
UUIDS="2c1b6c2f-04b6-4a24-83d8-2c19ab7a86ef 4fbd778d-badb-4cf9-84ce-c82a2fe29148 b70c2bb8-a093-4d95-bd5d-60008c4571f7 e2bab15c-8d71-4282-bf4d-c76bfecf2b72 fa58bbde-09d9-468a-9a53-98f2a48549fe"
TMP="$(mktemp -d)"; trap 'rm -rf "${TMP}"' EXIT
FAILS=0

pass() { printf '  \033[32mPASS\033[0m %s\n' "$1"; }
fail() { printf '  \033[31mFAIL\033[0m %s\n' "$1"; FAILS=$((FAILS + 1)); }
info() { printf '  \033[33mINFO\033[0m %s\n' "$1"; }
sorted() { tr ' ' '\n' | sed '/^$/d' | sort | tr '\n' ' ' | sed 's/ $//'; }

# ---------- DNS ----------
# $1=名前 $2=種別 $3=サーバー → 値（複数行）。問い合わせ自体の失敗は "ERR"
q() {
  local out
  if ! out="$(dig +short +time=5 +tries=2 "$1" "$2" @"$3" 2>/dev/null)"; then echo "ERR"; return; fi
  if echo "${out}" | grep -q '^;;'; then echo "ERR"; return; fi
  echo "${out}"
}
# $1=ラベル $2=得た値 $3=期待値 $4=FAIL 時の注記
dns_eq() {
  if [ "$2" = "ERR" ]; then fail "$1: 問い合わせ失敗（ERR）→ 通信の問題。レコードは書き直さず、少し待って再実行"; return; fi
  if [ "$2" = "$3" ]; then pass "$1 = $2"; else fail "$1 = [$2]（期待: $3）$4"; fi
}

check_dns() {
  echo "== DNS"
  local ns v
  for ns in "$@"; do
    echo "  -- @${ns}"
    v="$(q "${DOMAIN}" A "${ns}")"; [ "${v}" = "ERR" ] || v="$(echo ${v} | sorted)"
    dns_eq "A" "${v}" "$(echo "${GH_IPS}" | sorted)" ""
    dns_eq "www CNAME" "$(q "www.${DOMAIN}" CNAME "${ns}")" "nvidia9875.github.io." ""
    dns_eq "MX" "$(q "${DOMAIN}" MX "${ns}")" "${MX_WANT}" " ★メール優先で復旧（5-1）"
    v="$(q "${DOMAIN}" TXT "${ns}")"
    if [ "${v}" = "ERR" ]; then dns_eq "SPF" "ERR" "" ""
    elif echo "${v}" | tr -d '"' | grep -qxF "${SPF_WANT}"; then pass "SPF あり"
    else fail "SPF が無い ★メール優先で復旧（5-1）"; fi
    v="$(q "_dmarc.${DOMAIN}" TXT "${ns}")"; [ "${v}" = "ERR" ] || v="$(echo "${v}" | tr -d '"')"
    dns_eq "DMARC" "${v}" "${DMARC_WANT}" " ★5-1"
    v="$(q "_github-pages-challenge-nvidia9875.${DOMAIN}" TXT "${ns}")"; [ "${v}" = "ERR" ] || v="$(echo "${v}" | tr -d '"')"
    if [ -n "${CHALLENGE}" ]; then dns_eq "GitHub 検証 TXT" "${v}" "${CHALLENGE}" ""
    elif [ "${v}" = "ERR" ]; then dns_eq "GitHub 検証 TXT" "ERR" "" ""
    elif echo "${v}" | grep -qE '^[A-Za-z0-9]+$'; then pass "GitHub 検証 TXT あり（${v}）"
    else fail "GitHub 検証 TXT が無い／形が違う: [${v}]"; fi
  done
}

# ---------- HTTP ----------
# $1=URL [$2..=追加の curl 引数] → "$TMP/code"（HTTP コード）、"$TMP/rc"（curl の終了コード）、本文とヘッダー
fetch() {
  local url="$1"; shift
  : > "${TMP}/head"; : > "${TMP}/body"
  curl -sS --connect-timeout 10 --max-time 30 "$@" -D "${TMP}/head" -o "${TMP}/body" -w '%{http_code}' "${url}" > "${TMP}/code" 2> "${TMP}/err"
  echo $? > "${TMP}/rc"
}
ok_fetch() { [ "$(cat "${TMP}/rc")" = "0" ]; }
code() { cat "${TMP}/code"; }
errmsg() { head -1 "${TMP}/err"; }
location() { grep -i '^location:' "${TMP}/head" | tail -1 | sed -E 's/^[^:]*:[[:space:]]*//' | tr -d '\r'; }
has_noindex() { grep -Eiq '<meta[^>]*name="robots"[^>]*content="[^"]*noindex' "${TMP}/body"; }

# このリポジトリで $1（URL パス）に対応するファイル
local_file() {
  case "$1" in
    "") echo "index.html" ;;
    */) echo "$1index.html" ;;
    *) echo "$1" ;;
  esac
}

# $1=パス $2=期待する noindex（yes/no/any） $3=本文に含まれるべき追加の文字列（任意）
check_page() {
  local path="$1" want="$2" extra="${3:-}" file title has
  file="$(local_file "${path}")"
  title="$(grep -o '<title>[^<]*</title>' "${file}" 2>/dev/null | head -1)"
  if [ -z "${title}" ]; then fail "/${path}: ローカルの ${file} に <title> が無い（スクリプトの問題）"; return; fi
  fetch "${BASE}/${path}"
  if ! ok_fetch; then fail "/${path} → 通信失敗（ERR）: $(errmsg)"; return; fi
  if [ "$(code)" != "200" ]; then fail "/${path} → $(code)"; return; fi
  if ! grep -qF "${title}" "${TMP}/body"; then fail "/${path} → 200 だが中身が違う（${title} が無い）"; return; fi
  if [ -n "${extra}" ] && ! grep -qF "${extra}" "${TMP}/body"; then fail "/${path} → 200 だが ${extra} が無い"; return; fi
  has_noindex && has=yes || has=no
  if [ "${want}" = "any" ] || [ "${want}" = "${has}" ]; then pass "/${path} → 200（noindex: ${has}）"
  else fail "/${path} → 200 だが noindex: ${has}（期待: ${want}）"; fi
}

# $1=URL $2=期待する Location（完全一致） [$3..=追加の curl 引数]
check_redirect() {
  local url="$1" want="$2"; shift 2
  fetch "${url}" "$@"
  if ! ok_fetch; then fail "${url} → 通信失敗（ERR）: $(errmsg)"; return; fi
  case "$(code)" in
    301|302|307|308)
      if [ "$(location)" = "${want}" ]; then pass "${url} → $(code) $(location)"
      else fail "${url} → $(code) $(location)（期待: ${want}）"; fi ;;
    *) fail "${url} → $(code)（リダイレクトではない。期待: ${want}）" ;;
  esac
}

check_tls() {
  echo "== 証明書（有効な証明書で HTTPS がつながるか）"
  local host
  for host in "${DOMAIN}" "www.${DOMAIN}"; do
    fetch "https://${host}/"
    if ! ok_fetch; then fail "https://${host}/ → 失敗: $(errmsg)"
    elif grep -qi '^server: *GitHub.com' "${TMP}/head"; then pass "https://${host}/ → $(code)（GitHub・証明書 OK）"
    else fail "https://${host}/ → $(code)（証明書は有効だが、まだ GitHub ではない＝旧サイトにつながっている）"; fi
  done
}

check_site() {
  local final="$1" main_ni lang p body
  if [ "${final}" = "yes" ] && [ "${BASE}" != "${PROD}" ]; then
    fail "final は本番（${PROD}）専用。BASE=${BASE} では実行しない"; return
  fi
  [ "${final}" = "yes" ] && main_ni=no || main_ni=any
  echo "== 新サイト（${BASE}）"
  check_page "" "${main_ni}" 'id="members-list"'
  for p in member.html terms.html privacy.html; do check_page "${p}" "${main_ni}"; done
  # goods.html / legal.html はグッズ公開（SN.goodsLive = true）までは noindex のまま。公開後は GOODS_LIVE=yes で実行する
  if [ "${GOODS_LIVE:-no}" = "yes" ]; then
    for p in goods.html legal.html; do check_page "${p}" "${main_ni}"; done
  else
    for p in goods.html legal.html; do check_page "${p}" yes; done
  fi
  for lang in ja en th; do for p in ${UUIDS}; do check_page "${lang}/information/${p}/" "${main_ni}"; done; done

  echo "== 旧URLの転送ページ9つ（noindex のまま・転送先が正しい）"
  for lang in ja en th; do
    check_page "${lang}/" yes '<meta http-equiv="refresh" content="0; url=../index.html">'
    check_page "${lang}/privacy/" yes '<meta http-equiv="refresh" content="0; url=../../privacy.html">'
    check_page "${lang}/terms/" yes '<meta http-equiv="refresh" content="0; url=../../terms.html">'
  done

  echo "== robots.txt"
  fetch "${BASE}/robots.txt"
  if ! ok_fetch || [ "$(code)" != "200" ]; then fail "robots.txt → $(code) $(errmsg)"
  else
    body="$(tr -d '\r' < "${TMP}/body" | sed -E 's/[[:space:]]+$//')"
    if [ "${body}" = "$(printf 'User-agent: *\nAllow: /')" ]; then pass "robots.txt は検索を許可"
    elif [ "${body}" = "$(printf 'User-agent: *\nDisallow: /')" ]; then
      [ "${final}" = "yes" ] && fail "robots.txt がまだ Disallow: /" || info "robots.txt は Disallow: /（検索避け中。手順7で外す）"
    else fail "robots.txt が想定外の内容: $(echo "${body}" | tr '\n' ' ')"; fi
  fi

  if [ "${BASE}" != "${PROD}" ]; then info "BASE が本番ドメインではないので、ドメインの転送確認は飛ばす"; return; fi
  echo "== ドメインまわりの転送"
  check_redirect "${PROD}/ja" "${PROD}/ja/"
  check_redirect "https://www.${DOMAIN}/" "${PROD}/"
  check_redirect "https://nvidia9875.github.io/website-suger/" "${PROD}/"
  if [ "${final}" = "yes" ]; then
    check_redirect "http://${DOMAIN}/" "${PROD}/"
  else
    fetch "http://${DOMAIN}/"
    [ "$(location)" = "${PROD}/" ] && pass "http → ${PROD}/" || info "http://${DOMAIN}/ は https へ転送されていない（Enforce HTTPS がまだなら正常。final では必須）"
  fi
  echo "== メール（公開リゾルバー）"
  dns_eq "MX @8.8.8.8" "$(q "${DOMAIN}" MX 8.8.8.8)" "${MX_WANT}" " ★メール優先で復旧（5-1）"
}

check_old() {
  echo "== 旧サイト（Vercel）が生きているか＝切り戻しの保険（DNS に関係なく旧サーバーへ直接つなぐ）"
  fetch "${PROD}/ja" --resolve "${DOMAIN}:443:${OLD_APEX_IP}"
  if ! ok_fetch; then fail "apex（${OLD_APEX_IP}）/ja → 通信・証明書の失敗: $(errmsg)"
  elif [ "$(code)" != "200" ]; then fail "apex（${OLD_APEX_IP}）/ja → $(code)"
  elif ! grep -q 'dpl_' "${TMP}/body"; then fail "apex（${OLD_APEX_IP}）/ja → 200 だが旧サイト（Vercel）の中身ではない"
  else pass "apex（${OLD_APEX_IP}）/ja → 200・旧サイトの中身"; fi
  check_redirect "https://www.${DOMAIN}/" "/ja" --resolve "www.${DOMAIN}:443:${OLD_WWW_IP}"
  local h
  for h in "${DOMAIN}:${OLD_APEX_IP}" "www.${DOMAIN}:${OLD_WWW_IP}"; do
    info "${h%%:*} の旧証明書の期限: $(echo | openssl s_client -connect "${h##*:}:443" -servername "${h%%:*}" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | sed 's/notAfter=//')"
  done
}

case "${1:-}" in
  dns)    check_dns dns01.muumuu-domain.com dns02.muumuu-domain.com ;;
  public) check_dns 8.8.8.8 1.1.1.1 ;;
  tls)    check_tls ;;
  site)   check_site no ;;
  final)  check_site yes ;;
  old)    check_old ;;
  *) echo "使い方: bash tools/verify_cutover.sh {dns|public|tls|site|final|old}"; exit 2 ;;
esac

echo
if [ "${FAILS}" -eq 0 ]; then printf '\033[32m全部 OK\033[0m\n'; else printf '\033[31mFAIL %d 件\033[0m\n' "${FAILS}"; exit 1; fi
