#!/usr/bin/env bash
# release.sh — corta uma release da doc do cliente LOCALMENTE (bump + CHANGELOG
# automáticos).
#
# Mesma estratégia do godocs4-syncer: `develop` é o tronco e o deploy de PRODUÇÃO é
# disparado só pela TAG `vX.Y.Z` (o pipeline `tags: v*`). Push em develop publica
# apenas o canal `stage`. A branch `main` NÃO participa do deploy.
#
# Diferença para o syncer: aqui existe manifesto (package.json), então a versão vive
# no arquivo E na tag — a fase 1 commita `version` + CHANGELOG juntos.
#
# Fluxo:
#   0. ./scripts/release.sh --init     # UMA vez: cria a baseline (o svu precisa de uma
#                                      # tag inicial). Default v0.1.0 = version atual.
#   1. ./scripts/release.sh            # (na develop atualizada) calcula a versão, bumpa
#                                      # package.json, gera CHANGELOG, commita
#                                      # chore(release): vX.Y.Z e empurra em develop.
#                                      # → o stage builda (confira antes de liberar).
#   2. ./scripts/release.sh --tag      # (na develop com o bump) cria e empurra a tag
#                                      # vX.Y.Z → o pipeline `tags: v*` deploya a PROD.
#
# Ferramentas: svu (versão) + git-cliff (CHANGELOG). Se não estiverem no PATH, são
# baixadas nas versões pinadas abaixo para .release-tools/ (gitignored).

set -euo pipefail

# Versões pinadas — CONFERIR/atualizar para a release estável atual.
SVU_VERSION=3.2.4
CLIFF_VERSION=2.10.1

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"
TOOLS_DIR="$REPO_ROOT/.release-tools"

log() { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m!!\033[0m %s\n' "$*" >&2; exit 1; }

# ---------------------------------------------------------------------------
# bootstrap das ferramentas (svu, git-cliff) — usa o PATH se já existirem
# ---------------------------------------------------------------------------
detect_platform() {
  local os arch
  os="$(uname -s)"; arch="$(uname -m)"
  case "$os" in
    Linux)  SVU_OS=linux;  CLIFF_VENDOR=unknown-linux-gnu ;;
    Darwin) SVU_OS=darwin; CLIFF_VENDOR=apple-darwin ;;
    *) die "SO não suportado pelo bootstrap: $os (instale svu e git-cliff manualmente)" ;;
  esac
  case "$arch" in
    x86_64|amd64) SVU_ARCH=amd64; CLIFF_ARCH=x86_64 ;;
    arm64|aarch64) SVU_ARCH=arm64; CLIFF_ARCH=aarch64 ;;
    *) die "arquitetura não suportada: $arch" ;;
  esac
  # svu publica um binário universal no macOS
  if [ "$SVU_OS" = "darwin" ]; then SVU_ARCH=all; fi
}

ensure_tools() {
  SVU_BIN="$(command -v svu || true)"
  CLIFF_BIN="$(command -v git-cliff || true)"
  [ -n "$SVU_BIN" ] && [ -n "$CLIFF_BIN" ] && return 0

  detect_platform
  mkdir -p "$TOOLS_DIR"

  if [ -z "$SVU_BIN" ]; then
    if [ -x "$TOOLS_DIR/svu" ]; then
      SVU_BIN="$TOOLS_DIR/svu"
    else
      log "baixando svu $SVU_VERSION ($SVU_OS/$SVU_ARCH)"
      curl -fsSL "https://github.com/caarlos0/svu/releases/download/v${SVU_VERSION}/svu_${SVU_VERSION}_${SVU_OS}_${SVU_ARCH}.tar.gz" \
        | tar -xz -C "$TOOLS_DIR" svu
      SVU_BIN="$TOOLS_DIR/svu"
    fi
  fi

  if [ -z "$CLIFF_BIN" ]; then
    if [ -x "$TOOLS_DIR/git-cliff" ]; then
      CLIFF_BIN="$TOOLS_DIR/git-cliff"
    else
      log "baixando git-cliff $CLIFF_VERSION ($CLIFF_ARCH-$CLIFF_VENDOR)"
      curl -fsSL "https://github.com/orhun/git-cliff/releases/download/v${CLIFF_VERSION}/git-cliff-${CLIFF_VERSION}-${CLIFF_ARCH}-${CLIFF_VENDOR}.tar.gz" \
        | tar -xz --strip-components=1 -C "$TOOLS_DIR" "git-cliff-${CLIFF_VERSION}/git-cliff"
      CLIFF_BIN="$TOOLS_DIR/git-cliff"
    fi
  fi
  chmod +x "$SVU_BIN" "$CLIFF_BIN" 2>/dev/null || true
}

# ---------------------------------------------------------------------------
# guardas comuns
# ---------------------------------------------------------------------------
require_clean_tree() {
  git diff --quiet && git diff --cached --quiet || die "árvore de trabalho suja — commite ou stash antes."
}

require_develop_up_to_date() {
  git fetch --quiet origin develop --tags
  local branch; branch="$(git rev-parse --abbrev-ref HEAD)"
  [ "$branch" = "develop" ] || die "rode a partir da branch 'develop' (atual: $branch)."
  git merge-base --is-ancestor origin/develop HEAD \
    && [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/develop)" ] \
    || die "sua 'develop' local não está igual à origin/develop — dê 'git pull --ff-only' antes."
}

# Lê/escreve o campo `version` do package.json sem depender de jq (o repo tem Node).
pkg_version() { node -p "require('./package.json').version" 2>/dev/null; }

set_pkg_version() {
  local next_raw="${1#v}"
  VERSION="$next_raw" node -e '
    const fs = require("node:fs");
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    pkg.version = process.env.VERSION;
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
  '
}

# ---------------------------------------------------------------------------
# fase 2: taguear (na develop já com o commit chore(release) da fase 1)
# ---------------------------------------------------------------------------
do_tag() {
  require_clean_tree
  require_develop_up_to_date
  # O HEAD tem de ser o commit de bump; se entraram commits depois, esta já não é a
  # release preparada — recusa em vez de tagear algo diferente do que foi ao stage.
  local next
  next="$(git log -1 --pretty=%s | sed -n 's/^chore(release): \(v[0-9]\+\.[0-9]\+\.[0-9]\+\)$/\1/p')"
  [ -n "$next" ] || die "o HEAD da develop não é um commit 'chore(release): vX.Y.Z' (entraram
       commits depois do bump?). Rode ./scripts/release.sh para regerar o bump no topo."
  # A tag manda no deploy, o package.json é o que o app mostra: se divergirem, algo
  # foi editado à mão entre as fases.
  local pkg; pkg="v$(pkg_version)"
  [ "$pkg" = "$next" ] || die "package.json está em $pkg mas o commit de bump diz $next — corrija antes de taguear."
  git rev-parse -q --verify "refs/tags/$next" >/dev/null \
    && die "a tag $next já existe — nada a fazer (o bump desta release já foi tagueado?)."
  git ls-remote --exit-code --tags origin "$next" >/dev/null 2>&1 \
    && die "a tag $next já existe na origin."
  log "criando e empurrando a tag $next em $(git rev-parse --short HEAD)"
  git tag -a "$next" -m "release $next"
  git push origin "$next"
  log "tag $next empurrada — o pipeline 'tags: v*' fará o build :$next + :prod e o deploy de PROD."
}

# ---------------------------------------------------------------------------
# baseline: criar a PRIMEIRA tag (uma vez). Sem ela o svu partiria de v0.0.0.
# Uso: ./scripts/release.sh --init [vX.Y.Z] [<ref>]   (default: a version do package.json)
# ---------------------------------------------------------------------------
do_init() {
  require_clean_tree
  require_develop_up_to_date
  local ver ref
  ver="${1:-v$(pkg_version)}"
  ref="${2:-HEAD}"
  [[ "$ver" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]] || die "versão inválida: '$ver' (use vX.Y.Z, ex. v0.1.0)."
  [ -z "$(git tag --list 'v*')" ] \
    || die "já existe tag vX.Y.Z — a baseline é só para o 1º release. Use ./scripts/release.sh."
  git ls-remote --exit-code --tags origin "$ver" >/dev/null 2>&1 \
    && die "a tag $ver já existe na origin."
  git rev-parse -q --verify "${ref}^{commit}" >/dev/null || die "ref inexistente: $ref"
  log "criando baseline $ver em $(git rev-parse --short "$ref") e empurrando"
  log "ATENÇÃO: isto dispara o build :$ver + :prod e o deploy de PRODUÇÃO."
  git tag -a "$ver" -m "baseline $ver" "$ref"
  git push origin "$ver"
  log "baseline $ver empurrada. A partir daqui ./scripts/release.sh calcula a próxima versão."
}

# ---------------------------------------------------------------------------
# fase 1 (default): commitar o bump (package.json + CHANGELOG) direto na develop
# ---------------------------------------------------------------------------
do_prepare() {
  require_clean_tree
  require_develop_up_to_date
  ensure_tools

  if [ -z "$(git tag --list 'v*')" ]; then
    die "nenhuma tag vX.Y.Z existe ainda. Crie a baseline UMA vez (dispara o deploy
       prod dessa versão) e rode este script de novo para a próxima release:
         ./scripts/release.sh --init            # usa a version do package.json
         ./scripts/release.sh --init v0.1.0 <sha-em-prod>   # ou aponte para outro commit"
  fi

  # `--always`: QUALQUER commit desde a última tag rende no mínimo um patch —
  # ci, docs, chore e refactor contam (o CHANGELOG já os lista em seções
  # próprias, então ignorá-los no versionamento deixaria mudança publicada sem
  # versão que a identifique). feat/fix seguem mandando em minor/patch.
  local current next commits
  current="$("$SVU_BIN" current 2>/dev/null || echo v0.0.0)"
  next="$("$SVU_BIN" next --always)"
  # Com --always o svu bumpa mesmo sem commit nenhum, então quem barra a release
  # vazia é a contagem de commits desde a tag — não mais `next != current`.
  commits="$(git rev-list --count "refs/tags/$current"..HEAD)"
  [ "$commits" -gt 0 ] || die "nada a liberar desde $current (nenhum commit novo). Abortando."
  log "release: $current -> $next ($commits commit(s))"

  git rev-parse -q --verify "refs/tags/$next" >/dev/null \
    && die "a tag $next já existe — o bump desta versão já foi liberado."

  log "bumpando package.json para ${next#v}"
  set_pkg_version "$next"

  log "gerando CHANGELOG.md (git-cliff --tag $next)"
  "$CLIFF_BIN" --tag "$next" -o CHANGELOG.md

  git add package.json CHANGELOG.md
  git commit -m "chore(release): $next"
  git push origin HEAD:develop

  echo
  log "bump $next empurrado em develop — o pipeline 'branches: develop' vai buildar o stage."
  echo "   1. Confira o STAGE (<host-de-stage>/docs / a tag da imagem no Harbor)."
  echo "   2. Libere a PROD com a tag: ./scripts/release.sh --tag"
}

case "${1:-}" in
  --init|init) do_init "${2:-}" "${3:-}" ;;
  --tag|tag) do_tag ;;
  ""|prepare) do_prepare ;;
  -h|--help)
    sed -n '2,25p' "$0" | sed 's/^# \{0,1\}//' ;;
  *) die "argumento desconhecido: $1 (use: --init p/ a 1ª tag, sem args p/ preparar, ou --tag)" ;;
esac
