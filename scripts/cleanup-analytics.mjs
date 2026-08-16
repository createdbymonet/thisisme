import { readFile } from 'node:fs/promises'
import appSettings from '../appsettings.json' with { type: 'json' }
import { decryptText } from '../worker/security/crypto.ts'

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
const apiToken = process.env.CLOUDFLARE_API_TOKEN
if (!accountId || !apiToken) throw new Error('CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required')
const config = await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8')
const databaseId = config.match(/"database_id"\s*:\s*"([^"]+)"/u)?.[1]
if (!databaseId) throw new Error('D1 database_id is missing from wrangler.jsonc')

async function query(sql, params = []) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql, params }),
  })
  const body = await response.json()
  if (!response.ok || !body.success) throw new Error('Analytics cleanup failed')
  return body.result[0]
}

let retentionDays = appSettings.analytics.retentionDays
const setting = (await query(`SELECT value_ciphertext, value_iv, encryption_version
  FROM settings WHERE setting_key = ? LIMIT 1`, ['analytics.retentionDays'])).results[0]
if (setting) {
  const key = process.env.PRIVATE_DATA_ENCRYPTION_KEY
  if (!key) throw new Error('PRIVATE_DATA_ENCRYPTION_KEY is required for the configured retention override')
  const configured = JSON.parse(await decryptText({ ciphertext: setting.value_ciphertext, iv: setting.value_iv, encryptionVersion: setting.encryption_version }, key))
  if (Number.isInteger(configured) && configured >= 1 && configured <= 3650) retentionDays = configured
}

const threshold = `-${retentionDays} days`
const events = await query("DELETE FROM analytics_events WHERE datetime(created_at) < datetime('now', ?)", [threshold])
const sessions = await query("DELETE FROM analytics_sessions WHERE datetime(last_activity_at) < datetime('now', ?)", [threshold])
console.log(`Analytics removed: ${events.meta.changes} events, ${sessions.meta.changes} sessions`)
