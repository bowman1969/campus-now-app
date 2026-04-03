window.addEventListener("DOMContentLoaded", function () {
  const word = document.getElementById("word");
  const container = document.getElementById("word-container");

  // Create a hidden element to measure text width accurately
  const measure = document.createElement("span");
  measure.className = "measure-word";
  document.body.appendChild(measure);

  function getTextWidth(text) {
    measure.textContent = text;
    return Math.ceil(measure.getBoundingClientRect().width);
  }

  // Set initial width
  container.style.width = `${getTextWidth("everything")}px`;

  setTimeout(() => {
    word.classList.add("fade-out");

    setTimeout(() => {
      const newText = "everyone";
      const newWidth = getTextWidth(newText);

      word.textContent = newText;
      container.style.width = `${newWidth}px`;

      word.classList.remove("fade-out");
      word.classList.add("fade-in");

      setTimeout(() => {
        word.classList.remove("fade-in");
      }, 450);
    }, 450);
  }, 1400);
});