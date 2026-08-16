# React + TypeScript + Vite

## Continuous integration

GitHub Actions runs read-only validation for every pull request and each push to
`main`. It installs the committed pnpm lockfile, runs lint and the production
build, checks whitespace in the committed change range, validates secret/local
file exclusions, and applies every migration to disposable local D1 state before
checking critical tables and analytics privacy constraints. It never deploys or
connects to remote D1.

Run the equivalent repository checks locally with:

```bash
pnpm install --frozen-lockfile
pnpm check
```

## Production deployment

The `thisisme` Worker and React assets deploy together to Cloudflare Workers.
Production uses the existing D1 database named `thisisme` through the `DB`
binding; deployment does not create or seed another database.

Complete this one-time setup before the first deployment:

1. Configure these Worker runtime secrets interactively. Do not generate or
   replace an existing production encryption key without a deliberate rotation
   and data-migration plan, because existing encrypted data may become
   unreadable.

   ```bash
   pnpm wrangler secret put PRIVATE_DATA_ENCRYPTION_KEY
   pnpm wrangler secret put ADMIN_AUTH_SECRET
   ```

2. Create a GitHub Environment named `production` and add these deployment
   secrets to it:

   ```text
   CLOUDFLARE_API_TOKEN
   CLOUDFLARE_ACCOUNT_ID
   ```

   Use a scoped Cloudflare API token following the Worker deployment-token
   guidance. Limit it to the account containing this Worker and only the
   permissions required for Worker deployment and D1 migrations. Do not use a
   Global API Key or an unrestricted account token.

Every push to `main` runs `.github/workflows/deploy.yml`; it can also be rerun
manually with `workflow_dispatch`. The workflow runs `pnpm check`, verifies the
required Worker secrets, applies and rechecks remote D1 migrations, and then
runs `pnpm wrangler deploy`. Migration failure stops deployment. Deployments use
one non-cancelling production concurrency group so a migration is not interrupted
by a newer run.

The initial production URL is the Cloudflare-provided
`https://thisisme.<account-subdomain>.workers.dev` hostname reported by Wrangler
and recorded on the GitHub `production` environment deployment. After deployment,
the workflow checks frontend routes, Swagger UI, the OpenAPI document, public
testimonials, `/api/health`, `noindex, nofollow` metadata, and unauthenticated
protected API behavior. Smoke-check failure fails the workflow but does not
delete data, reset D1, or roll back automatically.

## Cloudflare D1

The Worker uses the `DB` binding for the `thisisme` D1 database. For local
development, apply the migrations before starting Vite:

```bash
pnpm wrangler d1 migrations apply thisisme --local
pnpm dev
```

Create the remote database while authenticated with Cloudflare, then replace
the local `database_id` in `wrangler.jsonc` with the ID returned by Wrangler:

```bash
pnpm wrangler d1 create thisisme
pnpm wrangler d1 migrations apply thisisme --remote
```

Migration status can be checked by replacing `apply` with `list` in either
command. Migration SQL files are stored in `migrations/`.

<details>
<summary>日本語</summary>

Workerは `thisisme` D1データベースに対して `DB` Bindingを使用します。

Local Developmentでは、Viteを起動する前にMigrationを適用してください。

```bash
pnpm wrangler d1 migrations apply thisisme --local
pnpm dev
```

Remote Databaseを作成する場合は、Cloudflareへ認証した状態で以下を実行します。

```bash
pnpm wrangler d1 create thisisme
```

Wranglerから返されたDatabase IDを `wrangler.jsonc` の `database_id` に設定した後、Remote DatabaseへMigrationを適用します。

```bash
pnpm wrangler d1 migrations apply thisisme --remote
```

Migrationの適用状況を確認する場合は、各Commandの `apply` を `list` に置き換えてください。

Migration用SQL Fileは以下に保存されています。

```text
migrations/
```

</details>

## Application configuration and secrets

Non-sensitive defaults live in `appsettings.json`. Runtime settings may
override those defaults through encrypted rows in D1. Protected values use
AES-GCM through the Worker Web Crypto API.

Set `PRIVATE_DATA_ENCRYPTION_KEY` to a base64-encoded 32-byte key in an ignored
`.dev.vars` file for local development. Configure the production value as a
Worker secret; never add the key to `appsettings.json` or `wrangler.jsonc`:

```bash
pnpm wrangler secret put PRIVATE_DATA_ENCRYPTION_KEY
```

### Administrator authentication

Admin authentication uses a dedicated `ADMIN_AUTH_SECRET`; company access codes
cannot authenticate administrators. For local development, place both required
secrets in the ignored `.dev.vars` file. Do not commit that file:

```text
PRIVATE_DATA_ENCRYPTION_KEY="<base64-encoded 32-byte development key>"
ADMIN_AUTH_SECRET="<long, random development-only credential>"
```

Configure the production credential interactively as a Worker Secret:

```bash
pnpm wrangler secret put ADMIN_AUTH_SECRET
```

Successful login creates a 45-minute opaque session in an HttpOnly, Secure,
SameSite=Strict cookie. D1 stores only the SHA-256 session-token hash. Access
codes created or reissued in the admin UI are displayed once and cannot be
recovered; copy them before dismissing the notice.

The `testimonial:moderate` command remains a credential-dependent emergency
and development workflow. Browser moderation uses authenticated admin APIs.

### Company analytics privacy

Analytics are recorded only for visitors with an active company authorization.
The system stores normalized page/section keys, allowlisted event types, bounded
estimated engagement duration, and the associated encrypted-company record.
It deliberately does not store IP addresses (including hashes), location,
User-Agent, fingerprints, referrers, full URLs, access codes, or session tokens.

Defaults are `analytics.enabled: true` and a 90-day retention period in
`appsettings.json`; encrypted D1 settings can override both values. Set
`analytics.enabled` to `false` to stop new ingestion without deleting retained
aggregates. With Cloudflare API credentials configured, remove expired analytics
using:

```bash
pnpm analytics:cleanup
```

### Protected-profile developer workflow

Set `PRIVATE_DATA_ENCRYPTION_KEY` in the current shell, then pass plaintext only
through stdin. The provisioning scripts write ciphertext and salted PBKDF2
hashes to local D1 by default:

```bash
printf 'Non-production company name' | pnpm access:issue
printf '{"legalName":"...","employment":[],"education":[],"certifications":[],"resume":null}' | pnpm private-profile:set
```

`access:issue` prints the generated access code once. Add `--remote` only when
intentionally provisioning the configured remote database. Never place
plaintext protected data or access codes in committed files.

<details>
<summary>日本語</summary>

機密情報ではないDefault Settingは `appsettings.json` に定義します。

Runtime Settingは、D1に保存された暗号化済みのOverride値によってDefault Settingを上書きできます。

Protected Valueの暗号化には、WorkerのWeb Crypto APIを利用したAES-GCMを使用します。

Local Developmentでは、Git管理外の `.dev.vars` に `PRIVATE_DATA_ENCRYPTION_KEY` を設定してください。

値にはBase64 Encodeされた32 ByteのKeyを使用します。

Production環境では、Encryption KeyをCloudflare Worker Secretとして設定してください。

```bash
pnpm wrangler secret put PRIVATE_DATA_ENCRYPTION_KEY
```

Encryption Keyを以下へ保存しないでください。

```text
appsettings.json
wrangler.jsonc
Git Repository
```

</details>

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

<details>
<summary>日本語</summary>

このTemplateは、ReactをVite上で動作させるための最小構成を提供しています。

HMR（Hot Module Replacement）と、いくつかのESLint Ruleが含まれています。

現在、公式Pluginとして以下の2つが利用できます。

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
  [Oxc](https://oxc.rs) を使用します。

- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)
  [SWC](https://swc.rs/) を使用します。

</details>

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

<details>
<summary>日本語</summary>

このTemplateでは、DevelopmentおよびBuild Performanceへの影響を考慮し、React Compilerは有効化されていません。

React Compilerを追加する場合は、以下のDocumentationを参照してください。

[React Compiler Installation](https://react.dev/learn/react-compiler/installation)

</details>

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, use this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

<details>
<summary>日本語</summary>

Production Applicationとして開発する場合は、Type情報を利用したLint Ruleを有効化することが推奨されています。

たとえば、現在のESLint Configurationを以下のように変更できます。

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // tseslint.configs.recommended を削除し、こちらへ置き換える
      tseslint.configs.recommendedTypeChecked,

      // より厳格なRuleを使用する場合
      tseslint.configs.strictTypeChecked,

      // Stylistic Ruleも使用する場合
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

</details>

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Enable lint rules for React
      reactX.configs['recommended-typescript'],

      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

<details>
<summary>日本語</summary>

React固有のLint Ruleを追加したい場合は、以下のPluginも利用できます。

- [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x)
- [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom)

設定例：

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // React用Lint Ruleを有効化
      reactX.configs['recommended-typescript'],

      // React DOM用Lint Ruleを有効化
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

</details>
