import { test, expect } from '@playwright/test';
import { API_BASE, mockEndpoint, clearAuth } from './utils';

test.beforeEach(async ({ page }) => {
  await clearAuth(page);
});

test('signup success with email flow', async ({ page }) => {
  await mockEndpoint(page, '/constituencies', {
    success: true,
    message: 'ok',
    data: [
      { _id: '1', name: 'Thiruvananthapuram', constituency_id: 'TVM001', createdAt: '', updatedAt: '' },
    ],
  });

  await mockEndpoint(page, /\/panchayats\/constituency\//, {
    success: true,
    message: 'ok',
    data: [
      { _id: 'p1', name: 'Kovalam Panchayat', ward_list: [{ _id: 'w1', ward_name: 'Ward 1' }] },
    ],
  });

  await mockEndpoint(page, '/auth/signup/email', {
    token: 'jwt-token',
    user: {
      name: 'New User',
      role: 'citizen',
      constituency_id: '1',
      panchayat_id: 'p1',
      ward_no: 'Ward 1',
    },
  });

  await page.goto('/signup');
  await expect(page.getByRole('heading', { name: /Create Your Account|Complete Your Profile/ })).toBeVisible();

  await page.getByLabel('Full Name').fill('New User');
  await page.getByLabel('Email Address').fill('new@user.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByLabel('Phone Number').fill('+91 9999999999');
  await page.getByRole('button', { name: 'Next Step' }).click();

  const constituencyTrigger = page.getByRole('button').filter({ hasText: /Select your constituency|Thiruvananthapuram/ }).first();
  await constituencyTrigger.click();
  await page.getByRole('option', { name: 'Thiruvananthapuram' }).click();

  const panchayatTrigger = page.getByRole('button').filter({ hasText: /Select your panchayat|Select panchayat first|Kovalam Panchayat/ }).first();
  await panchayatTrigger.click();
  await page.getByRole('option', { name: 'Kovalam Panchayat' }).click();

  const wardTrigger = page.getByRole('button').filter({ hasText: /Select your ward|Ward 1/ }).first();
  await wardTrigger.click();
  await page.getByRole('option', { name: 'Ward 1' }).click();

  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page).toHaveURL(/\/issues/);
});

test('signup error shows alert', async ({ page }) => {
  await mockEndpoint(page, '/constituencies', { success: true, message: 'ok', data: [] });

  await page.route(`${API_BASE}/auth/signup/email`, async (route) => {
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Email already exists' }),
    });
  });

  await page.goto('/signup');
  await expect(page.getByRole('heading', { name: /Create Your Account|Complete Your Profile/ })).toBeVisible();

  await page.getByLabel('Full Name').fill('New User');
  await page.getByLabel('Email Address').fill('duplicate@user.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByLabel('Phone Number').fill('+91 9999999999');
  await page.getByRole('button', { name: 'Next Step' }).click();

  const createBtn = page.getByRole('button', { name: 'Create Account' });
  await expect(createBtn).toBeVisible();
  await createBtn.click();

  await expect(page.getByText(/Email already exists/i)).toBeVisible();
});










