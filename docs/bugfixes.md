# Bug Fixes

Bugs identified and fixed during development sessions on this project.

---

## 1. Tab Panels not interactive

**File:** `frontend/app.js` — `initTabs()`

**Symptom:** Clicking tabs in the "Tab Panels" section had no effect. The panels did not switch.

**Root cause:** `initTabs()` had an early-exit guard that used `document.querySelector('[role="tablist"]')` — which returns the **first** matching element in the DOM. The first tablist on the page is the auth tabs inside `.auth-container`. The guard then checked `tablist.closest('.auth-container')` and, finding a match, returned immediately — before the `forEach` loop that wires up the demo tabs ever ran.

```js
// Bug: querySelector returns the auth tablist (first in DOM),
// so the function always returned early and never wired demo tabs
function initTabs() {
  const tablist = document.querySelector('[role="tablist"]');
  if (!tablist || tablist.closest('.auth-container')) return; // ← early exit
  document.querySelectorAll('[role="tablist"]').forEach(list => { ... });
}
```

**Fix:** Removed the broken early-exit guard. The `forEach` loop already has a per-item check (`if (list.closest('.auth-container')) return`) that correctly skips the auth tabs, making the outer guard redundant.

```js
function initTabs() {
  document.querySelectorAll('[role="tablist"]').forEach(list => {
    if (list.closest('.auth-container')) return; // skip auth tabs
    // wire up demo tabs ...
  });
}
```

---

## 2. Drag-and-drop — no way to remove dropped items

**Files:** `frontend/app.js` — `initDragAndDrop()`, `frontend/style.css`

**Symptom:** Once an item was dragged into the drop zone it could not be removed — there was no mechanism to take it back out.

**What was added:**

- **Drag-out to remove:** A `draggedFromZone` flag tracks whether the item being dragged originated from inside the drop zone. A `document`-level `drop` handler catches the drop when it lands outside the zone and removes the element.

- **Visual feedback:** While a zone-item is being dragged outside the zone boundary, the drop zone gets a `drag-remove` CSS class (red border/background) to signal that releasing the mouse will remove the item. Dragging back over the zone clears this state.

- **Keyboard removal:** Dropped items can be focused and removed by pressing `Delete` or `Backspace`.

- **Label restore:** When the last item is removed from the zone, the "Drop items here" placeholder label reappears.

```css
/* Added to style.css */
.drag-zone.drag-remove {
  border-color: var(--color-danger, #ef4444);
  background: #fef2f2;
}
```
