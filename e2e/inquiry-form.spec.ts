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
    await page.goto('/')

    // Navigate directly to the contact section anchor to avoid scrolling issues
    await page.goto('/#contact')

    // Fields use PremiumField which renders <label htmlFor="cf-*"> + <input id="cf-*">
    await page.getByLabel('Full Name').fill('Juan dela Cruz')
    await page.getByLabel('Email').fill('juan@example.com')
    await page.getByLabel('Phone').fill('09568843373')

    // Submit button text is "Get My Free Consult"
    await page.getByRole('button', { name: /get my free consult/i }).click()

    // Success heading is "You're in good hands."
    await expect(page.getByText("You're in good hands.")).toBeVisible({ timeout: 8_000 })
  })
})
