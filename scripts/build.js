const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const execa = require('execa')

const { extract } = require('./apiExtractor')

const { targets: allTargets, fuzzyMatchTarget } = require('./utils')

const args = require('minimist')(process.argv.slice(2))
const targets = args._
const formats = args.formats || args.f
const devOnly = args.devOnly || args.d
const isRelease = args.release
const buildTypes = args.t || args.types || isRelease
const buildAllMatching = args.all || args.a

run()

async function run() {
  if (!targets.length) {
    await buildAll(allTargets)
  } else {
    await buildAll(fuzzyMatchTarget(targets, buildAllMatching))
  }
}

async function buildAll(targets) {
  for (const target of targets) {
    console.log(`\n${chalk.blueBright(chalk.bold(target))}:`)
    await build(target)
  }
}

async function build(target) {
  const pkgDir = path.resolve(`packages/${target}`)
  const pkg = require(`${pkgDir}/package.json`)

  // only build published packages for release
  if (isRelease && pkg.private) {
    return
  }

  const bundler = pkg.buildOptions && pkg.buildOptions.bundler
  const types =
    target === 'uni-shared' ||
    target === 'uni-i18n' ||
    target === 'uni-app' ||
    target === 'uni-cli-shared' ||
    (buildTypes && pkg.types)
  // if building a specific format, do not remove dist.
  if (!formats && bundler !== 'vite') {
    await fs.remove(`${pkgDir}/dist`)
  }

  const env = devOnly ? 'development' : 'production'

  if (bundler === 'vite') {
    await execa(
      'vite',
      ['build', '--config', path.resolve(pkgDir, 'vite.config.ts')],
      {
        stdio: 'inherit',
        env: Object.assign({ FORMAT: 'es' }, process.env),
      }
    )
    if (target === 'size-check') {
      return
    }
    return await execa(
      'vite',
      ['build', '--config', path.resolve(pkgDir, 'vite.config.ts')],
      {
        stdio: 'inherit',
        env: Object.assign({ FORMAT: 'cjs' }, process.env),
      }
    )
  } else if (bundler === 'tsc') {
    const args = [
      '--listEmittedFiles',
      '-p',
      path.resolve(pkgDir, 'tsconfig.json'),
    ]
    if (types) {
      args.push('--declaration')
    }
    return await execa('tsc', args, {
      stdio: 'inherit',
    })
  }

  await execa(
    'rollup',
    [
      '-c',
      '--environment',
      [`NODE_ENV:${env}`, types ? `TYPES:true` : ``, `TARGET:${target}`]
        .filter(Boolean)
        .join(','),
    ],
    { stdio: 'inherit' }
  )
  if (types) {
    await extract(target)
  }
}