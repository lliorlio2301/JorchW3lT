# Gemini Interaction Guidelines (Project: Personal Portfolio)

## 1. Communication & Style
* **Language:** Explanations, concepts, and interaction are in **German** by default.
* **Technical Context:** Code examples, API definitions, error messages, and technical feedback are strictly in **English**.
* **Style:** Precise, solution-oriented, and direct (Senior Software Engineer level).
* **Git Workflow:** Code must be committed and pushed in **small, logical, and self-contained groups**.
* **Autonomous PRs:** Upon completion of a task, the AI is required to proactively prepare and create a Pull Request via the GitHub CLI (`gh pr create`).

## 2. Tech Stack & Architecture
* **Architecture:** Strictly decoupled stack communicating via REST API.
* **Backend:** Spring Boot 3 (Java 21, Maven), Spring Data JPA, H2 (Local Dev) / PostgreSQL (Test/Prod), Flyway Migrations, MapStruct, Lombok.
* **Frontend:** React 19 (Vite), TypeScript, Axios, i18next.
* **Design System:** "Playful Chaos" / "Neo-Dada" – Handwritten typography for headlines, warm canvas colors in Light Mode, irregular shapes, and intentional imperfection (rotations).

## 3. Infrastructure & Local Environment (Critical)
* **Containers:** **Podman** (Rootless) is used instead of Docker.
* **Testcontainers:** Singleton Container Strategy implemented in `AbstractIntegrationTest`.
* **Environment Variables:** `DOCKER_HOST`, `TESTCONTAINERS_RYUK_DISABLED` must be respected.

## 4. Backend Conventions & Fixes
* **Flyway vs JPA:** `spring.jpa.defer-datasource-initialization=false` is mandatory.
* **i18n:** Localization is handled in the Mapper via `@Context String locale`.
* **JPA Fetching:** Core entities use `FetchType.EAGER`.
* **Testing Mandate:** Automated tests are required for Security, Data Models, and Services.

## 5. Git Workflow (Branching Strategy)
* **Feature Isolation:** Every new development starts in a dedicated **feature branch**.
* **Synchronization:** Synchronize the branch with `master` (`git pull origin master`) before completion.
* **Pull Requests:** Merges are performed exclusively via Pull Requests.
* **AI Autonomy:** The AI is authorized and instructed to create Pull Requests autonomously via CLI once a task is locally completed and verified. The user performs the final review and merge.

## 6. Frontend Conventions
* **Styles:** CSS variables from `index.css`. Fonts: "Space Grotesk" (base), "Covered By Your Grace" (headlines).
* **PWA & Offline:** The app uses `vite-plugin-pwa` and `Dexie.js`. Data is cached locally and synchronized.
* **Assets:** Project images in `frontend/public/projects/`. Blog images under `/uploads/`.

## 7. Content Conventions (Blog)
* **Markdown:** Articles are rendered via `react-markdown`.
* **Language:** Blog content is flexible (DE, EN, ES).
* **Images:** Use relative paths (`/uploads/...`).

## 8. Documentation Hygiene
* **Accuracy:** Technical decisions must be documented in `.md` files immediately.
* **Cleanup:** Proactively delete outdated information or mark it as "Deprecated".

## 9. Coding Standards & Quality
* **TypeScript:** Usage of `any` is strictly prohibited.
* **Commits:** Conventional Commits standard (e.g., `feat: ...`, `fix: ...`).
* **Security:** Secrets exclusively via `.env` (local) or **GitHub Secrets** (production).

## 10. Deployment Security
* **Automation:** Deployments exclusively via the CI/CD pipeline.
* **Rootless:** Containers run under the user `jorchadmin`.

## 11. Native Image Best Practices (GraalVM)
* **AOT-Safety:** Avoid silent errors in `RuntimeHints`. Use `TypeReference` for runtime dependencies.
* **Completeness:** Reflection classes (e.g., for JJWT) must be registered precisely and completely.
