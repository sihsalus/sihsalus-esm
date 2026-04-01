import { expect } from '@playwright/test';
import { test } from '../core';
import { HomePage } from '../pages';

test('Basic walkthrough tutorial', async ({ page }) => {
  const homePage = new HomePage(page);

  await test.step('When I visit the home page', async () => {
    await homePage.goto();
  });

  await test.step('And I click on the help menu button', async () => {
    await page.locator('[id*="esm-help-menu-app"]').getByRole('button').click();
  });

  await test.step('And I click on the tutorials button', async () => {
    await page.getByText(/tutorials/i).click();
  });

  await test.step('Then I should see the tutorial modal', async () => {
    await expect(page.getByRole('heading', { name: 'Tutorials' })).toBeVisible();
    await expect(
      page.getByText(/find walkthroughs and video tutorials on some of the core features of openMRS./i),
    ).toBeVisible();
  });

  await test.step('And I click on the Basic Overview Tutorial', async () => {
    await page.locator('li').filter({ hasText: 'Basic Overview' }).getByText('Walkthrough').click();
  });

  await test.step('Then I should see the first Joyride tooltip', async () => {
    await expect(
      page.getByText(
        'Welcome to OpenMRS! This is the main dashboard where you can navigate to various features of the system.',
      ),
    ).toBeVisible();
  });

  await test.step('And I click the next button', async () => {
    await page.getByRole('button', { name: /next/i }).click();
  });

  await test.step('Then I should see the search icon Joyride tooltip', async () => {
    await expect(
      page.getByText('This is the search icon. Use it to find patients in the system quickly.'),
    ).toBeVisible();
  });

  await test.step('And I click the next button', async () => {
    await page.getByRole('button', { name: /next/i }).click();
  });

  await test.step('Then I should see the add patient icon Joyride tooltip', async () => {
    await expect(
      page.getByText('This is the add patient icon. Click here to register a new patient into the system.'),
    ).toBeVisible();
  });

  await test.step('And I click the next button', async () => {
    await page.getByRole('button', { name: /next/i }).click();
  });

  await test.step('Then I should see the user icon Joyride tooltip', async () => {
    await expect(
      page.getByText('The user icon. Click here to change your user preferences and settings.'),
    ).toBeVisible();
  });

  await test.step('And I click the finish button', async () => {
    await page.getByRole('button', { name: /last/i }).click();
  });
});
