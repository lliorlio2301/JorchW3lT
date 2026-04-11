import { test, expect } from '@playwright/test';
test.describe('Account Management Journey', () => {
  test('should allow changing username and password', async ({ page }) => {
    // 1. Mock API
    await page.route('**/api/**', async (route) => {
      const url = route.request().url();
      const method = route.request().method();

      if (url.includes('/api/auth/login')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ 
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6NDEwMjQ0NDgwMH0.signature', 
            username: 'admin', 
            role: 'ADMIN' 
          })
        });
      } else if (url.includes('/api/user/update-username') || url.includes('/api/user/update-password')) {
        await route.fulfill({ status: 200 });
      } else {
        await route.fulfill({ status: 200, body: JSON.stringify([]) });
      }
    });

    // 2. Login
    await page.goto('/login');
    await page.fill('input[id="username"]', 'admin');
    await page.fill('input[id="password"]', 'password');
    await page.click('.login-button');

    // Wait for the auth state to settle by checking for the default post-login redirect
    await expect(page).toHaveURL(/.*shopping/);

    // 3. Navigate to Account
    await page.goto('/account');
    await expect(page.locator('h1')).toContainText(/Account/i);

    // 4. Change Username
    await page.fill('input[placeholder*="Neuer Benutzername"]', 'newadmin');
    await page.click('[data-testid="save-username-btn"]');
    await expect(page.locator('.message-banner.success')).toBeVisible();

    // 5. Change Password
    await page.fill('input[placeholder*="Neues Passwort"]', 'newpassword');
    await page.fill('input[placeholder*="Passwort bestätigen"]', 'newpassword');
    await page.click('[data-testid="save-password-btn"]');
    await expect(page.locator('.message-banner.success')).toBeVisible();
  });
});
