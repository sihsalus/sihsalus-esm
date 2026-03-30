![Node.js CI](https://github.com/openmrs/openmrs-esm-template-app/workflows/Node.js%20CI/badge.svg)

# Reports Module

`openmrs-esm-reports-app` is a modular reporting solution for O3, providing tools to manage report executions and schedules.

## Features

- `Report Execution Overview`: Monitor execution history including queued reports, with options to execute specific reports, preserve, download, or delete completed executions

- `Schedule Management`: View execution schedules with capabilities to view, edit, or delete existing schedules
The Reports app is available in the app switcher menu under the `Reports` entry.

## Setup

See the guidance in the [Developer Documentation](https://o3-docs.openmrs.org/docs/frontend-modules/development#installing-dependencies).

This repository uses Yarn.

To run a dev server for this package, run

```bash
yarn start --sources 'packages/esm-reports-app'
