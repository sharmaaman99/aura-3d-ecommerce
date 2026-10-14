/**
 * 3D Physics & Parallax Engine
 * - Interactive 3D mouse tilt with dynamic specular glare
 * - Split-screen Hero 3D showcase with orbital neon depth rings & interactive card switching
 * - Interactive 3D Credit Card with 360° flip & live data mirroring
 * - Smooth lerped physics for 60fps performance
 */

class Physics3DEngine {
  constructor() {
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.heroContainer = null;
    this.heroShowcase = null;
    this.activeHeroCardIndex = 1; // Center card default
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.heroContainer = document.getElementById("heroSection");
    this.heroShowcase = document.getElementById("hero3DStage");

    this.bindWindowMouse();
    this.initHero3DShowcase();
    this.initCardTiltPhysics();
    this.init3DCreditCard();
    this.startRenderLoop();
  }

  // --- WINDOW MOUSE TRACKING WITH LERP ---
  bindWindowMouse() {
    window.addEventListener("mousemove", (e) => {
      // Normalized between -1 and 1
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;

      this.mouse.targetX = normX;
      this.mouse.targetY = normY;
    }, { passive: true });

    // Handle touch/orientation for mobile
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
      window.addEventListener("deviceorientation", (e) => {
        if (e.gamma !== null && e.beta !== null) {
          // Clamp and normalize
          this.mouse.targetX = Math.max(-1, Math.min(1, e.gamma / 30));
          this.mouse.targetY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
        }
      }, { passive: true });
    }
  }

  // --- HERO 3D SPLIT-SCREEN SHOWCASE ---
  initHero3DShowcase() {
    if (!this.heroShowcase) return;

    // Interactive Hero Card Switching
    const heroCards = this.heroShowcase.querySelectorAll(".hero-floating-card");
    heroCards.forEach((card, idx) => {
      card.addEventListener("mouseenter", () => {
        heroCards.forEach(c => c.classList.remove("active-focus"));
        card.classList.add("active-focus");
        this.activeHeroCardIndex = idx;
      });
    });
  }

  startRenderLoop() {
    const updatePhysics = () => {
      // Lerp mouse positions for silky smooth organic motion
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

      // Update Hero 3D Stage if present
      if (this.heroShowcase) {
        const rotY = this.mouse.x * 14;
        const rotX = -this.mouse.y * 14;

        this.heroShowcase.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

        // Parallax depth rings
        const rings = this.heroShowcase.querySelectorAll(".neon-depth-ring");
        rings.forEach((ring, idx) => {
          const depthMultiplier = (idx + 1) * 12;
          const shiftX = this.mouse.x * depthMultiplier;
          const shiftY = this.mouse.y * depthMultiplier;
          ring.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0px) rotate(${shiftX * 0.8}deg)`;
        });

        // Parallax floating hero cards
        const heroCards = this.heroShowcase.querySelectorAll(".hero-floating-card");
        heroCards.forEach((card, idx) => {
          const depth = parseFloat(card.dataset.depth || "30");
          const cardX = this.mouse.x * (depth * 0.6);
          const cardY = this.mouse.y * (depth * 0.6);
          const baseZ = card.dataset.baseZ || "40px";
          const cardRot = parseFloat(card.dataset.baseRot || "0");

          // Extra pop if hovered
          const isFocused = card.classList.contains("active-focus");
          const finalZ = isFocused ? "85px" : baseZ;
          card.style.transform = `translate3d(${cardX}px, ${cardY}px, ${finalZ}) rotateZ(${cardRot}deg) scale(${isFocused ? 1.05 : 1})`;
        });

        // Parallax floating badges
        const badges = this.heroShowcase.querySelectorAll(".hero-float-badge");
        badges.forEach(badge => {
          const depth = parseFloat(badge.dataset.depth || "50");
          const badgeX = -this.mouse.x * (depth * 0.8);
          const badgeY = -this.mouse.y * (depth * 0.8);
          badge.style.transform = `translate3d(${badgeX}px, ${badgeY}px, 70px)`;
        });
      }

      requestAnimationFrame(updatePhysics);
    };

    requestAnimationFrame(updatePhysics);
  }

  // --- 3D PERSPECTIVE PRODUCT CARDS TILT & SPECULAR GLARE ---
  initCardTiltPhysics() {
    const productGrid = document.getElementById("productGrid");
    if (!productGrid) return;

    // Mousemove tilt handler with real-time specular glare
    productGrid.addEventListener("mousemove", (e) => {
      const card = e.target.closest(".product-card-3d");
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation angles (max ~18 degrees)
      const rotateX = ((y - centerY) / centerY) * -16;
      const rotateY = ((x - centerX) / centerX) * 16;

      const inner = card.querySelector(".card-3d-inner");
      if (inner) {
        inner.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      }

      // Specular Glare calculation
      const glare = card.querySelector(".specular-glare");
      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        const opacity = Math.min(0.45, Math.hypot((x - centerX)/centerX, (y - centerY)/centerY) * 0.35);

        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, ${opacity}) 0%, rgba(255, 255, 255, 0) 70%)`;
      }
    });

    // Reset when leaving card
    productGrid.addEventListener("mouseout", (e) => {
      const card = e.target.closest(".product-card-3d");
      if (!card) return;

      const related = e.relatedTarget;
      if (related && card.contains(related)) return;

      const inner = card.querySelector(".card-3d-inner");
      if (inner) {
        inner.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      }

      const glare = card.querySelector(".specular-glare");
      if (glare) {
        glare.style.background = `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)`;
      }
    });
  }

  // --- INTERACTIVE 3D CREDIT CARD IN CHECKOUT ---
  init3DCreditCard() {
    const cardEl = document.getElementById("interactiveCreditCard3D");
    const numInput = document.getElementById("cardNumInput");
    const nameInput = document.getElementById("cardHolderInput");
    const expInput = document.getElementById("cardExpInput");
    const cvvInput = document.getElementById("cardCvvInput");

    if (!cardEl) return;

    // Mouse tilt on the card itself
    cardEl.addEventListener("mousemove", (e) => {
      if (cardEl.classList.contains("is-flipped")) return; // Don't disrupt flip
      const rect = cardEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotX = ((y - rect.height / 2) / (rect.height / 2)) * -14;
      const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 14;

      cardEl.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    });

    cardEl.addEventListener("mouseleave", () => {
      if (!cardEl.classList.contains("is-flipped")) {
        cardEl.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
      }
    });

    // Live Card Number Formatting & Mirroring
    if (numInput) {
      numInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        val = val.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = val;

        const display = document.getElementById("cardDisplayNum");
        if (display) {
          display.textContent = val || "•••• •••• •••• ••••";
        }
      });
    }

    // Live Cardholder Name Mirroring
    if (nameInput) {
      nameInput.addEventListener("input", (e) => {
        const display = document.getElementById("cardDisplayName");
        if (display) {
          display.textContent = (e.target.value.trim().toUpperCase()) || "YOUR NAME";
        }
      });
    }

    // Live Expiry Date Mirroring
    if (expInput) {
      expInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 3) {
          val = val.substring(0, 2) + '/' + val.substring(2);
        }
        e.target.value = val;

        const display = document.getElementById("cardDisplayExp");
        if (display) {
          display.textContent = val || "MM/YY";
        }
      });
    }

    // 3D Flip on CVV Focus / Blur
    if (cvvInput) {
      cvvInput.addEventListener("focus", () => {
        cardEl.classList.add("is-flipped");
        cardEl.style.transform = `perspective(1000px) rotateY(180deg)`;
      });

      cvvInput.addEventListener("blur", () => {
        cardEl.classList.remove("is-flipped");
        cardEl.style.transform = `perspective(1000px) rotateY(0deg)`;
      });

      cvvInput.addEventListener("input", (e) => {
        const display = document.getElementById("cardDisplayCvv");
        if (display) {
          display.textContent = e.target.value.substring(0, 4) || "•••";
        }
      });
    }
  }

  // Helper method to attach tilt to arbitrary elements (e.g., in modal)
  attachTiltToElement(element) {
    if (!element) return;

    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      element.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
  }
}

// Instantiate engine globally
window.physics3D = new Physics3DEngine();
