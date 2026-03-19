import { test, expect as playwrightExpect, Locator } from '@playwright/test';

class LocatorAssertions {
  constructor(private readonly locator: Locator) {}

  private get label() {
    return this.locator.toString();
  }

  async toBeVisible() {
    await test.step(`Assert visible: ${this.label}`, async () => {
      await playwrightExpect(this.locator).toBeVisible();
    });
  }

  async toBeHidden() {
    await test.step(`Assert hidden: ${this.label}`, async () => {
      await playwrightExpect(this.locator).toBeHidden();
    });
  }

  async toHaveText(text: string | RegExp) {
    await test.step(`Assert text "${text}": ${this.label}`, async () => {
      await playwrightExpect(this.locator).toHaveText(text);
    });
  }

  async toHaveValue(value: string) {
    await test.step(`Assert value "${value}": ${this.label}`, async () => {
      await playwrightExpect(this.locator).toHaveValue(value);
    });
  }

  async toBeChecked() {
    await test.step(`Assert checked: ${this.label}`, async () => {
      await playwrightExpect(this.locator).toBeChecked();
    });
  }

  async toHaveAttribute(attr: string, value: string | RegExp) {
    await test.step(`Assert [${attr}="${value}"]: ${this.label}`, async () => {
      await playwrightExpect(this.locator).toHaveAttribute(attr, value);
    });
  }
}

function isLocator(target: unknown): target is Locator {
  return (
    typeof target === 'object' &&
    target !== null &&
    typeof (target as Record<string, unknown>).waitFor === 'function'
  );
}

export function expect(target: Locator): LocatorAssertions;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function expect(target: unknown): ReturnType<typeof playwrightExpect<any>>;
export function expect(target: unknown) {
  if (isLocator(target)) {
    return new LocatorAssertions(target);
  }
  return playwrightExpect(target);
}
