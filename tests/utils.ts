import { Page, APIRequestContext, expect } from '@playwright/test';

export const API_BASE = 'http://localhost:3333/api';

export async function setAuthenticatedState(page: Page, user?: any) {
  const defaultUser = {
    name: 'Test User',
    role: 'citizen',
    constituency_id: 'TVM001',
    constituency_name: 'Thiruvananthapuram',
    panchayat_id: 'KOV001',
    panchayat_name: 'Kovalam Panchayat',
    ward_no: 'Ward 1',
    ward_name: 'Ward 1',
  };
  await page.addInitScript(([u]) => {
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('user_data', JSON.stringify(u));
  }, [user ?? defaultUser]);
}

export async function clearAuth(page: Page) {
  await page.addInitScript(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  });
}

export function mockEndpoint(
  page: Page,
  path: string | RegExp,
  response: any,
  status: number = 200,
) {
  return page.route(
    (url) => {
      if (typeof path === 'string') return url.toString() === `${API_BASE}${path}`;
      return path.test(url.toString());
    },
    async (route) => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    },
  );
}

export async function expectToast(page: Page, text: RegExp | string) {
  await expect(page.getByText(text)).toBeVisible();
}










