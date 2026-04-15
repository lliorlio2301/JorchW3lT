# Agent Interaction Guidelines (Universal)

Diese Datei dient als verbindliche Richtlinie für alle KI-Agenten und LLM-basierten CLIs, die an diesem Repository arbeiten. Sie stellt die Konsistenz zwischen verschiedenen Modellen sicher.

## 1. Core Workflow & Communication
* **Primary Language:** Explanations and documentation in **German**.
* **Technical Context:** Code, API definitions, and error messages strictly in **English**.
* **Direct Action:** Follow a "Research -> Strategy -> Execution" cycle.
* **Proactive PRs:** Agents are authorized and required to create Pull Requests via CLI (`gh pr create`) after completing and verifying a task.

## 2. Technical Stack
* **Backend:** Spring Boot 3 (Java 21, Maven), PostgreSQL/H2, Flyway.
* **Frontend:** React 19 (Vite), TypeScript, Axios, i18next.
* **Infra:** Podman (Rootless), GitHub Actions CI/CD.

## 3. Git & Branching Strategy
* **Branching:** Every task starts in a dedicated `feature/` or `fix/` branch.
* **Commits:** Follow **Conventional Commits** (e.g., `feat: ...`, `fix: ...`).
* **Pull Requests:** Merging is only allowed via Pull Requests. No direct pushes to `master`.
* **Verification:** Always run available tests/linters before pushing and creating a PR.

## 4. Coding Standards
* **TypeScript:** No usage of `any`. Strict typing is mandatory.
* **Backend:** Use MapStruct for DTO mapping and Lombok for boilerplate.
* **Security:** Never hardcode secrets. Use `.env` or GitHub Secrets.
* **Quality:** Prioritize readability and maintainability over "clever" hacks.

## 5. Local Environment (Critical)
* Use `DOCKER_HOST` for Podman compatibility.
* Respect `AbstractIntegrationTest` singleton container strategy.
* Use `application-dev.properties` for local development.

## 6. Documentation Hygiene
* Update `ROADMAP.md` after completing significant milestones.
* Document architectural decisions in `docs/` or `.md` files immediately.

---
*Note: This file is a mirror of the core principles defined in GEMINI.md to ensure cross-model compatibility.*
