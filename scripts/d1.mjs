import { spawnSync } from 'node:child_process'
import { writeFileSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export function sqlValue(value) {
  return `'${value.replaceAll("'", "''")}'`
}

export function executeD1Sql(sql, remote) {
  const filePath = join(tmpdir(), `thisisme-${crypto.randomUUID()}.sql`)
  writeFileSync(filePath, sql, { encoding: 'utf8', mode: 0o600 })

  try {
    const wranglerEntry = join(process.cwd(), 'node_modules', 'wrangler', 'bin', 'wrangler.js')
    const result = spawnSync(process.execPath, [
      wranglerEntry,
      'd1',
      'execute',
      'thisisme',
      remote ? '--remote' : '--local',
      '--file',
      filePath,
    ], {
      stdio: 'inherit',
      env: { ...process.env, pnpm_config_verify_deps_before_run: 'false' },
    })

    if (result.error || result.status !== 0) {
      throw new Error('Wrangler could not write the encrypted records', { cause: result.error })
    }
  } finally {
    unlinkSync(filePath)
  }
}

export async function readStdin() {
  let input = ''
  for await (const chunk of process.stdin) input += chunk
  return input.trim()
}
