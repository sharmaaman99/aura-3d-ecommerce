/**
 * 3D Physics & Parallax Engine
 * - Interactive 3D mouse tilt with dynamic specular glare
 * - Split-screen Hero 3D showcase with orbital neon depth rings
 * - Smooth lerped physics for 60fps performance
 */

class Physics3DEngine {
  constructor() {
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.heroContainer = null;
    this.heroShowcase = null;
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

    // Additional interactive tilt on the hero showcase area directly
    this.heroShowcase.addEventListener("mousemove", (e) => {
      const rect = this.heroShowcase.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      this.heroMouseX = (x - centerX) / centerX;
      this.heroMouseY = (y - centerY) / centerY;
    });

    this.heroShowcase.addEventListener("mouseleave", () => {
      this.heroMouseX = 0;
      this.heroMouseY = 0;
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
        heroCards.forEach(card => {
          const depth = parseFloat(card.dataset.depth || "30");
          const cardX = this.mouse.x * (depth * 0.6);
          const cardY = this.mouse.y * (depth * 0.6);
          const baseZ = card.dataset.baseZ || "40px";
          const cardRot = parseFloat(card.dataset.baseRot || "0");
          card.style.transform = `translate3d(${cardX}px, ${cardY}px, ${baseZ}) rotateZ(${cardRot}deg)`;
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
    // Event delegation on product grid for both existing and newly rendered cards
    const productGrid = document.getElementById("productGrid");
    if (!productGrid) return;

    // Mousemove tilt handler
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

      // Only reset if actually leaving the card boundary
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
