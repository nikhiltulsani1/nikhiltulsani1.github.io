(function () {
  "use strict";
  const root = document.documentElement;
  const body = document.body;
  const themeButton = document.getElementById("themeToggle");
  const menu = document.getElementById("mobileNavPanel");
  const menuButton = document.getElementById("mobileMenuBtn");
  const dialog = document.getElementById("profileBackdrop");
  const contactButton = document.getElementById("profileToggle");
  const closeButton = dialog.querySelector(".profile-close");
  const THEME_KEY = "nikhil_portfolio_theme";
  const VIEW_KEY = "nikhil_portfolio_view";
  let returnFocus = null;
  function safeStorageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeStorageSet(key,value) {
    try { localStorage.setItem(key,value); } catch (e) { /* Storage can be unavailable. */ }
  }
  function setTheme(value) {
    root.toggleAttribute("data-theme", false);
    if (value === "dark") root.setAttribute("data-theme","dark");
    const dark = value === "dark";
    themeButton.textContent = dark ? "Light" : "Dark";
    themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? "#181d1b" : "#f7f6f2";
    safeStorageSet(THEME_KEY,value);
  }
  const savedTheme = safeStorageGet(THEME_KEY);
  const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(savedTheme === "dark" || savedTheme === "light" ? savedTheme : (systemDark ? "dark" : "light"));
  themeButton.addEventListener("click",function(){
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });
  window.toggleMobileMenu = function () {
    const shouldOpen = menu.hidden;
    menu.hidden = !shouldOpen;
    menuButton.setAttribute("aria-expanded",String(shouldOpen));
    menuButton.setAttribute("aria-label",shouldOpen ? "Close menu" : "Open menu");
  };
  window.closeMobileMenu = function () {
    menu.hidden = true;
    menuButton.setAttribute("aria-expanded","false");
    menuButton.setAttribute("aria-label","Open menu");
  };
  window.openProfile = function () {
    returnFocus = document.activeElement;
    dialog.classList.add("open");
    contactButton.setAttribute("aria-expanded","true");
    closeButton.focus();
  };
  window.closeProfile = function () {
    if (!dialog.classList.contains("open")) return;
    dialog.classList.remove("open");
    contactButton.setAttribute("aria-expanded","false");
    if (returnFocus && typeof returnFocus.focus === "function") returnFocus.focus();
  };
  dialog.addEventListener("click",function(event) {
    if (event.target === dialog) window.closeProfile();
  });
  dialog.addEventListener("keydown",function(event) {
    if (event.key !== "Tab") return;
    const items = [...dialog.querySelectorAll('a[href],button:not([disabled])')];
    if (!items.length) return;
    const first=items[0],last=items[items.length-1];
    if (event.shiftKey && document.activeElement===first) {event.preventDefault();last.focus();}
    else if (!event.shiftKey && document.activeElement===last) {event.preventDefault();first.focus();}
  });
  document.addEventListener("keydown",function(event){
    if (event.key === "Escape") { window.closeProfile(); window.closeMobileMenu(); }
  });
  const titles = {
    ai: "Nikhil Tulsani | Applied AI Projects & Quality Engineering",
    qa: "Nikhil Tulsani | Quality Engineering & Automation Leadership"
  };
  window.setView = function(view) {
    const name = view === "qa" ? "qa" : "ai";
    body.setAttribute("data-view",name);
    document.getElementById("view-ai").classList.toggle("active",name==="ai");
    document.getElementById("view-qa").classList.toggle("active",name==="qa");
    for (const [id,active] of [["btnAI",name==="ai"],["btnQA",name==="qa"]]) {
      const el=document.getElementById(id);
      el.classList.toggle("active",active);
      el.setAttribute("aria-pressed",String(active));
    }
    document.getElementById("mnp-ai").hidden=name!=="ai";
    document.getElementById("mnp-qa").hidden=name!=="qa";
    document.title=titles[name];
    safeStorageSet(VIEW_KEY,name);
    window.closeMobileMenu();
    window.scrollTo(0,0);
  };
  window.setView(safeStorageGet(VIEW_KEY) || "ai");
})();