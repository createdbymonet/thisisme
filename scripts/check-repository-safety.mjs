import { spawnSync } from 'node:child_process'

function git(args) {
  const result = spawnSync('git', ['-c', 'safe.directory=*', ...args], { encoding: 'utf8' })
  if (result.error) throw result.error
  return result
}

const ignoredPaths = ['.dev.vars', '.dev.vars.local', '.env', '.env.local', '.wrangler/ci-state']
for (const path of ignoredPaths) {
  if (git(['check-ignore', '--quiet', '--no-index', path]).status !== 0) {
    throw new Error(`${path} must be ignored by Git`)
  }
}

const trackedResult = git(['ls-files'])
if (trackedResult.status !== 0) throw new Error(`Unable to inspect tracked files:\n${trackedResult.stderr}`)
const tracked = trackedResult.stdout.split(/\r?\n/u).filter(Boolean)
const prohibited = tracked.filter((path) => (
  /(^|\/)\.dev\.vars(?:\.|$)/u.test(path)
  || /(^|\/)\.wrangler(?:\/|$)/u.test(path)
  || (/(^|\/)\.env(?:\.|$)/u.test(path) && !path.endsWith('.env.example'))
  || path.endsWith('package-lock.json')
  || path.endsWith('yarn.lock')
))

if (prohibited.length > 0) {
  throw new Error(`Prohibited local or package-manager files are tracked:\n${prohibited.join('\n')}`)
}

console.log('Repository secret-file and package-manager safety checks passed.')
