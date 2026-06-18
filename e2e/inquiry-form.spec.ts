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

    // Scroll to and fill the contact form fields
    const nameInput  = page.getByLabel(/name/i).first()
    const emailInput = page.getByLabel(/email/i).first()
    const phoneInput = page.getByLabel(/phone/i).first()

    await nameInput.scrollIntoViewIfNeeded()
    await nameInput.fill('Juan dela Cruz')
    await emailInput.fill('juan@example.com')
    await phoneInput.fill('09568843373')

    // Submit the form
    await page.getByRole('button', { name: /send inquiry/i }).click()

    // Success state shows a confirmation message
    await expect(page.getByText(/inquiry sent/i)).toBeVisible({ timeout: 8_000 })
  })
})
