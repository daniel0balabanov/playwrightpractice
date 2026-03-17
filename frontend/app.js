/* ============================================
   CONFIGURATION
   ============================================ */
const USER_SERVICE = 'http://localhost:3001';
const ITEMS_SERVICE = 'http://localhost:3002';

/* ============================================
   STATE
   ============================================ */
const state = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  items: [],
  itemsMeta: { page: 1, limit: 10, total: 0, totalPages: 1 },
  itemsFilter: { category: '', done: '', search: '' },
  tableData: [],
  tableSortColumn: null,
  tableSortOrder: 'none',
  tableCurrentPage: 1,
  tablePageSize: 5,
  loadMoreOffset: 3,
  progressInterval: null,
};

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
function getAuthHeaders() {
  return state.token ? { 'Authorization': `Bearer ${state.token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: getAuthHeaders(),
      ...options,
    });
    return response;
  } catch (err) {
    console.error('Network error:', err);
    throw err;
  }
}

function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

function setFieldError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) field.classList.add('is-invalid');
  if (error) {
    error.textContent = message;
    error.classList.add('show');
  }
}

function clearFieldErrors(...fieldIds) {
  fieldIds.forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.classList.remove('is-invalid');
      field.classList.remove('is-valid');
    }
  });
  // Clear all invalid-feedback elements in a form
  document.querySelectorAll('.invalid-feedback').forEach(el => {
    el.classList.remove('show');
    el.textContent = '';
  });
}

/* ============================================
   AUTH — LOGIN FORM
   ============================================ */
function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFieldErrors('login-email', 'login-password');

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    let valid = true;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('login-email', 'login-email-error', 'Please enter a valid email address.');
      valid = false;
    }
    if (!password) {
      setFieldError('login-password', 'login-password-error', 'Password is required.');
      valid = false;
    }
    if (!valid) return;

    const submitBtn = document.getElementById('login-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Logging in...';

    try {
      const res = await apiRequest(`${USER_SERVICE}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        const errEl = document.getElementById('login-general-error');
        if (errEl) {
          errEl.textContent = data.error || 'Login failed.';
          errEl.classList.add('show');
        }
        return;
      }

      handleAuthSuccess(data.token, data.user);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      form.reset();
    } catch (err) {
      showToast('Network error. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';
    }
  });
}

/* ============================================
   AUTH — REGISTER FORM
   ============================================ */
function initRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFieldErrors('register-name', 'register-email', 'register-password');

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    let valid = true;

    if (!name) {
      setFieldError('register-name', 'register-name-error', 'Name is required.');
      valid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('register-email', 'register-email-error', 'Please enter a valid email address.');
      valid = false;
    }
    if (!password || password.length < 6) {
      setFieldError('register-password', 'register-password-error', 'Password must be at least 6 characters.');
      valid = false;
    }
    if (!valid) return;

    const submitBtn = document.getElementById('register-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Creating account...';

    try {
      const res = await apiRequest(`${USER_SERVICE}/auth/register`, {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        const errEl = document.getElementById('register-general-error');
        if (errEl) {
          errEl.textContent = data.error || 'Registration failed.';
          errEl.classList.add('show');
        }
        return;
      }

      handleAuthSuccess(data.token, data.user);
      showToast(`Welcome, ${data.user.name}! Account created successfully.`, 'success');
      form.reset();
    } catch (err) {
      showToast('Network error. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
    }
  });
}

/* ============================================
   AUTH — STATE MANAGEMENT
   ============================================ */
function handleAuthSuccess(token, user) {
  state.token = token;
  state.user = user;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  updateAuthUI();
  loadItems();
}

function updateAuthUI() {
  const userInfo = document.getElementById('user-info');
  const authNavBtns = document.getElementById('auth-nav-btns');
  const authSection = document.getElementById('auth-section');
  const itemsSection = document.getElementById('items-section');
  const displayName = document.getElementById('user-display-name');

  if (state.token && state.user) {
    if (userInfo) userInfo.style.display = 'flex';
    if (authNavBtns) authNavBtns.style.display = 'none';
    if (authSection) authSection.style.display = 'none';
    if (itemsSection) itemsSection.classList.add('visible');
    if (displayName) displayName.textContent = state.user.name;
  } else {
    if (userInfo) userInfo.style.display = 'none';
    if (authNavBtns) authNavBtns.style.display = 'flex';
    if (authSection) authSection.style.display = 'block';
    if (itemsSection) itemsSection.classList.remove('visible');
  }
}

/* ============================================
   AUTH — LOGOUT
   ============================================ */
function initLogout() {
  const btn = document.getElementById('logout-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    try {
      await apiRequest(`${USER_SERVICE}/auth/logout`, { method: 'POST' });
    } catch (e) {
      // ignore errors on logout
    }
    state.token = null;
    state.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateAuthUI();
    clearItemsList();
    showToast('Logged out successfully.', 'info');
  });
}

/* ============================================
   AUTH — TAB SWITCHING
   ============================================ */
function initAuthTabs() {
  const showRegisterBtn = document.getElementById('show-register-btn');
  const loginTabBtn = document.getElementById('login-tab-btn');
  const registerTabBtn = document.getElementById('register-tab-btn');
  const loginPanel = document.getElementById('login-form-panel');
  const registerPanel = document.getElementById('register-form-panel');

  function switchToLogin() {
    if (loginTabBtn) { loginTabBtn.classList.add('active'); loginTabBtn.setAttribute('aria-selected', 'true'); }
    if (registerTabBtn) { registerTabBtn.classList.remove('active'); registerTabBtn.setAttribute('aria-selected', 'false'); }
    if (loginPanel) loginPanel.classList.add('active');
    if (registerPanel) registerPanel.classList.remove('active');
  }

  function switchToRegister() {
    if (registerTabBtn) { registerTabBtn.classList.add('active'); registerTabBtn.setAttribute('aria-selected', 'true'); }
    if (loginTabBtn) { loginTabBtn.classList.remove('active'); loginTabBtn.setAttribute('aria-selected', 'false'); }
    if (registerPanel) registerPanel.classList.add('active');
    if (loginPanel) loginPanel.classList.remove('active');
  }

  if (showRegisterBtn) showRegisterBtn.addEventListener('click', () => {
    switchToRegister();
    const authSection = document.getElementById('auth-section');
    if (authSection) authSection.scrollIntoView({ behavior: 'smooth' });
  });

  if (loginTabBtn) loginTabBtn.addEventListener('click', switchToLogin);
  if (registerTabBtn) registerTabBtn.addEventListener('click', switchToRegister);
}

/* ============================================
   ITEMS — FETCH & DISPLAY
   ============================================ */
async function loadItems(page = 1) {
  if (!state.token) return;

  const { category, done, search } = state.itemsFilter;
  const params = new URLSearchParams({ page, limit: 10 });
  if (category) params.set('category', category);
  if (done !== '') params.set('done', done);
  if (search) params.set('search', search);

  try {
    const res = await apiRequest(`${ITEMS_SERVICE}/items?${params}`);
    if (!res.ok) {
      if (res.status === 401) {
        state.token = null;
        state.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        updateAuthUI();
      }
      return;
    }
    const data = await res.json();
    state.items = data.data;
    state.itemsMeta = data.meta;
    renderItemsList();
    renderItemsPagination();
  } catch (err) {
    showToast('Failed to load items.', 'error');
  }
}

function renderItemsList() {
  const list = document.getElementById('items-list');
  const emptyMsg = document.getElementById('items-empty-msg');
  if (!list) return;

  // Remove existing item cards
  Array.from(list.querySelectorAll('.item-card')).forEach(el => el.closest('li').remove());

  if (state.items.length === 0) {
    if (emptyMsg) emptyMsg.style.display = '';
    return;
  }

  if (emptyMsg) emptyMsg.style.display = 'none';

  state.items.forEach(item => {
    const li = document.createElement('li');
    const catClass = `badge badge-${item.category}`;
    li.innerHTML = `
      <div class="item-card ${item.done ? 'done' : ''}" data-id="${item.id}">
        <input type="checkbox" ${item.done ? 'checked' : ''} class="item-toggle" aria-label="Toggle ${item.title}" style="width:18px;height:18px;cursor:pointer;accent-color:var(--color-primary);">
        <span class="item-title">${escapeHtml(item.title)}</span>
        <span class="${catClass} item-category">${escapeHtml(item.category)}</span>
        <div class="item-actions">
          <button class="btn btn-sm btn-danger item-delete" data-id="${item.id}" aria-label="Delete ${item.title}">Delete</button>
        </div>
      </div>
    `;

    // Toggle done
    const checkbox = li.querySelector('.item-toggle');
    checkbox.addEventListener('change', () => toggleItem(item.id));

    // Delete
    const deleteBtn = li.querySelector('.item-delete');
    deleteBtn.addEventListener('click', () => deleteItem(item.id));

    list.appendChild(li);
  });
}

function renderItemsPagination() {
  const { page, totalPages } = state.itemsMeta;
  const paginationEl = document.getElementById('items-pagination');
  const currentPageEl = document.getElementById('items-current-page');
  const totalPagesEl = document.getElementById('items-total-pages');
  const prevBtn = document.getElementById('items-prev-btn');
  const nextBtn = document.getElementById('items-next-btn');
  const pageDisplay = document.getElementById('items-page-display');

  if (!paginationEl) return;

  if (totalPages <= 1) {
    paginationEl.style.display = 'none';
    return;
  }

  paginationEl.style.display = 'block';
  if (currentPageEl) currentPageEl.textContent = page;
  if (totalPagesEl) totalPagesEl.textContent = totalPages;
  if (pageDisplay) pageDisplay.textContent = page;
  if (prevBtn) prevBtn.disabled = page <= 1;
  if (nextBtn) nextBtn.disabled = page >= totalPages;
}

function clearItemsList() {
  const list = document.getElementById('items-list');
  if (list) list.innerHTML = '<li class="text-muted text-center" id="items-empty-msg">No items to display. Create one above!</li>';
  const paginationEl = document.getElementById('items-pagination');
  if (paginationEl) paginationEl.style.display = 'none';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ============================================
   ITEMS — CREATE
   ============================================ */
function initCreateItem() {
  const btn = document.getElementById('create-item-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const title = document.getElementById('new-item-title').value.trim();
    const category = document.getElementById('new-item-category').value;

    if (!title) {
      showToast('Please enter an item title.', 'warning');
      document.getElementById('new-item-title').focus();
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>';

    try {
      const res = await apiRequest(`${ITEMS_SERVICE}/items`, {
        method: 'POST',
        body: JSON.stringify({ title, category }),
      });

      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || 'Failed to create item.', 'error');
        return;
      }

      document.getElementById('new-item-title').value = '';
      showToast('Item created!', 'success');
      await loadItems(1);
    } catch (err) {
      showToast('Network error.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Add Item';
    }
  });

  // Allow Enter key in title input
  const titleInput = document.getElementById('new-item-title');
  if (titleInput) {
    titleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btn.click();
    });
  }
}

/* ============================================
   ITEMS — TOGGLE / DELETE
   ============================================ */
async function toggleItem(id) {
  try {
    const res = await apiRequest(`${ITEMS_SERVICE}/items/${id}/toggle`, { method: 'POST' });
    if (!res.ok) { showToast('Failed to toggle item.', 'error'); return; }
    await loadItems(state.itemsMeta.page);
  } catch (err) {
    showToast('Network error.', 'error');
  }
}

async function deleteItem(id) {
  try {
    const res = await apiRequest(`${ITEMS_SERVICE}/items/${id}`, { method: 'DELETE' });
    if (!res.ok) { showToast('Failed to delete item.', 'error'); return; }
    showToast('Item deleted.', 'info');
    await loadItems(state.itemsMeta.page);
  } catch (err) {
    showToast('Network error.', 'error');
  }
}

/* ============================================
   ITEMS — FILTER
   ============================================ */
function initItemsFilter() {
  const applyBtn = document.getElementById('apply-filter-btn');
  const resetBtn = document.getElementById('reset-filter-btn');

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      state.itemsFilter.category = document.getElementById('filter-category').value;
      state.itemsFilter.done = document.getElementById('filter-done').value;
      state.itemsFilter.search = document.getElementById('filter-search').value.trim();
      loadItems(1);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.getElementById('filter-category').value = '';
      document.getElementById('filter-done').value = '';
      document.getElementById('filter-search').value = '';
      state.itemsFilter = { category: '', done: '', search: '' };
      loadItems(1);
    });
  }

  // Items pagination
  const prevBtn = document.getElementById('items-prev-btn');
  const nextBtn = document.getElementById('items-next-btn');

  if (prevBtn) prevBtn.addEventListener('click', () => {
    if (state.itemsMeta.page > 1) loadItems(state.itemsMeta.page - 1);
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    if (state.itemsMeta.page < state.itemsMeta.totalPages) loadItems(state.itemsMeta.page + 1);
  });
}

/* ============================================
   RANGE SLIDER
   ============================================ */
function initRangeSlider() {
  const range = document.getElementById('range-input');
  const display = document.getElementById('range-value');
  const badge = document.getElementById('range-value-badge');

  if (!range) return;

  function updateDisplay(val) {
    if (display) display.textContent = val;
    if (badge) badge.textContent = val;
    range.setAttribute('aria-valuenow', val);
  }

  range.addEventListener('input', () => updateDisplay(range.value));
  updateDisplay(range.value);
}

/* ============================================
   TOGGLE SWITCH
   ============================================ */
function initToggleSwitch() {
  const toggle = document.getElementById('toggle-switch');
  const status = document.getElementById('toggle-status');

  if (!toggle) return;

  toggle.addEventListener('change', () => {
    if (status) status.textContent = toggle.checked ? 'On' : 'Off';
    toggle.setAttribute('aria-checked', toggle.checked ? 'true' : 'false');
  });
}

/* ============================================
   TABS
   ============================================ */
function initTabs() {
  // Find all tab containers on the page
  document.querySelectorAll('[role="tablist"]').forEach(list => {
    if (list.closest('.auth-container')) return; // skip auth tabs

    const tabs = Array.from(list.querySelectorAll('[role="tab"]'));

    function activateTab(tab) {
      tabs.forEach(t => {
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
        const panelId = t.getAttribute('aria-controls');
        if (panelId) {
          const panel = document.getElementById(panelId);
          if (panel) panel.hidden = true;
        }
      });

      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
      const panelId = tab.getAttribute('aria-controls');
      if (panelId) {
        const panel = document.getElementById(panelId);
        if (panel) panel.hidden = false;
      }
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => activateTab(tab));
      tab.addEventListener('keydown', (e) => {
        const currentIndex = tabs.indexOf(tab);
        if (e.key === 'ArrowRight') {
          const next = tabs[(currentIndex + 1) % tabs.length];
          activateTab(next);
          next.focus();
          e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
          const prev = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
          activateTab(prev);
          prev.focus();
          e.preventDefault();
        } else if (e.key === 'Home') {
          activateTab(tabs[0]);
          tabs[0].focus();
          e.preventDefault();
        } else if (e.key === 'End') {
          activateTab(tabs[tabs.length - 1]);
          tabs[tabs.length - 1].focus();
          e.preventDefault();
        }
      });
    });
  });
}

/* ============================================
   ACCORDION
   ============================================ */
function initAccordion() {
  // Update aria-expanded on toggle
  document.querySelectorAll('details.accordion-item').forEach(details => {
    const summary = details.querySelector('summary');
    if (!summary) return;

    const observer = new MutationObserver(() => {
      summary.setAttribute('aria-expanded', details.open ? 'true' : 'false');
    });
    observer.observe(details, { attributes: true, attributeFilter: ['open'] });
  });
}

/* ============================================
   MODAL
   ============================================ */
function initModal() {
  const modal = document.getElementById('demo-modal');
  const openBtn = document.getElementById('open-modal-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const cancelBtn = document.getElementById('cancel-modal-btn');
  const confirmBtn = document.getElementById('confirm-modal-btn');

  if (!modal) return;

  function openModal() {
    modal.showModal();
    setTimeout(() => document.getElementById('modal-input')?.focus(), 50);
  }

  function closeModal() {
    modal.close();
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (confirmBtn) confirmBtn.addEventListener('click', () => {
    const val = document.getElementById('modal-input')?.value;
    showToast(`Confirmed: ${val || '(empty)'}`, 'success');
    closeModal();
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC key is handled by browser natively for dialog
}

/* ============================================
   TOAST BUTTON
   ============================================ */
function initToastButton() {
  const btn = document.getElementById('show-toast-btn');
  if (!btn) return;

  const types = ['success', 'error', 'warning', 'info'];
  let typeIndex = 0;

  btn.addEventListener('click', () => {
    const type = types[typeIndex % types.length];
    typeIndex++;
    const messages = {
      success: 'Operation completed successfully!',
      error: 'Something went wrong. Please try again.',
      warning: 'Warning: This action cannot be undone.',
      info: 'Here is some useful information.',
    };
    showToast(messages[type], type);
  });
}

/* ============================================
   PROGRESS BAR
   ============================================ */
function initProgressBar() {
  const btn = document.getElementById('start-progress-btn');
  const bar = document.getElementById('progress-bar');
  const percentEl = document.getElementById('progress-percent');

  if (!btn || !bar) return;

  btn.addEventListener('click', () => {
    if (state.progressInterval) {
      clearInterval(state.progressInterval);
      state.progressInterval = null;
    }

    let progress = 0;
    bar.style.width = '0%';
    bar.setAttribute('aria-valuenow', '0');
    if (percentEl) percentEl.textContent = '0';

    btn.disabled = true;
    btn.textContent = 'Running...';

    state.progressInterval = setInterval(() => {
      progress += Math.random() * 8 + 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(state.progressInterval);
        state.progressInterval = null;
        btn.disabled = false;
        btn.textContent = 'Start Progress';
        showToast('Progress complete!', 'success');
      }
      const rounded = Math.round(progress);
      bar.style.width = `${rounded}%`;
      bar.setAttribute('aria-valuenow', rounded.toString());
      if (percentEl) percentEl.textContent = rounded.toString();
    }, 200);
  });
}

/* ============================================
   TABLE SORT & PAGINATION
   ============================================ */
function initTable() {
  // Static table data for pagination demo
  state.tableData = [
    { title: 'Buy groceries', category: 'shopping', done: false, createdAt: '2024-01-01' },
    { title: 'Morning run', category: 'health', done: true, createdAt: '2024-01-02' },
    { title: 'Read Playwright docs', category: 'learning', done: false, createdAt: '2024-01-03' },
    { title: 'Finish project report', category: 'work', done: false, createdAt: '2024-01-04' },
    { title: 'Meditate', category: 'personal', done: true, createdAt: '2024-01-05' },
    { title: 'Learn TypeScript', category: 'learning', done: false, createdAt: '2024-01-06' },
    { title: 'Weekly review', category: 'work', done: true, createdAt: '2024-01-07' },
    { title: 'Buy birthday gift', category: 'shopping', done: false, createdAt: '2024-01-08' },
    { title: 'Fix login bug', category: 'work', done: false, createdAt: '2024-01-09' },
    { title: 'Cook dinner', category: 'personal', done: false, createdAt: '2024-01-10' },
    { title: 'Call dentist', category: 'health', done: false, createdAt: '2024-01-11' },
    { title: 'Read novel', category: 'personal', done: false, createdAt: '2024-01-12' },
    { title: 'Gym session', category: 'health', done: true, createdAt: '2024-01-13' },
    { title: 'Plan vacation', category: 'personal', done: false, createdAt: '2024-01-14' },
    { title: 'Code review', category: 'work', done: false, createdAt: '2024-01-15' },
  ];

  // Sort headers
  const headers = document.querySelectorAll('#data-table th[data-sort]');
  headers.forEach(th => {
    th.addEventListener('click', () => sortTable(th));
    th.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { sortTable(th); e.preventDefault(); }
    });
  });

  // Pagination buttons
  const prevBtn = document.getElementById('pagination-prev');
  const nextBtn = document.getElementById('pagination-next');
  const pageButtons = document.querySelectorAll('[data-page]');

  if (prevBtn) prevBtn.addEventListener('click', () => {
    if (state.tableCurrentPage > 1) {
      state.tableCurrentPage--;
      renderTable();
    }
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(state.tableData.length / state.tablePageSize);
    if (state.tableCurrentPage < totalPages) {
      state.tableCurrentPage++;
      renderTable();
    }
  });

  pageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      state.tableCurrentPage = parseInt(btn.dataset.page);
      renderTable();
    });
  });

  renderTable();
}

function sortTable(th) {
  const col = th.dataset.sort;
  const headers = document.querySelectorAll('#data-table th[data-sort]');

  if (state.tableSortColumn === col) {
    state.tableSortOrder = state.tableSortOrder === 'ascending' ? 'descending' : 'ascending';
  } else {
    state.tableSortColumn = col;
    state.tableSortOrder = 'ascending';
  }

  headers.forEach(h => h.removeAttribute('aria-sort'));
  th.setAttribute('aria-sort', state.tableSortOrder);

  state.tableData.sort((a, b) => {
    const aVal = String(a[col] ?? '').toLowerCase();
    const bVal = String(b[col] ?? '').toLowerCase();
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return state.tableSortOrder === 'ascending' ? cmp : -cmp;
  });

  state.tableCurrentPage = 1;
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById('table-body');
  const currentPageEl = document.getElementById('current-page');
  const totalPagesEl = document.getElementById('total-pages');
  const prevBtn = document.getElementById('pagination-prev');
  const nextBtn = document.getElementById('pagination-next');
  const pageButtons = document.querySelectorAll('[data-page]');

  if (!tbody) return;

  const total = state.tableData.length;
  const totalPages = Math.ceil(total / state.tablePageSize);
  const start = (state.tableCurrentPage - 1) * state.tablePageSize;
  const pageData = state.tableData.slice(start, start + state.tablePageSize);

  tbody.innerHTML = '';
  pageData.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(item.title)}</td>
      <td><span class="badge badge-${item.category} item-category">${escapeHtml(item.category)}</span></td>
      <td>${item.done ? '<span class="status-done">Done</span>' : '<span class="status-pending">Pending</span>'}</td>
      <td>${escapeHtml(item.createdAt)}</td>
    `;
    tbody.appendChild(tr);
  });

  if (currentPageEl) currentPageEl.textContent = state.tableCurrentPage;
  if (totalPagesEl) totalPagesEl.textContent = totalPages;
  if (prevBtn) prevBtn.disabled = state.tableCurrentPage <= 1;
  if (nextBtn) nextBtn.disabled = state.tableCurrentPage >= totalPages;

  pageButtons.forEach(btn => {
    const pg = parseInt(btn.dataset.page);
    btn.classList.toggle('active', pg === state.tableCurrentPage);
    btn.setAttribute('aria-current', pg === state.tableCurrentPage ? 'page' : 'false');
  });
}

/* ============================================
   LOAD MORE
   ============================================ */
function initLoadMore() {
  const btn = document.getElementById('load-more-btn');
  const list = document.getElementById('loadmore-list');
  if (!btn || !list) return;

  const allItems = [
    'Additional item 4', 'Additional item 5', 'Additional item 6',
    'Additional item 7', 'Additional item 8', 'Additional item 9',
    'Additional item 10', 'Additional item 11', 'Additional item 12',
  ];

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="border-top-color:var(--color-primary);border-color:rgba(0,0,0,0.1);"></span> Loading...';

    // Show skeleton
    const skeletonContainer = document.getElementById('skeleton-container');
    if (skeletonContainer) skeletonContainer.style.display = 'block';

    await new Promise(resolve => setTimeout(resolve, 800));

    const nextBatch = allItems.slice(state.loadMoreOffset - 3, state.loadMoreOffset);
    nextBatch.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      list.appendChild(li);
    });

    state.loadMoreOffset += 3;

    if (skeletonContainer) skeletonContainer.style.display = 'none';

    if (state.loadMoreOffset - 3 >= allItems.length) {
      btn.textContent = 'All loaded';
      btn.disabled = true;
    } else {
      btn.disabled = false;
      btn.textContent = 'Load More';
    }
  });
}

/* ============================================
   DRAG AND DROP
   ============================================ */
function initDragAndDrop() {
  let draggedItem = null;
  let draggedFromZone = false;

  const draggables = document.querySelectorAll('.draggable-item');
  const dropZone = document.querySelector('.drag-zone');

  function attachDroppedItemEvents(clone) {
    clone.addEventListener('dragstart', (ev) => {
      draggedItem = clone;
      draggedFromZone = true;
      clone.classList.add('dragging');
      clone.setAttribute('aria-grabbed', 'true');
      ev.dataTransfer.effectAllowed = 'move';
      ev.dataTransfer.setData('text/plain', clone.dataset.sourceId || clone.id);
    });

    clone.addEventListener('dragend', () => {
      clone.classList.remove('dragging');
      clone.setAttribute('aria-grabbed', 'false');
      dropZone.classList.remove('drag-remove');
      draggedFromZone = false;
      draggedItem = null;
    });

    // Keyboard support: press Delete/Backspace to remove from zone
    clone.addEventListener('keydown', (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const label = clone.textContent.trim();
        clone.remove();
        showToast(`"${label}" removed from drop zone`, 'info');
        const labelDiv = dropZone.querySelector('.drag-zone-label');
        if (labelDiv && dropZone.querySelectorAll('.draggable-item').length === 0) {
          labelDiv.style.display = '';
        }
        e.preventDefault();
      }
    });
  }

  draggables.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      draggedItem = item;
      draggedFromZone = false;
      item.classList.add('dragging');
      item.setAttribute('aria-grabbed', 'true');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', item.id);
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      item.setAttribute('aria-grabbed', 'false');
      draggedItem = null;
      draggedFromZone = false;
    });

    // Keyboard support
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (dropZone) {
          const clone = item.cloneNode(true);
          clone.classList.remove('dragging');
          clone.setAttribute('aria-grabbed', 'false');
          clone.setAttribute('draggable', 'true');
          clone.dataset.sourceId = item.id;
          attachDroppedItemEvents(clone);
          const labelDiv = dropZone.querySelector('.drag-zone-label');
          if (labelDiv) labelDiv.style.display = 'none';
          dropZone.appendChild(clone);
          showToast(`"${item.textContent.trim()}" moved to drop zone`, 'success');
        }
        e.preventDefault();
      }
    });
  });

  if (dropZone) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (draggedFromZone) {
        // Item from zone is being dragged back over zone — cancel remove
        dropZone.classList.remove('drag-remove');
        e.dataTransfer.dropEffect = 'move';
      } else {
        e.dataTransfer.dropEffect = 'move';
        dropZone.classList.add('drag-over');
      }
    });

    dropZone.addEventListener('dragleave', (e) => {
      if (!dropZone.contains(e.relatedTarget)) {
        dropZone.classList.remove('drag-over');
        // If item originated from zone, signal removal
        if (draggedFromZone && draggedItem) {
          dropZone.classList.add('drag-remove');
        }
      }
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      dropZone.classList.remove('drag-remove');

      if (draggedItem && !draggedFromZone) {
        const clone = draggedItem.cloneNode(true);
        clone.classList.remove('dragging');
        clone.setAttribute('aria-grabbed', 'false');
        clone.setAttribute('draggable', 'true');
        clone.dataset.sourceId = draggedItem.id;
        attachDroppedItemEvents(clone);

        const labelDiv = dropZone.querySelector('.drag-zone-label');
        if (labelDiv) labelDiv.style.display = 'none';
        dropZone.appendChild(clone);
        showToast(`"${draggedItem.textContent.trim()}" dropped!`, 'success');
      }
    });
  }

  // Remove item when dragged out of the drop zone and dropped elsewhere
  document.addEventListener('dragover', (e) => {
    if (draggedFromZone && dropZone && !dropZone.contains(e.target)) {
      e.dataTransfer.dropEffect = 'move';
      e.preventDefault();
    }
  });

  document.addEventListener('drop', (e) => {
    if (draggedFromZone && draggedItem && dropZone && !dropZone.contains(e.target)) {
      e.preventDefault();
      const label = draggedItem.textContent.trim();
      draggedItem.remove();
      dropZone.classList.remove('drag-remove');
      const labelDiv = dropZone.querySelector('.drag-zone-label');
      if (labelDiv && dropZone.querySelectorAll('.draggable-item').length === 0) {
        labelDiv.style.display = '';
      }
      showToast(`"${label}" removed from drop zone`, 'info');
      draggedItem = null;
      draggedFromZone = false;
    }
  });
}

/* ============================================
   TOOLTIP HOVER (keyboard support)
   ============================================ */
function initTooltip() {
  const trigger = document.getElementById('tooltip-trigger');
  const tooltip = document.getElementById('demo-tooltip');

  if (!trigger || !tooltip) return;

  trigger.addEventListener('focus', () => { tooltip.style.opacity = '1'; });
  trigger.addEventListener('blur', () => { tooltip.style.opacity = '0'; });
  trigger.addEventListener('mouseenter', () => { tooltip.style.opacity = '1'; });
  trigger.addEventListener('mouseleave', () => { tooltip.style.opacity = '0'; });
}

/* ============================================
   INITIALIZE ALL
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Auth
  initAuthTabs();
  initLoginForm();
  initRegisterForm();
  initLogout();

  // Form elements
  initRangeSlider();
  initToggleSwitch();

  // Tabs
  initTabs();

  // Accordion
  initAccordion();

  // Overlays
  initModal();
  initToastButton();
  initProgressBar();
  initTooltip();

  // Table
  initTable();

  // Load more
  initLoadMore();

  // Drag and drop
  initDragAndDrop();

  // Items (auth-required)
  initCreateItem();
  initItemsFilter();

  // Check if already authenticated
  if (state.token && state.user) {
    updateAuthUI();
    loadItems();
  } else {
    updateAuthUI();
  }
});
