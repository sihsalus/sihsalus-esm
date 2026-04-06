# SIH Salus Frontend Web — Documentation

This directory contains architecture documentation and decision records for the SIH Salus frontend monorepo.

## Contents

- ADRs — Architecture Decision Records (pending, not yet created)

## Architecture Overview

SIH Salus is a Hospital Information System built as a **Turborepo monorepo** with **single-spa** microfrontend architecture on top of **OpenMRS 3.x**, using **Rspack** as the bundler.

### Key Design Decisions

- **Framework as dependency**: The OpenMRS framework (`@openmrs/esm-framework`) and app shell (`@openmrs/esm-app-shell`) are consumed as npm packages, not vendored. This simplifies upgrades and reduces maintenance burden.
- **Yarn Berry with node-modules linker**: PnP is disabled (`nodeLinker: node-modules`) for compatibility with the OpenMRS toolchain and Webpack Module Federation.
- **Import map overrides**: SIH Salus modules (`@sihsalus/*`) override their upstream OpenMRS counterparts at runtime via the import map, allowing customization without forking.
- **Offline-first**: Service worker caching and a sync queue ensure the app works in low-connectivity environments (satellite link, 3G).

### Package Organization

| Directory                    | Contents                                                                                           |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| `packages/apps/`             | 41 frontend ESM modules (upstream + custom)                                                        |
| `packages/libs/`             | 6 shared libraries (RBAC, FHIR client, audit logger, Keycloak auth, constants, patient-common-lib) |
| `packages/tooling/`          | Build scripts and local dev tooling (import map assembly, dev server, i18n parser)                 |
| `packages/__mocks__/`        | Shared Jest mocks                                                                                  |
| `packages/declarations.d.ts` | Global TypeScript declarations                                                                     |
| `packages/jest.config.js`    | Root Jest config                                                                                   |
| `packages/tsconfig.json`     | Root TypeScript config                                                                             |
| `e2e/`                       | Playwright E2E tests                                                                               |

### Module Types

**SIH Salus overrides** — custom modules that replace upstream OpenMRS equivalents:
- `esm-patient-registration-app`
- `esm-patient-search-app`
- `esm-billing-app` (upstream removed)
- `esm-vacunacion-app` (MINSA vaccination schedule, replaces upstream `esm-patient-immunizations-app`)

**SIH Salus custom** — modules with no upstream equivalent:
- `esm-coststructure-app` — Cost structure management
- `esm-dyaku-app` — FHIR sync for remote communities
- `esm-fua-app` — FUA (Formato Unico de Atención) integration
- `esm-indicadores-app` — MINSA reporting indicators
- `esm-maternal-and-child-health` — CRED (child growth and development)
- `esm-consulta-externa-app` — Outpatient consultation
- `esm-vacunacion-app` — Vaccination management

### Data Access Strategy

- **FHIR R4** (`/ws/fhir2/R4/`) is the preferred API for all new development
- **REST** (`/ws/rest/v1/`) is used where FHIR endpoints don't exist (visits, form engine, concept dictionary, queue management, stock management, billing)
- Typed wrappers are provided by `@sihsalus/fhir-client`

### Security (HIPAA)

- `@sihsalus/rbac` — Role-based access control with `<RequirePrivilege>` component and `useRequirePrivilege()` hook
- `@sihsalus/audit-logger` — Client-side PHI access audit trail with offline fallback
- `@sihsalus/keycloak-auth` — Optional Keycloak OIDC integration (toggle via `SIHSALUS_AUTH_MODE`)
- 15-minute session timeout with warning dialog
- Break-the-glass emergency access with clinical justification

## Contributing

See the root [README.md](../README.md) for setup instructions and development commands.
