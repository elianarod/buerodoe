const slider = document.getElementById("slider");
const btn = document.getElementById("toggleBtn");
const sliderScroll = slider.querySelector(".slider-scroll-container");
const descriptionSection = document.getElementById("projectDescriptions");
const descriptionTrack = descriptionSection.querySelector(".description-track");

// Toggle visibility
function toggleSlider() {
  const isActive = slider.classList.toggle("active");
  btn.textContent = isActive ? "Less  -" : "More  +";
  descriptionSection.classList.toggle("visible", isActive);
}

btn.addEventListener("click", toggleSlider);
sliderScroll.addEventListener("click", toggleSlider);

// Prevent click after dragging
let isDragging = false;

sliderScroll.addEventListener("mousedown", (e) => {
  isDragging = false;

  const onMouseMove = () => {
    isDragging = true;
  };

  const onMouseUp = (e) => {
    sliderScroll.removeEventListener("mousemove", onMouseMove);
    sliderScroll.removeEventListener("mouseup", onMouseUp);

    if (isDragging) {
      // Temporarily disable click
      const preventClick = (e) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        sliderScroll.removeEventListener("click", preventClick, true);
      };
      sliderScroll.addEventListener("click", preventClick, true);
    }
  };

  sliderScroll.addEventListener("mousemove", onMouseMove);
  sliderScroll.addEventListener("mouseup", onMouseUp);
});

// Sync scroll between carousel and descriptions
sliderScroll.addEventListener("scroll", () => {
  const maxImageScroll = sliderScroll.scrollWidth - sliderScroll.clientWidth;
  const maxDescScroll = descriptionTrack.scrollWidth - sliderScroll.clientWidth;
  const scrollRatio = sliderScroll.scrollLeft / maxImageScroll;

  // Move the description track exactly in sync
  descriptionTrack.style.transform = `translateX(-${
    scrollRatio * maxDescScroll
  }px)`;
});

// Click and drag image carousel
let isDown = false;
let startX;
let scrollLeft;

sliderScroll.addEventListener("mousedown", (e) => {
  isDown = true;
  sliderScroll.classList.add("dragging");
  startX = e.pageX - sliderScroll.offsetLeft;
  scrollLeft = sliderScroll.scrollLeft;
});

sliderScroll.addEventListener("mouseleave", () => {
  isDown = false;
  sliderScroll.classList.remove("dragging");
});

sliderScroll.addEventListener("mouseup", () => {
  isDown = false;
  sliderScroll.classList.remove("dragging");
});

sliderScroll.addEventListener("mousemove", (e) => {
  if (!isDown) return; // stop if not dragging
  e.preventDefault();
  const x = e.pageX - sliderScroll.offsetLeft;
  const walk = (x - startX) * 1.2; // multiply for scroll speed
  sliderScroll.scrollLeft = scrollLeft - walk;
});

//firefox click and drag fix
document.querySelectorAll(".slider-scroll-container img").forEach((img) => {
  img.draggable = false;
});

// Set initial carousel position on page load
window.addEventListener("load", () => {
  let initialOffset;

  if (window.innerWidth <= 768) {
    // Mobile / tablet
    initialOffset = 40;
  } else {
    // Desktop
    initialOffset = 100;
  }

  sliderScroll.scrollLeft = initialOffset;
});