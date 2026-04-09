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
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6NDEwMjQ0NDgwMH0.signature',
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
              content: '# Markdown Content\nCheck me!',
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
    
    // Markdown Textarea
    const textarea = page.locator('.note-textarea');
    await textarea.fill('# Markdown Content\nCheck me!');
    
    // 6. Save and wait for Response
    const saveResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/notes') && response.request().method() === 'POST'
    );
    
    await page.locator('.save-btn').click();
    
    await saveResponsePromise;

    // 7. Verify the Sidebar
    const sidebarNote = page.locator('.note-summary-card h3').filter({ hasText: 'E2E Test Note' });
    await expect(sidebarNote).toBeVisible({ timeout: 10000 });
    
    // 8. Verify Preview
    // After saving, it should switch to view mode
    await expect(page.locator('.note-preview')).toBeVisible();
    await expect(page.locator('.note-preview')).toContainText('Markdown Content');
  });
});
