import appSettings from '../appsettings.json' with { type: 'json' }
import { encryptText } from '../worker/security/crypto.ts'
import { hashAccessCode } from '../worker/security/accessCode.ts'
import { executeD1Sql, readStdin, sqlValue } from './d1.mjs'

function randomToken(byteLength) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength))
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

const encryptionKey = process.env.PRIVATE_DATA_ENCRYPTION_KEY
if (!encryptionKey) throw new Error('PRIVATE_DATA_ENCRYPTION_KEY is required')

const companyName = await readStdin()
if (!companyName) throw new Error('Provide the company name through stdin')

const companyCode = crypto.randomUUID()
const accessCodeId = crypto.randomUUID()
const accessCode = randomToken(24)
const codeHash = await hashAccessCode(accessCode)
const encryptedName = await encryptText(
  companyName,
  encryptionKey,
  appSettings.security.encryptionVersion,
)
const expiresAt = new Date(
  Date.now() + appSettings.accessCode.defaultExpirationDays * 86_400_000,
).toISOString()

executeD1Sql(`
INSERT INTO companies (
  company_code, company_name_ciphertext, company_name_iv, encryption_version
) VALUES (
  ${sqlValue(companyCode)},
  ${sqlValue(encryptedName.ciphertext)},
  ${sqlValue(encryptedName.iv)},
  ${encryptedName.encryptionVersion}
);

INSERT INTO access_codes (id, company_code, code_hash, expires_at) VALUES (
  ${sqlValue(accessCodeId)},
  ${sqlValue(companyCode)},
  ${sqlValue(codeHash)},
  ${sqlValue(expiresAt)}
);
`, process.argv.includes('--remote'))

console.log(`Access code (shown once): ${accessCode}`)
