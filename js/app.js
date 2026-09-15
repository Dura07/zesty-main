document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('floating-search-container');
  const searchBtn = document.getElementById('floating-search-btn');
  const searchCard = document.getElementById('floating-search-card');
  const searchInput = document.getElementById('menu-search-input');
  const clearBtn = document.getElementById('search-clear-btn');
  const resultsDropdown = document.getElementById('search-results-dropdown');
  const resultsList = document.getElementById('search-results-list');
  const searchIcon = searchBtn.querySelector('.search-icon');
  const closeIcon = searchBtn.querySelector('.close-icon');

  if (!container || !searchBtn) return;

  // --------------------------------------------------
  // 1. Drag & Drop Engine (Mouse + Touch)
  // --------------------------------------------------
  let isDragging = false;
  let hasMoved = false;
  let startX = 0, startY = 0;
  let initialLeft = 0, initialTop = 0;

  function onDragStart(e) {
    isDragging = true;
    hasMoved = false;

    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    startX = clientX;
    startY = clientY;

    const rect = container.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    // Switch container from bottom/right to explicit top/left positioning on first move
    container.style.bottom = 'auto';
    container.style.right = 'auto';
    container.style.left = `${initialLeft}px`;
    container.style.top = `${initialTop}px`;

    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);
  }

  function onDragMove(e) {
    if (!isDragging) return;

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    // Threshold to distinguish between tap vs drag
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      hasMoved = true;
    }

    if (hasMoved) {
      if (e.cancelable) e.preventDefault(); // Stop mobile scroll while dragging

      // Keep inside screen bounds
      const newLeft = Math.max(10, Math.min(window.innerWidth - container.offsetWidth - 10, initialLeft + deltaX));
      const newTop = Math.max(10, Math.min(window.innerHeight - container.offsetHeight - 10, initialTop + deltaY));

      container.style.left = `${newLeft}px`;
      container.style.top = `${newTop}px`;
    }
  }

  function onDragEnd() {
    isDragging = false;
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('touchend', onDragEnd);
  }

  searchBtn.addEventListener('mousedown', onDragStart);
  searchBtn.addEventListener('touchstart', onDragStart, { passive: false });

  // --------------------------------------------------
  // 2. Toggle Search Card (Only on Click, not Drag)
  // --------------------------------------------------
  searchBtn.addEventListener('click', (e) => {
    if (hasMoved) return; // Ignore clicks if button was dragged

    const isHidden = searchCard.hidden;
    searchCard.hidden = !isHidden;
    searchIcon.hidden = isHidden;
    closeIcon.hidden = !isHidden;

    if (isHidden) {
      searchInput.focus();
    }
  });

  // --------------------------------------------------
  // 3. Search Database & Filtering
  // --------------------------------------------------
  const menuPages = [
    { name: 'Yogurt & Smoothies', url: 'yoghurt.html' },
    { name: 'Grill', url: 'grill.html' },
    { name: 'Shawarma', url: 'shawarma.html' },
    { name: 'Main Dishes', url: 'main-dish.html' },
    { name: 'Finger Foods', url: 'finger-foods.html' },
    { name: 'Pepper Soup', url: 'pepper-soup.html' },
    { name: 'Beers', url: 'beer.html' },
    { name: 'Spirits & Liquor', url: 'spirits.html' },
    { name: 'Wines', url: 'wines.html' },
    { name: 'Energy Drinks', url: 'energy.html' },
    { name: 'Bitters', url: 'bitters.html' },
    { name: 'Non-Alcoholic', url: 'non-alcoholic.html' }
  ];

  let globalMenuDatabase = [];
  let isIndexingComplete = false;

  // ----------------------------------------------------
  // Multi-Page Scraper: Background Fetches & Extracts
  // ----------------------------------------------------
  async function buildSiteWideIndex() {
    if (isIndexingComplete) return;

    try {
      const fetchPromises = menuPages.map(async (page) => {
        try {
          const response = await fetch(page.url);
          if (!response.ok) return [];

          const htmlText = await response.text();

          // Parse fetched raw HTML string into a temporary DOM Document
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlText, 'text/html');
          const cards = doc.querySelectorAll('.menu-card');

          return Array.from(cards).map((card, idx) => {
            const name = card.dataset.name || card.querySelector('h3, h4')?.textContent.trim() || 'Menu Item';
            const category = card.dataset.category || page.name;
            const price = card.dataset.price || card.querySelector('.price')?.textContent.trim() || '';
            const itemId = card.id || `item-${idx}`;

            return {
              name,
              category,
              price,
              // Constructs direct link to target page and smooth-scroll anchor ID
              url: `${page.url}#${itemId}`
            };
          });
        } catch (err) {
          console.warn(`Unable to fetch ${page.url} for global search index.`, err);
          return [];
        }
      });

      const resultsArrays = await Promise.all(fetchPromises);
      globalMenuDatabase = resultsArrays.flat();
      isIndexingComplete = true;
      console.log(`Global Search Index Ready: Indexed ${globalMenuDatabase.length} menu items across all pages.`);
    } catch (error) {
      console.error('Failed to build site-wide search index:', error);
    }
  }

  // Also index any .menu-card elements directly present on current page
  function scrapeCurrentPage() {
    const localCards = document.querySelectorAll('.menu-card');
    const localItems = Array.from(localCards).map((card, idx) => ({
      name: card.dataset.name || card.querySelector('h3, h4')?.textContent.trim() || 'Menu Item',
      category: card.dataset.category || 'Menu',
      price: card.dataset.price || card.querySelector('.price')?.textContent.trim() || '',
      url: `#${card.id || `local-item-${idx}`}`
    }));

    if (localItems.length > 0) {
      globalMenuDatabase = [...globalMenuDatabase, ...localItems];
    }
  }

  // Pre-build index silently in background
  buildSiteWideIndex().then(() => scrapeCurrentPage());

  // ----------------------------------------------------
  // Live Search & Results Filtering
  // ----------------------------------------------------
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();

    clearBtn.hidden = query.length === 0;

    if (query.length < 2) {
      resultsDropdown.hidden = true;
      resultsList.innerHTML = '';
      return;
    }

    const matches = globalMenuDatabase.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );

    renderResults(matches);
  });

  function renderResults(items) {
    resultsList.innerHTML = '';

    if (items.length === 0) {
      resultsList.innerHTML = `<li class="search-no-results">No matching food or drink found across Zest Lounge.</li>`;
    } else {
      items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'search-result-item';
        li.innerHTML = `
          <a href="${item.url}">
            <div class="result-info">
              <span class="result-name">${item.name}</span>
              <span class="result-category">${item.category}</span>
            </div>
            <span class="result-price">${item.price}</span>
          </a>
        `;
        resultsList.appendChild(li);
      });
    }

    resultsDropdown.hidden = false;
  }

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.hidden = true;
    resultsDropdown.hidden = true;
    resultsList.innerHTML = '';
    searchInput.focus();
  });
});







// Smooth Scroll Reveal Observer
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Unobserve after revealing so animation runs smoothly once
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15, // Triggers when 15% of the element is in view
    rootMargin: '0px 0px -50px 0px' // Slightly triggers before reaching bottom
  });

  revealElements.forEach(el => revealObserver.observe(el));
});