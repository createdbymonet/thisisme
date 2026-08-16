import { decryptText, encryptText } from "../security/crypto.js";

export const DISPLAY_PREFERENCES = ["full_name", "partial_name", "anonymous"] as const;
export type DisplayPreference = typeof DISPLAY_PREFERENCES[number];

export type TestimonialSubmission = {
  authorName: string;
  relationship: string;
  comment: string;
  displayPreference: DisplayPreference;
};

type ApprovedTestimonialRow = {
  author_name_ciphertext: string;
  author_name_iv: string;
  relationship_ciphertext: string;
  relationship_iv: string;
  comment_ciphertext: string;
  comment_iv: string;
  display_preference: DisplayPreference;
  encryption_version: number;
};

function partialName(name: string) {
  // Keep the first name and reduce the final name segment to one Unicode initial.
  const parts = name.split(/\s+/u);
  return parts.length === 1
    ? `${Array.from(parts[0])[0] ?? ""}.`
    : `${parts[0]} ${Array.from(parts.at(-1) ?? "")[0] ?? ""}.`;
}

export async function createTestimonial(
  db: D1Database,
  encodedKey: string,
  encryptionVersion: number,
  submission: TestimonialSubmission,
) {
  const [authorName, relationship, comment] = await Promise.all([
    encryptText(submission.authorName, encodedKey, encryptionVersion),
    encryptText(submission.relationship, encodedKey, encryptionVersion),
    encryptText(submission.comment, encodedKey, encryptionVersion),
  ]);

  await db.prepare(`
    INSERT INTO testimonials (
      id, author_name_ciphertext, author_name_iv,
      relationship_ciphertext, relationship_iv,
      comment_ciphertext, comment_iv, display_preference,
      status, encryption_version, reviewed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, NULL)
  `).bind(
    crypto.randomUUID(),
    authorName.ciphertext,
    authorName.iv,
    relationship.ciphertext,
    relationship.iv,
    comment.ciphertext,
    comment.iv,
    submission.displayPreference,
    encryptionVersion,
  ).run();
}

export async function getApprovedTestimonials(db: D1Database, encodedKey: string) {
  const { results } = await db.prepare(`
    SELECT
      author_name_ciphertext, author_name_iv,
      relationship_ciphertext, relationship_iv,
      comment_ciphertext, comment_iv,
      display_preference, encryption_version
    FROM testimonials
    WHERE status = 'approved'
    ORDER BY reviewed_at DESC
  `).all<ApprovedTestimonialRow>();

  return Promise.all(results.map(async (row) => {
    const encrypted = (ciphertext: string, iv: string) => ({
      ciphertext,
      iv,
      encryptionVersion: row.encryption_version,
    });
    const [relationship, comment, decryptedAuthorName] = await Promise.all([
      decryptText(encrypted(row.relationship_ciphertext, row.relationship_iv), encodedKey),
      decryptText(encrypted(row.comment_ciphertext, row.comment_iv), encodedKey),
      row.display_preference === "anonymous"
        ? Promise.resolve(null)
        : decryptText(encrypted(row.author_name_ciphertext, row.author_name_iv), encodedKey),
    ]);

    return {
      authorName: row.display_preference === "partial_name" && decryptedAuthorName
        ? partialName(decryptedAuthorName)
        : decryptedAuthorName,
      isAnonymous: row.display_preference === "anonymous",
      relationship,
      comment,
    };
  }));
}
