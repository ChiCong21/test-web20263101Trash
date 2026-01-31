/* =========================
   LOAD COMPONENTS
========================= */
const BASE = location.pathname.includes("/pages/") ? ".." : ".";

async function loadComponent(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  try {
    const res = await fetch(url);
    el.innerHTML = await res.text();
  } catch (e) {
    console.error("Failed to load:", url);
  }
}


loadComponent("#site-header", `${BASE}/components/navbar.html`);
loadComponent("#site-footer", `${BASE}/components/footer.html`);

loadComponent("#hero", `${BASE}/components/hero.html`);
loadComponent("#home", `${BASE}/pages/home.html`);
loadComponent("#sns-bar", `${BASE}/components/sns-bar.html`);






window.addEventListener("scroll", () => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  header.classList.toggle("is-scrolled", window.scrollY > 20);
});

function activeNavLink() {
  const current = location.pathname.replace(/\/$/, "");
  document.querySelectorAll(".nav-menu a").forEach((a) => {
    const href = new URL(a.getAttribute("href"), location.origin);
    const path = href.pathname.replace(/\/$/, "");
    if (path === current) a.classList.add("active");
  });
}

activeNavLink();





/* =========================
   SPLIT GALLERY
========================= */
const galleryImages = [
  `${BASE}/assets/images/gallery/p7.png`,
  `${BASE}/assets/images/gallery/girls.png`,
  `${BASE}/assets/images/gallery/p1.png`,
  `${BASE}/assets/images/gallery/p2.png`,
  `${BASE}/assets/images/gallery/p3.png`,
  `${BASE}/assets/images/gallery/p4.png`,
  `${BASE}/assets/images/gallery/p5.png`,
  `${BASE}/assets/images/gallery/p6.png`,
];


let galleryIndex = 0;
let autoTimer = null;

function initSplitGallery() {
  const split = document.getElementById("splitGallery");
  const leftImg = document.getElementById("leftImg");
  const rightImg = document.getElementById("rightImg");
  const btnPrev = document.getElementById("galleryPrev");
  const btnNext = document.getElementById("galleryNext");

  if (!split || !leftImg || !rightImg) return;

  const getImg = (i) =>
    galleryImages[(i + galleryImages.length) % galleryImages.length];

  function animate() {
    leftImg.classList.remove("enter");
    rightImg.classList.remove("enter");


    void leftImg.offsetHeight;
    void rightImg.offsetHeight;

    leftImg.classList.add("enter");
    rightImg.classList.add("enter");
  }

  function render() {
    leftImg.src = getImg(galleryIndex);
    rightImg.src = getImg(galleryIndex + 1);

 
    requestAnimationFrame(() => {
      animate();
    });
  }

  function next() {
    split.dataset.mode = "next";
    galleryIndex = (galleryIndex + 2) % galleryImages.length;
    render();
  }

  function prev() {
    split.dataset.mode = "prev";
    galleryIndex =
      (galleryIndex - 2 + galleryImages.length) % galleryImages.length;
    render();
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 2000); 
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  // Buttons
  btnNext?.addEventListener("click", () => {
    next();
    startAuto();
  });

  btnPrev?.addEventListener("click", () => {
    prev();
    startAuto(); 
  });

 
  split.addEventListener("mouseenter", stopAuto);
  split.addEventListener("mouseleave", startAuto);


  split.dataset.mode = "next";
  render();
  startAuto(); 
}


const waitGallery = setInterval(() => {
  if (document.getElementById("splitGallery")) {
    initSplitGallery();
    clearInterval(waitGallery);
  }
}, 60);


function applyBasePaths(root = document) {
  // Set logo images
  root.querySelectorAll("[data-path]").forEach((el) => {
    const p = el.getAttribute("data-path");
    el.setAttribute("src", `${BASE}/${p}`);
  });

  // Set internal links 
  root.querySelectorAll("[data-href]").forEach((a) => {
    const p = a.getAttribute("data-href");
    a.setAttribute("href", `${BASE}/${p}`);
  });
}



// Watch header/footer inserted by fetch, then apply paths
const mo = new MutationObserver(() => {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  if (header) applyBasePaths(header);
  if (footer) applyBasePaths(footer);
});

mo.observe(document.body, { childList: true, subtree: true });

function setActiveMenu() {
  const currentPage = location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-menu a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const dataHref = link.getAttribute("data-href");
    const linkPath = (href || dataHref || "").split("/").pop();

    if (linkPath === currentPage) {
      link.classList.add("active");
    }

    if (currentPage === "" && linkPath === "index.html") {
      link.classList.add("active");
    }
  });
}

window.addEventListener("load", setActiveMenu);

// button navbar
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");
  const closeEls = document.querySelectorAll("[data-nav-close]");
  const links = menu ? menu.querySelectorAll("a") : [];

  if (!btn || !menu) return;

  const openNav = () => {
    document.body.classList.add("nav-open");
    btn.setAttribute("aria-expanded", "true");
  };

  const closeNav = () => {
    document.body.classList.remove("nav-open");
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", () => {
    const isOpen = document.body.classList.contains("nav-open");
    isOpen ? closeNav() : openNav();
  });

  closeEls.forEach(el => el.addEventListener("click", closeNav));
  links.forEach(a => a.addEventListener("click", closeNav));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
});













