# Lagu versions

A version archive of every **Lagu** release, newest first.

Each version is described by a small manifest in [`versions/`](versions) listing
every installer with its **name, size and sha256**. The installers themselves are
attached to the matching **GitHub Release** for that version rather than committed
here, because several of them are larger than GitHub's **100 MiB per-file git
limit** (a Release asset can be up to 2 GiB).

| Version | Notes | Release |
| --- | --- | --- |
| `b0.4.1` | Bundled ffmpeg, macOS Apple Silicon + Intel, Windows/macOS fixes | [v0.4.1](https://github.com/Yzedeka/laguversions/releases/tag/v0.4.1) |
| `b0.4` | yt-dlp downloads, playlist/album import, album spacing | [v0.4.0](https://github.com/Yzedeka/laguversions/releases/tag/v0.4.0) |
| `v0.3b` | Playlists, artists, keybinds, 3D covers | [v0.3.0](https://github.com/Yzedeka/laguversions/releases/tag/v0.3.0) |
| `v0.2.2b` | Folder + UI polish, artwork theming | [v0.2.2](https://github.com/Yzedeka/laguversions/releases/tag/v0.2.2) |
| `v0.1.0b` | First public beta | [v0.1.0](https://github.com/Yzedeka/laguversions/releases/tag/v0.1.0) |

## Layout

```
versions/
  0.1.0.json     name, size and sha256 for every file in that version
scripts/
  collect.mjs    snapshot a build into versions/<version>.json
  publish.sh     snapshot + push + attach the files to a GitHub Release
```

A manifest looks like:

```json
{
  "version": "0.1.0",
  "label": "v0.1.0b",
  "date": "2026-10-13",
  "beta": true,
  "files": [
    { "platform": "linux", "name": "Lagu-0.1.0.AppImage", "size": 131202414, "sha256": "..." }
  ]
}
```

## Publishing a new version

```bash
# build the app first
cd ../Lagu && npm run dist:all && npm run dist:flatpak

# then snapshot + publish
cd ../laguversions
scripts/publish.sh 0.1.0 ../Lagu/build
```

This writes `versions/0.1.0.json`, commits and pushes it, then creates the
`v0.1.0` GitHub Release and uploads the installers. It needs the
[GitHub CLI](https://cli.github.com/) (`gh`) authenticated for this repository.

## Verifying a download

```bash
sha256sum Lagu-0.1.0.AppImage
# compare with versions/0.1.0.json
```
