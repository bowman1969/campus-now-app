/* =========================
   CAROUSEL
========================= */

const track = document.getElementById("featureTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

if (track && prevBtn && nextBtn) {
  let index = 0;
  const cardWidth = 116; // card width + gap
  const maxIndex = Math.max(0, track.children.length - 3);

  function updateCarousel() {
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  nextBtn.addEventListener("click", () => {
    if (index < maxIndex) {
      index++;
      updateCarousel();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (index > 0) {
      index--;
      updateCarousel();
    }
  });
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
  if (savedAvatar) {
    avatarPreview.src = savedAvatar;
  } else {
    avatarPreview.src = defaultAvatar;
  }

  updateAvatarTooltip();

  avatarPreview.addEventListener("mouseenter", () => {
    if (!localStorage.getItem("avatar")) {
      avatarPreview.src = hoverAvatar;
    }
  });

  avatarPreview.addEventListener("mouseleave", () => {
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