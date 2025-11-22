const slider = document.getElementById("slider");
const sliderScroll = slider.querySelector(".slider-scroll-container");
const about = document.getElementById("about");
var x = window.matchMedia("(max-width: 1024px)");
const btn = document.getElementById("toggleBtn");

// Toggle visibility with media query
function myFunction(x) {
  if (x.matches) {
    btn.addEventListener("click", toggleSlider);
    sliderScroll.addEventListener("click", toggleSlider);
  } else {
    slider.classList.remove("active");
    about.classList.remove("visible");
    sliderScroll.removeEventListener("click", toggleSlider);
  }
}

function toggleSlider() {
  const isActive = slider.classList.toggle("active");
  btn.textContent = isActive ? "Less  -" : "More  +";
  about.classList.toggle("visible", isActive);
}

// Initial check
myFunction(x);

// Listen for changes in the query
x.addEventListener("change", myFunction);

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

// Sync scroll between carousel and about
sliderScroll.addEventListener("scroll", () => {
  const maxImageScroll = sliderScroll.scrollWidth - sliderScroll.clientWidth;
  const maxDescScroll = about.scrollWidth - sliderScroll.clientWidth;
  const scrollRatio = sliderScroll.scrollLeft / maxImageScroll;

  // Move the description track exactly in sync
  about.style.transform = `translateX(-${scrollRatio * maxDescScroll}px)`;
});

//firefox click and drag fix
document.querySelectorAll(".slider-scroll-container img").forEach((img) => {
  img.draggable = false;
});
