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