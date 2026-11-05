import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const pages = ['/', '/about/', '/clinics/'];

for (const route of pages) {
  test(`${route} loads with working assets, links and accessible content`, async ({ page, request }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('form')).toHaveCount(0);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://www.drmorris.co.il${route}`);
    for (const img of await page.locator('img').all()) {
      await expect(img).toHaveJSProperty('complete', true);
      expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
      await expect(img).toHaveAttribute('alt', /.+/);
    }
    const links = await page.locator('a[href]').evaluateAll(links => links.map(a => a.getAttribute('href')!));
    for (const href of [...new Set(links)]) {
      if (href.startsWith('mailto:')) { expect(href).toBe('mailto:dreitanmorris@gmail.com'); continue; }
      const url = new URL(href, `http://127.0.0.1:4322${route}`);
      expect((await request.get(url.pathname)).status(), href).toBe(200);
      if (url.hash) {
        const target = await request.get(url.pathname);
        expect(await target.text(), href).toContain(`id="${url.hash.slice(1)}"`);
      }
    }
    expect(errors).toEqual([]);
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(accessibility.violations).toEqual([]);
    await page.setViewportSize({ width: 390, height: 844 });
    const mobileAccessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(mobileAccessibility.violations).toEqual([]);
  });
  test(`${route} fits mobile, tablet and desktop screens`, async ({ page }) => {
    await page.goto(route);
    for (const width of [320, 390, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`).toBe(true);
      if (width > 760) {
        const logo = (await page.locator('.wordmark').first().boundingBox())!;
        const nav = (await page.getByRole('navigation').boundingBox())!;
        const button = (await page.locator('.header-cta').boundingBox())!;
        expect(logo.x + logo.width, `logo overlaps nav at ${width}`).toBeLessThanOrEqual(nav.x);
        expect(nav.x + nav.width, `nav overlaps CTA at ${width}`).toBeLessThanOrEqual(button.x);
      }
    }
  });
}

test('desktop links reach real About and Clinics pages, and the email is correct', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Meet your dentist' }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByRole('navigation').getByRole('link', { name: 'About me' })).toHaveAttribute('aria-current', 'page');
  await page.locator('.header-cta').click();
  await expect(page).toHaveURL(/\/about\/#get-in-touch$/);
  await expect(page.getByRole('link', { name: 'dreitanmorris@gmail.com' })).toHaveAttribute('href', 'mailto:dreitanmorris@gmail.com');
  await page.getByRole('navigation').getByRole('link', { name: 'Clinics & appointments' }).click();
  await expect(page).toHaveURL(/\/clinics\/$/);
  await expect(page.getByText('Coming soon', { exact: true })).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Clinics & appointments' })).toHaveAttribute('aria-current', 'page');
  await page.locator('header .wordmark').click();
  await expect(page).toHaveURL('/');
});

test('mobile menu supports Escape, outside click and navigation on every page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of pages) {
    await page.goto(route);
    const toggle = page.getByRole('button', { name: 'Open navigation' });
    await toggle.click();
    await expect(page.getByRole('navigation')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
    await expect(page.getByRole('navigation')).toBeHidden();
    await toggle.click();
    await page.locator('h1').click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await page.getByRole('navigation').getByRole('link', { name: 'About me' }).click();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
  }
});

test('FAQ and skip link work with the keyboard', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  const summary = page.locator('summary').first();
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
  await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).not.toHaveAttribute('open', '');
});

test('mobile navigation and contact information work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/');
  await page.getByRole('navigation').getByRole('link', { name: 'About me' }).click();
  await expect(page.getByRole('link', { name: 'dreitanmorris@gmail.com' })).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'Clinics & appointments' }).click();
  await expect(page.getByText('Coming soon', { exact: true })).toBeVisible();
  await context.close();
});
