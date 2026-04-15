# Agent Interaction Guidelines (Universal)

This document serves as a binding guideline for all AI agents and LLM-based CLIs working on this repository. It ensures consistency in quality, communication, and workflow across different models.

## 1. Core Workflow & Communication
* **Primary Language:** All communication, explanations, and documentation are strictly in **English**.
* **Direct Action:** Follow a "Research -> Strategy -> Execution" cycle. Be proactive and decisive.
* **Proactive PRs:** Agents are authorized and required to create Pull Requests via CLI (`gh pr create`) immediately after completing and verifying a task.

## 2. Technical Stack
* **Backend:** Spring Boot 3 (Java 21, Maven), PostgreSQL/H2, Flyway.
* **Frontend:** React 19 (Vite), TypeScript, Axios, i18next.
* **Infra:** Podman (Rootless), GitHub Actions CI/CD.

## 3. Git & Branching Strategy
* **Branching:** Every task MUST start in a dedicated `feature/` or `fix/` branch.
* **Commits:** Follow **Conventional Commits** (e.g., `feat: ...`, `fix: ...`).
* **Pull Requests:** Merging is only allowed via Pull Requests. Direct pushes to `master` are prohibited.
* **Verification:** Always run available tests, linters, and type-checks before pushing and creating a PR.

## 4. Coding Standards
* **TypeScript:** Usage of `any` is strictly forbidden. Use precise interfaces and types.
* **Backend:** Use MapStruct for DTO mapping and Lombok to reduce boilerplate.
* **Security:** Never log or commit secrets. Use environment variables.
* **Quality:** Prioritize clean, idiomatic code over complex workarounds.

## 5. Local Environment (Critical)
* Use `DOCKER_HOST` for Podman compatibility.
* Respect the singleton container strategy in `AbstractIntegrationTest`.
* Use the `dev` profile for local development to ensure fast startup times.

## 6. Documentation Hygiene
* Update `ROADMAP.md` immediately after completing significant milestones.
* Document all architectural decisions or changes in `docs/` or relevant `.md` files.

---
*Note: This file mirrors the core principles defined in GEMINI.md to ensure absolute cross-model compatibility and standard compliance.*
