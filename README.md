## Features

* Public portfolio
* English / Japanese localization
* Responsive desktop, tablet, and mobile layouts
* Company-specific access codes
* Protected private profile
* Protected resume viewing and download
* Administrator portal
* Access-code issuance, deactivation, and reissue
* Privacy-conscious company analytics
* Testimonial submission and moderation
* OpenAPI specification
* Swagger UI
* Cloudflare D1 persistence
* Private Cloudflare R2 storage
* GitHub Actions CI
* Separate development and production deployments

<details>
<summary>日本語</summary>

## 主な機能

* Public Portfolio
* 英語 / 日本語切り替え
* Desktop / Tablet / Mobile対応
* 企業ごとのAccess Code
* Protected Private Profile
* 認証付きレジュメ閲覧・ダウンロード
* Administrator Portal
* Access Codeの発行・無効化・再発行
* Privacyに配慮したCompany Analytics
* Testimonial投稿・承認
* OpenAPI Specification
* Swagger UI
* Cloudflare D1
* Private Cloudflare R2 Storage
* GitHub Actions CI
* Development / Production分離Deploy

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
* Cloudflare D1
* Cloudflare R2
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
* Cloudflare D1
* Cloudflare R2
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

The project now includes separate development and production environments, protected resume delivery through private Cloudflare R2 storage, environment-specific D1 databases, and controlled production releases through the `release` branch.

Future development may transition toward direct source-code implementation by the project owner while continuing to use ChatGPT and Codex as development tools.

<details>
<summary>日本語</summary>

## Project Status

**Version 2.0.0.0** が現在の最新Production Releaseです。

AI-only implementationの実験はVersion `2.0.0.0` まで継続しました。

現在は、Development / Production環境の分離、Private Cloudflare R2を利用した認証付きレジュメ配信、環境ごとに分離したD1 Database、`release` ブランチを利用したProduction Release Flowまで実装されています。

今後はChatGPTやCodexを開発Toolとして引き続き利用しながら、Project Owner自身によるSource Codeの直接実装へ移行する可能性があります。

</details>
