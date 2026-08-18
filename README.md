# This is me

A personal portfolio web application built with React, TypeScript, Cloudflare Workers, Cloudflare D1, OpenAPI, and Swagger UI.

This project began with three goals:

1. Learn React by building a real application.
2. Build and deploy a web application from scratch.
3. Explore how far modern AI tools can support the full software development lifecycle.

Live application:

```text
https://thisisme.sumihana.workers.dev/
```

Development deployment:

```text
https://thisisme-development.sumihana.workers.dev/
```

<details>
<summary>日本語</summary>

React、TypeScript、Cloudflare Workers、Cloudflare D1、OpenAPI、Swagger UIを使用して開発している個人ポートフォリオWebアプリケーションです。

このプロジェクトは、次の3つを目的として始めました。

1. 実際のアプリケーション開発を通してReactを学ぶこと
2. Webアプリケーションをゼロから構築し、本番環境へ公開すること
3. 現在のAIツールがソフトウェア開発ライフサイクル全体をどこまで支援できるのか試すこと

Production URL:

```text
https://thisisme.sumihana.workers.dev/
```

Development URL:

```text
https://thisisme-development.sumihana.workers.dev/
```

</details>

---

## Features

- Public portfolio
- English / Japanese localization
- Responsive desktop, tablet, and mobile layouts
- Company-specific access codes
- Protected private profile
- Administrator portal
- Access-code issuance, deactivation, and reissue
- Privacy-conscious company analytics
- Testimonial submission and moderation
- OpenAPI specification
- Swagger UI
- Cloudflare D1 persistence
- GitHub Actions CI
- Automated production deployment

<details>
<summary>日本語</summary>

## 主な機能

- Public Portfolio
- 英語 / 日本語切り替え
- Desktop / Tablet / Mobile対応
- 企業ごとのAccess Code
- Protected Private Profile
- Administrator Portal
- Access Codeの発行・無効化・再発行
- Privacyに配慮したCompany Analytics
- Testimonial投稿・承認
- OpenAPI Specification
- Swagger UI
- Cloudflare D1
- GitHub Actions CI
- Production自動Deploy

</details>

---

## Technology stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- SCSS

### Backend / Infrastructure

- Cloudflare Workers
- Cloudflare D1
- Web Crypto API
- OpenAPI
- Swagger UI
- Wrangler

### Development / Delivery

- pnpm
- GitHub Actions
- Figma
- ChatGPT
- Codex

<details>
<summary>日本語</summary>

## 技術スタック

### Frontend

- React
- TypeScript
- Vite
- React Router
- SCSS

### Backend / Infrastructure

- Cloudflare Workers
- Cloudflare D1
- Web Crypto API
- OpenAPI
- Swagger UI
- Wrangler

### Development / Delivery

- pnpm
- GitHub Actions
- Figma
- ChatGPT
- Codex

</details>

---

## AI-assisted development experiment

`This is me` began not only as a portfolio project, but also as an experiment in AI-assisted software development.

### Version 1.0.0.0

Up to and including **Version 1.0.0.0, I intentionally wrote no application code manually.**

The project was created using:

- **Figma** — UI and responsive design
- **ChatGPT** — requirements discussion, architecture planning, implementation review, debugging support, security review, and production verification
- **Codex** — source-code implementation and modification

My role during this phase was to make the engineering and product decisions rather than manually write the implementation.

I was responsible for:

- defining requirements and application behavior
- selecting the architecture and technology stack
- designing the UI in Figma
- reviewing generated implementations
- validating frontend and backend behavior
- testing production workflows
- investigating and debugging failures
- making security and privacy decisions
- configuring CI/CD and production infrastructure
- performing end-to-end production verification

Version `1.0.0.0` therefore represents a deliberate **AI-only implementation milestone**.

It is not intended to imply that I manually authored the source code included in that version.

From the next version onward, I will begin directly modifying and extending the code myself while continuing to use AI as a development tool.

Version `1.0.0.0` will remain in the repository history as a record of what was achieved under this constraint.

<details>
<summary>日本語</summary>

## AIを活用した開発実験

`This is me` はポートフォリオ制作だけでなく、AIを活用したSoftware Developmentの実験としても始めました。

### Version 1.0.0.0

**Version 1.0.0.0までは、意図的に私自身ではApplication Codeを一切書いていません。**

このフェーズでは、以下を利用して開発しました。

- **Figma** — UI・Responsive Design
- **ChatGPT** — 要件整理、Architecture検討、実装レビュー、Debug支援、Security Review、Production Verification
- **Codex** — Source Codeの実装・修正

このフェーズでの私の役割は、実装コードを直接記述することではなく、EngineeringおよびProduct上の判断を行うことでした。

主に以下を担当しました。

- 要件・Application Behaviorの決定
- Architecture・Technology Stackの選定
- FigmaでのUI設計
- 生成されたImplementationのレビュー
- Frontend / Backendの動作確認
- Production Workflowのテスト
- 不具合の調査・Debug
- Security / Privacyに関する判断
- CI/CD・Production Infrastructureの設定
- End-to-end Production Verification

Version `1.0.0.0` は、意図的に設定した **AI-only implementation milestone** です。

このVersionに含まれるSource Codeを私自身が手作業で実装した、という意味ではありません。

次のVersion以降は、AIを開発Toolとして引き続き活用しながら、私自身もSource Codeを直接修正・追加していく予定です。

Version `1.0.0.0` は、この条件のもとでどこまで構築できたのかを記録するため、Repository Historyに残します。

</details>

---

## Version history

| Version | Development approach | Description |
| --- | --- | --- |
| `1.0.0.0` | Figma + ChatGPT + Codex | Initial production release. No application code manually written by the project owner. |
| `1.1.0.0+` | AI-assisted + manual development | The project owner begins directly modifying and extending the source code. |

<details>
<summary>日本語</summary>

## Version履歴

| Version | 開発方法 | 内容 |
| --- | --- | --- |
| `1.0.0.0` | Figma + ChatGPT + Codex | 初回Production Release。Project Owner自身によるApplication Codeの手動実装なし。 |
| `1.1.0.0+` | AI支援 + 手動開発 | Project Owner自身もSource Codeを直接修正・追加するフェーズ。 |

</details>

---

## Application routes

### Public

```text
/
 /recommend
```

### Protected

```text
/access
/private
```

### Administration

```text
/manage-portal
/admin
/admin/access-codes
/admin/analytics
/admin/testimonials
/admin/settings
```

### API documentation

```text
/docs
/api/openapi.json
```

<details>
<summary>日本語</summary>

## Application Routes

### Public

```text
/
 /recommend
```

### Protected

```text
/access
/private
```

### Administration

```text
/manage-portal
/admin
/admin/access-codes
/admin/analytics
/admin/testimonials
/admin/settings
```

### API Documentation

```text
/docs
/api/openapi.json
```

</details>

---

## Privacy and security

The application intentionally minimizes stored visitor data.

Company analytics do not store:

- IP addresses
- hashed IP addresses
- precise location
- User-Agent
- browser fingerprints
- referrers
- full URLs
- access codes
- session tokens
- persistent visitor identifiers

Protected data is encrypted with AES-GCM.

Access codes are stored as salted PBKDF2-SHA-256 hashes.

Administrator and protected sessions use opaque random tokens, while D1 stores only token hashes.

<details>
<summary>日本語</summary>

## Privacy / Security

このApplicationでは、Visitor Dataの保存を最小限にしています。

Company Analyticsでは、以下を保存しません。

- IP Address
- Hashed IP Address
- Precise Location
- User-Agent
- Browser Fingerprint
- Referrer
- Full URL
- Access Code
- Session Token
- Persistent Visitor Identifier

Protected DataはAES-GCMで暗号化します。

Access CodeはSalt付きPBKDF2-SHA-256 Hashとして保存します。

Administrator SessionおよびProtected SessionではOpaque Random Tokenを使用し、D1にはToken Hashのみを保存します。

</details>

---

## Local development

### Requirements

- Node.js `24.14.1`
- pnpm `11.21.0`

Install dependencies:

```bash
pnpm install --frozen-lockfile
```

Apply local D1 migrations:

```bash
pnpm wrangler d1 migrations apply DB --local
```

Start the application:

```bash
pnpm dev
```

<details>
<summary>日本語</summary>

## Local Development

### 必要環境

- Node.js `24.14.1`
- pnpm `11.21.0`

DependencyをInstallします。

```bash
pnpm install --frozen-lockfile
```

Local D1へMigrationを適用します。

```bash
pnpm wrangler d1 migrations apply DB --local
```

Applicationを起動します。

```bash
pnpm dev
```

</details>

---

## Application configuration and secrets

Non-sensitive defaults live in:

```text
appsettings.json
```

Local development secrets must be stored in the ignored:

```text
.dev.vars
```

Required Worker secrets:

```text
PRIVATE_DATA_ENCRYPTION_KEY
ADMIN_AUTH_SECRET
```

Example local configuration:

```text
PRIVATE_DATA_ENCRYPTION_KEY="<base64-encoded 32-byte development key>"
ADMIN_AUTH_SECRET="<long, random development-only credential>"
```

Never commit production secret values.

<details>
<summary>日本語</summary>

## Application Configuration / Secrets

機密情報ではないDefault Settingは以下に定義します。

```text
appsettings.json
```

Local Development用SecretはGit管理外の以下に保存します。

```text
.dev.vars
```

必要なWorker Secret：

```text
PRIVATE_DATA_ENCRYPTION_KEY
ADMIN_AUTH_SECRET
```

Local設定例：

```text
PRIVATE_DATA_ENCRYPTION_KEY="<base64-encoded 32-byte development key>"
ADMIN_AUTH_SECRET="<long, random development-only credential>"
```

Production Secretの値は絶対にCommitしません。

</details>

---

## Protected-profile developer workflow

The provisioning tools use stdin so plaintext protected data does not need to appear in command-line arguments.

Local example:

```bash
printf 'Non-production company name' | pnpm access:issue
```

```bash
printf '{"legalName":"...","employment":[],"education":[],"certifications":[],"resume":null}' | pnpm private-profile:set
```

Use `--remote` only when intentionally provisioning the configured production D1 database.

Access codes are shown only once and cannot be recovered later.

<details>
<summary>日本語</summary>

## Protected Profile Developer Workflow

Provisioning Toolでは、Plaintext Protected DataをCommand-line Argumentへ直接書かなくて済むようstdinを利用します。

Local Example：

```bash
printf 'Non-production company name' | pnpm access:issue
```

```bash
printf '{"legalName":"...","employment":[],"education":[],"certifications":[],"resume":null}' | pnpm private-profile:set
```

Configured Production D1へ意図的にProvisioningする場合のみ `--remote` を使用します。

Access Codeは一度だけ表示され、後から復元することはできません。

</details>

---

## Cloudflare D1

Both Workers use the `DB` binding with separate D1 databases:

- `main` / development: `thisisme-development`
- `release` / production: `thisisme`

Migration files are stored in:

```text
migrations/
```

Apply migrations locally:

```bash
pnpm wrangler d1 migrations apply DB --local
```

Check migration status:

```bash
pnpm wrangler d1 migrations list DB --local
```

For production:

```bash
pnpm wrangler d1 migrations list DB --remote
```

Production migrations are normally applied automatically by the deployment workflow.

<details>
<summary>日本語</summary>

## Cloudflare D1

両方のWorkerは `DB` Bindingを使用し、環境ごとに異なるD1 Databaseへ接続します。

- `main` / Development：`thisisme-development`
- `release` / Production：`thisisme`

Migration File：

```text
migrations/
```

Local Migration：

```bash
pnpm wrangler d1 migrations apply DB --local
```

Migration Status：

```bash
pnpm wrangler d1 migrations list DB --local
```

Production：

```bash
pnpm wrangler d1 migrations list DB --remote
```

Production Migrationは通常Deployment Workflowによって自動適用されます。

</details>

---

## Continuous integration

GitHub Actions runs validation for:

- every pull request
- every push to `main`

CI performs:

- frozen-lockfile installation
- lint
- production build
- repository safety checks
- whitespace validation
- migration validation
- disposable local D1 migration application
- analytics privacy schema checks

CI does not deploy or connect to remote D1.

Run the equivalent checks locally:

```bash
pnpm check
```

<details>
<summary>日本語</summary>

## Continuous Integration

GitHub Actionsでは以下のタイミングでValidationを実行します。

- Pull Request
- `main` へのPush

CIでは以下を確認します。

- Frozen Lockfile Install
- Lint
- Production Build
- Repository Safety
- Whitespace
- Migration
- Disposable Local D1
- Analytics Privacy Schema

CIではDeployやRemote D1への接続は行いません。

Localでは以下を実行します。

```bash
pnpm check
```

</details>

---

## Development and production deployment

The application is deployed to Cloudflare Workers through GitHub Actions.

- Every push to `main` deploys the `thisisme-development` Worker with the separate `thisisme-development` D1 database.
- Every push to `release` deploys the production `thisisme` Worker with the production `thisisme` D1 database.
- Feature branches and pull request activity run CI but do not deploy.

Release flow:

```text
feature/* -> pull request -> main -> development
main -> merge when ready -> release -> production
```

Each deployment workflow:

1. installs dependencies
2. runs repository validation
3. verifies required Worker secrets
4. applies remote D1 migrations
5. deploys the Worker and frontend assets
6. runs deployment smoke tests

Deployments use matching GitHub Environments:

```text
development
production
```

Required GitHub Environment Secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

The Cloudflare token should be scoped only to the permissions required for Worker deployment and D1 migrations.

<details>
<summary>日本語</summary>

## Development / Production Deployment

ApplicationはGitHub ActionsからCloudflare WorkersへDeployします。

- `main` へのPushは、専用の `thisisme-development` D1 Databaseを使用する `thisisme-development` WorkerへDeployします。
- `release` へのPushは、Production用 `thisisme` D1 Databaseを使用する `thisisme` WorkerへDeployします。
- Feature BranchへのPushおよびPull RequestではDeployせず、CIのみを実行します。

Release Flow：

```text
feature/* -> Pull Request -> main -> Development
main -> Release準備完了後にMerge -> release -> Production
```

Workflow：

1. Dependency Install
2. Repository Validation
3. Worker Secret確認
4. Remote D1 Migration
5. Worker / Frontend Deploy
6. Deployment Smoke Test

GitHub Environments：

```text
development
production
```

必要なEnvironment Secrets：

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

Cloudflare TokenはWorker DeployとD1 Migrationに必要な最小権限のみに制限します。

</details>

---

## Production smoke tests

After deployment, automated smoke tests verify:

- `/`
- `/recommend`
- `/access`
- `/private`
- `/manage-portal`
- `/docs`
- `/api/health`
- `/api/openapi.json`
- `/api/testimonials`
- protected API authentication behavior
- administrator API authentication behavior
- `noindex, nofollow`

Smoke tests are read-only.

<details>
<summary>日本語</summary>

## Production Smoke Test

Deploy後、以下を自動確認します。

- `/`
- `/recommend`
- `/access`
- `/private`
- `/manage-portal`
- `/docs`
- `/api/health`
- `/api/openapi.json`
- `/api/testimonials`
- Protected APIの認証動作
- Administrator APIの認証動作
- `noindex, nofollow`

Smoke TestはRead-onlyです。

</details>

---

## Company analytics

Analytics are recorded only for visitors with an active company authorization.

Stored data includes:

- normalized page keys
- normalized section keys
- allowlisted event types
- bounded estimated engagement time
- associated company context

Analytics retention defaults to:

```text
90 days
```

Expired analytics can be removed with:

```bash
pnpm analytics:cleanup
```

<details>
<summary>日本語</summary>

## Company Analytics

Analyticsは有効なCompany Authorizationを持つVisitorに対してのみ記録されます。

保存する情報：

- Normalized Page Key
- Normalized Section Key
- Allowlisted Event Type
- Bounded Estimated Engagement Time
- Associated Company Context

Default Retention：

```text
90 days
```

期限切れAnalyticsは以下で削除できます。

```bash
pnpm analytics:cleanup
```

</details>

---

## API documentation

Swagger UI:

```text
/docs
```

OpenAPI specification:

```text
/api/openapi.json
```

<details>
<summary>日本語</summary>

## API Documentation

Swagger UI：

```text
/docs
```

OpenAPI Specification：

```text
/api/openapi.json
```

</details>

---

## Project status

**Version 1.0.0.0** represents the completion of the initial AI-only implementation experiment and the first production-ready release.

Development from the next version onward will include direct manual source-code changes by the project owner.

<details>
<summary>日本語</summary>

## Project Status

**Version 1.0.0.0** は、AIのみでImplementationを行う初期実験の完了、および最初のProduction-ready Releaseを表します。

次Version以降は、Project Owner自身によるSource Codeの直接修正・追加を含む開発へ移行します。

</details>
