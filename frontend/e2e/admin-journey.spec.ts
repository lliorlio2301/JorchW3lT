import { test, expect } from '@playwright/test';

test.describe('Admin User Journey', () => {
  test('should log in and create a new note', async ({ page }) => {
    // 1. Global API Mocking to prevent proxy errors
    // This catches everything under /api/ and returns a default 200/[] if not matched below
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
        // Fallback for all other API calls (like /api/shopping-list)
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    // 2. Go to Login Page
    await page.goto('/login');
    
    // 3. Perform Login
    await page.fill('input[id="username"]', 'admin');
    await page.fill('input[id="password"]', 'password');
    await page.click('.login-button');

    // 4. Wait for redirect to shopping page (default after login)
    await expect(page).toHaveURL(/.*shopping/);

    // 5. Navigate to Notes
    await page.goto('/notes');
    
    // Use the class name for the add button which is unique
    const addNoteBtn = page.locator('.add-note-btn');
    await expect(addNoteBtn).toBeVisible();

    // 6. Create a new Note
    await addNoteBtn.click();
    
    // Wait for the editor to be visible
    const titleInput = page.locator('.editor-title-input');
    await expect(titleInput).toBeVisible();
    await titleInput.fill('E2E Test Note');
    
    // First note item input
    await page.fill('.note-item-input', 'Check me!');
    
    // Save button
    const saveBtn = page.locator('.editor-actions button').first();
    await saveBtn.click();

    // 7. Verify the new note appears in the sidebar
    // We use a more flexible locator to ensure the text is found
    const sidebarNote = page.locator('.note-summary-card h3');
    await expect(sidebarNote).toHaveText(/E2E Test Note/i);
  });
});
