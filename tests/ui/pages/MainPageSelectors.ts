export const MainPageSelectors = {
  // ── Auth ───────────────────────────────────────────────────────────────────

  loginTabBtn: '#login-tab-btn',
  registerTabBtn: '#register-tab-btn',

  loginEmail: '#login-email',
  loginPassword: '#login-password',
  loginSubmit: '#login-submit',
  loginGeneralError: '#login-general-error',

  registerName: '#register-name',
  registerEmail: '#register-email',
  registerPassword: '#register-password',
  registerSubmit: '#register-submit',
  registerGeneralError: '#register-general-error',

  userInfo: '#user-info',
  userDisplayName: '#user-display-name',
  logoutBtn: '#logout-btn',
  showRegisterBtn: '#show-register-btn',

  // ── Items ──────────────────────────────────────────────────────────────────

  newItemTitle: '#new-item-title',
  newItemCategory: '#new-item-category',
  createItemBtn: '#create-item-btn',

  filterCategory: '#filter-category',
  filterDone: '#filter-done',
  filterSearch: '#filter-search',
  applyFilterBtn: '#apply-filter-btn',
  resetFilterBtn: '#reset-filter-btn',

  itemsList: '#items-list',
  itemsEmptyMsg: '#items-empty-msg',

  itemsPrevBtn: '#items-prev-btn',
  itemsNextBtn: '#items-next-btn',
  itemsCurrentPage: '#items-current-page',
  itemsTotalPages: '#items-total-pages',

  // ── Form elements 

  textInput: '#text-input',
  emailInput: '#email-input',
  passwordInput: '#password-input',
  numberInput: '#number-input',
  telInput: '#tel-input',
  urlInput: '#url-input',
  textareaInput: '#textarea-input',
  disabledInput: '#disabled-input',
  readonlyInput: '#readonly-input',
  dateInput: '#date-input',
  fileInput: '#file-input',
  rangeInput: '#range-input',
  rangeValue: '#range-value',

  // ── Selects & toggles 

  nativeSelect: '#native-select',
  multiSelect: '#multi-select',
  toggleSwitch: '#toggle-switch',
  toggleStatus: '#toggle-status',

  checkbox1: '#checkbox-1',
  checkbox2: '#checkbox-2',
  checkbox3: '#checkbox-3',
  checkbox4: '#checkbox-4',

  radioA: '#radio-a',
  radioB: '#radio-b',
  radioC: '#radio-c',

  // ── Tabs 

  tab1Btn: '[role="tab"][data-tab="tab1"]',
  tab2Btn: '[role="tab"][data-tab="tab2"]',
  tab3Btn: '[role="tab"][data-tab="tab3"]',

  tabPanel1: '#tab-panel-1',
  tabPanel2: '#tab-panel-2',
  tabPanel3: '#tab-panel-3',

  // ── Accordion 

  accordion1: '#accordion-1',
  accordion2: '#accordion-2',
  accordion3: '#accordion-3',

  // ── Overlays 

  openModalBtn: '#open-modal-btn',
  demoModal: '#demo-modal',
  closeModalBtn: '#close-modal-btn',
  cancelModalBtn: '#cancel-modal-btn',
  confirmModalBtn: '#confirm-modal-btn',
  modalInput: '#modal-input',

  showToastBtn: '#show-toast-btn',
  toastContainer: '#toast-container',
  toast: '#toast-container .toast',

  tooltipTrigger: '#tooltip-trigger',
  tooltip: '[role="tooltip"]',

  startProgressBtn: '#start-progress-btn',
  progressBar: '[role="progressbar"]',
  progressPercent: '#progress-percent',

  // ── Table 

  dataTable: '#data-table',
  tableBody: '#table-body',
  tableRows: '#data-table tbody tr',
  tableSortHeaders: '#data-table th[data-sort]',

  paginationPrev: '#pagination-prev',
  paginationNext: '#pagination-next',
  currentPage: '#current-page',
  totalPages: '#total-pages',

  // ── Load more 

  loadmoreList: '#loadmore-list',
  loadmoreItems: '#loadmore-list li',
  loadMoreBtn: '#load-more-btn',

  // ── Drag and drop 

  draggableItems: '.draggable-item',
  dragItem1: '#drag-item-1',
  dragItem2: '#drag-item-2',
  dragZone: '.drag-zone',
  dropZone1: '#drop-zone-1',

  // ── iFrame 

  demoIframe: '#demo-iframe',
} as const;
