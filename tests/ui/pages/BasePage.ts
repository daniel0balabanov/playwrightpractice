import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  async waitForURL(url: string | RegExp) {
    await this.page.waitForURL(url);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async click(selector: string) {
    await this.page.click(selector);
  }

  async fill(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  async selectOption(selector: string, value: string | string[]) {
    await this.page.selectOption(selector, value);
  }

  async check(selector: string) {
    await this.page.locator(selector).check();
  }

  async uncheck(selector: string) {
    await this.page.locator(selector).uncheck();
  }

  async hover(selector: string) {
    await this.page.hover(selector);
  }

  async pressKey(key: string) {
    await this.page.keyboard.press(key);
  }

  locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async getText(selector: string): Promise<string | null> {
    return this.page.locator(selector).textContent();
  }

  async getValue(selector: string): Promise<string> {
    return this.page.locator(selector).inputValue();
  }

  async getAttribute(selector: string, attr: string): Promise<string | null> {
    return this.page.locator(selector).getAttribute(attr);
  }

  async getCount(selector: string): Promise<number> {
    return this.page.locator(selector).count();
  }

  async isVisible(selector: string): Promise<boolean> {
    return this.page.locator(selector).isVisible();
  }

  async isEnabled(selector: string): Promise<boolean> {
    return this.page.locator(selector).isEnabled();
  }

  async isChecked(selector: string): Promise<boolean> {
    return this.page.locator(selector).isChecked();
  }

  async waitForSelector(selector: string) {
    await this.page.waitForSelector(selector);
  }

  async waitForVisible(selector: string) {
    await this.page.locator(selector).waitFor({ state: 'visible' });
  }

  async waitForHidden(selector: string) {
    await this.page.locator(selector).waitFor({ state: 'hidden' });
  }

  async waitForFunction<T>(fn: () => T | Promise<T>): Promise<T> {
    return this.page.waitForFunction(fn) as unknown as T;
  }
}
