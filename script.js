(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Thème : mémorisé si le navigateur l'autorise, sinon préférence système. */
  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* ignoré */ }
  }

  var saved = safeGet("theme");
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);

  var themeBtn = document.getElementById("theme");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var explicit = root.getAttribute("data-theme");
      var systemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      var current = explicit || (systemLight ? "light" : "dark");
      var next = current === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      safeSet("theme", next);
    });
  }

  /* Menu mobile */
  var menu = document.getElementById("menu");
  var menuBtn = document.getElementById("menu-btn");
  if (menu && menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Compteurs animés : seulement si le mouvement n'est pas réduit. */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target) || reduceMotion) return;
    var start = null;
    var duration = 900;
    el.textContent = "0";
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  /* Apparition au défilement */
  var items = document.querySelectorAll(".reveal");
  function show(el) {
    el.classList.add("in");
    var counter = el.querySelector("[data-count]");
    if (counter) countUp(counter);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          show(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(show);
  }

  /* Halo qui suit le curseur sur les cartes (variables CSS, compatible CSP). */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".glow").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* Barre de progression de lecture */
  var ticking = false;
  function updateProgress() {
    var max = root.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    root.style.setProperty("--progress", p.toFixed(4));
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();

  /* Année du pied de page */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
