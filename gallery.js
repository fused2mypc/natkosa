import { galleries } from "./data.js";

// ELEMENTS
const img = document.getElementById("galleryImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const counter = document.getElementById("counter");
const banner = document.getElementById("galleryBanner");

// GET GALLERY TYPE
const params = new URLSearchParams(window.location.search);
const type = params.get("type") || "album";
let config = galleries[type];

if (!config) {
  console.error("Gallery type not found:", type);
  if (galleries.album) {
    console.warn("Falling back to 'album' gallery.");
    config = galleries.album;
  }
}

// STATE
let currentIndex = 0;

// BUILD PATH
function getImagePath(index) {
  return `${config.folder}/${config.prefix}${index}.${config.ext}`;
}

// UPDATE IMAGE
function loadImage(index) {
  if (!config || !Number.isFinite(config.count) || config.count === 0) return;

  currentIndex = (index + config.count) % config.count;
  const path = getImagePath(currentIndex);

  img.src = path;
  img.alt = `${type} ${currentIndex + 1}`;
  counter.textContent = `${currentIndex + 1} / ${config.count}`;

  // preload neighbors
  preload(currentIndex + 1);
  preload(currentIndex - 1);
}

// PRELOAD
function preload(index) {
  if (!config || !Number.isFinite(config.count) || config.count === 0) return;
  const i = (index + config.count) % config.count;
  const pre = new Image();
  pre.src = getImagePath(i);
}

// NAV BUTTONS
prevBtn.addEventListener("click", () => loadImage(currentIndex - 1));
nextBtn.addEventListener("click", () => loadImage(currentIndex + 1));

function updateNavDisabled() {
  if (!config || !Number.isFinite(config.count)) return;
  const single = config.count <= 1;
  prevBtn.disabled = single;
  nextBtn.disabled = single;
  prevBtn.setAttribute("aria-disabled", String(single));
  nextBtn.setAttribute("aria-disabled", String(single));
}
updateNavDisabled();

// KEYBOARD (left/right)
document.addEventListener("keydown", (e) => {
  const active = document.activeElement;
  if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)) return;
  if (e.key === "ArrowLeft") loadImage(currentIndex - 1);
  if (e.key === "ArrowRight") loadImage(currentIndex + 1);
});

// SWIPE (touch)
let startX = 0;
img.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
img.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  if (endX - startX > 50) loadImage(currentIndex - 1);
  if (startX - endX > 50) loadImage(currentIndex + 1);
});

// BANNER (click/keyboard -> home)
if (banner) {
  banner.addEventListener("click", () => { window.location.href = "index.html"; });
  banner.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.location.href = "index.html";
    }
  });
}

// IMAGE ERROR HANDLING
img.addEventListener("error", () => {
  console.error("Failed to load image:", img.src);
  img.alt = "Image not available";
  img.src = "";
  const overlay = document.querySelector(".image-overlay");
  if (overlay) overlay.textContent = "Image not available";
});

// INIT
if (config && config.count > 0) {
  loadImage(0);
} else {
  counter.textContent = "0 / 0";
  prevBtn.disabled = true;
  nextBtn.disabled = true;
}
