(() => {
  const data = window.libraryData;
  if (!data || !Array.isArray(data.items)) return;

  const state = { filter: "all" };
  const recentGrid = document.getElementById("recentGrid");
  const catalogueGrid = document.getElementById("catalogueGrid");
  const shelfIndexRows = document.getElementById("shelfIndexRows");
  const catalogueCount = document.getElementById("catalogueCount");
  const itemModal = document.getElementById("itemModal");
  const modalContent = document.getElementById("modalContent");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const toast = document.getElementById("toast");

  const escapeHtml = (value = "") => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const visualClass = (visual) => `visual-${visual || "lines-ink"}`;

  function renderRecent() {
    const featured = data.items.filter((item) => item.featured).slice(0, 4);
    recentGrid.innerHTML = featured.map((item) => `
      <button class="recent-card ${visualClass(item.visual)}" type="button" data-open-item="${escapeHtml(item.id)}">
        <span class="card-art" aria-hidden="true"></span>
        <span class="card-headerline">
          <span>${escapeHtml(item.type)}</span>
          ${item.starter ? '<span class="starter-chip">Starter</span>' : `<span>${escapeHtml(item.date)}</span>`}
        </span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.excerpt)}</p>
        <span class="card-footerline"><span>${escapeHtml(item.meta)}</span><span>Open ↗</span></span>
      </button>
    `).join("");
  }

  function renderShelfIndex() {
    shelfIndexRows.innerHTML = data.shelves.map((shelf, index) => {
      const count = data.items.filter((item) => item.shelf === shelf.id).length;
      return `
        <button class="index-row" type="button" data-index-filter="${escapeHtml(shelf.id)}">
          <span class="index-number">${String(index + 1).padStart(2, "0")}</span>
          <span class="index-label">${escapeHtml(shelf.label)}</span>
          <span class="index-count">${String(count).padStart(2, "0")}</span>
        </button>
      `;
    }).join("");
  }

  function cardSymbol(item) {
    const symbols = {
      writing: "W",
      watched: "F",
      listening: "L",
      made: "M",
      chapters: "C"
    };
    return symbols[item.shelf] || "•";
  }

  function renderCatalogue() {
    const items = state.filter === "all"
      ? data.items
      : data.items.filter((item) => item.shelf === state.filter);

    catalogueCount.textContent = `${String(items.length).padStart(2, "0")} records`;

    if (!items.length) {
      catalogueGrid.innerHTML = '<div class="catalogue-empty">This shelf is waiting.</div>';
      return;
    }

    catalogueGrid.innerHTML = items.map((item) => `
      <button class="catalogue-card" type="button" data-open-item="${escapeHtml(item.id)}">
        <span class="catalogue-topline">
          <span>${escapeHtml(item.type)}</span>
          ${item.starter ? '<span>Starter entry</span>' : `<span>${escapeHtml(item.date)}</span>`}
        </span>
        <span class="catalogue-symbol" aria-hidden="true"><span class="sr-only">${cardSymbol(item)}</span></span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.excerpt)}</p>
        <span class="catalogue-bottom"><span>${escapeHtml(item.meta)}</span><span>↗</span></span>
      </button>
    `).join("");
  }

  function setFilter(filter) {
    state.filter = filter;
    document.querySelectorAll(".filter-button").forEach((button) => {
      button.classList.toggle("active", button.dataset.filter === filter);
    });
    renderCatalogue();
  }

  function getItem(id) {
    return data.items.find((item) => item.id === id);
  }

  function openItem(id) {
    const item = getItem(id);
    if (!item) return;

    modalContent.innerHTML = `
      ${item.image ? `<img class="modal-image" src="${escapeHtml(item.image)}" alt="Cover for ${escapeHtml(item.title)}" />` : ""}
      <div class="modal-inner">
        <div class="modal-meta">
          <span>${escapeHtml(item.type)}</span>
          <span>${escapeHtml(item.meta)}</span>
          <span>${escapeHtml(item.date)}</span>
        </div>
        <h2 id="modalTitle">${escapeHtml(item.title)}</h2>
        <p class="modal-dek">${escapeHtml(item.excerpt)}</p>
        <div class="modal-body">
          ${item.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </div>
        <div class="modal-tags">${item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        ${item.starter ? '<div class="modal-starter">This is starter copy created to demonstrate the library. Replace it with Leena’s real post, film note or listening entry in content.js.</div>' : ""}
      </div>
    `;

    itemModal.classList.add("open");
    itemModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    window.location.hash = `item=${encodeURIComponent(item.id)}`;
  }

  function closeItem({ preserveHash = false } = {}) {
    itemModal.classList.remove("open");
    itemModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (!preserveHash && window.location.hash.startsWith("#item=")) {
      history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }

  function openSearch() {
    searchOverlay.classList.add("open");
    searchOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    window.setTimeout(() => searchInput.focus(), 30);
  }

  function closeSearch() {
    searchOverlay.classList.remove("open");
    searchOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    searchInput.value = "";
    searchResults.innerHTML = '<p class="search-empty">Type a word. I’ll look through titles, notes and tags.</p>';
  }

  function searchItems(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      searchResults.innerHTML = '<p class="search-empty">Type a word. I’ll look through titles, notes and tags.</p>';
      return;
    }

    const matches = data.items.filter((item) => {
      const haystack = [item.title, item.excerpt, item.type, item.meta, ...item.tags, ...item.body].join(" ").toLowerCase();
      return haystack.includes(normalized);
    });

    searchResults.innerHTML = matches.length
      ? matches.map((item) => `
          <button class="search-result" type="button" data-search-item="${escapeHtml(item.id)}">
            <small>${escapeHtml(item.type)}</small>
            <strong>${escapeHtml(item.title)}</strong>
            <span>↗</span>
          </button>
        `).join("")
      : `<p class="search-empty">No card contains “${escapeHtml(query)}” yet. That might be a new shelf.</p>`;
  }

  let toastTimeout;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("show"), 2500);
  }

  function updateScrollProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    document.getElementById("scrollProgress").style.width = `${percent}%`;
  }

  function readHash() {
    if (!window.location.hash.startsWith("#item=")) return;
    const id = decodeURIComponent(window.location.hash.replace("#item=", ""));
    if (getItem(id)) openItem(id);
  }

  renderRecent();
  renderShelfIndex();
  renderCatalogue();
  readHash();

  document.addEventListener("click", (event) => {
    const openTrigger = event.target.closest("[data-open-item]");
    if (openTrigger) openItem(openTrigger.dataset.openItem);

    const searchTrigger = event.target.closest("[data-search-item]");
    if (searchTrigger) {
      closeSearch();
      openItem(searchTrigger.dataset.searchItem);
    }

    const filterTrigger = event.target.closest("[data-index-filter]");
    if (filterTrigger) {
      setFilter(filterTrigger.dataset.indexFilter);
      document.getElementById("shelves").scrollIntoView({ behavior: "smooth" });
    }

    if (event.target.closest("[data-close-modal]")) closeItem();

    const placeholder = event.target.closest("[data-placeholder-link]");
    if (placeholder) {
      event.preventDefault();
      showToast("Replace this placeholder with Leena’s real link.");
    }
  });

  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.filter));
  });

  document.getElementById("searchOpen").addEventListener("click", openSearch);
  document.getElementById("indexSearch").addEventListener("click", openSearch);
  document.getElementById("searchClose").addEventListener("click", closeSearch);
  searchOverlay.addEventListener("click", (event) => { if (event.target === searchOverlay) closeSearch(); });
  searchInput.addEventListener("input", (event) => searchItems(event.target.value));

  document.getElementById("randomItem").addEventListener("click", () => {
    const random = data.items[Math.floor(Math.random() * data.items.length)];
    openItem(random.id);
  });

  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  });
  mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  }));

  document.addEventListener("keydown", (event) => {
    const commandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
    if (commandK) {
      event.preventDefault();
      openSearch();
    }
    if (event.key === "Escape") {
      if (itemModal.classList.contains("open")) closeItem();
      if (searchOverlay.classList.contains("open")) closeSearch();
    }
  });

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#item=")) readHash();
    else if (itemModal.classList.contains("open")) closeItem({ preserveHash: true });
  });
  updateScrollProgress();
})();
