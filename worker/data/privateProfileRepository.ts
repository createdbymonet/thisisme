import { decryptText } from "../security/crypto.js";

type PrivateProfileRow = {
  legal_name_ciphertext: string;
  legal_name_iv: string;
  employment_ciphertext: string;
  employment_iv: string;
  education_ciphertext: string;
  education_iv: string;
  certifications_ciphertext: string;
  certifications_iv: string;
  resume_ciphertext: string;
  resume_iv: string;
  encryption_version: number;
};

function encryptedValue(ciphertext: string, iv: string, encryptionVersion: number) {
  return { ciphertext, iv, encryptionVersion };
}

function parseStringArray(value: string) {
  const parsed: unknown = JSON.parse(value);
  return Array.isArray(parsed) && parsed.every((item) => typeof item === "string") ? parsed : [];
}

function parseNullableString(value: string) {
  const parsed: unknown = JSON.parse(value);
  return typeof parsed === "string" || parsed === null ? parsed : null;
}

export async function getPrivateProfile(db: D1Database, encodedKey: string) {
  const profile = await db.prepare(`
    SELECT legal_name_ciphertext, legal_name_iv,
           employment_ciphertext, employment_iv,
           education_ciphertext, education_iv,
           certifications_ciphertext, certifications_iv,
           resume_ciphertext, resume_iv,
           encryption_version
    FROM private_profile
    ORDER BY created_at
    LIMIT 1
  `).first<PrivateProfileRow>();

  if (!profile) {
    return null;
  }

  const version = profile.encryption_version;
  const [legalName, employment, education, certifications, resume] = await Promise.all([
    decryptText(encryptedValue(profile.legal_name_ciphertext, profile.legal_name_iv, version), encodedKey),
    decryptText(encryptedValue(profile.employment_ciphertext, profile.employment_iv, version), encodedKey),
    decryptText(encryptedValue(profile.education_ciphertext, profile.education_iv, version), encodedKey),
    decryptText(encryptedValue(profile.certifications_ciphertext, profile.certifications_iv, version), encodedKey),
    decryptText(encryptedValue(profile.resume_ciphertext, profile.resume_iv, version), encodedKey),
  ]);

  return {
    legalName,
    employment: parseStringArray(employment),
    education: parseStringArray(education),
    certifications: parseStringArray(certifications),
    resume: parseNullableString(resume),
  };
}
