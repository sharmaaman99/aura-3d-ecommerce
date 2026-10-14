/**
 * Main Application Logic
 * Orchestrates UI, catalog rendering, quick-view 3D modal, cart drawer,
 * search & filters, checkout flow, and order confirmation.
 */

class LuxeStoreApp {
  constructor() {
    this.currentCategory = "all";
    this.searchQuery = "";
    this.currentSort = "featured";

    this.activeQuickViewProduct = null;
    this.selectedVariant = null;
    this.selectedColor = null;
    this.modalQuantity = 1;

    this.selectedPaymentMethod = "upi";

    this.init();
  }

  init() {
    // Wait for DOM
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.initTheme();
    this.bindEvents();
    this.renderProducts();
    this.updateCartUI();
    this.updateWishlistUI();
    this.startCountdownTimer();
  }

  // --- THEME MANAGEMENT (Dark / Light) ---
  initTheme() {
    const savedTheme = localStorage.getItem("luxe_theme") || "dark";
    this.setTheme(savedTheme);

    const themeToggleBtn = document.getElementById("themeToggleBtn");
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "dark";
        const newTheme = current === "dark" ? "light" : "dark";
        this.setTheme(newTheme);
        window.soundFX?.playClick();
      });
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("luxe_theme", theme);

    const sunIcon = document.getElementById("sunIcon");
    const moonIcon = document.getElementById("moonIcon");
    if (sunIcon && moonIcon) {
      if (theme === "light") {
        sunIcon.classList.remove("hidden");
        moonIcon.classList.add("hidden");
      } else {
        sunIcon.classList.add("hidden");
        moonIcon.classList.remove("hidden");
      }
    }
  }

  // --- EVENT LISTENERS ---
  bindEvents() {
    // Category tabs
    const categoryTabs = document.querySelectorAll(".category-tab-btn");
    categoryTabs.forEach(btn => {
      btn.addEventListener("click", (e) => {
        categoryTabs.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentCategory = btn.dataset.category;
        window.soundFX?.playClick();
        this.renderProducts();
      });
    });

    // Search input
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderProducts();
      });
    }

    // Sort select
    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        window.soundFX?.playClick();
        this.renderProducts();
      });
    }

    // Cart drawer toggle buttons
    const cartToggleBtns = document.querySelectorAll(".toggle-cart-btn");
    cartToggleBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.toggleCartDrawer(true);
        window.soundFX?.playClick();
      });
    });

    const closeCartBtn = document.getElementById("closeCartDrawerBtn");
    if (closeCartBtn) {
      closeCartBtn.addEventListener("click", () => {
        this.toggleCartDrawer(false);
      });
    }

    const cartBackdrop = document.getElementById("cartDrawerBackdrop");
    if (cartBackdrop) {
      cartBackdrop.addEventListener("click", () => {
        this.toggleCartDrawer(false);
      });
    }

    // Wishlist drawer / modal toggle buttons
    const wishlistToggleBtns = document.querySelectorAll(".toggle-wishlist-btn");
    wishlistToggleBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.openWishlistModal();
        window.soundFX?.playClick();
      });
    });

    // Cart Manager custom event listeners
    window.addEventListener("cart-updated", (e) => {
      this.updateCartUI(e.detail);
    });

    window.addEventListener("wishlist-updated", () => {
      this.updateWishlistUI();
      this.renderProducts(); // re-render hearts
    });

    // Coupon code form submission
    const applyCouponBtn = document.getElementById("applyCouponBtn");
    const couponInput = document.getElementById("couponInput");
    if (applyCouponBtn && couponInput) {
      applyCouponBtn.addEventListener("click", () => {
        const res = window.cartManager.applyCoupon(couponInput.value);
        if (res.success) {
          window.soundFX?.playSuccess();
          this.showToast(res.message, "success");
        } else {
          this.showToast(res.message, "error");
        }
      });

      couponInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          applyCouponBtn.click();
        }
      });
    }

    // Remove coupon button
    const removeCouponBtn = document.getElementById("removeCouponBtn");
    if (removeCouponBtn) {
      removeCouponBtn.addEventListener("click", () => {
        window.cartManager.removeCoupon();
        this.showToast("Promo code removed", "info");
      });
    }

    // Promo code banner click to autofill & apply
    const promoBannerTag = document.getElementById("promoCodeClickable");
    if (promoBannerTag) {
      promoBannerTag.addEventListener("click", () => {
        if (couponInput) couponInput.value = "SAVE20";
        this.toggleCartDrawer(true);
        const res = window.cartManager.applyCoupon("SAVE20");
        if (res.success) {
          window.soundFX?.playSuccess();
          this.showToast("⚡ SAVE20 code auto-applied (20% OFF)!", "success");
        }
      });
    }

    // Audio Mute Toggle
    const soundToggleBtn = document.getElementById("soundToggleBtn");
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener("click", () => {
        const isMuted = window.soundFX?.toggleMute();
        this.updateSoundBtnUI(isMuted);
        this.showToast(isMuted ? "Sound muted" : "Luxury sound FX active", "info");
      });
    }

    // Checkout button inside cart drawer
    const proceedToCheckoutBtn = document.getElementById("proceedToCheckoutBtn");
    if (proceedToCheckoutBtn) {
      proceedToCheckoutBtn.addEventListener("click", () => {
        if (window.cartManager.items.length === 0) {
          this.showToast("Your cart is empty!", "error");
          return;
        }
        this.toggleCartDrawer(false);
        this.openCheckoutModal();
        window.soundFX?.playClick();
      });
    }

    // Checkout modal submission
    const checkoutForm = document.getElementById("checkoutForm");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.processOrderPlacement();
      });
    }

    // Payment method selector buttons
    const paymentMethods = document.querySelectorAll(".payment-method-card");
    paymentMethods.forEach(card => {
      card.addEventListener("click", () => {
        paymentMethods.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        this.selectedPaymentMethod = card.dataset.method;
        this.updatePaymentDetailsView(this.selectedPaymentMethod);
        window.soundFX?.playClick();
      });
    });

    // Close modal handlers (Esc key + backdrop light dismiss)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAllModals();
      }
    });

    ["quickViewModal", "wishlistModal", "checkoutModal", "orderConfirmedModal"].forEach(id => {
      const dialog = document.getElementById(id);
      if (dialog) {
        dialog.addEventListener("click", (e) => {
          if (e.target === dialog) {
            dialog.close();
          }
        });
      }
    });

    // Mobile nav menu toggle
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileNavDrawer = document.getElementById("mobileNavDrawer");
    const closeMobileNavBtn = document.getElementById("closeMobileNavBtn");
    if (mobileMenuBtn && mobileNavDrawer) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileNavDrawer.classList.remove("hidden");
      });
    }
    if (closeMobileNavBtn && mobileNavDrawer) {
      closeMobileNavBtn.addEventListener("click", () => {
        mobileNavDrawer.classList.add("hidden");
      });
    }
  }

  // --- RENDER PRODUCTS GRID ---
  renderProducts() {
    const grid = document.getElementById("productGrid");
    const emptyState = document.getElementById("productEmptyState");
    const countIndicator = document.getElementById("productsCountIndicator");
    if (!grid) return;

    let filtered = [...PRODUCTS_DATA];

    // Filter by Category
    if (this.currentCategory !== "all") {
      filtered = filtered.filter(p => p.category === this.currentCategory);
    }

    // Filter by Search Query
    if (this.searchQuery) {
      filtered = filtered.filter(p => {
        const text = `${p.name} ${p.category} ${p.description} ${p.badge}`.toLowerCase();
        return text.includes(this.searchQuery);
      });
    }

    // Sort Products
    if (this.currentSort === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.currentSort === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (this.currentSort === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    // Update count indicator
    if (countIndicator) {
      countIndicator.textContent = `Showing ${filtered.length} of ${PRODUCTS_DATA.length} products`;
    }

    // Check for empty state
    if (filtered.length === 0) {
      grid.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    // Build Cards HTML
    grid.innerHTML = filtered.map(product => {
      const isWishlisted = window.cartManager.isInWishlist(product.id);
      const savings = product.originalPrice - product.price;

      // Badges
      let badgeClass = "badge-standard";
      if (product.badgeType === "gold") badgeClass = "badge-gold";
      else if (product.badgeType === "trending") badgeClass = "badge-trending";
      else if (product.badgeType === "luxury") badgeClass = "badge-luxury";
      else if (product.badgeType === "tech") badgeClass = "badge-tech";

      // Variant previews
      let variantChipsHtml = "";
      if (product.variantType === "size" && product.variants) {
        variantChipsHtml = `
          <div class="card-variant-chips">
            <span class="chip-label">Sizes:</span>
            ${product.variants.map((v, i) => `<span class="size-chip ${i === 0 ? 'active' : ''}">${v}</span>`).join("")}
          </div>
        `;
      } else if (product.variantType === "strap" && product.variants) {
        variantChipsHtml = `
          <div class="card-variant-chips">
            <span class="chip-label">Straps:</span>
            ${product.variants.slice(0, 3).map((v, i) => `<span class="strap-chip ${i === 0 ? 'active' : ''}">${v.split(" ")[0]}</span>`).join("")}
          </div>
        `;
      } else if (product.colors && product.colors.length > 0) {
        variantChipsHtml = `
          <div class="card-variant-chips">
            <span class="chip-label">Colors:</span>
            <div class="color-dots-row">
              ${product.colors.map((c, i) => `
                <span class="color-dot ${i === 0 ? 'active' : ''}" style="background-color: ${c.hex};" title="${c.name}"></span>
              `).join("")}
            </div>
          </div>
        `;
      }

      return `
        <article class="product-card-3d" data-id="${product.id}">
          <div class="card-3d-inner">
            <!-- Specular Glare Overlay -->
            <div class="specular-glare"></div>

            <!-- Top Row: Badges & Wishlist -->
            <div class="card-top-row">
              <div class="badges-wrapper">
                <span class="product-badge ${badgeClass}">${product.badge}</span>
                <span class="discount-pill">${product.discountPercent}% OFF</span>
              </div>
              <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" 
                      aria-label="Toggle Wishlist" 
                      data-id="${product.id}"
                      onclick="window.luxeApp.handleWishlistToggle('${product.id}', event)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWishlisted ? '#f43f5e' : 'none'}" stroke="${isWishlisted ? '#f43f5e' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              </button>
            </div>

            <!-- 3D Popout Image Container -->
            <div class="card-image-box" onclick="window.luxeApp.openQuickViewModal('${product.id}')">
              <img src="${product.image}" alt="${product.name}" loading="lazy" class="product-img-popout">
              <div class="quick-view-overlay-hint">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span>3D Quick View</span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="card-body">
              <div class="card-rating-row">
                <div class="star-rating">
                  <span class="star-icon">★</span>
                  <span class="rating-val">${product.rating}</span>
                </div>
                <span class="review-count">(${product.reviewsCount} reviews)</span>
                <span class="stock-pill ${product.stockCount <= 5 ? 'low-stock' : ''}">
                  ${product.stockCount <= 5 ? `Only ${product.stockCount} left` : 'In Stock'}
                </span>
              </div>

              <h3 class="product-title" onclick="window.luxeApp.openQuickViewModal('${product.id}')">
                ${product.name}
              </h3>

              <!-- Variant Chips -->
              ${variantChipsHtml}

              <!-- Pricing Row -->
              <div class="pricing-row">
                <div class="price-wrapper">
                  <span class="current-price">${formatINR(product.price)}</span>
                  <span class="original-price">${formatINR(product.originalPrice)}</span>
                </div>
                <span class="save-tag">Save ${formatINR(savings)}</span>
              </div>

              <!-- Action Buttons -->
              <div class="card-actions-row">
                <button class="btn-quick-view" onclick="window.luxeApp.openQuickViewModal('${product.id}')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span>Quick View</span>
                </button>
                <button class="btn-add-cart" onclick="window.luxeApp.handleQuickAddToCart('${product.id}', event)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  // --- WISHLIST TOGGLE ---
  handleWishlistToggle(productId, event) {
    if (event) event.stopPropagation();
    const isAdded = window.cartManager.toggleWishlist(productId);
    const product = PRODUCTS_DATA.find(p => p.id === productId);

    if (isAdded) {
      window.soundFX?.playAddCart();
      this.showToast(`Saved "${product?.name || 'Item'}" to Wishlist!`, "success");
    } else {
      window.soundFX?.playClick();
      this.showToast(`Removed from Wishlist`, "info");
    }
  }

  // --- QUICK ADD TO CART FROM CARD ---
  handleQuickAddToCart(productId, event) {
    if (event) event.stopPropagation();
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const defaultVariant = product.variants ? product.variants[0] : "Standard";
    const defaultColor = product.colors ? product.colors[0].name : "Standard";

    window.cartManager.addItem(product, defaultVariant, defaultColor, 1);
    window.soundFX?.playAddCart();
    this.showToast(`Added "${product.name}" (${defaultVariant}) to Bag!`, "success");

    // Animate cart badge
    this.animateCartBadge();
  }

  // --- 3D PRODUCT QUICK-VIEW MODAL ---
  openQuickViewModal(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    this.activeQuickViewProduct = product;
    this.selectedVariant = product.variants ? product.variants[0] : null;
    this.selectedColor = product.colors ? product.colors[0].name : null;
    this.modalQuantity = 1;

    const modal = document.getElementById("quickViewModal");
    if (!modal) return;

    // Fill modal fields
    document.getElementById("modalProductImage").src = product.image;
    document.getElementById("modalProductImage").alt = product.name;
    document.getElementById("modalCategoryBadge").textContent = product.categoryLabel.toUpperCase();
    document.getElementById("modalTitle").textContent = product.name;
    document.getElementById("modalRatingScore").textContent = product.rating;
    document.getElementById("modalReviewCount").textContent = `(${product.reviewsCount} customer reviews)`;
    document.getElementById("modalPrice").textContent = formatINR(product.price);
    document.getElementById("modalOriginalPrice").textContent = formatINR(product.originalPrice);
    document.getElementById("modalDiscountTag").textContent = `${product.discountPercent}% OFF`;
    document.getElementById("modalSavings").textContent = `Save ${formatINR(product.originalPrice - product.price)}`;
    document.getElementById("modalDescription").textContent = product.description;
    document.getElementById("modalStockPill").innerHTML = `
      <span class="stock-dot"></span>
      <span>${product.stockCount <= 5 ? `Only ${product.stockCount} left in stock!` : 'In Stock - Ready to Ship'}</span>
    `;

    // Render Specs
    const specsList = document.getElementById("modalSpecsList");
    if (specsList && product.specs) {
      specsList.innerHTML = product.specs.map(spec => `<li><span class="spec-check">✓</span> ${spec}</li>`).join("");
    }

    // Render Variants (Sizes / Straps / Colors)
    const variantContainer = document.getElementById("modalVariantContainer");
    const variantLabel = document.getElementById("modalVariantLabel");

    if (product.variants && product.variants.length > 0) {
      if (variantLabel) {
        if (product.variantType === "size") variantLabel.textContent = "Select Size";
        else if (product.variantType === "strap") variantLabel.textContent = "Select Strap Material";
        else variantLabel.textContent = "Select Option";
      }

      variantContainer.innerHTML = product.variants.map((v, i) => `
        <button class="modal-variant-btn ${i === 0 ? 'active' : ''}" 
                data-variant="${v}" 
                onclick="window.luxeApp.selectModalVariant('${v}', this)">
          ${v}
        </button>
      `).join("");
      variantContainer.classList.remove("hidden");
    } else {
      variantContainer.innerHTML = "";
      variantContainer.classList.add("hidden");
    }

    // Render Color Options
    const colorContainer = document.getElementById("modalColorContainer");
    if (colorContainer && product.colors && product.colors.length > 0) {
      colorContainer.innerHTML = product.colors.map((c, i) => `
        <button class="modal-color-swatch ${i === 0 ? 'active' : ''}" 
                style="background-color: ${c.hex};" 
                title="${c.name}"
                data-color="${c.name}"
                onclick="window.luxeApp.selectModalColor('${c.name}', this)">
          <span class="swatch-check">✓</span>
        </button>
      `).join("");
      document.getElementById("modalSelectedColorName").textContent = product.colors[0].name;
      document.getElementById("modalColorSection").classList.remove("hidden");
    } else {
      if (document.getElementById("modalColorSection")) {
        document.getElementById("modalColorSection").classList.add("hidden");
      }
    }

    // Reset Quantity
    document.getElementById("modalQtyDisplay").textContent = "1";

    // Wishlist state inside modal
    const modalWishlistBtn = document.getElementById("modalWishlistBtn");
    if (modalWishlistBtn) {
      const isFav = window.cartManager.isInWishlist(product.id);
      modalWishlistBtn.classList.toggle("active", isFav);
    }

    // Attach 3D tilt to modal image card
    const modalImageStage = document.getElementById("modal3DImageStage");
    if (modalImageStage && window.physics3D) {
      window.physics3D.attachTiltToElement(modalImageStage);
    }

    modal.showModal();
    window.soundFX?.playClick();
  }

  selectModalVariant(variant, btn) {
    this.selectedVariant = variant;
    const parent = btn.parentElement;
    parent.querySelectorAll(".modal-variant-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    window.soundFX?.playClick();
  }

  selectModalColor(colorName, btn) {
    this.selectedColor = colorName;
    const parent = btn.parentElement;
    parent.querySelectorAll(".modal-color-swatch").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("modalSelectedColorName").textContent = colorName;
    window.soundFX?.playClick();
  }

  updateModalQty(delta) {
    if (!this.activeQuickViewProduct) return;
    const maxStock = this.activeQuickViewProduct.stockCount || 10;
    this.modalQuantity = Math.max(1, Math.min(maxStock, this.modalQuantity + delta));
    document.getElementById("modalQtyDisplay").textContent = this.modalQuantity;
    window.soundFX?.playClick();
  }

  addModalItemToCart(openCartDrawerAfter = true) {
    if (!this.activeQuickViewProduct) return;

    window.cartManager.addItem(
      this.activeQuickViewProduct,
      this.selectedVariant,
      this.selectedColor,
      this.modalQuantity
    );

    window.soundFX?.playAddCart();
    this.showToast(`Added ${this.modalQuantity}x "${this.activeQuickViewProduct.name}" to Bag!`, "success");
    this.closeModal("quickViewModal");

    if (openCartDrawerAfter) {
      this.toggleCartDrawer(true);
    }
  }

  buyModalItemNow() {
    this.addModalItemToCart(false);
    this.openCheckoutModal();
  }

  // --- CART DRAWER UI ---
  toggleCartDrawer(open) {
    const drawer = document.getElementById("cartDrawer");
    const backdrop = document.getElementById("cartDrawerBackdrop");
    if (!drawer || !backdrop) return;

    if (open) {
      drawer.classList.remove("translate-x-full");
      backdrop.classList.remove("hidden");
      this.updateCartUI();
    } else {
      drawer.classList.add("translate-x-full");
      backdrop.classList.add("hidden");
    }
  }

  updateCartUI(summary = null) {
    const s = summary || window.cartManager.getSummary();

    // Badges update
    const badgeElements = document.querySelectorAll(".cart-count-badge");
    badgeElements.forEach(el => {
      el.textContent = s.totalCount;
      el.classList.toggle("hidden", s.totalCount === 0);
    });

    const itemsContainer = document.getElementById("cartItemsContainer");
    const emptyState = document.getElementById("cartEmptyState");
    const footer = document.getElementById("cartDrawerFooter");
    const freeShippingBar = document.getElementById("freeShippingProgress");
    const freeShippingText = document.getElementById("freeShippingStatusText");

    // Free shipping bar
    if (freeShippingBar && freeShippingText) {
      freeShippingBar.style.width = `${s.freeShippingProgress}%`;
      if (s.isFreeShipping) {
        freeShippingText.innerHTML = `🎉 <strong>Congratulations!</strong> You have unlocked <strong>FREE Express Shipping</strong>.`;
      } else {
        freeShippingText.innerHTML = `Add <strong>${formatINR(s.amountNeededForFreeShipping)}</strong> more to get <strong>FREE Express Shipping</strong>!`;
      }
    }

    if (s.totalCount === 0) {
      if (itemsContainer) itemsContainer.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
      if (footer) footer.classList.add("hidden");
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    if (footer) footer.classList.remove("hidden");

    // Render Cart Items
    if (itemsContainer) {
      itemsContainer.innerHTML = s.items.map(item => `
        <div class="cart-item-row" data-id="${item.cartItemId}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-variant">
              <span>${item.variant}</span>
              ${item.color ? `<span>• ${item.color}</span>` : ''}
            </div>
            <div class="cart-item-pricing">
              <span class="cart-price">${formatINR(item.price)}</span>
              <span class="cart-orig-price">${formatINR(item.originalPrice)}</span>
            </div>
            <div class="cart-item-bottom">
              <div class="quantity-stepper">
                <button class="qty-btn" onclick="window.cartManager.updateQuantity('${item.cartItemId}', ${item.quantity - 1})">-</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="qty-btn" onclick="window.cartManager.updateQuantity('${item.cartItemId}', ${item.quantity + 1})">+</button>
              </div>
              <button class="cart-remove-btn" title="Remove Item" onclick="window.cartManager.removeItem('${item.cartItemId}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>
      `).join("");
    }

    // Totals
    document.getElementById("cartSubtotalDisplay").textContent = formatINR(s.subtotal);
    document.getElementById("cartShippingDisplay").textContent = s.isFreeShipping ? "FREE" : formatINR(s.shippingFee);
    document.getElementById("cartGstDisplay").textContent = formatINR(s.gstComponent);
    document.getElementById("cartGrandTotalDisplay").textContent = formatINR(s.grandTotal);

    // Coupon row
    const discountRow = document.getElementById("cartDiscountRow");
    if (s.appliedCoupon) {
      discountRow.classList.remove("hidden");
      document.getElementById("cartDiscountDisplay").textContent = `-${formatINR(s.discountAmount)} (${s.appliedCoupon.code})`;
      document.getElementById("appliedCouponPill").classList.remove("hidden");
      document.getElementById("appliedCouponCode").textContent = s.appliedCoupon.code;
      document.getElementById("couponInput").value = s.appliedCoupon.code;
    } else {
      discountRow.classList.add("hidden");
      document.getElementById("appliedCouponPill").classList.add("hidden");
    }
  }

  // --- WISHLIST UI ---
  updateWishlistUI() {
    const list = window.cartManager.wishlist;
    const badgeElements = document.querySelectorAll(".wishlist-count-badge");
    badgeElements.forEach(el => {
      el.textContent = list.length;
      el.classList.toggle("hidden", list.length === 0);
    });

    const wishlistContainer = document.getElementById("wishlistItemsContainer");
    const emptyState = document.getElementById("wishlistEmptyState");
    if (!wishlistContainer) return;

    if (list.length === 0) {
      wishlistContainer.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    const wishlistedProducts = PRODUCTS_DATA.filter(p => list.includes(p.id));
    wishlistContainer.innerHTML = wishlistedProducts.map(p => `
      <div class="wishlist-item-card">
        <img src="${p.image}" alt="${p.name}" class="wishlist-thumb">
        <div class="wishlist-details">
          <h4>${p.name}</h4>
          <span class="wishlist-category">${p.categoryLabel}</span>
          <div class="wishlist-price">${formatINR(p.price)}</div>
        </div>
        <div class="wishlist-actions">
          <button class="btn-wishlist-cart" onclick="window.luxeApp.handleQuickAddToCart('${p.id}'); window.cartManager.toggleWishlist('${p.id}');">
            Move to Cart
          </button>
          <button class="btn-wishlist-remove" onclick="window.cartManager.toggleWishlist('${p.id}')">
            Remove
          </button>
        </div>
      </div>
    `).join("");
  }

  openWishlistModal() {
    this.updateWishlistUI();
    const modal = document.getElementById("wishlistModal");
    if (modal) modal.showModal();
  }

  // --- CHECKOUT & PAYMENT ---
  openCheckoutModal() {
    const s = window.cartManager.getSummary();
    if (s.totalCount === 0) {
      this.showToast("Your cart is empty!", "error");
      return;
    }

    const modal = document.getElementById("checkoutModal");
    if (!modal) return;

    // Fill summary items
    const summaryItems = document.getElementById("checkoutSummaryItems");
    if (summaryItems) {
      summaryItems.innerHTML = s.items.map(item => `
        <div class="checkout-summary-item">
          <span class="item-name">${item.quantity}x ${item.name} (${item.variant})</span>
          <span class="item-price">${formatINR(item.price * item.quantity)}</span>
        </div>
      `).join("");
    }

    document.getElementById("checkoutSubtotal").textContent = formatINR(s.subtotal);
    document.getElementById("checkoutDiscount").textContent = s.discountAmount > 0 ? `-${formatINR(s.discountAmount)}` : "₹0";
    document.getElementById("checkoutShipping").textContent = s.isFreeShipping ? "FREE" : formatINR(s.shippingFee);
    document.getElementById("checkoutGst").textContent = `Included (${formatINR(s.gstComponent)})`;
    document.getElementById("checkoutGrandTotal").textContent = formatINR(s.grandTotal);
    document.getElementById("checkoutSubmitBtnText").textContent = `Pay & Confirm Order (${formatINR(s.grandTotal)})`;

    modal.showModal();
  }

  updatePaymentDetailsView(method) {
    const upiBox = document.getElementById("upiPaymentBox");
    const cardBox = document.getElementById("cardPaymentBox");
    const codBox = document.getElementById("codPaymentBox");

    if (upiBox) upiBox.classList.toggle("hidden", method !== "upi");
    if (cardBox) cardBox.classList.toggle("hidden", method !== "card");
    if (codBox) codBox.classList.toggle("hidden", method !== "cod");
  }

  processOrderPlacement() {
    const fullName = document.getElementById("custName")?.value || "Guest Collector";
    const phone = document.getElementById("custPhone")?.value || "+91 98765 43210";
    const address = document.getElementById("custAddress")?.value || "Penthouse 42, Skyline Towers";
    const city = document.getElementById("custCity")?.value || "Mumbai";
    const pincode = document.getElementById("custPincode")?.value || "400001";

    const s = window.cartManager.getSummary();
    const orderedItems = [...s.items];
    const finalAmount = s.grandTotal;

    // Generate unique Tracking ID: e.g. #TRK-98421
    const randomTrackNum = Math.floor(10000 + Math.random() * 90000);
    const trackingId = `#TRK-${randomTrackNum}`;

    // Show button loading state
    const submitBtn = document.getElementById("checkoutSubmitBtn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <div class="spinner-small"></div>
        <span>Securing Luxury Order...</span>
      `;
    }

    setTimeout(() => {
      // Clear Cart
      window.cartManager.clearCart();

      // Close Checkout Modal
      this.closeModal("checkoutModal");

      // Reset Submit Button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Pay & Confirm Order</span>`;
      }

      // Open Order Confirmed Modal
      this.openOrderConfirmation({
        trackingId,
        customerName: fullName,
        phone,
        address: `${address}, ${city} - ${pincode}`,
        items: orderedItems,
        total: finalAmount,
        paymentMethod: this.selectedPaymentMethod.toUpperCase()
      });

      window.soundFX?.playSuccess();
    }, 1200);
  }

  openOrderConfirmation(orderData) {
    const modal = document.getElementById("orderConfirmedModal");
    if (!modal) return;

    document.getElementById("confirmTrackingId").textContent = orderData.trackingId;
    document.getElementById("confirmCustomerName").textContent = orderData.customerName;
    document.getElementById("confirmAddress").textContent = orderData.address;
    document.getElementById("confirmTotal").textContent = formatINR(orderData.total);
    document.getElementById("confirmPaymentMethod").textContent = orderData.paymentMethod;

    // Delivery date (3 days from now)
    const delDate = new Date();
    delDate.setDate(delDate.getDate() + 3);
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    document.getElementById("confirmDeliveryDate").textContent = delDate.toLocaleDateString("en-IN", options);

    // List ordered items
    const itemsContainer = document.getElementById("confirmOrderItems");
    if (itemsContainer) {
      itemsContainer.innerHTML = orderData.items.map(item => `
        <div class="confirm-item-row">
          <img src="${item.image}" alt="${item.name}" class="confirm-thumb">
          <div>
            <div class="confirm-item-title">${item.name}</div>
            <div class="confirm-item-meta">${item.quantity}x • ${item.variant}</div>
          </div>
          <div class="confirm-item-price">${formatINR(item.price * item.quantity)}</div>
        </div>
      `).join("");
    }

    modal.showModal();

    // Trigger celebratory confetti effect
    this.launchConfetti();
  }

  launchConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const particles = [];
    const colors = ["#F59E0B", "#6366F1", "#10B981", "#EC4899", "#3B82F6"];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 14,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 8,
        gravity: 0.25,
        opacity: 1
      });
    }

    let animationId;
    const renderConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rSpeed;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
          ctx.restore();
        }
      });

      if (alive) {
        animationId = requestAnimationFrame(renderConfetti);
      } else {
        cancelAnimationFrame(animationId);
      }
    };

    renderConfetti();
  }

  // --- FLASH SALE COUNTDOWN TIMER ---
  startCountdownTimer() {
    const hoursEl = document.getElementById("countdownHours");
    const minsEl = document.getElementById("countdownMins");
    const secsEl = document.getElementById("countdownSecs");
    if (!hoursEl || !minsEl || !secsEl) return;

    // Set end target 14 hours 45 minutes from now
    let remainingSeconds = 14 * 3600 + 45 * 60 + 28;

    const tick = () => {
      if (remainingSeconds <= 0) {
        remainingSeconds = 24 * 3600; // Reset cycle
      }
      remainingSeconds--;

      const h = Math.floor(remainingSeconds / 3600);
      const m = Math.floor((remainingSeconds % 3600) / 60);
      const s = remainingSeconds % 60;

      hoursEl.textContent = String(h).padStart(2, "0");
      minsEl.textContent = String(m).padStart(2, "0");
      secsEl.textContent = String(s).padStart(2, "0");
    };

    tick();
    setInterval(tick, 1000);
  }

  // --- TOAST NOTIFICATION UTILITY ---
  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type}`;

    let iconSvg = "";
    if (type === "success") {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === "error") {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-text">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  animateCartBadge() {
    const badges = document.querySelectorAll(".cart-count-badge");
    badges.forEach(b => {
      b.classList.remove("bump");
      void b.offsetWidth; // Force reflow
      b.classList.add("bump");
    });
  }

  updateSoundBtnUI(isMuted) {
    const soundOn = document.getElementById("soundIconOn");
    const soundOff = document.getElementById("soundIconOff");
    if (soundOn && soundOff) {
      soundOn.classList.toggle("hidden", isMuted);
      soundOff.classList.toggle("hidden", !isMuted);
    }
  }

  closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m && typeof m.close === "function") {
      m.close();
    }
  }

  closeAllModals() {
    ["quickViewModal", "wishlistModal", "checkoutModal", "orderConfirmedModal"].forEach(id => {
      this.closeModal(id);
    });
    this.toggleCartDrawer(false);
  }
}

// Global App Instance
window.luxeApp = new LuxeStoreApp();
