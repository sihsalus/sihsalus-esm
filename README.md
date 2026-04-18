# SIH Salus ESM

Turborepo-powered monorepo for the **SIH Salus Hospital Information System** — an offline-first, FHIR-compliant, HIPAA-compliant frontend serving ~30,000 inhabitants across 112 native Amazonian communities along 500+ km of the Napo River (Peru).

Built on [OpenMRS 3.x](https://openmrs.org/) with the single-spa microfrontend architecture.

## Prerequisites

- **Node.js** 24 LTS
- **Yarn** 4.13.0 (via Corepack: `corepack enable && corepack prepare yarn@4.13.0 --activate`)
- **Docker** (for containerized deployment)

## Quick Start

```bash
# 1. Clonar e instalar
git clone git@github.com:sihsalus/sihsalus-esm.git
cd sihsalus-esm
corepack enable          # activa la versión de Yarn incluida en .yarn/releases/
nvm use                  # usa la versión definida en .nvmrc
yarn install

# 2. Configurar entorno (opcional — tiene defaults apuntando al servidor dev)
cp .env.example .env     # editar si se necesita apuntar a otro backend

# 3. Levantar el dev server
yarn clean && yarn build && yarn assemble
SIHSALUS_DEV_APPS=esm-login-app,esm-home-app yarn start
# → http://localhost:8080/openmrs/spa/

You can also specify the port with the flag
SIHSALUS_PORT=3000 SIHSALUS_DEV_APPS=esm-login-app,esm-home-app yarn start
# → http://localhost:3000/openmrs/spa/
```

El dev server hace proxy de las peticiones de API al backend definido en `SIHSALUS_BACKEND_URL` (ver [.env.example](.env.example)).

## Repository Structure

```
packages/
  __mocks__/                            # Shared Jest mocks
  declarations.d.ts                     # Global declarations for TS
  jest.config.js                        # Root Jest configuration
  tsconfig.json                         # Root TypeScript configuration
  tooling/
    openmrs/                            # CLI (openmrs develop, build, assemble)
    rspack-config/                      # Shared Rspack configuration
  apps/                                 # 57 frontend modules (esm-*-app)
  libs/
    esm-rbac/                           # @sihsalus/esm-rbac — HIPAA role-based access control
    esm-audit-logger/                   # @sihsalus/esm-audit-logger — Client-side PHI audit logging
    esm-sihsalus-shared/                # @sihsalus/esm-sihsalus-shared — Shared UI components and hooks
    esm-patient-common-lib/             # @openmrs/esm-patient-common-lib — Shared patient utilities
    esm-styleguide/                     # @openmrs/esm-styleguide — Carbon-based component library
packages/tooling/
  assemble-importmap.js                 # Import map assembly for SPA build
  start-dev.js                          # Local dev server entrypoint
  i18next-parser.config.js               # i18n extraction config
e2e/                                    # Playwright E2E tests
docs/                                   # Architecture docs and ADRs
```

> **Note:** The OpenMRS framework (`@openmrs/esm-framework`) and app shell (`@openmrs/esm-app-shell`) are consumed as npm dependencies, not vendored in this repo.

## Commands

### Development

```bash
yarn install                                # Instalar dependencias
yarn start                                  # Dev server → proxy a SIHSALUS_BACKEND_URL
SIHSALUS_BACKEND_URL=http://... yarn start  # Apuntar a otro backend en esta sesión
```

### Qué comando usar (`start` vs `serve` vs `serve:prod`)

- `yarn start` (**recomendado para desarrollo diario**) usa [packages/tooling/start-dev.js](packages/tooling/start-dev.js), que lanza `openmrs develop` con `--importmap` y `--routes`, y además sirve assets/chunks desde `dist/spa` mediante proxy.
- `yarn serve` ejecuta `openmrs start` directo (ver [package.json](package.json)) después de compilar apps. En esta base, `openmrs start` hace descubrimiento local de módulos compilados (`packages/apps/*/dist`) y genera importmap/rutas en memoria (ver [packages/tooling/openmrs/src/commands/start.ts](packages/tooling/openmrs/src/commands/start.ts)).
- `yarn serve:prod` compila todo + ejecuta `assemble-importmap.js` y luego `openmrs start`. El `dist/spa` generado queda como fallback estático durante el servido (también en [packages/tooling/openmrs/src/commands/start.ts](packages/tooling/openmrs/src/commands/start.ts)).

Resumen práctico:

- Para desarrollo local con hot-reload/control de módulos: `yarn start`.
- Para validar comportamiento de `openmrs start` con artefactos compilados: `yarn serve` / `yarn serve:prod`.

### Building

```bash
yarn build                                  # Build all packages
yarn build:apps                             # Build only app packages
yarn assemble                               # Assemble import map
yarn turbo run build --filter=<package>     # Build single package
```

### Testing

```bash
yarn test                                   # Run all unit tests
yarn turbo run test --filter='@sihsalus/*' # Test SIH Salus packages only
yarn test:e2e                               # Run Playwright E2E tests
```

### Quality

```bash
yarn lint                                   # ESLint all packages
yarn typecheck                              # TypeScript check all packages
yarn verify                                 # lint + typecheck + test
```

### Concurrency

This monorepo has 50+ packages. Avoid high concurrency on resource-constrained machines:

```bash
yarn turbo run build --concurrency=4
yarn turbo run test --filter=@openmrs/esm-login-app   # Single package
```

### Docker

```bash
docker build -t sihsalus/sihsalus-esm .
```

Nginx / reverse proxy configuration is managed in the infra repo (`sihsalus-distro-referenceapplication`).

## Architecture

- **Turborepo** orchestrates builds across ~50 packages with caching
- **Yarn 4 (Berry)** manages dependencies with `node-modules` linker
- **single-spa** orchestrates microfrontend modules at runtime via import maps
- **Rspack** (Webpack-compatible) is the bundler; Module Federation enables shared deps
- **Carbon Design System** (v11) is the primary UI framework
- **FHIR R4** preferred for data access (`/ws/fhir2/R4/`)
- **Service worker** enables offline-first operation

## SIH Salus Module Overrides

| SIH Salus Module (`@sihsalus/*`) | Replaces Upstream (`@openmrs/*`)         |
| -------------------------------- | ---------------------------------------- |
| `esm-patient-registration-app`   | `@openmrs/esm-patient-registration-app`  |
| `esm-patient-search-app`         | `@openmrs/esm-patient-search-app`        |
| `esm-billing-app`                | `@openmrs/esm-billing-app`               |
| `esm-vacunacion-app`             | `@openmrs/esm-patient-immunizations-app` |

Custom modules with no upstream equivalent: `esm-atencion-ambulatoria-app`, `esm-coststructure-app`, `esm-cred-app`, `esm-dyaku-app`, `esm-emergency-app`, `esm-ficha-familiar-app`, `esm-fua-app`, `esm-indicadores-app`, `esm-odontogram-app`, `esm-reports-app`, `esm-salud-materna-app`, `esm-vih-app`.

## Environment Variables

Crea un archivo `.env` en la raíz del repo (ver [.env.example](.env.example)):

| Variable               | Default                             | Descripción                                                            |
| ---------------------- | ----------------------------------- | ---------------------------------------------------------------------- |
| `SIHSALUS_BACKEND_URL` | `http://hii1sc-dev.inf.pucp.edu.pe` | Backend OpenMRS al que se hace proxy en dev y se descarga el importmap |
| `SIHSALUS_AUTH_MODE`   | `openmrs`                           | Modo de auth: `openmrs` (básico) o `keycloak` (OIDC)                   |
| `SIHSALUS_FHIR_BASE`   | *(derivado del backend)*            | URL base de FHIR R4                                                    |
| `SPA_PATH`             | `/openmrs/spa`                      | Base path para los assets del SPA                                      |
| `API_URL`              | `/openmrs`                          | Base path de la API de OpenMRS                                         |

## HIPAA Compliance

- **RBAC** (`@sihsalus/esm-rbac`): Role-based access control at component and route level
- **Audit logging** (`@sihsalus/esm-audit-logger`): PHI access event logging with offline fallback
- **Session timeout**: 15-minute idle timeout with warning
- **Break the glass**: Emergency access with mandatory clinical justification
- **TLS 1.2+**: Enforced at the infrastructure layer

## License

[MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)
