import { test, expect } from '@playwright/test'

test.describe('Admin login', () => {
  test('renders login form', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByPlaceholder('Email')).toBeVisible()
    await expect(page.getByPlaceholder('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  test('shows error on wrong credentials', async ({ page }) => {
    await page.goto('/admin')
    await page.getByPlaceholder('Email').fill('wrong@example.com')
    await page.getByPlaceholder('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign In' }).click()
    // Any auth failure (including network error with fake Supabase URL) shows the generic message
    await expect(page.getByRole('alert')).toContainText('Invalid email or password.', { timeout: 10_000 })
  })
})
