const track = document.getElementById("featureTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let index = 0;
const cardWidth = 112; // 100px + gap
const maxIndex = 5; // 8 items, show 3 → 5 moves

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

/* Button sticky active state */

const signupBtn = document.getElementById("signupBtn");

signupBtn.addEventListener("click", () => {
  signupBtn.classList.toggle("active");
});