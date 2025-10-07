import { test, expect } from '@playwright/test';
import { API_BASE, mockEndpoint, clearAuth } from './utils';

test.beforeEach(async ({ page }) => {
  await clearAuth(page);
});

test('login success redirects based on role and shows toast', async ({ page }) => {
  await mockEndpoint(page, '/auth/login/email', {
    token: 'jwt-token',
    user: {
      name: 'Citizen User',
      role: 'citizen',
      constituency_id: 'TVM001',
      constituency_name: 'Thiruvananthapuram',
    },
  });

  await page.goto('/login');
  await page.getByLabel('Email Address').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page).toHaveURL(/\/issues/);
});

test('login error shows alert', async ({ page }) => {
  await page.route(`${API_BASE}/auth/login/email`, async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Invalid credentials' }),
    });
  });

  await page.goto('/login');
  await page.getByLabel('Email Address').fill('wrong@example.com');
  await page.getByLabel('Password').fill('badpass');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page.getByText('Invalid credentials')).toBeVisible();
});










