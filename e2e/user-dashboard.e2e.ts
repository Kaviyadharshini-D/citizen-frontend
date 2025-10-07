import { test, expect } from '@playwright/test';
import { API_BASE, mockEndpoint, setAuthenticatedState } from './utils';

test.beforeEach(async ({ page }) => {
  await setAuthenticatedState(page);
});

test('submit issue success shows toast and resets form', async ({ page }) => {
  await mockEndpoint(page, /\/issues\/constituency\//, { issues: [] });
  await page.route(`${API_BASE}/issues`, async (route) => {
    const request = route.request();
    expect(request.method()).toBe('POST');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, issue: { _id: 'i1' } }),
    });
  });

  await page.goto('/');
  const title = page.getByPlaceholder('Brief description of the issue...');
  await expect(title).toBeVisible();
  await title.fill('Pothole on main road');
  await page.getByPlaceholder('Provide detailed information about the issue...').fill('Large pothole causing traffic issues');
  await page.getByPlaceholder('Specific location or address...').fill('MG Road');
  await page.getByRole('button', { name: 'Submit Issue' }).click();

  await expect(page.getByText(/Issue submitted successfully/i)).toBeVisible();
  await expect(page.getByPlaceholder('Brief description of the issue...')).toHaveValue('');
});

test('submit issue error shows error toast', async ({ page }) => {
  await mockEndpoint(page, /\/issues\/constituency\//, { issues: [] });
  await page.route(`${API_BASE}/issues`, async (route) => {
    await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'Server error' }) });
  });

  await page.goto('/');
  const title = page.getByPlaceholder('Brief description of the issue...');
  await expect(title).toBeVisible();
  await title.fill('Pothole');
  await page.getByPlaceholder('Provide detailed information about the issue...').fill('Large pothole');
  await page.getByPlaceholder('Specific location or address...').fill('MG Road');
  await page.getByRole('button', { name: 'Submit Issue' }).click();

  await expect(page.getByText(/Server error|Please try again/i)).toBeVisible();
});

test('form validations show inline toasts and prevent submit', async ({ page }) => {
  await mockEndpoint(page, /\/issues\/constituency\//, { issues: [] });
  await page.goto('/');
  const submit = page.getByRole('button', { name: 'Submit Issue' });
  await expect(submit).toBeVisible();
  await submit.click();
  await expect(page.getByText(/Please enter a title/i)).toBeVisible();
});










