/* =========================
   HERO COPY ROTATOR
========================= */

const heroRotator = document.getElementById("heroRotator");
const heroStage = document.getElementById("heroStage");
const heroStageInner = document.getElementById("heroStageInner");

if (heroRotator && heroStage && heroStageInner) {
  const phrases = [
    "students come together.",
    "ideas come together.",
    "community comes together.",
    "creativity comes together.",
    "campus life comes together."
  ];

  let phraseIndex = 0;
  let isAnimating = false;

  function measurePhraseWidth(text) {
    const measurer = document.createElement("span");
    measurer.style.position = "absolute";
    measurer.style.visibility = "hidden";
    measurer.style.whiteSpace = "nowrap";
    measurer.style.font = window.getComputedStyle(heroStageInner).font;
    measurer.style.fontWeight = window.getComputedStyle(heroStageInner).fontWeight;
    measurer.style.letterSpacing = window.getComputedStyle(heroStageInner).letterSpacing;
    measurer.style.paddingBottom = window.getComputedStyle(heroStageInner).paddingBottom;
    measurer.textContent = text;
    document.body.appendChild(measurer);
    const width = Math.ceil(measurer.getBoundingClientRect().width);
    document.body.removeChild(measurer);
    return width;
  }

  function setPhrase(text) {
    heroStageInner.textContent = text;
    heroRotator.setAttribute("aria-label", `Where ${text}`);
  }

  function expandTo(text) {
    setPhrase(text);
    const width = measurePhraseWidth(text);
    requestAnimationFrame(function () {
      heroStage.style.width = `${width}px`;
    });
  }

  function collapseThenSwap() {
    if (isAnimating) return;
    isAnimating = true;

    heroStage.style.width = "0px";

    setTimeout(function () {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      expandTo(phrases[phraseIndex]);

      setTimeout(function () {
        isAnimating = false;
      }, 450);
    }, 450);
  }

  setPhrase(phrases[phraseIndex]);
  heroStage.style.width = `${measurePhraseWidth(phrases[phraseIndex])}px`;

  setInterval(collapseThenSwap, 2600);

  window.addEventListener("resize", function () {
    heroStage.style.width = `${measurePhraseWidth(phrases[phraseIndex])}px`;
  });
}

/* =========================
   CAROUSEL
========================= */

const track = document.getElementById("featureTrack");
const viewport = document.querySelector(".carousel-viewport");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

if (track && viewport) {
  let index = 0;
  let startX = 0;
  let endX = 0;

  const gap = 16;
  const cardWidth = 100 + gap;
  const visibleCards = 3;
  const totalCards = track.children.length;
  const maxIndex = Math.max(0, totalCards - visibleCards);

  function updateCarousel() {
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  function goNext() {
    if (index < maxIndex) {
      index += 1;
      updateCarousel();
    }
  }

  function goPrev() {
    if (index > 0) {
      index -= 1;
      updateCarousel();
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", goNext);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", goPrev);
  }

  viewport.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].clientX;
    },
    { passive: true }
  );

  viewport.addEventListener(
    "touchend",
    function (e) {
      endX = e.changedTouches[0].clientX;

      const swipeDistance = endX - startX;
      const threshold = 40;

      if (swipeDistance < -threshold) {
        goNext();
      } else if (swipeDistance > threshold) {
        goPrev();
      }
    },
    { passive: true }
  );

  updateCarousel();
}

/* =========================
   SIGN-UP BUTTON
========================= */

const signupBtn = document.getElementById("signupBtn");

if (signupBtn) {
  signupBtn.addEventListener("click", function (e) {
    e.preventDefault();
    signupBtn.classList.toggle("active");
  });
}

/* =========================
   AVATAR
========================= */

const avatarUpload = document.getElementById("avatarUpload");
const avatarPreview = document.getElementById("avatarPreview");
const avatarLabel = document.querySelector(".profile-icon");

const defaultAvatar = "images/avatar_default.png";
const hoverAvatar = "images/avatar_hover.png";
const savedAvatar = localStorage.getItem("avatar");

function updateAvatarTooltip() {
  if (!avatarLabel) return;

  if (localStorage.getItem("avatar")) {
    avatarLabel.setAttribute("data-tooltip", "Change image");
  } else {
    avatarLabel.setAttribute("data-tooltip", "Upload image");
  }
}

if (avatarPreview) {
  avatarPreview.src = savedAvatar || defaultAvatar;
  updateAvatarTooltip();

  avatarPreview.addEventListener("mouseenter", function () {
    if (!localStorage.getItem("avatar")) {
      avatarPreview.src = hoverAvatar;
    }
  });

  avatarPreview.addEventListener("mouseleave", function () {
    if (!localStorage.getItem("avatar")) {
      avatarPreview.src = defaultAvatar;
    }
  });
}

if (avatarUpload && avatarPreview) {
  avatarUpload.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const imageData = e.target.result;
      avatarPreview.src = imageData;
      localStorage.setItem("avatar", imageData);
      updateAvatarTooltip();
    };

    reader.readAsDataURL(file);
  });
}

/* =========================
   NAVIGATION
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
   SEARCH BUTTON ICON SWAP
========================= */

const searchBtn = document.getElementById("searchBtn");
const searchIcon = document.getElementById("searchIcon");

if (searchBtn && searchIcon) {
  searchBtn.addEventListener("click", function () {
    const defaultSrc = searchIcon.dataset.default;
    const activeSrc = searchIcon.dataset.active;

    searchIcon.src = activeSrc;

    setTimeout(function () {
      searchIcon.src = defaultSrc;
    }, 180);
  });
}

/* =========================
   HOME ICON HOVER SWAP
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

/* =============================
   GET USERNAME (CAN COME LATER)
============================= */

const userName = localStorage.getItem("userName") || "#User Name";

/* =========================
   PAGE TITLE MAP
========================= */

const pageTitles = {
  home: `Good Morning, ${userName}!`,
  events: `${userName}'s Events`,
  tasks: `${userName}'s Tasks`,
  calendar: `${userName}'s Calendar`,
  resources: `${userName}'s Spots`,
  tutors: `${userName}'s Tutors`,
  community: `${userName}'s Community Hub`,
  study: "Study Groups",
  messages: "Message Board",
  meetups: "Meet Ups"
};

/* ============
   APPLY TITLE
============ */

const titleEl = document.querySelector(".page-title");

if (titleEl) {
  const pageKey = titleEl.dataset.page;
  titleEl.textContent = pageTitles[pageKey] || "";
}

const eventsList = document.getElementById("eventsList");
const calendarList = document.getElementById("calendarList");
const tasksList = document.getElementById("tasksList");

function buildHomeShellList(items, type) {
  const stack = document.createElement("div");
  stack.className = "home-shell__stack";

  items.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "home-shell__item";

    if (type === "tasks") {
      row.innerHTML = `
        <span class="home-shell__label">${item}</span>
        <input class="home-shell__check" type="checkbox" aria-label="${item}" id="task-${index}" />
      `;
    } else {
      row.innerHTML = `
        <span class="home-shell__label">${item}</span>
      `;
    }

    stack.appendChild(row);
  });

  return stack;
}

function populateHomeShell() {
  if (eventsList) {
    const items = Array.from({ length: 15 }, (_, i) => `Event Listing FPO ${i + 1}`);
    eventsList.innerHTML = "";
    eventsList.appendChild(buildHomeShellList(items, "events"));
  }

  if (calendarList) {
    const items = Array.from({ length: 15 }, (_, i) => `Calendar Item FPO ${i + 1}`);
    calendarList.innerHTML = "";
    calendarList.appendChild(buildHomeShellList(items, "calendar"));
  }

  if (tasksList) {
    const items = Array.from({ length: 15 }, (_, i) => `Task Item FPO ${i + 1}`);
    tasksList.innerHTML = "";
    tasksList.appendChild(buildHomeShellList(items, "tasks"));
  }
}

populateHomeShell();

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