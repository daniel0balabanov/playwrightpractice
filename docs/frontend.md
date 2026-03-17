# Frontend

A vanilla JavaScript single-page application served as static files by a lightweight Express server (Docker container on port **3000**).

## Files

| File | Description |
|---|---|
| `index.html` | Single HTML page containing all UI sections |
| `app.js` | All JavaScript — state, API calls, and UI behaviour |
| `style.css` | All styles |
| `iframe-content.html` | Standalone page loaded inside the iframe section |

## Architecture

No framework, no build step. The page loads `app.js` as a plain `<script>` at the bottom of `index.html`. All state lives in a single `state` object at the top of `app.js`. Each UI section has a dedicated `init*()` function that wires up event listeners; everything is called from a single `DOMContentLoaded` handler.

### State object

```js
const state = {
  token,          // JWT from user-service, persisted in localStorage
  user,           // logged-in user object
  items,          // current page of items from items-service
  itemsMeta,      // pagination metadata { page, limit, total, totalPages }
  itemsFilter,    // active filter values { category, done, search }
  tableData,      // static data for the demo table
  tableSortColumn,
  tableSortOrder,
  tableCurrentPage,
  tablePageSize,
  loadMoreOffset,
  progressInterval,
};
```

## Sections & their init functions

### Authentication (`initLoginForm`, `initRegisterForm`, `initAuthTabs`, `initLogout`)
- Two-tab panel: Login / Register
- On success, JWT and user object are stored in `localStorage` and the items section becomes visible
- Logout calls `POST /auth/logout` to blacklist the token, then clears local state

### My Items (`initCreateItem`, `initItemsFilter`)
- Visible only when authenticated
- Talks to **items-service** (port 3002) for CRUD operations
- Supports filtering by category, status, and free-text search
- Paginated with prev/next controls

### Form Elements
Static demo inputs: text, email, password, number, tel, URL, textarea, disabled, readonly, date, file, range slider.

### Selects, Checkboxes & Toggles (`initToggleSwitch`)
Native `<select>`, multi-select, checkboxes, radio group, toggle switch.

### Tab Panels (`initTabs`)
Three-tab panel with full keyboard navigation (Arrow keys, Home, End).
Auth tabs are skipped automatically — only `.tabs-container` tabs are wired up.

### Accordion (`initAccordion`)
`<details>`/`<summary>` elements. A `MutationObserver` keeps `aria-expanded` in sync with the `open` attribute.

### Modals, Toasts & Tooltips (`initModal`, `initToastButton`, `initTooltip`, `initProgressBar`)
- Modal: native `<dialog>` element, closes on backdrop click or ESC
- Toast: cycling through success/error/warning/info messages
- Progress bar: animated with `setInterval`, triggered by a button

### Sortable Table (`initTable`, `sortTable`, `renderTable`)
15-row static dataset. Columns are sortable (ascending/descending toggle). Paginated at 5 rows per page with numbered page buttons.

### Load More (`initLoadMore`)
Simulates async loading with a 800 ms delay and a skeleton placeholder.

### Drag and Drop (`initDragAndDrop`)
- Four draggable source items (Alpha, Beta, Gamma, Delta)
- Drop zone accepts items via mouse drag or keyboard (Enter/Space)
- Items already in the drop zone can be **removed** by dragging them back out of the zone
- Drop zone turns red while an item is being dragged out (visual feedback)
- Keyboard: focus a dropped item and press `Delete`/`Backspace` to remove it

### Embedded iFrame
Loads `iframe-content.html` in an `<iframe>` — contains a nested form for iframe interaction testing.

## API communication

All requests go through `apiRequest()`, which attaches the `Authorization: Bearer <token>` header automatically when a token is present.

```
User Service  →  http://localhost:3001
Items Service →  http://localhost:3002
```

Errors are surfaced via `showToast()`.
