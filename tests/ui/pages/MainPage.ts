import { test, Page, FrameLocator } from '@playwright/test';
import { BasePage } from './BasePage';
import { MainPageSelectors as sel } from './MainPageSelectors';

export class MainPage extends BasePage {
  readonly sel = sel;

  constructor(page: Page) {
    super(page);
  }

  // ── Auth

  get loginTabBtn()        { return this.page.locator(sel.loginTabBtn); }
  get registerTabBtn()     { return this.page.locator(sel.registerTabBtn); }
  get loginEmail()         { return this.page.locator(sel.loginEmail); }
  get loginPassword()      { return this.page.locator(sel.loginPassword); }
  get loginSubmit()        { return this.page.locator(sel.loginSubmit); }
  get loginGeneralError()  { return this.page.locator(sel.loginGeneralError); }
  get registerName()       { return this.page.locator(sel.registerName); }
  get registerEmail()      { return this.page.locator(sel.registerEmail); }
  get registerPassword()   { return this.page.locator(sel.registerPassword); }
  get registerSubmit()     { return this.page.locator(sel.registerSubmit); }
  get registerGeneralError() { return this.page.locator(sel.registerGeneralError); }
  get userInfo()           { return this.page.locator(sel.userInfo); }
  get userDisplayName()    { return this.page.locator(sel.userDisplayName); }
  get logoutBtn()          { return this.page.locator(sel.logoutBtn); }

  // ── Items

  get newItemTitle()       { return this.page.locator(sel.newItemTitle); }
  get newItemCategory()    { return this.page.locator(sel.newItemCategory); }
  get createItemBtn()      { return this.page.locator(sel.createItemBtn); }
  get filterCategory()     { return this.page.locator(sel.filterCategory); }
  get filterDone()         { return this.page.locator(sel.filterDone); }
  get filterSearch()       { return this.page.locator(sel.filterSearch); }
  get applyFilterBtn()     { return this.page.locator(sel.applyFilterBtn); }
  get resetFilterBtn()     { return this.page.locator(sel.resetFilterBtn); }
  get itemsList()          { return this.page.locator(sel.itemsList); }
  get itemsEmptyMsg()      { return this.page.locator(sel.itemsEmptyMsg); }
  get itemsPrevBtn()       { return this.page.locator(sel.itemsPrevBtn); }
  get itemsNextBtn()       { return this.page.locator(sel.itemsNextBtn); }
  get itemsCurrentPage()   { return this.page.locator(sel.itemsCurrentPage); }
  get itemsTotalPages()    { return this.page.locator(sel.itemsTotalPages); }

  // ── Forms

  get textInput()          { return this.page.locator(sel.textInput); }
  get emailInput()         { return this.page.locator(sel.emailInput); }
  get passwordInput()      { return this.page.locator(sel.passwordInput); }
  get numberInput()        { return this.page.locator(sel.numberInput); }
  get telInput()           { return this.page.locator(sel.telInput); }
  get urlInput()           { return this.page.locator(sel.urlInput); }
  get textareaInput()      { return this.page.locator(sel.textareaInput); }
  get disabledInput()      { return this.page.locator(sel.disabledInput); }
  get readonlyInput()      { return this.page.locator(sel.readonlyInput); }
  get dateInput()          { return this.page.locator(sel.dateInput); }
  get fileInput()          { return this.page.locator(sel.fileInput); }
  get rangeInput()         { return this.page.locator(sel.rangeInput); }
  get rangeValue()         { return this.page.locator(sel.rangeValue); }

  // ── Selects & toggles

  get nativeSelect()       { return this.page.locator(sel.nativeSelect); }
  get multiSelect()        { return this.page.locator(sel.multiSelect); }
  get toggleSwitch()       { return this.page.locator(sel.toggleSwitch); }
  get toggleStatus()       { return this.page.locator(sel.toggleStatus); }
  get checkbox1()          { return this.page.locator(sel.checkbox1); }
  get checkbox2()          { return this.page.locator(sel.checkbox2); }
  get checkbox3()          { return this.page.locator(sel.checkbox3); }
  get checkbox4()          { return this.page.locator(sel.checkbox4); }
  get radioA()             { return this.page.locator(sel.radioA); }
  get radioB()             { return this.page.locator(sel.radioB); }
  get radioC()             { return this.page.locator(sel.radioC); }

  // ── Tabs

  get tab1Btn()            { return this.page.locator(sel.tab1Btn); }
  get tab2Btn()            { return this.page.locator(sel.tab2Btn); }
  get tab3Btn()            { return this.page.locator(sel.tab3Btn); }
  get tabPanel1()          { return this.page.locator(sel.tabPanel1); }
  get tabPanel2()          { return this.page.locator(sel.tabPanel2); }
  get tabPanel3()          { return this.page.locator(sel.tabPanel3); }

  // ── Accordion

  get accordion1()         { return this.page.locator(sel.accordion1); }
  get accordion2()         { return this.page.locator(sel.accordion2); }
  get accordion3()         { return this.page.locator(sel.accordion3); }

  // ── Overlays

  get openModalBtn()       { return this.page.locator(sel.openModalBtn); }
  get demoModal()          { return this.page.locator(sel.demoModal); }
  get closeModalBtn()      { return this.page.locator(sel.closeModalBtn); }
  get cancelModalBtn()     { return this.page.locator(sel.cancelModalBtn); }
  get confirmModalBtn()    { return this.page.locator(sel.confirmModalBtn); }
  get modalInput()         { return this.page.locator(sel.modalInput); }
  get showToastBtn()       { return this.page.locator(sel.showToastBtn); }
  get toastContainer()     { return this.page.locator(sel.toastContainer); }
  get toast()              { return this.page.locator(sel.toast); }
  get tooltipTrigger()     { return this.page.locator(sel.tooltipTrigger); }
  get tooltip()            { return this.page.locator(sel.tooltip); }
  get startProgressBtn()   { return this.page.locator(sel.startProgressBtn); }
  get progressBar()        { return this.page.locator(sel.progressBar); }
  get progressPercent()    { return this.page.locator(sel.progressPercent); }

  // ── Table

  get dataTable()          { return this.page.locator(sel.dataTable); }
  get tableBody()          { return this.page.locator(sel.tableBody); }
  get tableRows()          { return this.page.locator(sel.tableRows); }
  get paginationPrev()     { return this.page.locator(sel.paginationPrev); }
  get paginationNext()     { return this.page.locator(sel.paginationNext); }
  get currentPage()        { return this.page.locator(sel.currentPage); }
  get totalPages()         { return this.page.locator(sel.totalPages); }

  // ── Load more

  get loadmoreList()       { return this.page.locator(sel.loadmoreList); }
  get loadmoreItems()      { return this.page.locator(sel.loadmoreItems); }
  get loadMoreBtn()        { return this.page.locator(sel.loadMoreBtn); }

  // ── Drag and drop

  get draggableItems()     { return this.page.locator(sel.draggableItems); }
  get dragItem1()          { return this.page.locator(sel.dragItem1); }
  get dragItem2()          { return this.page.locator(sel.dragItem2); }
  get dragZone()           { return this.page.locator(sel.dragZone); }
  get dropZone1()          { return this.page.locator(sel.dropZone1); }

  async login(email: string, password: string) {
    await test.step(`Login as ${email}`, async () => {
      await this.click(sel.loginTabBtn);
      await this.fill(sel.loginEmail, email);
      await this.fill(sel.loginPassword, password);
      await this.click(sel.loginSubmit);
    });
  }

  async register(name: string, email: string, password: string) {
    await test.step(`Register user ${name} (${email})`, async () => {
      await this.click(sel.registerTabBtn);
      await this.fill(sel.registerName, name);
      await this.fill(sel.registerEmail, email);
      await this.fill(sel.registerPassword, password);
      await this.click(sel.registerSubmit);
    });
  }

  async logout() {
    await test.step('Logout', async () => {
      await this.click(sel.logoutBtn);
    });
  }

  async isLoggedIn(): Promise<boolean> {
    return test.step('Check if logged in', async () => {
      return this.isVisible(sel.userInfo);
    });
  }

  async getDisplayName(): Promise<string | null> {
    return test.step('Get display name', async () => {
      return this.getText(sel.userDisplayName);
    });
  }

  async createItem(title: string, category?: string) {
    await test.step(`Create item "${title}"${category ? ` in category "${category}"` : ''}`, async () => {
      await this.fill(sel.newItemTitle, title);
      if (category) {
        await this.selectOption(sel.newItemCategory, category);
      }
      await this.click(sel.createItemBtn);
    });
  }

  async applyFilters(options: { category?: string; status?: string; search?: string }) {
    await test.step(`Apply filters ${JSON.stringify(options)}`, async () => {
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
    });
  }

  async resetFilters() {
    await test.step('Reset filters', async () => {
      await this.click(sel.resetFilterBtn);
    });
  }

  async getItemCount(): Promise<number> {
    return test.step('Get item count', async () => {
      return this.getCount(`${sel.itemsList} li:not(#items-empty-msg)`);
    });
  }

  async goToNextItemsPage() {
    await test.step('Go to next items page', async () => {
      await this.click(sel.itemsNextBtn);
    });
  }

  async goToPrevItemsPage() {
    await test.step('Go to previous items page', async () => {
      await this.click(sel.itemsPrevBtn);
    });
  }

  async clickTab(tab: 1 | 2 | 3) {
    await test.step(`Click tab ${tab}`, async () => {
      const btns = { 1: sel.tab1Btn, 2: sel.tab2Btn, 3: sel.tab3Btn };
      await this.click(btns[tab]);
    });
  }

  async getActiveTabPanel(): Promise<string | null> {
    return test.step('Get active tab panel', async () => {
      for (const id of [sel.tabPanel1, sel.tabPanel2, sel.tabPanel3]) {
        if (await this.isVisible(id)) return id;
      }
      return null;
    });
  }

  async toggleAccordion(index: 1 | 2 | 3) {
    await test.step(`Toggle accordion ${index}`, async () => {
      const accordions = { 1: sel.accordion1, 2: sel.accordion2, 3: sel.accordion3 };
      await this.click(`${accordions[index]} summary`);
    });
  }

  async isAccordionOpen(index: 1 | 2 | 3): Promise<boolean> {
    return test.step(`Check if accordion ${index} is open`, async () => {
      const accordions = { 1: sel.accordion1, 2: sel.accordion2, 3: sel.accordion3 };
      const attr = await this.getAttribute(accordions[index], 'open');
      return attr !== null;
    });
  }

  async openModal() {
    await test.step('Open modal', async () => {
      await this.click(sel.openModalBtn);
      await this.waitForVisible(sel.demoModal);
    });
  }

  async closeModal() {
    await test.step('Close modal', async () => {
      await this.click(sel.closeModalBtn);
    });
  }

  async confirmModal() {
    await test.step('Confirm modal', async () => {
      await this.click(sel.confirmModalBtn);
    });
  }

  async showToast() {
    await test.step('Show toast notification', async () => {
      await this.click(sel.showToastBtn);
    });
  }

  async startProgress() {
    await test.step('Start progress bar', async () => {
      await this.click(sel.startProgressBtn);
    });
  }

  async waitForProgressComplete() {
    await test.step('Wait for progress to reach 100%', async () => {
      await this.page.waitForFunction(() => {
        const bar = document.querySelector('[role="progressbar"]');
        return bar && parseInt(bar.getAttribute('aria-valuenow') || '0') >= 100;
      }, { timeout: 10000 });
    });
  }

  async sortTableBy(column: 'title' | 'category' | 'done') {
    await test.step(`Sort table by "${column}"`, async () => {
      await this.click(`#data-table th[data-sort="${column}"]`);
    });
  }

  async getTableRowCount(): Promise<number> {
    return test.step('Get table row count', async () => {
      return this.getCount(sel.tableRows);
    });
  }

  async goToNextTablePage() {
    await test.step('Go to next table page', async () => {
      await this.click(sel.paginationNext);
    });
  }

  async goToPrevTablePage() {
    await test.step('Go to previous table page', async () => {
      await this.click(sel.paginationPrev);
    });
  }

  async loadMore() {
    await test.step('Load more items', async () => {
      await this.click(sel.loadMoreBtn);
    });
  }

  async getLoadmoreItemCount(): Promise<number> {
    return test.step('Get load-more item count', async () => {
      return this.getCount(sel.loadmoreItems);
    });
  }

  async dragItemToZone(itemSelector: string, zoneSelector: string = sel.dragZone) {
    await test.step(`Drag "${itemSelector}" to "${zoneSelector}"`, async () => {
      const source = this.page.locator(itemSelector);
      const target = this.page.locator(zoneSelector);
      await source.dragTo(target);
    });
  }

  getIframeLocator(): FrameLocator {
    return this.page.frameLocator(sel.demoIframe);
  }
}
