/* =========================
   HOME PAGE ONLY SCRIPT
========================= */

/* =========================
   SEARCH ICON
========================= */

const searchBtn = document.getElementById("searchBtn");
const searchIcon = document.getElementById("searchIcon");

if (searchBtn && searchIcon) {
  searchBtn.addEventListener("click", function () {
    const defaultSrc = searchIcon.dataset.default;
    const activeSrc = searchIcon.dataset.active;

    searchIcon.src = activeSrc;

    window.setTimeout(function () {
      searchIcon.src = defaultSrc;
    }, 180);
  });
}

/* =========================
   HOME ICON HOVER
========================= */

const homeIcon = document.getElementById("homeIcon");

if (homeIcon) {
  const defaultSrc = homeIcon.dataset.default;
  const hoverSrc = homeIcon.dataset.hover;

  homeIcon.addEventListener("mouseenter", function () {
    homeIcon.src = hoverSrc;
  });

  homeIcon.addEventListener("mouseleave", function () {
    homeIcon.src = defaultSrc;
  });
}

/* =========================
   AVATAR
========================= */

const avatarUpload = document.getElementById("avatarUpload");
const avatarPreview = document.getElementById("avatarPreview");
const avatarLabel = document.querySelector(".profile-icon");
const avatarStorageKey = "avatar";

const defaultAvatar = "images/avatar_default.png";
const hoverAvatar = "images/avatar_hover.png";
const savedAvatar = localStorage.getItem(avatarStorageKey);

function updateAvatarTooltip() {
  if (!avatarLabel) return;

  if (localStorage.getItem(avatarStorageKey)) {
    avatarLabel.setAttribute("data-tooltip", "Change image");
  } else {
    avatarLabel.setAttribute("data-tooltip", "Upload image");
  }
}

if (avatarPreview) {
  avatarPreview.src = savedAvatar || defaultAvatar;
  updateAvatarTooltip();

  avatarPreview.addEventListener("mouseenter", function () {
    if (!localStorage.getItem(avatarStorageKey)) {
      avatarPreview.src = hoverAvatar;
    }
  });

  avatarPreview.addEventListener("mouseleave", function () {
    if (!localStorage.getItem(avatarStorageKey)) {
      avatarPreview.src = defaultAvatar;
    }
  });
}

if (avatarUpload && avatarPreview) {
  avatarUpload.addEventListener("change", function () {
    const file = this.files && this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const imageData = event.target.result;
      avatarPreview.src = imageData;
      localStorage.setItem(avatarStorageKey, imageData);
      updateAvatarTooltip();
    };

    reader.readAsDataURL(file);
  });
}

/* =========================
   MOBILE NAV ANIMATION
========================= */

const bottomNav = document.querySelector(".bottom-nav-inner");
const bottomPills = document.querySelectorAll(".bottom-pill");

if (bottomNav) {
  requestAnimationFrame(function () {
    bottomNav.classList.add("is-ready");
  });
}

if (bottomPills.length) {
  bottomPills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      bottomPills.forEach(function (item) {
        item.classList.remove("active");
      });

      this.classList.add("active");
    });
  });
}

/* =========================
   PAGE TITLE
========================= */

const userName = localStorage.getItem("userName") || "#User Name";

const pageTitles = {
  home: `Good Morning, ${userName}!`
};

const titleEl = document.querySelector(".page-title");

if (titleEl) {
  const pageKey = titleEl.dataset.page;
  titleEl.textContent = pageTitles[pageKey] || "";
}

/* =========================
   API PLACEHOLDERS
========================= */

const weatherContent = document.getElementById("weatherContent");
const quoteContent = document.getElementById("quoteContent");

async function loadWeatherPlaceholder() {
  if (!weatherContent) return;
  weatherContent.textContent = "Weather API placeholder";
}

async function loadQuotePlaceholder() {
  if (!quoteContent) return;
  quoteContent.textContent = "Quote of the day.";
}

loadWeatherPlaceholder();
loadQuotePlaceholder();

/* =========================
   HOME LISTS
========================= */

function createStandardItem(labelText) {
  const item = document.createElement("div");
  item.className = "home-list-item";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "home-list-item__button";

  const label = document.createElement("span");
  label.className = "home-list-item__label";
  label.textContent = labelText;

  button.appendChild(label);
  item.appendChild(button);

  return item;
}

function createTaskItem(labelText, index) {
  const item = document.createElement("div");
  item.className = "home-list-item";

  const row = document.createElement("label");
  row.className = "home-list-item__task";

  const label = document.createElement("span");
  label.className = "home-list-item__label";
  label.textContent = labelText;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "home-task-check";
  checkbox.id = `task-item-${index + 1}`;
  checkbox.setAttribute("aria-label", `${labelText} complete`);

  row.appendChild(label);
  row.appendChild(checkbox);
  item.appendChild(row);

  return item;
}

function renderList(containerId, baseLabel, isTaskList) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  for (let i = 1; i <= 15; i += 1) {
    const labelText = `${baseLabel} ${i}`;
    const item = isTaskList
      ? createTaskItem(labelText, i - 1)
      : createStandardItem(labelText);

    container.appendChild(item);
  }
}

renderList("eventList", "Event Listing FPO", false);
renderList("calendarList", "Calendar Item FPO", false);
renderList("taskList", "Task Item FPO", true);

/* =========================
   DRAG SCROLL
========================= */

const dragViewports = document.querySelectorAll(".home-list-viewport");

dragViewports.forEach(function (viewport) {
  let isDragging = false;
  let startY = 0;
  let startScrollTop = 0;

  viewport.addEventListener("pointerdown", function (event) {
    isDragging = true;
    startY = event.clientY;
    startScrollTop = viewport.scrollTop;
    viewport.classList.add("is-dragging");
    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener("pointermove", function (event) {
    if (!isDragging) return;

    const deltaY = event.clientY - startY;
    viewport.scrollTop = startScrollTop - deltaY;
  });

  function stopDragging(event) {
    if (!isDragging) return;

    isDragging = false;
    viewport.classList.remove("is-dragging");

    try {
      viewport.releasePointerCapture(event.pointerId);
    } catch (error) {
      /* no-op */
    }
  }

  viewport.addEventListener("pointerup", stopDragging);
  viewport.addEventListener("pointercancel", stopDragging);
  viewport.addEventListener("mouseleave", stopDragging);
});