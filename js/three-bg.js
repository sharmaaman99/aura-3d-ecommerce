/**
 * Ultra-Modern 3D Ambient Background Engine
 * Powers a floating 3D luxury geometry & stardust field using Three.js
 * Gracefully falls back to high-performance Canvas 2D if WebGL is unavailable
 */

class Luxury3DBackground {
  constructor() {
    this.canvas = document.getElementById("bg3DCanvas");
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.floatingMeshes = [];
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isWebGL = false;

    this.init();
  }

  init() {
    if (!this.canvas) return;

    if (window.THREE && this.checkWebGL()) {
      this.initThreeJS();
    } else {
      this.initCanvasFallback();
    }

    this.bindEvents();
  }

  checkWebGL() {
    try {
      const gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
      return !!gl;
    } catch (e) {
      return false;
    }
  }

  // --- THREE.JS IMPLEMENTATION ---
  initThreeJS() {
    this.isWebGL = true;
    const THREE = window.THREE;

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 80;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xF59E0B, 2.5, 200);
    goldLight.position.set(40, 50, 40);
    this.scene.add(goldLight);

    const indigoLight = new THREE.PointLight(0x6366F1, 2.8, 200);
    indigoLight.position.set(-40, -40, 30);
    this.scene.add(indigoLight);

    // Floating Geometries (Luxury Rings & Icosahedrons)
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });

    const indigoMaterial = new THREE.MeshStandardMaterial({
      color: 0x6366F1,
      metalness: 0.9,
      roughness: 0.15,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });

    // Torus 1 (Gold Ring)
    const torusGeo1 = new THREE.TorusGeometry(18, 1.2, 16, 80);
    const torus1 = new THREE.Mesh(torusGeo1, goldMaterial);
    torus1.position.set(35, 15, -10);
    this.scene.add(torus1);
    this.floatingMeshes.push({ mesh: torus1, rx: 0.003, ry: 0.005, rz: 0.002 });

    // Torus 2 (Indigo Ring)
    const torusGeo2 = new THREE.TorusGeometry(24, 0.8, 16, 90);
    const torus2 = new THREE.Mesh(torusGeo2, indigoMaterial);
    torus2.position.set(-35, -20, -15);
    this.scene.add(torus2);
    this.floatingMeshes.push({ mesh: torus2, rx: -0.004, ry: 0.003, rz: -0.003 });

    // Icosahedron (Center Depth Gem)
    const icoGeo = new THREE.IcosahedronGeometry(12, 1);
    const ico = new THREE.Mesh(icoGeo, goldMaterial);
    ico.position.set(10, -25, -25);
    this.scene.add(ico);
    this.floatingMeshes.push({ mesh: ico, rx: 0.005, ry: 0.006, rz: 0.004 });

    // Particle Cloud (1,200 Luxury Stars)
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorGold = new THREE.Color(0xF59E0B);
    const colorIndigo = new THREE.Color(0x6366F1);
    const colorWhite = new THREE.Color(0xFFFFFF);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 220;
      positions[i + 1] = (Math.random() - 0.5) * 220;
      positions[i + 2] = (Math.random() - 0.5) * 150;

      const rand = Math.random();
      const chosenColor = rand > 0.6 ? colorGold : (rand > 0.25 ? colorIndigo : colorWhite);
      colors[i] = chosenColor.r;
      colors[i + 1] = chosenColor.g;
      colors[i + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, particleMaterial);
    this.scene.add(this.particles);

    this.animateThreeJS();
  }

  animateThreeJS() {
    const loop = () => {
      // Lerp mouse
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

      // Parallax camera
      if (this.camera) {
        this.camera.position.x = this.mouse.x * 12;
        this.camera.position.y = -this.mouse.y * 12;
        this.camera.lookAt(0, 0, 0);
      }

      // Rotate particles slowly
      if (this.particles) {
        this.particles.rotation.y += 0.0006;
        this.particles.rotation.x += 0.0003;
      }

      // Rotate geometric meshes
      this.floatingMeshes.forEach(item => {
        item.mesh.rotation.x += item.rx;
        item.mesh.rotation.y += item.ry;
        item.mesh.rotation.z += item.rz;
      });

      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  // --- CANVAS 2D FALLBACK (Runs if offline or WebGL disabled) ---
  initCanvasFallback() {
    const ctx = this.canvas.getContext("2d");
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = [];
    const colors = ["rgba(245, 158, 11, 0.4)", "rgba(99, 102, 241, 0.4)", "rgba(255, 255, 255, 0.3)"];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      particles.forEach(p => {
        p.x += p.vx + this.mouse.targetX * 0.5;
        p.y += p.vy - this.mouse.targetY * 0.5;

        if (p.x < 0) p.x = this.canvas.width;
        if (p.x > this.canvas.width) p.x = 0;
        if (p.y < 0) p.y = this.canvas.height;
        if (p.y > this.canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }

  bindEvents() {
    window.addEventListener("mousemove", (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    window.addEventListener("resize", () => {
      if (this.isWebGL && this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });
  }
}

// Auto-instantiate when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.luxe3DBG = new Luxury3DBackground();
});
