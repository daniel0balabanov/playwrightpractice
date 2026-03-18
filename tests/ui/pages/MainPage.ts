import { Page, FrameLocator } from '@playwright/test';
import { BasePage } from './BasePage';
import { MainPageSelectors as sel } from './MainPageSelectors';

export class MainPage extends BasePage {
  readonly sel = sel;

  constructor(page: Page) {
    super(page);
  }

  async login(email: string, password: string) {
    await this.click(sel.loginTabBtn);
    await this.fill(sel.loginEmail, email);
    await this.fill(sel.loginPassword, password);
    await this.click(sel.loginSubmit);
  }

  async register(name: string, email: string, password: string) {
    await this.click(sel.registerTabBtn);
    await this.fill(sel.registerName, name);
    await this.fill(sel.registerEmail, email);
    await this.fill(sel.registerPassword, password);
    await this.click(sel.registerSubmit);
  }

  async logout() {
    await this.click(sel.logoutBtn);
  }

  async isLoggedIn(): Promise<boolean> {
    return this.isVisible(sel.userInfo);
  }

  async getDisplayName(): Promise<string | null> {
    return this.getText(sel.userDisplayName);
  }

  async createItem(title: string, category?: string) {
    await this.fill(sel.newItemTitle, title);
    if (category) {
      await this.selectOption(sel.newItemCategory, category);
    }
    await this.click(sel.createItemBtn);
  }

  async applyFilters(options: { category?: string; status?: string; search?: string }) {
    if (options.category !== undefined) {
      await this.selectOption(sel.filterCategory, options.category);
    }
    if (options.status !== undefined) {
      await this.selectOption(sel.filterDone, options.status);
    }
    if (options.search !== undefined) {
      await this.fill(sel.filterSearch, options.search);
    }
    await this.click(sel.applyFilterBtn);
  }

  async resetFilters() {
    await this.click(sel.resetFilterBtn);
  }

  async getItemCount(): Promise<number> {
    return this.getCount(`${sel.itemsList} li:not(#items-empty-msg)`);
  }

  async goToNextItemsPage() {
    await this.click(sel.itemsNextBtn);
  }

  async goToPrevItemsPage() {
    await this.click(sel.itemsPrevBtn);
  }

  async clickTab(tab: 1 | 2 | 3) {
    const btns = { 1: sel.tab1Btn, 2: sel.tab2Btn, 3: sel.tab3Btn };
    await this.click(btns[tab]);
  }

  async getActiveTabPanel(): Promise<string | null> {
    for (const id of [sel.tabPanel1, sel.tabPanel2, sel.tabPanel3]) {
      if (await this.isVisible(id)) return id;
    }
    return null;
  }

  async toggleAccordion(index: 1 | 2 | 3) {
    const accordions = { 1: sel.accordion1, 2: sel.accordion2, 3: sel.accordion3 };
    await this.click(`${accordions[index]} summary`);
  }

  async isAccordionOpen(index: 1 | 2 | 3): Promise<boolean> {
    const accordions = { 1: sel.accordion1, 2: sel.accordion2, 3: sel.accordion3 };
    const attr = await this.getAttribute(accordions[index], 'open');
    return attr !== null;
  }

  async openModal() {
    await this.click(sel.openModalBtn);
    await this.waitForVisible(sel.demoModal);
  }

  async closeModal() {
    await this.click(sel.closeModalBtn);
  }

  async confirmModal() {
    await this.click(sel.confirmModalBtn);
  }

  async showToast() {
    await this.click(sel.showToastBtn);
  }

  async startProgress() {
    await this.click(sel.startProgressBtn);
  }

  async waitForProgressComplete() {
    await this.page.waitForFunction(() => {
      const bar = document.querySelector('[role="progressbar"]');
      return bar && parseInt(bar.getAttribute('aria-valuenow') || '0') >= 100;
    }, { timeout: 10000 });
  }

  async sortTableBy(column: 'title' | 'category' | 'done') {
    await this.click(`#data-table th[data-sort="${column}"]`);
  }

  async getTableRowCount(): Promise<number> {
    return this.getCount(sel.tableRows);
  }

  async goToNextTablePage() {
    await this.click(sel.paginationNext);
  }

  async goToPrevTablePage() {
    await this.click(sel.paginationPrev);
  }

  async loadMore() {
    await this.click(sel.loadMoreBtn);
  }

  async getLoadmoreItemCount(): Promise<number> {
    return this.getCount(sel.loadmoreItems);
  }

  async dragItemToZone(itemSelector: string, zoneSelector: string = sel.dragZone) {
    const source = this.page.locator(itemSelector);
    const target = this.page.locator(zoneSelector);
    await source.dragTo(target);
  }

  getIframeLocator(): FrameLocator {
    return this.page.frameLocator(sel.demoIframe);
  }
}
