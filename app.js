(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme");
  var STORE = "rwakan-theme";

  function stored() {
    try { return localStorage.getItem(STORE); } catch (e) { return null; }
  }
  function system() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function apply(mode) {
    root.setAttribute("data-theme", mode);
    btn.setAttribute("aria-pressed", String(mode === "dark"));
    btn.textContent = mode === "dark" ? "☾" : "☀";
    btn.setAttribute("aria-label", mode === "dark" ? "التبديل إلى المظهر الفاتح" : "التبديل إلى المظهر الداكن");
  }

  var saved = stored();
  apply(saved === "dark" || saved === "light" ? saved : system());

  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(next);
    try { localStorage.setItem(STORE, next); } catch (e) { /* التخزين مقفول: التبديل يفضل للشدة دي */ }
  });

  var viewer = document.getElementById("viewer");
  var viewerImg = document.getElementById("viewer-img");
  var viewerCaption = document.getElementById("viewer-caption");

  Array.prototype.forEach.call(document.querySelectorAll(".shot-btn"), function (shot) {
    shot.addEventListener("click", function () {
      var thumb = shot.querySelector("img");
      viewerImg.src = shot.getAttribute("data-src");
      viewerImg.alt = thumb ? thumb.alt : "";
      viewerCaption.textContent = shot.getAttribute("data-caption") || "";
      viewer.showModal();
    });
  });

  document.getElementById("viewer-close").addEventListener("click", function () {
    viewer.close();
  });

  var reel = document.getElementById("reel");
  if (reel) {
    var slides = reel.querySelectorAll(".slide");
    var dots = document.getElementById("reel-dots");
    var caption = document.getElementById("reel-caption");
    var current = 0;
    var timer = null;
    var paused = false;
    var GAP = 3800;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    slides = Array.prototype.slice.call(slides);

    slides.forEach(function (slide, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "اللقطة " + (i + 1));
      dot.setAttribute("aria-selected", String(i === current));
      dot.addEventListener("click", function () {
        show(i);
        paused = true;
      });
      dots.appendChild(dot);
    });

    var dotEls = Array.prototype.slice.call(dots.children);

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("on", i === current);
      });
      dotEls.forEach(function (dot, i) {
        dot.setAttribute("aria-selected", String(i === current));
      });
      caption.textContent = slides[current].getAttribute("data-caption") || "";
    }

    function start() {
      if (timer || reduceMotion) return;
      timer = window.setInterval(function () {
        if (!paused && !document.hidden) show(current + 1);
      }, GAP);
    }

    reel.addEventListener("mouseenter", function () { paused = true; });
    reel.addEventListener("mouseleave", function () { paused = false; });
    reel.addEventListener("focusin", function () { paused = true; });
    reel.addEventListener("focusout", function () { paused = false; });
    dots.addEventListener("focusin", function () { paused = true; });
    dots.addEventListener("focusout", function () { paused = false; });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { window.clearInterval(timer); timer = null; } else { start(); }
    });

    if (reduceMotion) {
      var jump = document.createElement("button");
      jump.type = "button";
      jump.className = "reel-next";
      jump.textContent = "اللقطة التالية";
      jump.addEventListener("click", function () { show(current + 1); });
      dots.parentNode.insertBefore(jump, caption);
    }

    start();
  }
})();
