import { test, expect } from '@playwright/test';
import { mockEndpoint, setAuthenticatedState } from './utils';

test.beforeEach(async ({ page }) => {
  await setAuthenticatedState(page);
});

test('feed renders issues and filters work', async ({ page }) => {
  await mockEndpoint(page, /\/issues\/constituency\//, {
    issues: [
      { _id: '1', title: 'Road repair', detail: 'Fix road', status: 'pending', created_at: new Date().toISOString(), upvotes: 2, locality: 'Town' },
      { _id: '2', title: 'Water supply', detail: 'Water shortage', status: 'resolved', created_at: new Date().toISOString(), upvotes: 5, locality: 'Ward 2' },
    ],
  });

  await page.goto('/issues');

  await expect(page.getByRole('heading', { name: 'Road repair' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Water supply' })).toBeVisible();

  await page.getByRole('button', { name: 'Most Popular' }).click();
  await page.getByRole('button', { name: 'By Category' }).click();
  await page.locator('select').first().selectOption('water');
  await expect(page.getByRole('heading', { name: 'Water supply' })).toBeVisible();
});

test('empty state shown when no issues', async ({ page }) => {
  await mockEndpoint(page, /\/issues\/constituency\//, { issues: [] });
  await page.goto('/issues');
  await expect(page.getByText(/No issues found/i)).toBeVisible();
});

test('error loading issues falls back to empty UI', async ({ page }) => {
  await page.route(/\/issues\/constituency\//, async (route) => {
    await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'Server error' }) });
  });
  await page.goto('/issues');
  await expect(page.getByText(/No issues/i)).toBeVisible();
});










