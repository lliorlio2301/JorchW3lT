# Backend (Spring Boot 3 + Java 21)

Dieses Modul stellt die REST-API für Portfolio, Blog, Notizen, Galerie, Kurzgeschichten und Authentifizierung bereit.

## Voraussetzungen

- Java 21
- Maven Wrapper (`./mvnw`)

## Lokale Entwicklung

Dev-Profil (H2 In-Memory, schnelle Starts):

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Default/Produktionsnahes Profil (PostgreSQL via Environment):

```bash
./mvnw spring-boot:run
```

## Tests

```bash
./mvnw test
```

Hinweis für Testcontainers in Rootless-Umgebungen (Podman):

- `DOCKER_HOST` auf den Podman Socket setzen
- `TESTCONTAINERS_RYUK_DISABLED=true` verwenden

## Build

JAR Build:

```bash
./mvnw clean package
```

Native Build (GraalVM Profile):

```bash
./mvnw -Pnative clean package
```

## Relevante Konventionen

- Flyway Migrationen sind führend; Hibernate validiert Schema (`ddl-auto=validate`).
- `spring.jpa.defer-datasource-initialization=false` muss gesetzt bleiben.
- Mapper-basierte Lokalisierung über `@Context String locale`.

## Weitere Doku

- Infrastruktur: `../docs/infrastructure.md`
- Testing: `../docs/testing.md`
- Projektüberblick: `../README.md`
