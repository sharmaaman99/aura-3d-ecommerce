/**
 * TOONHUB 3D Character Figurine Hero Carousel
 * Full-viewport character carousel with dynamic role transitions,
 * Anton display typography, fractal noise grain overlay, and 650ms cubic-bezier physics.
 */

const TOONHUB_DATA = [
  {
    id: "toon-1",
    name: "Aero Cyber Bot #01",
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png',
    bg: '#F4845F',
    panel: '#F79B7F'
  },
  {
    id: "toon-2",
    name: "Verde Mech Pilot #02",
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png',
    bg: '#6BBF7A',
    panel: '#85CC92'
  },
  {
    id: "toon-3",
    name: "Sakura Android #03",
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png',
    bg: '#E882B4',
    panel: '#ED9DC4'
  },
  {
    id: "toon-4",
    name: "Hydro Plasma Drone #04",
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png',
    bg: '#6EB5FF',
    panel: '#8DC4FF'
  }
];

class ToonhubCarousel {
  constructor() {
    this.activeIndex = 0;
    this.isAnimating = false;
    this.isMobile = window.innerWidth < 640;
    this.imagesLoaded = 0;
    this.container = null;
    this.carouselTrack = null;

    this.init();
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.container = document.getElementById("toonhubSection");
    this.carouselTrack = document.getElementById("toonhubTrack");

    if (!this.container || !this.carouselTrack) return;

    this.preloadImages();
    this.renderItems();
    this.applyRoles();
    this.bindEvents();
  }

  // Preload all 4 images on mount
  preloadImages() {
    TOONHUB_DATA.forEach(item => {
      const img = new Image();
      img.src = item.src;
      img.onload = () => {
        this.imagesLoaded++;
      };
    });
  }

  renderItems() {
    if (!this.carouselTrack) return;

    this.carouselTrack.innerHTML = TOONHUB_DATA.map((item, idx) => `
      <div class="toonhub-item" id="toonItem-${idx}" data-index="${idx}">
        <img src="${item.src}" alt="${item.name}" draggable="false" class="toonhub-img">
      </div>
    `).join("");
  }

  applyRoles() {
    if (!this.container) return;

    // Outer background transition
    this.container.style.backgroundColor = TOONHUB_DATA[this.activeIndex].bg;

    const centerIdx = this.activeIndex;
    const leftIdx = (this.activeIndex + 3) % 4;
    const rightIdx = (this.activeIndex + 1) % 4;
    const backIdx = (this.activeIndex + 2) % 4;

    this.isMobile = window.innerWidth < 640;

    const setRoleStyle = (idx, role) => {
      const el = document.getElementById(`toonItem-${idx}`);
      if (!el) return;

      el.className = `toonhub-item role-${role}`;

      if (role === 'center') {
        el.style.left = '50%';
        el.style.height = this.isMobile ? '60%' : '92%';
        el.style.bottom = this.isMobile ? '22%' : '0';
        el.style.transform = `translateX(-50%) scale(${this.isMobile ? 1.25 : 1.68})`;
        el.style.filter = 'blur(0px)';
        el.style.opacity = '1';
        el.style.zIndex = '20';
      } else if (role === 'left') {
        el.style.left = this.isMobile ? '20%' : '30%';
        el.style.height = this.isMobile ? '16%' : '28%';
        el.style.bottom = this.isMobile ? '32%' : '12%';
        el.style.transform = 'translateX(-50%) scale(1)';
        el.style.filter = 'blur(2px)';
        el.style.opacity = '0.85';
        el.style.zIndex = '10';
      } else if (role === 'right') {
        el.style.left = this.isMobile ? '80%' : '70%';
        el.style.height = this.isMobile ? '16%' : '28%';
        el.style.bottom = this.isMobile ? '32%' : '12%';
        el.style.transform = 'translateX(-50%) scale(1)';
        el.style.filter = 'blur(2px)';
        el.style.opacity = '0.85';
        el.style.zIndex = '10';
      } else if (role === 'back') {
        el.style.left = '50%';
        el.style.height = this.isMobile ? '13%' : '22%';
        el.style.bottom = this.isMobile ? '32%' : '12%';
        el.style.transform = 'translateX(-50%) scale(1)';
        el.style.filter = 'blur(4px)';
        el.style.opacity = '1';
        el.style.zIndex = '5';
      }
    };

    setRoleStyle(centerIdx, 'center');
    setRoleStyle(leftIdx, 'left');
    setRoleStyle(rightIdx, 'right');
    setRoleStyle(backIdx, 'back');
  }

  navigate(direction) {
    if (this.isAnimating) return;

    this.isAnimating = true;
    window.soundFX?.playClick();

    if (direction === 'next') {
      this.activeIndex = (this.activeIndex + 1) % 4;
    } else {
      this.activeIndex = (this.activeIndex + 3) % 4;
    }

    this.applyRoles();

    // Release animation lock after 650ms
    setTimeout(() => {
      this.isAnimating = false;
    }, 650);
  }

  bindEvents() {
    const prevBtn = document.getElementById("toonhubPrevBtn");
    const nextBtn = document.getElementById("toonhubNextBtn");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.navigate('prev'));
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.navigate('next'));
    }

    window.addEventListener("resize", () => {
      const mob = window.innerWidth < 640;
      if (mob !== this.isMobile) {
        this.isMobile = mob;
        this.applyRoles();
      }
    });

    // Keyboard Arrow navigation
    window.addEventListener("keydown", (e) => {
      // Only navigate if visible in viewport
      const rect = this.container?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
        if (e.key === "ArrowLeft") this.navigate('prev');
        if (e.key === "ArrowRight") this.navigate('next');
      }
    });
  }
}

// Global instance
window.toonhubCarousel = new ToonhubCarousel();
