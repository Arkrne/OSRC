import { test, expect } from '@playwright/test'

// The inquiry form is on the homepage which requires live Supabase server rendering.
// Skip in CI where only placeholder env vars are available.
test.skip(!!process.env.CI, 'requires live Supabase server rendering — run locally with real .env.local')

test.describe('Inquiry form', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the send-inquiry API so no real email is sent during tests.
    await page.route('/api/send-inquiry', route =>
      route.fulfill({
        status:      200,
        contentType: 'application/json',
        body:        JSON.stringify({ ok: true }),
      }),
    )
  })

  test('submits inquiry and shows success state', async ({ page }) => {
    // ContactForm lives at /contact, not the homepage
    await page.goto('/contact')

    // PremiumField renders <input id="cf-*"> — use IDs directly
    const nameInput = page.locator('#cf-name')
    await nameInput.waitFor({ state: 'visible', timeout: 10_000 })

    await nameInput.fill('Juan dela Cruz')
    await page.locator('#cf-email').fill('juan@example.com')
    await page.locator('#cf-phone').fill('09568843373')

    // Submit button text is "Get My Free Consult"
    await page.getByRole('button', { name: /get my free consult/i }).click()

    // Success heading is "You're in good hands."
    await expect(page.getByText("You're in good hands.")).toBeVisible({ timeout: 8_000 })
  })
})
