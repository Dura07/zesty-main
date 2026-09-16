document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const foodCards = document.querySelectorAll('.food-card');
  const searchInput = document.getElementById('menuSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const noResultsMsg = document.getElementById('noResultsMsg');

  let activeCategory = 'all';

  // Core filter & search application function
  function filterMenu() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    // Toggle clear button visibility
    if (query.length > 0) {
      clearSearchBtn.classList.add('show');
    } else {
      clearSearchBtn.classList.remove('show');
    }

    foodCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      const cardTitle = card.querySelector('.food-title').textContent.toLowerCase();
      const cardDesc = card.querySelector('.food-desc').textContent.toLowerCase();
      const cardBadge = card.querySelector('.food-badge').textContent.toLowerCase();

      // Category filter check
      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;

      // Search query check (matches title, description, or badge)
      const matchesQuery = query === '' || 
                           cardTitle.includes(query) || 
                           cardDesc.includes(query) || 
                           cardBadge.includes(query);

      // Card is shown if it matches both active category and current search query
      if (matchesCategory && matchesQuery) {
        card.classList.remove('hide');
        visibleCount++;
      } else {
        card.classList.add('hide');
      }
    });

    // Show/hide no results feedback
    if (visibleCount === 0) {
      noResultsMsg.classList.remove('hide');
    } else {
      noResultsMsg.classList.add('hide');
    }
  }

  // Event listener: Category buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      filterMenu();
    });
  });

  // Event listener: Real-time search input
  searchInput.addEventListener('input', filterMenu);

  // Event listener: Clear search input button
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    filterMenu();
    searchInput.focus();
  });
});




// BTN DRAGGING

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('filterBtnContainer');

  if (container) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;

    // Mouse events for desktop dragging
    container.addEventListener('mousedown', (e) => {
      isDown = true;
      isDragging = false;
      container.classList.add('active-drag');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.classList.remove('active-drag');
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
      container.classList.remove('active-drag');
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5; // Drag speed sensitivity multiplier
      if (Math.abs(walk) > 5) {
        isDragging = true;
      }
      container.scrollLeft = scrollLeft - walk;
    });

    // Prevent accidental button triggering on drag release
    container.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (isDragging) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      });
    });
  }
});





// WhatsApp cart state logic to handle adding items, calculating totals,
//  2348139336663 and redirecting directly to WhatsApp with a pre-formatted message

document.addEventListener('DOMContentLoaded', () => {
  // Replace with Zest Lounge's actual WhatsApp phone number (with country code, no + or spaces)
  const WHATSAPP_PHONE_NUMBER = '2348139336663'; 
  const LOCAL_STORAGE_KEY = 'zest_lounge_cart';

  // Initialize cart from localStorage so items persist across refreshes
  let cart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

  const cartFloatingBar = document.getElementById('cartFloatingBar');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const cartTotalPrice = document.getElementById('cartTotalPrice');
  const openCartBtn = document.getElementById('openCartBtn');
  const cartModal = document.getElementById('cartModal');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartGrandTotal = document.getElementById('cartGrandTotal');
  const sendWhatsappOrderBtn = document.getElementById('sendWhatsappOrderBtn');

  // Save state
  function saveCartToStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
  }

  // Currency helper
  function formatMoney(amount) {
    return '₦' + Number(amount).toLocaleString();
  }

  // Render modal items with clear individual pricing & remove buttons
  function updateCartUI() {
    saveCartToStorage();

    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Floating bar visibility
    if (cartFloatingBar) {
      if (totalCount > 0) {
        cartFloatingBar.classList.remove('hide');
      } else {
        cartFloatingBar.classList.add('hide');
        if (cartModal) cartModal.classList.remove('open');
      }
    }

    if (cartCountBadge) cartCountBadge.textContent = totalCount;
    if (cartTotalPrice) cartTotalPrice.textContent = formatMoney(totalPrice);
    if (cartGrandTotal) cartGrandTotal.textContent = formatMoney(totalPrice);

    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
      cartItemsList.innerHTML = '<p style="color:#aaa; text-align:center; padding:1.5rem 0;">Your cart is currently empty.</p>';
      return;
    }

    cart.forEach((item) => {
      const itemRow = document.createElement('div');
      itemRow.className = 'cart-item-row';
      
      const itemTotalPrice = item.price * item.qty;

      // Item structure displaying:
      // 1. Item Title
      // 2. Individual price breakdown (Subtotal for item + Unit price)
      // 3. Qty controls (- / +)
      // 4. Dedicated Remove Trash Button
      itemRow.innerHTML = `
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <div class="cart-item-price-breakdown">
            <span>${formatMoney(itemTotalPrice)}</span>
            ${item.qty > 1 ? `<span class="cart-item-unit-price">(${formatMoney(item.price)} each)</span>` : ''}
          </div>
        </div>

        <div class="cart-item-controls">
          <button class="qty-btn minus-btn" data-id="${item.id}" aria-label="Decrease quantity">-</button>
          <span style="color:#fff; font-size:0.85rem; font-weight:600; min-width:20px; text-align:center;">${item.qty}</span>
          <button class="qty-btn plus-btn" data-id="${item.id}" aria-label="Increase quantity">+</button>
          
          <!-- Dedicated Remove Button -->
          <button class="remove-item-btn" data-id="${item.id}" title="Remove item" aria-label="Remove item">🗑️</button>
        </div>
      `;
      cartItemsList.appendChild(itemRow);
    });

    // Event listeners for Quantity changes & Remove button
    document.querySelectorAll('.minus-btn').forEach(btn => {
      btn.addEventListener('click', () => changeQty(btn.getAttribute('data-id'), -1));
    });
    
    document.querySelectorAll('.plus-btn').forEach(btn => {
      btn.addEventListener('click', () => changeQty(btn.getAttribute('data-id'), 1));
    });

    document.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', () => removeItem(btn.getAttribute('data-id')));
    });
  }

  // Add item
  function addToCart(id, name, price) {
    const existingIndex = cart.findIndex(item => item.id === id);
    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({ id, name, price: Number(price), qty: 1 });
    }
    updateCartUI();
  }

  // Adjust quantity
  function changeQty(id, delta) {
    const existingIndex = cart.findIndex(item => item.id === id);
    if (existingIndex > -1) {
      cart[existingIndex].qty += delta;
      if (cart[existingIndex].qty <= 0) {
        cart.splice(existingIndex, 1);
      }
    }
    updateCartUI();
  }

  // Directly remove single product
  function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
  }

  // Clear entire cart
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all items from your cart?')) {
        cart = [];
        updateCartUI();
      }
    });
  }

  // Click handler for add-to-cart buttons across all menu categories
 document.querySelectorAll('.add-to-cart-btn').forEach((btn, index) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.food-card');
    
    // Scrape item details directly from DOM
    const name = card.querySelector('.food-title').textContent.trim();
    const priceText = card.querySelector('.food-price').textContent;
    const numericPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    
    // Fallback: If data-id is missing or repeated, generate a unique ID from the title or array index
    const uniqueId = btn.getAttribute('data-id') || `item-${name.toLowerCase().replace(/\s+/g, '-')}`;

    addToCart(uniqueId, name, numericPrice);
  });
});

  // Open/Close Modal
  if (openCartBtn && cartModal) {
    openCartBtn.addEventListener('click', () => cartModal.classList.add('open'));
  }
  if (closeCartBtn && cartModal) {
    closeCartBtn.addEventListener('click', () => cartModal.classList.remove('open'));
  }

  // WhatsApp Checkout
  if (sendWhatsappOrderBtn) {
    sendWhatsappOrderBtn.addEventListener('click', () => {
      if (cart.length === 0) return;

      let message = `Hello Zest Lounge & Bar, I would like to place an order from your website:\n\n`;
      let grandTotal = 0;

      cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        grandTotal += itemTotal;
        message += `${index + 1}. ${item.name} (x${item.qty}) - ₦${itemTotal.toLocaleString()}\n`;
      });

      message += `\n*Grand Total:* ₦${grandTotal.toLocaleString()}\n\nPlease confirm availability and delivery details. Thanks!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;

      window.open(whatsappUrl, '_blank');
    });
  }

  // Initial load sync
  updateCartUI();
});