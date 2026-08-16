import defaultSettings from "../../appsettings.json" with { type: "json" };
import type { ApplicationEnv } from "../environment.js";
import { decryptText } from "../security/crypto.js";

export type SettingKey =
  | "application.defaultLanguage"
  | "security.encryptionVersion"
  | "accessCode.defaultExpirationDays"
  | "protectedProfile.sessionLifetimeMinutes";
export type SettingValue = string | number | boolean;

type SettingRow = {
  value_ciphertext: string;
  value_iv: string;
  encryption_version: number;
};

function getDefaultSetting(key: SettingKey): SettingValue {
  switch (key) {
    case "application.defaultLanguage":
      return defaultSettings.application.defaultLanguage;
    case "security.encryptionVersion":
      return defaultSettings.security.encryptionVersion;
    case "accessCode.defaultExpirationDays":
      return defaultSettings.accessCode.defaultExpirationDays;
    case "protectedProfile.sessionLifetimeMinutes":
      return defaultSettings.protectedProfile.sessionLifetimeMinutes;
  }
}

function isSettingValue(value: unknown): value is SettingValue {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

export async function getSetting(key: SettingKey, env?: ApplicationEnv): Promise<SettingValue> {
  if (!env) {
    return getDefaultSetting(key);
  }

  const override = await env.DB.prepare(`
    SELECT value_ciphertext, value_iv, encryption_version
    FROM settings
    WHERE setting_key = ?
  `).bind(key).first<SettingRow>();

  if (!override) {
    return getDefaultSetting(key);
  }

  const decryptedValue: unknown = JSON.parse(await decryptText({
    ciphertext: override.value_ciphertext,
    iv: override.value_iv,
    encryptionVersion: override.encryption_version,
  }, env.PRIVATE_DATA_ENCRYPTION_KEY));

  return isSettingValue(decryptedValue) ? decryptedValue : getDefaultSetting(key);
}
