export type ApplicationEnv = Env & {
  PRIVATE_DATA_ENCRYPTION_KEY: string;
  ADMIN_AUTH_SECRET?: string;
};
