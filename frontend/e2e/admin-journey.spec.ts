import { test, expect } from '@playwright/test';

test.describe('Admin User Journey', () => {
  test('should log in and create a new note', async ({ page }) => {
    // 1. Global API Mocking
    await page.route('**/api/**', async (route) => {
      const url = route.request().url();
      const method = route.request().method();

      if (url.includes('/api/auth/login')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            token: 'fake-jwt-token',
            username: 'admin',
            role: 'ADMIN'
          })
        });
      } else if (url.includes('/api/notes')) {
        if (method === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([])
          });
        } else if (method === 'POST') {
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({
              id: 123,
              title: 'E2E Test Note',
              noteItems: [{ text: 'Check me!', completed: false, isChecklist: true }],
              createdAt: new Date().toISOString()
            })
          });
        }
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    // 2. Login
    await page.goto('/login');
    await page.fill('input[id="username"]', 'admin');
    await page.fill('input[id="password"]', 'password');
    await page.click('.login-button');

    // 3. Wait for Navigation
    await expect(page).toHaveURL(/.*shopping/);

    // 4. Navigate to Notes
    await page.goto('/notes');
    
    // 5. Create a new Note
    const addNoteBtn = page.locator('.add-note-btn');
    await expect(addNoteBtn).toBeVisible();
    await addNoteBtn.click();
    
    // Fill content
    const titleInput = page.locator('.editor-title-input');
    await expect(titleInput).toBeVisible();
    await titleInput.fill('E2E Test Note');
    
    const itemInput = page.locator('.note-item-input').first();
    await itemInput.fill('Check me!');
    
    // 6. Save and wait for Response
    // We wait for the POST request to complete before checking the sidebar
    const saveResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/notes') && response.request().method() === 'POST'
    );
    
    // The save button is the first button in editor-actions
    await page.locator('.editor-actions button').first().click();
    
    await saveResponsePromise;

    // 7. Verify the Sidebar
    // Increase timeout and use a robust locator
    const sidebarNote = page.locator('.note-summary-card h3').filter({ hasText: 'E2E Test Note' });
    await expect(sidebarNote).toBeVisible({ timeout: 10000 });
  });
});
