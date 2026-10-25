import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('overview loads and glossary searches real course content', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(
    page.getByRole('navigation', { name: 'Main navigation' }),
  ).toBeVisible();
  if (process.env.UPDATE_SCREENSHOTS) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({ path: 'docs/screenshots/overview.png' });
  }
  await page.getByRole('button', { name: 'Glossary', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search glossary' }).fill('QLoRA');
  await expect(
    page.getByRole('heading', { name: 'QLoRA', exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test('held out examples remain separate through import, reload and download', async ({
  page,
}) => {
  await page.goto('/#dataset');
  await page.getByRole('button', { name: /Held-out test/ }).click();
  await page.getByRole('button', { name: 'Import JSONL', exact: true }).click();
  await page
    .getByLabel('JSONL examples')
    .fill(
      '{"question":"A held out test question","answer":"Meaning: Unseen.\\nExample: Evaluate."}',
    );
  await page.getByRole('button', { name: 'Import into test' }).click();
  await expect(
    page.getByText('A held out test question', { exact: true }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: /Held-out test/ }).click();
  await expect(
    page.getByText('A held out test question', { exact: true }),
  ).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSONL', exact: true }).click();
  const testFile = await download;
  expect(testFile.suggestedFilename()).toBe('finetune-test.jsonl');
  expect(await readFile(await testFile.path(), 'utf8')).toContain(
    'A held out test question',
  );
  await page.getByRole('button', { name: /^Training \d/ }).click();
  const trainDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSONL', exact: true }).click();
  const trainFile = await trainDownload;
  expect(await readFile(await trainFile.path(), 'utf8')).not.toContain(
    'A held out test question',
  );
});

test('invalid JSONL is rejected without partially importing records', async ({
  page,
}) => {
  await page.goto('/#dataset');
  const before = await page.locator('.data-record').count();
  await page.getByRole('button', { name: 'Import JSONL', exact: true }).click();
  await page
    .getByLabel('JSONL examples')
    .fill(
      '{"question":"Valid first row","answer":"An answer"}\n{"question":"Missing answer"}',
    );
  await page.getByRole('button', { name: 'Import into train' }).click();
  await expect(page.locator('.input-error[role=alert]')).toContainText(
    'Line 2',
  );
  await expect(page.locator('.data-record')).toHaveCount(before);
});

test('mobile navigation opens the dataset studio', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('button', { name: 'Dataset studio', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Build a dataset that teaches.' }),
  ).toBeVisible();
});
