#!/usr/bin/env bash
set -euo pipefail

# Environment variables for E2E tests
export E2E_BASE_URL="http://localhost:8080/openmrs"
export E2E_USER_ADMIN_USERNAME="admin"
export E2E_USER_ADMIN_PASSWORD="Admin123"
export E2E_LOGIN_DEFAULT_LOCATION_UUID="44c3efb0-2583-4c80-a79e-1f756a03c0a1"

# Run Playwright tests
npx playwright test "$@"