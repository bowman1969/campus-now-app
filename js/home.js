/* =========================
   HOME PAGE SCRIPT
========================= */

/* =========================
   ELEMENTS
========================= */

const avatarUpload = document.getElementById("avatarUpload");
const avatarPreview = document.getElementById("avatarPreview");
const avatarLabel = document.querySelector(".profile-icon");

const titleEl = document.querySelector(".page-title");

const weatherContent = document.getElementById("weatherContent");
const quoteContent = document.getElementById("quoteContent");

const eventListEl = document.getElementById("eventList");
const calendarListEl = document.getElementById("calendarList");
const taskListEl = document.getElementById("taskList");

const searchBtn = document.getElementById("searchBtn");
const searchIcon = document.getElementById("searchIcon");
const homeIcon = document.getElementById("homeIcon");

/* =========================
   AVATAR
========================= */

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
   PAGE TITLE
========================= */

const userName = localStorage.getItem("userName") || "#User Name";

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

if (titleEl) {
  const pageKey = titleEl.dataset.page;
  titleEl.textContent = pageTitles[pageKey] || "";
}

/* =========================
   WEATHER TILE - OPEN-METEO
========================= */

const WEATHER_FALLBACK = {
  latitude: 40.8759,
  longitude: -81.4023,
  label: "North Canton"
};

const weatherCodeMap = {
  0: "Clear",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Icy fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  56: "Freezing drizzle",
  57: "Heavy freezing drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Heavy showers",
  82: "Violent showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm"
};

function getWeatherDescription(code) {
  return weatherCodeMap[code] || "Current conditions unavailable";
}

async function fetchWeather(lat, lon, label = "Your area") {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}` +
    `&longitude=${lon}` +
    `&current=temperature_2m,weather_code,wind_speed_10m` +
    `&temperature_unit=fahrenheit` +
    `&wind_speed_unit=mph` +
    `&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Weather request failed: ${response.status}`);
  }

  const data = await response.json();
  const current = data.current;

  if (!current) {
    throw new Error("No current weather returned.");
  }

  const temp = Math.round(current.temperature_2m);
  const wind = Math.round(current.wind_speed_10m);
  const condition = getWeatherDescription(current.weather_code);

  weatherContent.textContent = `${label}: ${temp}°F, ${condition}, wind ${wind} mph`;
}

async function loadWeather() {
  if (!weatherContent) return;

  weatherContent.textContent = "Loading weather...";

  try {
    if (!navigator.geolocation) {
      throw new Error("Geolocation not supported.");
    }

    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 15 * 60 * 1000
      });
    });

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    await fetchWeather(lat, lon, "Your area");
  } catch (error) {
    try {
      await fetchWeather(
        WEATHER_FALLBACK.latitude,
        WEATHER_FALLBACK.longitude,
        WEATHER_FALLBACK.label
      );
    } catch (fallbackError) {
      weatherContent.textContent = "Weather unavailable right now.";
      console.error("Weather error:", error);
      console.error("Fallback weather error:", fallbackError);
    }
  }
}

/* =========================
   QUOTE PLACEHOLDER
========================= */

function loadQuotePlaceholder() {
  if (!quoteContent) return;
  quoteContent.textContent = "Quote of the day.";
}

/* =========================
   HOME LIST DATA
========================= */

const eventPlaceholders = Array.from(
  { length: 15 },
  (_, i) => `Event Listing FPO ${i + 1}`
);

const calendarPlaceholders = Array.from(
  { length: 15 },
  (_, i) => `Calendar Item FPO ${i + 1}`
);

const taskPlaceholders = Array.from(
  { length: 15 },
  (_, i) => `Task Item FPO ${i + 1}`
);

/* =========================
   LIST RENDERERS
========================= */

function createButtonItem(labelText) {
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

  const wrapper = document.createElement("label");
  wrapper.className = "home-list-item__task";

  const label = document.createElement("span");
  label.className = "home-list-item__label";
  label.textContent = labelText;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "home-task-check";
  checkbox.setAttribute("aria-label", `${labelText} complete`);
  checkbox.id = `task-check-${index + 1}`;

  wrapper.appendChild(label);
  wrapper.appendChild(checkbox);
  item.appendChild(wrapper);

  return item;
}

function renderHomeLists() {
  if (eventListEl && !eventListEl.children.length) {
    eventPlaceholders.forEach((itemText) => {
      eventListEl.appendChild(createButtonItem(itemText));
    });
  }

  if (calendarListEl && !calendarListEl.children.length) {
    calendarPlaceholders.forEach((itemText) => {
      calendarListEl.appendChild(createButtonItem(itemText));
    });
  }

  if (taskListEl && !taskListEl.children.length) {
    taskPlaceholders.forEach((itemText, index) => {
      taskListEl.appendChild(createTaskItem(itemText, index));
    });
  }
}

/* =========================
   DRAG / SWIPE SCROLL
========================= */

const dragScrollEls = document.querySelectorAll(".home-list-viewport");

dragScrollEls.forEach((scroller) => {
  let isPointerDown = false;
  let startY = 0;
  let startScrollTop = 0;

  scroller.addEventListener("pointerdown", (event) => {
    isPointerDown = true;
    startY = event.clientY;
    startScrollTop = scroller.scrollTop;
    scroller.classList.add("is-dragging");
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
    scroller.classList.remove("is-dragging");

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
  scroller.addEventListener("pointerleave", endDrag);
});

/* =========================
   SEARCH BUTTON ICON SWAP
========================= */

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
   INIT
========================= */

loadWeather();
loadQuotePlaceholder();
renderHomeLists();

// QUOTE OF THE DAY API
async function loadQuote() {
  const quoteEl = document.getElementById("quoteContent");

  try {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();

    quoteEl.textContent = `"${data.content}" — ${data.author}`;
  } catch (error) {
    console.error("Quote API error:", error);
    quoteEl.textContent = "Stay positive. Stay moving forward.";
  }
}

// Run it
loadQuote();
