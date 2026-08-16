import { readFile } from 'node:fs/promises'
import { decryptText } from '../worker/security/crypto.ts'

const [command, id] = process.argv.slice(2)
const validCommands = ['list', 'inspect', 'approve', 'reject']
if (!validCommands.includes(command) || (command !== 'list' && !id)) {
  throw new Error('Usage: pnpm testimonial:moderate <list|inspect|approve|reject> [testimonial-id]')
}
if (id && !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(id)) {
  throw new Error('Invalid testimonial ID')
}

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
const apiToken = process.env.CLOUDFLARE_API_TOKEN
const encryptionKey = process.env.PRIVATE_DATA_ENCRYPTION_KEY
if (!accountId || !apiToken) throw new Error('CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required')

const config = await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8')
const databaseId = config.match(/"database_id"\s*:\s*"([^"]+)"/u)?.[1]
if (!databaseId) throw new Error('D1 database_id is missing from wrangler.jsonc')

async function query(sql, params = []) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, params }),
    },
  )
  const body = await response.json()
  if (!response.ok || !body.success) throw new Error('Cloudflare D1 query failed')
  return body.result[0]
}

if (command === 'list') {
  const result = await query(`
    SELECT id, submitted_at, status, display_preference
    FROM testimonials WHERE status = ? ORDER BY submitted_at ASC
  `, ['pending'])
  console.table(result.results)
} else if (command === 'inspect') {
  if (!encryptionKey) throw new Error('PRIVATE_DATA_ENCRYPTION_KEY is required to inspect a testimonial')
  const result = await query(`
    SELECT id, author_name_ciphertext, author_name_iv,
      relationship_ciphertext, relationship_iv, comment_ciphertext, comment_iv,
      display_preference, status, encryption_version, submitted_at
    FROM testimonials WHERE id = ? LIMIT 1
  `, [id])
  const row = result.results[0]
  if (!row) throw new Error('Testimonial not found')
  const encrypted = (ciphertext, iv) => ({ ciphertext, iv, encryptionVersion: row.encryption_version })
  console.log({
    id: row.id,
    authorName: await decryptText(encrypted(row.author_name_ciphertext, row.author_name_iv), encryptionKey),
    relationship: await decryptText(encrypted(row.relationship_ciphertext, row.relationship_iv), encryptionKey),
    comment: await decryptText(encrypted(row.comment_ciphertext, row.comment_iv), encryptionKey),
    displayPreference: row.display_preference,
    status: row.status,
    submittedAt: row.submitted_at,
  })
} else {
  const status = command === 'approve' ? 'approved' : 'rejected'
  const result = await query(`
    UPDATE testimonials SET status = ?, reviewed_at = CURRENT_TIMESTAMP
    WHERE id = ? AND status = 'pending'
  `, [status, id])
  if (result.meta.changes !== 1) throw new Error('No pending testimonial matched that ID')
  console.log(`Testimonial ${status}.`)
}
