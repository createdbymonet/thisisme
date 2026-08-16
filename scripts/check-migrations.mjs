import { spawnSync } from 'node:child_process'
import { mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const migrationFiles = readdirSync('migrations').filter((file) => file.endsWith('.sql')).sort()
if (migrationFiles.length === 0) throw new Error('No migrations were found')

const numbers = migrationFiles.map((file) => {
  const match = /^(\d{4})_[a-z0-9_]+\.sql$/u.exec(file)
  if (!match) throw new Error(`Invalid migration filename: ${file}`)
  return Number(match[1])
})
if (new Set(numbers).size !== numbers.length) throw new Error('Duplicate migration numbers were found')
for (let index = 1; index < numbers.length; index += 1) {
  if (numbers[index] <= numbers[index - 1]) throw new Error('Migration filenames are not strictly ordered')
}

const stateDirectory = mkdtempSync(join(tmpdir(), 'thisisme-ci-d1-'))
const wranglerEntry = join(process.cwd(), 'node_modules', 'wrangler', 'bin', 'wrangler.js')
const common = [wranglerEntry, 'd1']

function wrangler(args, capture = false) {
  const result = spawnSync(process.execPath, [...common, ...args, '--local', '--persist-to', stateDirectory], {
    encoding: capture ? 'utf8' : undefined,
    stdio: capture ? 'pipe' : 'inherit',
    env: {
      ...process.env,
      CI: 'true',
      WRANGLER_LOG_PATH: join(stateDirectory, 'wrangler.log'),
      pnpm_config_verify_deps_before_run: 'false',
    },
  })
  if (result.error || result.status !== 0) throw new Error(`Wrangler failed: ${args.join(' ')}`, { cause: result.error })
  return result.stdout ?? ''
}

try {
  wrangler(['migrations', 'apply', 'thisisme'])
  const migrationStatus = wrangler(['migrations', 'list', 'thisisme'], true)
  const plainMigrationStatus = migrationStatus.replace(/\x1b\[[0-?]*[ -/]*[@-~]/gu, '')
  if (!plainMigrationStatus.includes('No migrations to apply')) {
    throw new Error(`Pending migrations remain after apply:\n${plainMigrationStatus}`)
  }

  const output = wrangler(['execute', 'thisisme', '--command', `
    SELECT name FROM sqlite_master
    WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name;
    PRAGMA table_info(analytics_sessions);
    PRAGMA table_info(analytics_events);
  `, '--json'], true)
  const queryResults = JSON.parse(output)
  const tables = new Set(queryResults[0].results.map((row) => row.name))
  const requiredTables = [
    '_infrastructure_health', 'companies', 'access_codes', 'private_profile',
    'testimonials', 'settings', 'protected_profile_sessions', 'admin_sessions',
    'analytics_sessions', 'analytics_events',
  ]
  for (const table of requiredTables) {
    if (!tables.has(table)) throw new Error(`Required table is missing: ${table}`)
  }

  const obsoleteTables = ['public_profile', 'public_skills', 'public_experience', 'public_projects']
  for (const table of obsoleteTables) {
    if (tables.has(table)) throw new Error(`Obsolete table must not exist: ${table}`)
  }

  const analyticsColumns = queryResults.slice(1).flatMap((result) => result.results.map((row) => String(row.name).toLowerCase()))
  const prohibitedFragments = ['ip', 'country', 'region', 'location', 'asn', 'user_agent', 'fingerprint', 'referrer', 'full_url']
  const prohibitedColumns = analyticsColumns.filter((column) => prohibitedFragments.some((fragment) => column === fragment || column.includes(`_${fragment}`) || column.startsWith(`${fragment}_`)))
  if (prohibitedColumns.length > 0) throw new Error(`Privacy-sensitive analytics columns found: ${prohibitedColumns.join(', ')}`)

  console.log(`Migration checks passed: ${migrationFiles.join(', ')}`)
} finally {
  rmSync(stateDirectory, { recursive: true, force: true })
}
