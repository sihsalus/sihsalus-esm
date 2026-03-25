# SIH Salus Frontend Web

Turborepo-powered monorepo for the **SIH Salus Hospital Information System** — an offline-first, FHIR-compliant, HIPAA-compliant frontend serving ~30,000 inhabitants across 112 native Amazonian communities along 500+ km of the Napo River (Peru).

Built on [OpenMRS 3.x](https://openmrs.org/) with the single-spa microfrontend architecture.

## Prerequisites

- **Node.js** >= 20
- **Yarn** 4.13.0 (via Corepack: `corepack enable && corepack prepare yarn@4.13.0 --activate`)
- **Docker** (for containerized deployment)

## Quick Start

```bash
# Clone
git clone https://github.com/sihsalus/frontend-web.git
cd frontend-web

# Install dependencies
yarn install

# Build all packages
yarn build

# Start dev server (requires OpenMRS backend at localhost:8080)
yarn start
# or with explicit backend URL:
yarn openmrs develop --backend http://localhost:8080/openmrs --port 9090
```

## Repository Structure

```
packages/
  tooling/
    openmrs/                            # CLI (openmrs develop, build, assemble)
    webpack-config/                     # Shared webpack configuration
    rspack-config/                      # Rspack configuration (experimental)
  apps/                                 # 41 frontend modules (esm-*-app)
  libs/
    rbac/                               # @sihsalus/rbac — HIPAA role-based access control
    fhir-client/                        # @sihsalus/fhir-client — Typed FHIR R4 client
    audit-logger/                       # @sihsalus/audit-logger — Client-side audit logging
    keycloak-auth/                      # @sihsalus/keycloak-auth — Keycloak OIDC adapter
    constants/                          # @sihsalus/constants — Centralized UUIDs and constants
    esm-patient-common-lib/             # @openmrs/esm-patient-common-lib — Shared patient utilities
  tools/                                # Test utilities (setup-tests, test-utils)
scripts/
  assemble-importmap.js                 # Import map assembly for SPA build
  fix-workspace-deps.js                 # Workspace dependency fixer
e2e/                                    # Playwright E2E tests
docs/                                   # Architecture docs and ADRs
```

> **Note:** The OpenMRS framework (`@openmrs/esm-framework`) and app shell (`@openmrs/esm-app-shell`) are consumed as npm dependencies, not vendored in this repo.

## Commands

### Development

```bash
yarn setup                                  # Install + build all
yarn start                                  # Dev server (openmrs develop)
yarn openmrs develop --sources <path>       # Dev server with specific module(s)
```

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
docker build -t sihsalus/frontend-web .
```

Nginx / reverse proxy configuration is managed in the infra repo (`sihsalus-distro-referenceapplication`).

## Architecture

- **Turborepo** orchestrates builds across ~50 packages with caching
- **Yarn 4 (Berry)** manages dependencies with `node-modules` linker
- **single-spa** orchestrates microfrontend modules at runtime via import maps
- **Webpack Module Federation** enables shared dependencies across modules
- **Carbon Design System** (v11) is the primary UI framework
- **FHIR R4** preferred for data access (`/ws/fhir2/R4/`)
- **Service worker** enables offline-first operation

## SIH Salus Module Overrides

| SIH Salus Module (`@sihsalus/*`) | Replaces Upstream (`@openmrs/*`) |
|---|---|
| `esm-patient-registration-app` | `@openmrs/esm-patient-registration-app` |
| `esm-patient-search-app` | `@openmrs/esm-patient-search-app` |
| `esm-billing-app` | `@openmrs/esm-billing-app` |
| `esm-patient-immunizations-app` | `@openmrs/esm-patient-immunizations-app` |

Custom modules with no upstream equivalent: `esm-coststructure-app`, `esm-dyaku-app`, `esm-fua-app`, `esm-indicadores-app`, `esm-maternal-and-child-health`, `esm-consulta-externa-app`, `esm-vacunacion-app`.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `SPA_PATH` | `/openmrs/spa` | Base path for SPA assets |
| `API_URL` | `/openmrs` | OpenMRS backend API base |
| `BACKEND_URL` | `http://backend:8080` | Backend URL for Nginx proxy |
| `SPA_DEFAULT_LOCALE` | `es` | Default locale |
| `SIHSALUS_AUTH_MODE` | `openmrs` | Auth mode: `openmrs` or `keycloak` |

## HIPAA Compliance

- **RBAC** (`@sihsalus/rbac`): Role-based access control at component and route level
- **Audit logging** (`@sihsalus/audit-logger`): PHI access event logging with offline fallback
- **Session timeout**: 15-minute idle timeout with warning
- **Break the glass**: Emergency access with mandatory clinical justification
- **TLS 1.2+**: Enforced at the infrastructure layer

## i18n

Supported locales: `en`, `es`, plus Amazonian languages (Kichwa, Secoya). Each module keeps translations in `src/translations/{locale}.json`.

## License

[MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)
