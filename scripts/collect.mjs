#!/usr/bin/env node
/**
 * Snapshot a Lagu build into a version manifest.
 *
 *   node scripts/collect.mjs <build-dir> <version>
 *
 * Writes versions/<version>.json with the name, size and sha256 of every
 * installer found in the build directory. The binaries themselves are attached
 * to a GitHub Release for that version (see README.md), not committed here,
 * because they are larger than GitHub's 100 MiB per-file git limit.
 */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const buildDir = path.resolve(process.argv[2] ?? '../Lagu/build')
const version = process.argv[3] ?? '0.1.0'
const outDir = path.resolve('versions')

const PLATFORM = {
  '.exe': 'windows',
  '.zip': 'macos',
  '.AppImage': 'linux',
  '.deb': 'linux',
  '.rpm': 'linux',
  '.tar.gz': 'linux',
  '.pkg.tar.zst': 'linux'
}

function platformOf(name) {
  for (const [ext, platform] of Object.entries(PLATFORM)) {
    if (name.endsWith(ext)) return platform
  }
  return 'linux'
}

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex')
}

const names = [
  `Lagu-${version}-setup.exe`,
  `Lagu-${version}-mac.zip`,
  `Lagu-${version}.AppImage`,
  `lagu-music-player_${version}_amd64.deb`,
  `lagu-music-player-${version}.x86_64.rpm`,
  `lagu-music-player-${version}.tar.gz`,
  `lagu-${version}-1-x86_64.pkg.tar.zst`
]

const files = []
for (const name of names) {
  const full = path.join(buildDir, name)
  if (!existsSync(full)) {
    console.warn(`  skipped (missing): ${name}`)
    continue
  }
  const { size } = statSync(full)
  files.push({ platform: platformOf(name), name, size, sha256: sha256(full) })
  console.log(`  ${name}  ${size} bytes`)
}

mkdirSync(outDir, { recursive: true })
const manifest = {
  version,
  label: `v${version}b`,
  date: new Date().toISOString().slice(0, 10),
  beta: true,
  files
}
const out = path.join(outDir, `${version}.json`)
writeFileSync(out, JSON.stringify(manifest, null, 2) + '\n')
console.log(`\nWrote ${out} (${files.length} files)`)
