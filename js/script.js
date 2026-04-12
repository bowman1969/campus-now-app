/* =========================
   HOME DASHBOARD DATA
========================= */

const eventListEl = document.getElementById("eventList");
const calendarListEl = document.getElementById("calendarList");
const taskListEl = document.getElementById("taskList");
const weatherContent = document.getElementById("weatherContent");
const quoteContent = document.getElementById("quoteContent");

const eventPlaceholders = Array.from({ length: 15 }, (_, i) => `Event Listing FPO ${i + 1}`);
const calendarPlaceholders = Array.from({ length: 15 }, (_, i) => `Calendar Item FPO ${i + 1}`);
const taskPlaceholders = Array.from({ length: 15 }, (_, i) => `Task Item FPO ${i + 1}`);

/* =========================
   HOME API PLACEHOLDERS
========================= */

async function loadWeatherPlaceholder() {
  if (!weatherContent) return;

  // Placeholder only.
  // Example future flow:
  // const response = await fetch("YOUR_WEATHER_ENDPOINT");
  // const data = await response.json();

  weatherContent.textContent = "Weather API placeholder";
}

async function loadQuotePlaceholder() {
  if (!quoteContent) return;

  // Placeholder only.
  // Example future flow:
  // const response = await fetch("YOUR_QUOTE_ENDPOINT");
  // const data = await response.json();

  quoteContent.textContent = "Quote of the day.";
}

loadWeatherPlaceholder();
loadQuotePlaceholder();

/* =========================
   RENDER HOME LISTS
========================= */

function createButtonItem(labelText) {
  const item = document.createElement("div");
  item.className = "list-item list-item--blue";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "list-item-button";

  const label = document.createElement("span");
  label.className = "list-item-label";
  label.textContent = labelText;

  button.appendChild(label);
  item.appendChild(button);

  return item;
}

function createTaskItem(labelText, index) {
  const item = document.createElement("div");
  item.className = "list-item list-item--task";

  const wrapper = document.createElement("label");
  wrapper.className = "list-item-task";

  const label = document.createElement("span");
  label.className = "list-item-label";
  label.textContent = labelText;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-check";
  checkbox.setAttribute("aria-label", `${labelText} complete`);
  checkbox.id = `task-check-${index + 1}`;

  wrapper.appendChild(label);
  wrapper.appendChild(checkbox);
  item.appendChild(wrapper);

  return item;
}

function renderHomeLists() {
  if (eventListEl) {
    eventPlaceholders.forEach((itemText) => {
      eventListEl.appendChild(createButtonItem(itemText));
    });
  }

  if (calendarListEl) {
    calendarPlaceholders.forEach((itemText) => {
      calendarListEl.appendChild(createButtonItem(itemText));
    });
  }

  if (taskListEl) {
    taskPlaceholders.forEach((itemText, index) => {
      taskListEl.appendChild(createTaskItem(itemText, index));
    });
  }
}

renderHomeLists();

/* =========================
   DRAG / SWIPE SCROLL
========================= */

const dragScrollEls = document.querySelectorAll("[data-drag-scroll]");

dragScrollEls.forEach((scroller) => {
  let isPointerDown = false;
  let startY = 0;
  let startScrollTop = 0;

  scroller.addEventListener("pointerdown", (event) => {
    isPointerDown = true;
    startY = event.clientY;
    startScrollTop = scroller.scrollTop;
    scroller.classList.add("dragging");
    scroller.setPointerCapture(event.pointerId);
  });

  scroller.addEventListener("pointermove", (event) => {
    if (!isPointerDown) return;
    const deltaY = event.clientY - startY;
    scroller.scrollTop = startScrollTop - deltaY;
  });

  function endDrag(event) {
    if (!isPointerDown) return;
    isPointerDown = false;
    scroller.classList.remove("dragging");

    if (event && typeof event.pointerId !== "undefined") {
      try {
        scroller.releasePointerCapture(event.pointerId);
      } catch (err) {
        /* no-op */
      }
    }
  }

  scroller.addEventListener("pointerup", endDrag);
  scroller.addEventListener("pointercancel", endDrag);
  scroller.addEventListener("mouseleave", endDrag);
});