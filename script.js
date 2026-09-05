const dateNodes = document.querySelectorAll("[data-current-date]");
const now = new Date();
const dateText = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
}).format(now).replaceAll("/", " / ");

dateNodes.forEach((node) => {
  node.textContent = dateText;
  node.dateTime = now.toISOString().slice(0, 10);
});

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  const closeMenu = () => {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "Menu";
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "Close" : "Menu";
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

let toastTimer;
document.querySelectorAll("[data-placeholder-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const toast = document.querySelector("#toast");
    if (!toast) return;

    toast.textContent = `${link.textContent.trim()} is ready for Leena's profile URL.`;
    toast.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3200);
  });
});

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");

if (lightbox instanceof HTMLDialogElement && lightboxImage && lightboxCaption) {
  const closeLightbox = () => {
    lightbox.close();
    lightboxImage.removeAttribute("src");
  };

  document.querySelectorAll("[data-lightbox]").forEach((button) => {
    button.addEventListener("click", () => {
      const preview = button.querySelector("img");
      lightboxImage.setAttribute("src", button.dataset.src || "");
      lightboxImage.setAttribute("alt", preview?.getAttribute("alt") || "Expanded photograph");
      lightboxCaption.textContent = button.dataset.caption || "";
      lightbox.showModal();
    });
  });

  lightbox.querySelector("[data-lightbox-close]")?.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}
