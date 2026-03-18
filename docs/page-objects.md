# Page Objects

This document describes the page object pattern used in the UI and integration tests.

## Location

```
tests/ui/pages/
├── BasePage.ts   — generic wrapper methods for all pages
└── MainPage.ts   — selectors and actions for the main frontend page
```

## BasePage

`BasePage` wraps common Playwright operations into reusable methods. Every page object extends it.

### Constructor

```ts
constructor(page: Page)
```

### Navigation

| Method | Description |
|--------|-------------|
| `goto(path?)` | Navigate to a path (default `/`) |
| `waitForURL(url)` | Wait for the page URL to match |
| `getTitle()` | Return the page `<title>` |

### Element interaction

| Method | Description |
|--------|-------------|
| `click(selector)` | Click an element |
| `fill(selector, value)` | Fill an input |
| `selectOption(selector, value)` | Select one or more options in a `<select>` |
| `check(selector)` | Check a checkbox or radio |
| `uncheck(selector)` | Uncheck a checkbox |
| `hover(selector)` | Hover over an element |
| `pressKey(key)` | Press a keyboard key |

### Getters

| Method | Description |
|--------|-------------|
| `locator(selector)` | Return a raw `Locator` |
| `getText(selector)` | Return the `textContent` of an element |
| `getValue(selector)` | Return the current value of an input |
| `getAttribute(selector, attr)` | Return an attribute value |
| `getCount(selector)` | Return the number of matching elements |

### State checks

| Method | Description |
|--------|-------------|
| `isVisible(selector)` | Returns `true` if the element is visible |
| `isEnabled(selector)` | Returns `true` if the element is enabled |
| `isChecked(selector)` | Returns `true` if the element is checked |

### Assertions

| Method | Description |
|--------|-------------|
| `assertVisible(selector)` | Expect element to be visible |
| `assertHidden(selector)` | Expect element to be hidden |
| `assertText(selector, text)` | Expect element to have specific text |
| `assertValue(selector, value)` | Expect input to have a specific value |
| `assertChecked(selector)` | Expect element to be checked |
| `assertAttribute(selector, attr, value)` | Expect element to have a specific attribute value |

### Waits

| Method | Description |
|--------|-------------|
| `waitForSelector(selector)` | Wait until selector appears in DOM |
| `waitForVisible(selector)` | Wait until element becomes visible |
| `waitForHidden(selector)` | Wait until element becomes hidden |
| `waitForFunction(fn)` | Wait for a custom browser-side predicate |

---

## MainPage

`MainPage` extends `BasePage`. It provides typed selectors for every element on the main page (`/`) and high-level action methods grouped by section.

### Instantiation

```ts
import { MainPage } from './pages/MainPage';

test('example', async ({ page }) => {
  const mainPage = new MainPage(page);
  await mainPage.goto();
  // ...
});
```

---

### Sections & selectors

#### Auth

| Selector field | ID / selector |
|----------------|---------------|
| `loginTabBtn` | `#login-tab-btn` |
| `registerTabBtn` | `#register-tab-btn` |
| `loginEmail` | `#login-email` |
| `loginPassword` | `#login-password` |
| `loginSubmit` | `#login-submit` |
| `loginGeneralError` | `#login-general-error` |
| `registerName` | `#register-name` |
| `registerEmail` | `#register-email` |
| `registerPassword` | `#register-password` |
| `registerSubmit` | `#register-submit` |
| `userInfo` | `#user-info` |
| `userDisplayName` | `#user-display-name` |
| `logoutBtn` | `#logout-btn` |

#### Items

| Selector field | ID / selector |
|----------------|---------------|
| `newItemTitle` | `#new-item-title` |
| `newItemCategory` | `#new-item-category` |
| `createItemBtn` | `#create-item-btn` |
| `filterCategory` | `#filter-category` |
| `filterDone` | `#filter-done` |
| `filterSearch` | `#filter-search` |
| `applyFilterBtn` | `#apply-filter-btn` |
| `resetFilterBtn` | `#reset-filter-btn` |
| `itemsList` | `#items-list` |
| `itemsEmptyMsg` | `#items-empty-msg` |
| `itemsPrevBtn` | `#items-prev-btn` |
| `itemsNextBtn` | `#items-next-btn` |
| `itemsCurrentPage` | `#items-current-page` |
| `itemsTotalPages` | `#items-total-pages` |

#### Form Elements

| Selector field | ID |
|----------------|----|
| `textInput` | `#text-input` |
| `emailInput` | `#email-input` |
| `numberInput` | `#number-input` |
| `textareaInput` | `#textarea-input` |
| `disabledInput` | `#disabled-input` |
| `readonlyInput` | `#readonly-input` |
| `rangeInput` | `#range-input` |
| `rangeValue` | `#range-value` |
| `fileInput` | `#file-input` |
| `dateInput` | `#date-input` |

#### Selects & Toggles

| Selector field | ID |
|----------------|----|
| `nativeSelect` | `#native-select` |
| `multiSelect` | `#multi-select` |
| `toggleSwitch` | `#toggle-switch` |
| `checkbox1–4` | `#checkbox-1` … `#checkbox-4` |
| `radioA/B/C` | `#radio-a` … `#radio-c` |

#### Tabs

| Selector field | Selector |
|----------------|----------|
| `tab1Btn` | `[role="tab"][data-tab="tab1"]` |
| `tab2Btn` | `[role="tab"][data-tab="tab2"]` |
| `tab3Btn` | `[role="tab"][data-tab="tab3"]` |
| `tabPanel1–3` | `#tab-panel-1` … `#tab-panel-3` |

#### Accordion

| Selector field | ID |
|----------------|----|
| `accordion1–3` | `#accordion-1` … `#accordion-3` |

#### Overlays (Modal / Toast / Tooltip / Progress)

| Selector field | ID / selector |
|----------------|---------------|
| `openModalBtn` | `#open-modal-btn` |
| `demoModal` | `#demo-modal` |
| `closeModalBtn` | `#close-modal-btn` |
| `confirmModalBtn` | `#confirm-modal-btn` |
| `showToastBtn` | `#show-toast-btn` |
| `toast` | `#toast-container .toast` |
| `tooltipTrigger` | `#tooltip-trigger` |
| `tooltip` | `[role="tooltip"]` |
| `startProgressBtn` | `#start-progress-btn` |
| `progressBar` | `[role="progressbar"]` |

#### Table & Pagination

| Selector field | ID / selector |
|----------------|---------------|
| `dataTable` | `#data-table` |
| `tableRows` | `#data-table tbody tr` |
| `tableSortHeaders` | `#data-table th[data-sort]` |
| `paginationPrev` | `#pagination-prev` |
| `paginationNext` | `#pagination-next` |
| `currentPage` | `#current-page` |

#### Load More

| Selector field | ID |
|----------------|----|
| `loadmoreList` | `#loadmore-list` |
| `loadmoreItems` | `#loadmore-list li` |
| `loadMoreBtn` | `#load-more-btn` |

#### Drag and Drop

| Selector field | ID / selector |
|----------------|---------------|
| `draggableItems` | `.draggable-item` |
| `dragItem1–2` | `#drag-item-1`, `#drag-item-2` |
| `dragZone` | `.drag-zone` |
| `dropZone1` | `#drop-zone-1` |

#### iFrame

| Selector field | ID |
|----------------|----|
| `demoIframe` | `#demo-iframe` |

---

### Action methods

#### Auth

```ts
await mainPage.login(email, password);
await mainPage.register(name, email, password);
await mainPage.logout();
const loggedIn = await mainPage.isLoggedIn();   // boolean
const name     = await mainPage.getDisplayName(); // string | null
```

#### Items

```ts
await mainPage.createItem('Buy milk', 'shopping');
await mainPage.applyFilters({ category: 'work', status: 'false', search: 'report' });
await mainPage.resetFilters();
const count = await mainPage.getItemCount();
await mainPage.goToNextItemsPage();
await mainPage.goToPrevItemsPage();
```

#### Tabs

```ts
await mainPage.clickTab(2);                     // 1 | 2 | 3
const active = await mainPage.getActiveTabPanel(); // '#tab-panel-2'
```

#### Accordion

```ts
await mainPage.toggleAccordion(1);              // 1 | 2 | 3
const open = await mainPage.isAccordionOpen(1); // boolean
```

#### Modal

```ts
await mainPage.openModal();
await mainPage.closeModal();
await mainPage.confirmModal();
```

#### Overlays

```ts
await mainPage.showToast();
await mainPage.startProgress();
await mainPage.waitForProgressComplete();
```

#### Table

```ts
await mainPage.sortTableBy('title');            // 'title' | 'category' | 'done'
const rows = await mainPage.getTableRowCount();
await mainPage.goToNextTablePage();
await mainPage.goToPrevTablePage();
```

#### Load More

```ts
await mainPage.loadMore();
const count = await mainPage.getLoadmoreItemCount();
```

#### Drag and Drop

```ts
await mainPage.dragItemToZone('#drag-item-1');
await mainPage.dragItemToZone('#drag-item-2', '#drop-zone-1');
```

#### iFrame

```ts
const frame = mainPage.getIframeLocator();
await frame.locator('#iframe-name').fill('test');
await frame.locator('#iframe-submit').click();
```

---

## Usage example

```ts
import { test, expect } from '@playwright/test';
import { MainPage } from './pages/MainPage';

test.describe('UI - Navigation using page object', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.goto();
  });

  test('clicking a tab shows correct panel', async () => {
    await mainPage.clickTab(2);
    await mainPage.assertVisible(mainPage.tabPanel2);
    await mainPage.assertHidden(mainPage.tabPanel1);
  });

  test('accordion expands and collapses', async () => {
    expect(await mainPage.isAccordionOpen(1)).toBe(false);
    await mainPage.toggleAccordion(1);
    expect(await mainPage.isAccordionOpen(1)).toBe(true);
    await mainPage.toggleAccordion(1);
    expect(await mainPage.isAccordionOpen(1)).toBe(false);
  });
});
```
