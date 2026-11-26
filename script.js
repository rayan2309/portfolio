(function () {
  "use strict";

  var root = document.documentElement;

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

  /* Apparition au défilement */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* Année du pied de page */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
