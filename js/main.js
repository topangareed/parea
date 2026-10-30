/* PARÉA ZION — interactions */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* Header turns solid once you scroll past the top of the hero */
  var header = document.getElementById("header");
  var hero = document.getElementById("hero");
  function onScroll() {
    var limit = hero ? hero.offsetHeight - 80 : 24;
    header.classList.toggle("is-scrolled", window.scrollY > limit);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* Fade-in on scroll */
  var els = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* Newsletter */
  var form = document.getElementById("newsletterForm");
  var note = document.getElementById("formNote");
  if (form && note) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var btn = form.querySelector("button");
      var input = form.querySelector('input[name="EMAIL"]');
      var email = (input.value || "").trim();
      note.className = "form-note";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        note.classList.add("is-err");
        note.textContent = "Please enter a valid email address.";
        input.focus();
        return;
      }
      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending…";
      try {
        var res = await fetch("/api/newsletter", { method: "POST", body: new FormData(form) });
        var data = await res.json().catch(function () { return {}; });
        if (res.ok) {
          note.textContent = data.message || "Thank you. We’ll be in touch.";
          form.reset();
        } else {
          note.classList.add("is-err");
          note.textContent = data.message || "Something went wrong. Please try again.";
        }
      } catch (err) {
        note.classList.add("is-err");
        note.textContent = "Network error. Please try again.";
      } finally {
        btn.disabled = false;
        btn.textContent = label;
      }
    });
  }

  /* Smooth in-page scrolling */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id === "#top") { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); return; }
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });
})();
