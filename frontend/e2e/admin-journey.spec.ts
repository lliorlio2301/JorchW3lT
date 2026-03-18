import { test, expect } from '@playwright/test';

test.describe('Admin User Journey', () => {
  test('should log in and create a new note', async ({ page }) => {
    // 1. Mock the API calls
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'fake-jwt-token',
          username: 'admin',
          role: 'ADMIN'
        })
      });
    });

    await page.route('**/api/notes', async (route) => {
        const method = route.request().method();
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
    });

    // 2. Go to Login Page
    await page.goto('/login');
    
    // 3. Perform Login
    await page.fill('input[id="username"]', 'admin');
    await page.fill('input[id="password"]', 'password');
    await page.click('.login-button');

    // 4. Verify redirect to shopping page
    await expect(page).toHaveURL(/.*shopping/);

    // 5. Navigate to Notes
    await page.goto('/notes');
    
    // Use the class name for the add button which is unique
    const addNoteBtn = page.locator('.add-note-btn');
    await expect(addNoteBtn).toBeVisible();

    // 6. Create a new Note
    await addNoteBtn.click();
    
    // Title input
    await page.fill('.editor-title-input', 'E2E Test Note');
    
    // First note item input
    await page.fill('.note-item-input', 'Check me!');
    
    // Save button - search by text in the editor-actions div
    const saveBtn = page.locator('.editor-actions button').first();
    await saveBtn.click();

    // 7. Verify the new note appears in the sidebar
    const sidebarNote = page.locator('.note-summary-card h3');
    await expect(sidebarNote).toContainText('E2E Test Note');
  });
});
