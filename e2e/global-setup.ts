import { request } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:8080/openmrs';

async function globalSetup() {
  const username = process.env.E2E_USER_ADMIN_USERNAME ?? 'admin';
  const password = process.env.E2E_USER_ADMIN_PASSWORD ?? 'Admin123';
  const locationUuid = process.env.E2E_LOGIN_DEFAULT_LOCATION_UUID ?? '44c3efb0-2583-4c80-a79e-1f756a03c0a1';

  const ctx = await request.newContext();
  const token = Buffer.from(`${username}:${password}`).toString('base64');

  const res = await ctx.post(`${BASE_URL}/ws/rest/v1/session`, {
    data: {
      sessionLocation: locationUuid,
      locale: 'es',
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
  });

  if (!res.ok()) {
    throw new Error(`Login failed (${res.status()}): ${await res.text()}`);
  }

  await ctx.storageState({ path: 'e2e/storage-state.json' });
  await ctx.dispose();
}

export default globalSetup;
