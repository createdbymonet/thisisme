## Current development branch

The private profile, access codes, resume delivery, administrator portal, and company analytics have been removed from the current implementation. The public portfolio remains; testimonial display, submission, and moderation are also removed. Existing database migrations are retained as history; the owner has deleted both production and development D1 databases. The version history below describes earlier releases.

現在の実装では、非公開プロフィール、アクセスコード、レジュメ配信、管理者画面、企業別分析を削除しています。公開ポートフォリオは維持し、推薦コメントの表示・投稿・承認機能も削除しています。既存のDBマイグレーションは履歴として保持し、本番・開発のD1 Databaseは所有者が削除済みです。以下のバージョン履歴は過去のリリースについての記録です。

## Features

* Public portfolio
* English / Japanese localization
* Responsive desktop, tablet, and mobile layouts
* OpenAPI specification
* Swagger UI
* GitHub Actions CI
* Local Vite development and production deployment from `release`

<details>
<summary>日本語</summary>

## 主な機能

* Public Portfolio
* 英語 / 日本語切り替え
* Desktop / Tablet / Mobile対応
* OpenAPI Specification
* Swagger UI
* GitHub Actions CI
* Viteによるローカル開発と`release`からのProduction Deploy

</details>

---

## Local development and deployment

Run `pnpm dev` for local Vite development. No Cloudflare deployment is required.

| Branch | GitHub Actions behavior |
| --- | --- |
| `main` | Run CI checks; no Cloudflare deployment |
| `release` | Run `pnpm check`, deploy the production Worker `thisisme`, then run production smoke checks |

Production uses the top-level `wrangler.jsonc` configuration. There are no named Wrangler environments or development deployment workflows. The Cloudflare Vite plugin uses this configuration for local development and production builds.

The GitHub Actions `development` environment is no longer referenced by any workflow and can be deleted manually in repository settings. Removing repository configuration does not delete an existing remote Worker; remote cleanup is a separate action. Historical R2 buckets are outside this configuration change.

<details>
<summary>日本語</summary>

`pnpm dev`でViteによるローカル開発を開始します。CloudflareへのDeployは不要です。

`main`へのPushではCIチェックのみを実行し、CloudflareにはDeployしません。`release`へのPushでは`pnpm check`、Production Worker `thisisme`へのDeploy、本番スモークチェックを順に実行します。

Wranglerはトップレベルの設定のみを使用します。開発用のWrangler環境やDeploy Workflowはありません。GitHub Actionsの`development`環境は未参照となるため、Repository Settingsから手動で削除できます。既存のCloudflare Workerや過去のR2 Bucketの削除は別途判断します。

</details>

---

## Technology stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* SCSS

### Backend / Infrastructure

* Cloudflare Workers
* Web Crypto API
* OpenAPI
* Swagger UI
* Wrangler

### Development / Delivery

* pnpm
* GitHub Actions
* Figma
* ChatGPT
* Codex

<details>
<summary>日本語</summary>

## 技術スタック

### Frontend

* React
* TypeScript
* Vite
* React Router
* SCSS

### Backend / Infrastructure

* Cloudflare Workers
* Web Crypto API
* OpenAPI
* Swagger UI
* Wrangler

### Development / Delivery

* pnpm
* GitHub Actions
* Figma
* ChatGPT
* Codex

</details>

---

## AI-assisted development experiment

`This is me` began not only as a portfolio project, but also as an experiment in AI-assisted software development.

### Versions 1.0.0.0 – 2.0.0.0

Up to and including **Version 2.0.0.0, I intentionally wrote no application code manually.**

The project has been developed using:

* **Figma** — UI and responsive design
* **ChatGPT** — requirements discussion, architecture planning, implementation planning, implementation review, debugging support, security review, infrastructure planning, and production verification
* **Codex** — source-code implementation and modification

My role during these releases was to make the engineering and product decisions rather than manually author the implementation.

I was responsible for:

* defining requirements and application behavior
* selecting and evolving the architecture and technology stack
* designing the UI in Figma
* reviewing generated implementations
* validating frontend and backend behavior
* designing development and production deployment strategies
* configuring Cloudflare Workers, D1, and R2 resources
* testing CI/CD and deployment workflows
* investigating and debugging failures
* making security and privacy decisions
* performing end-to-end development and production verification

Version `1.0.0.0` represents the initial production-ready AI-only implementation.

Version `2.0.0.0` extends the experiment into infrastructure, deployment, and protected file delivery, while maintaining the same constraint: **the application code was implemented through AI tools rather than manually written by the project owner.**

These versions are not intended to imply that I manually authored the source code included in them.

Future versions may transition toward direct source-code implementation by the project owner while continuing to use AI as a development tool.

Versions `1.0.0.0` and `2.0.0.0` will remain in the repository history as records of what was achieved under the AI-only implementation constraint.

<details>
<summary>日本語</summary>

## AIを活用した開発実験

`This is me` はポートフォリオ制作だけでなく、AIを活用したSoftware Developmentの実験としても始めました。

### Versions 1.0.0.0 – 2.0.0.0

**Version 2.0.0.0までは、意図的に私自身ではApplication Codeを直接書いていません。**

このプロジェクトでは、以下を利用して開発しています。

* **Figma** — UI・Responsive Design
* **ChatGPT** — 要件整理、Architecture検討、実装計画、Implementation Review、Debug支援、Security Review、Infrastructure設計、Production Verification
* **Codex** — Source Codeの実装・修正

これらのReleaseにおける私の役割は、実装コードを直接記述することではなく、EngineeringおよびProduct上の判断を行うことでした。

主に以下を担当しました。

* 要件・Application Behaviorの決定
* Architecture・Technology Stackの選定と改善
* FigmaでのUI設計
* 生成されたImplementationのレビュー
* Frontend / Backendの動作確認
* Development / Production Deployment Strategyの設計
* Cloudflare Workers / D1 / R2の構成・設定
* CI/CD・Deployment Workflowのテスト
* 不具合の調査・Debug
* Security / Privacyに関する判断
* Development / Production環境でのEnd-to-end Verification

Version `1.0.0.0` は、AIのみで構築した最初のProduction-ready Releaseです。

Version `2.0.0.0` では同じ制約を維持したまま、Infrastructure、Deployment、Protected File DeliveryまでAI実装の対象を広げました。

これらのVersionに含まれるSource Codeを、Project Owner自身が手作業で実装したという意味ではありません。

今後のVersionでは、AIを開発Toolとして引き続き活用しながら、Project Owner自身によるSource Codeの直接実装へ移行する可能性があります。

Version `1.0.0.0` と `2.0.0.0` は、AI-only implementationという条件のもとでどこまで構築できたのかを記録するため、Repository Historyに残します。

</details>

---

## Version history

| Version   | Development approach             | Description                                                                                                                                                                                     |
| --------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `1.0.0.0` | Figma + ChatGPT + Codex          | Initial production release. No application code manually written by the project owner.                                                                                                          |
| `2.0.0.0` | ChatGPT + Codex                  | Separated development and production deployments, added protected R2-backed resume access, and updated the public Workers namespace. No application code manually written by the project owner. |
| Future    | AI-assisted + manual development | Planned transition toward direct source-code implementation by the project owner while continuing to use AI as a development tool.                                                              |

<details>
<summary>日本語</summary>

## Version履歴

| Version   | 開発方法                    | 内容                                                                                                         |
| --------- | ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| `1.0.0.0` | Figma + ChatGPT + Codex | 初回Production Release。Project Owner自身によるApplication Codeの手動実装なし。                                            |
| `2.0.0.0` | ChatGPT + Codex         | Development / Production環境の分離、R2を使用した認証付きレジュメ機能、Workers公開URLの更新。Project Owner自身によるApplication Codeの手動実装なし。 |
| Future    | AI支援 + 手動開発             | AIを開発Toolとして継続利用しながら、Project Owner自身によるSource Codeの直接実装へ移行予定。                                              |

</details>

---

## Project status

**Version 2.0.0.0** is the latest production release.

The AI-only implementation experiment has continued through Version `2.0.0.0`.

The current implementation provides the public portfolio without D1 or R2 bindings. Local development uses Vite; `main` runs CI without deploying, and `release` deploys the production Cloudflare Worker `thisisme`. The separate development deployment and protected storage features described in the version history are no longer part of the current configuration.

Future development may transition toward direct source-code implementation by the project owner while continuing to use ChatGPT and Codex as development tools.

<details>
<summary>日本語</summary>

## Project Status

**Version 2.0.0.0** が現在の最新Production Releaseです。

AI-only implementationの実験はVersion `2.0.0.0` まで継続しました。

現在の実装はD1やR2のBindingを使用せず、公開ポートフォリオを提供します。ローカル開発はViteを使用し、`main`ではCIのみ、`release`ではProduction Cloudflare Worker `thisisme`へのDeployを実行します。Version履歴に記載した開発用Deployや認証付きストレージ機能は現在の構成には含まれません。

今後はChatGPTやCodexを開発Toolとして引き続き利用しながら、Project Owner自身によるSource Codeの直接実装へ移行する可能性があります。

</details>

### Retired-feature database cleanup

Both `thisisme` and `thisisme-development` D1 databases were deleted by the owner. The application no longer uses a database. D1 bindings, migration checks, and deployment migration steps have been removed. SQL migrations are retained only as historical records and are not applied by CI or deployment workflows.

## License

This project is licensed under the [MIT License](./LICENSE).
