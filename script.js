// Interactive features for Kunal's Black & Gold portfolio
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");
const progressBar = document.getElementById("progressBar");
const toTop = document.getElementById("toTop");
const typingRole = document.getElementById("typingRole");
const cursorGlow = document.querySelector(".cursor-glow");

// Mobile navigation
menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});
navItems.forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

// Typing animation
const roles = ["Data Analyst", "Python Developer", "Problem Solver"];
let roleIndex = 0, letterIndex = roles[0].length, deleting = true;
function typeRole() {
  if (!typingRole || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const current = roles[roleIndex];
  typingRole.textContent = current.slice(0, letterIndex);
  if (deleting) {
    letterIndex--;
    if (letterIndex < 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; letterIndex = 0; }
  } else {
    letterIndex++;
    if (letterIndex > roles[roleIndex].length) {
      deleting = true;
      window.setTimeout(typeRole, 1250);
      return;
    }
  }
  window.setTimeout(typeRole, deleting ? 48 : 85);
}
if (typingRole) window.setTimeout(typeRole, 1600);

// Reveal elements as they enter the viewport
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("visible"));
}

// Scroll progress, active section, and back-to-top button
const sections = document.querySelectorAll("main section[id]");
function onScroll() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if (progressBar) progressBar.style.width = `${percent}%`;
  toTop?.classList.toggle("show", window.scrollY > 450);

  let activeId = "home";
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 150) activeId = section.id;
  });
  navItems.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Soft gold spotlight follows the pointer on devices that support hover
if (cursorGlow && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  window.addEventListener("pointermove", event => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });
} else if (cursorGlow) {
  cursorGlow.style.display = "none";
}

// Subtle 3D tilt on project cards; disabled on touch and reduced-motion devices
const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (canTilt) {
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 4}deg) rotateY(${(x - 0.5) * 5}deg) translateY(-3px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

// Keep the footer year current
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
