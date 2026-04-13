document.addEventListener("DOMContentLoaded", () => {
  const communityTitles = {
    community: "Mark’s Community Hub"
  };

  const communityEvents = [
    "Event Item FPO",
    "Event Item FPO",
    "Event Item FPO",
    "Campus Mixer Night",
    "Design Club Meetup",
    "Peer Mentor Lunch",
    "Game Day Tailgate",
    "Open Mic Night"
  ];

  setPageTitle();
  buildCommunityEventList();
  enableDragScroll(document.getElementById("communityListViewport"));

  function setPageTitle() {
    const titleNode = document.querySelector(".page-title[data-page]");
    if (!titleNode) return;

    const pageKey = titleNode.dataset.page;
    if (communityTitles[pageKey]) {
      titleNode.textContent = communityTitles[pageKey];
    }
  }

  function buildCommunityEventList() {
    const eventList = document.getElementById("communityEventList");
    if (!eventList) return;

    eventList.innerHTML = "";

    communityEvents.forEach((labelText, index) => {
      const item = document.createElement("article");
      item.className = "community-list-item";

      const button = document.createElement("button");
      button.className = "community-list-item__button";
      button.type = "button";
      button.setAttribute("aria-label", labelText);

      button.addEventListener("click", () => {
        console.log(`Community event clicked: ${labelText} (${index + 1})`);
      });

      const label = document.createElement("span");
      label.className = "community-list-item__label";
      label.textContent = labelText;

      button.appendChild(label);
      item.appendChild(button);
      eventList.appendChild(item);
    });
  }

  function enableDragScroll(viewport) {
    if (!viewport) return;

    let isPointerDown = false;
    let startY = 0;
    let startScrollTop = 0;
    let hasDragged = false;

    viewport.addEventListener("pointerdown", (event) => {
      isPointerDown = true;
      hasDragged = false;
      startY = event.clientY;
      startScrollTop = viewport.scrollTop;

      viewport.classList.add("is-dragging");
      viewport.setPointerCapture(event.pointerId);
    });

    viewport.addEventListener("pointermove", (event) => {
      if (!isPointerDown) return;

      const deltaY = event.clientY - startY;

      if (Math.abs(deltaY) > 4) {
        hasDragged = true;
      }

      viewport.scrollTop = startScrollTop - deltaY;
    });

    function endDrag(event) {
      if (!isPointerDown) return;

      isPointerDown = false;
      viewport.classList.remove("is-dragging");

      if (event && typeof event.pointerId !== "undefined") {
        try {
          viewport.releasePointerCapture(event.pointerId);
        } catch (error) {
          // no-op
        }
      }
    }

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("pointerleave", endDrag);

    viewport.addEventListener(
      "click",
      (event) => {
        if (hasDragged) {
          event.preventDefault();
          event.stopPropagation();
          hasDragged = false;
        }
      },
      true
    );
  }
});