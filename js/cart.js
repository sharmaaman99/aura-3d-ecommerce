/**
 * Shopping Cart & Wishlist State Management
 * Features LocalStorage persistence, coupon validation, dynamic tax & shipping calculation
 */

class CartManager {
  constructor() {
    this.CART_STORAGE_KEY = "luxe_cart_v2";
    this.WISHLIST_STORAGE_KEY = "luxe_wishlist_v2";
    this.COUPON_STORAGE_KEY = "luxe_coupon_v2";

    this.items = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.appliedCoupon = this.loadCoupon();

    // Available promotional coupons
    this.AVAILABLE_COUPONS = {
      "SAVE20": { code: "SAVE20", discountPercent: 20, description: "Flat 20% OFF Limited Drop" },
      "NEO15": { code: "NEO15", discountPercent: 15, description: "15% Welcome Privilege" },
      "VIP10": { code: "VIP10", discountPercent: 10, description: "10% VIP Atelier Pass" }
    };

    // Free shipping threshold in ₹
    this.FREE_SHIPPING_THRESHOLD = 2000;
    this.STANDARD_SHIPPING_FEE = 199;
    this.GST_RATE = 0.18; // 18% GST (already calculated in breakups)
  }

  // --- LOCAL STORAGE HELPERS ---
  loadCart() {
    try {
      const data = localStorage.getItem(this.CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load cart from storage:", e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(this.items));
      window.dispatchEvent(new CustomEvent("cart-updated", { detail: this.getSummary() }));
    } catch (e) {
      console.error("Failed to save cart to storage:", e);
    }
  }

  loadWishlist() {
    try {
      const data = localStorage.getItem(this.WISHLIST_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load wishlist from storage:", e);
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(this.WISHLIST_STORAGE_KEY, JSON.stringify(this.wishlist));
      window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { count: this.wishlist.length, items: this.wishlist } }));
    } catch (e) {
      console.error("Failed to save wishlist to storage:", e);
    }
  }

  loadCoupon() {
    try {
      const data = localStorage.getItem(this.COUPON_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  saveCoupon() {
    try {
      if (this.appliedCoupon) {
        localStorage.setItem(this.COUPON_STORAGE_KEY, JSON.stringify(this.appliedCoupon));
      } else {
        localStorage.removeItem(this.COUPON_STORAGE_KEY);
      }
    } catch (e) {}
  }

  // --- CART OPERATIONS ---
  addItem(product, variant = null, color = null, quantity = 1) {
    const chosenVariant = variant || (product.variants && product.variants[0]) || "Standard";
    const chosenColor = color || (product.colors && product.colors[0]?.name) || "Default";
    const cartItemId = `${product.id}_${chosenVariant}_${chosenColor}`.replace(/\s+/g, "-");

    const existingIndex = this.items.findIndex(item => item.cartItemId === cartItemId);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
      // Cap at product stock if available
      if (product.stockCount && this.items[existingIndex].quantity > product.stockCount) {
        this.items[existingIndex].quantity = product.stockCount;
      }
    } else {
      this.items.push({
        cartItemId,
        productId: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        variant: chosenVariant,
        color: chosenColor,
        quantity: quantity,
        maxStock: product.stockCount || 10
      });
    }

    this.saveCart();
    return cartItemId;
  }

  updateQuantity(cartItemId, newQty) {
    const itemIndex = this.items.findIndex(item => item.cartItemId === cartItemId);
    if (itemIndex === -1) return false;

    if (newQty <= 0) {
      this.items.splice(itemIndex, 1);
    } else {
      const maxStock = this.items[itemIndex].maxStock || 20;
      this.items[itemIndex].quantity = Math.min(newQty, maxStock);
    }

    this.saveCart();
    return true;
  }

  removeItem(cartItemId) {
    const beforeLen = this.items.length;
    this.items = this.items.filter(item => item.cartItemId !== cartItemId);
    if (this.items.length !== beforeLen) {
      this.saveCart();
      return true;
    }
    return false;
  }

  clearCart() {
    this.items = [];
    this.appliedCoupon = null;
    this.saveCoupon();
    this.saveCart();
  }

  // --- COUPON OPERATIONS ---
  applyCoupon(couponCodeInput) {
    if (!couponCodeInput) {
      return { success: false, message: "Please enter a promo code" };
    }

    const code = couponCodeInput.trim().toUpperCase();
    const coupon = this.AVAILABLE_COUPONS[code];

    if (!coupon) {
      return { success: false, message: `Invalid code '${code}'. Try 'SAVE20'` };
    }

    if (this.items.length === 0) {
      return { success: false, message: "Your cart is empty. Add items first!" };
    }

    this.appliedCoupon = coupon;
    this.saveCoupon();
    this.saveCart();

    return {
      success: true,
      coupon,
      message: `Code '${coupon.code}' applied! You saved ${coupon.discountPercent}%.`
    };
  }

  removeCoupon() {
    this.appliedCoupon = null;
    this.saveCoupon();
    this.saveCart();
    return true;
  }

  // --- WISHLIST OPERATIONS ---
  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    let isAdded = false;

    if (index > -1) {
      this.wishlist.splice(index, 1);
      isAdded = false;
    } else {
      this.wishlist.push(productId);
      isAdded = true;
    }

    this.saveWishlist();
    return isAdded;
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  // --- TOTALS & CALCULATIONS ---
  getSummary() {
    const totalCount = this.items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const originalSubtotal = this.items.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);

    let discountAmount = 0;
    if (this.appliedCoupon && subtotal > 0) {
      discountAmount = Math.round((subtotal * this.appliedCoupon.discountPercent) / 100);
    }

    const discountedSubtotal = subtotal - discountAmount;
    const isFreeShipping = subtotal >= this.FREE_SHIPPING_THRESHOLD || subtotal === 0;
    const shippingFee = isFreeShipping ? 0 : this.STANDARD_SHIPPING_FEE;

    // GST component (18% inclusive in luxury pricing)
    const gstComponent = Math.round((discountedSubtotal * 0.18) / 1.18);
    const totalSavings = (originalSubtotal - subtotal) + discountAmount;
    const grandTotal = discountedSubtotal + shippingFee;

    const amountNeededForFreeShipping = Math.max(0, this.FREE_SHIPPING_THRESHOLD - subtotal);
    const freeShippingProgress = Math.min(100, Math.round((subtotal / this.FREE_SHIPPING_THRESHOLD) * 100));

    return {
      totalCount,
      subtotal,
      originalSubtotal,
      discountAmount,
      discountedSubtotal,
      shippingFee,
      isFreeShipping,
      amountNeededForFreeShipping,
      freeShippingProgress,
      gstComponent,
      totalSavings,
      grandTotal,
      appliedCoupon: this.appliedCoupon,
      items: this.items
    };
  }
}

// Global singleton instance
window.cartManager = new CartManager();
