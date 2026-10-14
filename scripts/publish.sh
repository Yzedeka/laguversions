#!/usr/bin/env bash
# Publish a Lagu version: snapshot the build, push the manifest, and attach the
# installers to a GitHub Release.
#
#   scripts/publish.sh <version> <build-dir>   e.g.  scripts/publish.sh 0.1.0 ../Lagu/build
#
# Requires the GitHub CLI (gh) authenticated for Yzedeka/laguversions.
set -euo pipefail

VERSION="${1:?usage: publish.sh <version> <build-dir>}"
BUILD="${2:?usage: publish.sh <version> <build-dir>}"
REPO="Yzedeka/laguversions"
TAG="v${VERSION}"

if [ ! -x "$(command -v gh 2>/dev/null)" ]; then
  echo "GitHub CLI (gh) is required. Install it from https://cli.github.com/" >&2
  exit 1
fi

echo "==> Snapshotting $VERSION"
node scripts/collect.mjs "$BUILD" "$VERSION"

git add "versions/${VERSION}.json"
git commit -m "Add Lagu ${VERSION}"
git push

echo "==> Creating release ${TAG}"
files=(
  "Lagu-${VERSION}-setup.exe"
  "Lagu-${VERSION}-mac.zip"
  "Lagu-${VERSION}.AppImage"
  "lagu-music-player_${VERSION}_amd64.deb"
  "lagu-music-player-${VERSION}.x86_64.rpm"
  "lagu-music-player-${VERSION}.tar.gz"
  "lagu-${VERSION}-1-x86_64.pkg.tar.zst"
  "Lagu-${VERSION}.flatpak"
)
assets=()
for f in "${files[@]}"; do
  [ -f "${BUILD}/${f}" ] && assets+=("${BUILD}/${f}")
done

gh release create "${TAG}" \
  --repo "${REPO}" \
  --title "Lagu ${VERSION}" \
  --notes "Lagu ${VERSION} (beta). Checksums: versions/${VERSION}.json" \
  "${assets[@]}"

echo "Done."
