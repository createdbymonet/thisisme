import appSettings from '../appsettings.json' with { type: 'json' }
import { encryptText } from '../worker/security/crypto.ts'
import { executeD1Sql, readStdin, sqlValue } from './d1.mjs'

const encryptionKey = process.env.PRIVATE_DATA_ENCRYPTION_KEY
if (!encryptionKey) throw new Error('PRIVATE_DATA_ENCRYPTION_KEY is required')

const input = JSON.parse(await readStdin())
if (
  typeof input !== 'object'
  || input === null
  || typeof input.legalName !== 'string'
  || !Array.isArray(input.employment)
  || !Array.isArray(input.education)
  || !Array.isArray(input.certifications)
  || !(typeof input.resume === 'string' || input.resume === null)
  || ![input.employment, input.education, input.certifications]
    .every((items) => items.every((item) => typeof item === 'string'))
) {
  throw new Error('Invalid private-profile input')
}

const version = appSettings.security.encryptionVersion
const [legalName, employment, education, certifications, resume] = await Promise.all([
  encryptText(input.legalName, encryptionKey, version),
  encryptText(JSON.stringify(input.employment), encryptionKey, version),
  encryptText(JSON.stringify(input.education), encryptionKey, version),
  encryptText(JSON.stringify(input.certifications), encryptionKey, version),
  encryptText(JSON.stringify(input.resume), encryptionKey, version),
])

executeD1Sql(`
INSERT INTO private_profile (
  id,
  legal_name_ciphertext, legal_name_iv,
  employment_ciphertext, employment_iv,
  education_ciphertext, education_iv,
  certifications_ciphertext, certifications_iv,
  resume_ciphertext, resume_iv,
  encryption_version
) VALUES (
  'primary',
  ${sqlValue(legalName.ciphertext)}, ${sqlValue(legalName.iv)},
  ${sqlValue(employment.ciphertext)}, ${sqlValue(employment.iv)},
  ${sqlValue(education.ciphertext)}, ${sqlValue(education.iv)},
  ${sqlValue(certifications.ciphertext)}, ${sqlValue(certifications.iv)},
  ${sqlValue(resume.ciphertext)}, ${sqlValue(resume.iv)},
  ${version}
)
ON CONFLICT(id) DO UPDATE SET
  legal_name_ciphertext = excluded.legal_name_ciphertext,
  legal_name_iv = excluded.legal_name_iv,
  employment_ciphertext = excluded.employment_ciphertext,
  employment_iv = excluded.employment_iv,
  education_ciphertext = excluded.education_ciphertext,
  education_iv = excluded.education_iv,
  certifications_ciphertext = excluded.certifications_ciphertext,
  certifications_iv = excluded.certifications_iv,
  resume_ciphertext = excluded.resume_ciphertext,
  resume_iv = excluded.resume_iv,
  encryption_version = excluded.encryption_version,
  updated_at = CURRENT_TIMESTAMP;
`, process.argv.includes('--remote'))

console.log('Encrypted private profile saved.')
