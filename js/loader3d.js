/**
 * ULTRA-MODERN FULL-SCREEN 3D LUXURY SPATIAL LOADING SCREEN ENGINE
 * Full-viewport WebGL 3D Gyroscope with faceted gold icosahedron core,
 * 3 concentric multi-axis orbital rings, 450 cosmic stardust particles,
 * real-time cursor tilt physics, and dramatic cinematic camera zoom-out exit animation.
 */

class Luxury3DLoader {
  constructor() {
    this.overlay = document.getElementById("luxuryLoadingScreen");
    this.canvas = document.getElementById("loader3DCanvas");
    this.bar = document.getElementById("loaderProgressBar");
    this.percent = document.getElementById("loaderPercent");
    this.statusText = document.getElementById("loaderStatusText");
    this.stageName = document.getElementById("loaderStageName");

    this.progress = 0;
    this.isCompleted = false;
    this.animFrameId = null;

    // Three.js instances
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.coreGroup = null;
    this.gemMesh = null;
    this.wireframeMesh = null;
    this.innerMesh = null;
    this.ring1 = null;
    this.ring2 = null;
    this.ring3 = null;
    this.satellites = [];
    this.particles = null;
    this.light1 = null;
    this.light2 = null;

    // Interaction & Tilt Physics
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.rotationSpeed = { x: 0.012, y: 0.018, z: 0.008 };
    this.isZoomingOut = false;
    this.targetCameraZ = 95;

    // Telemetry Stages
    this.stages = [
      { text: "Compiling 3D WebGL Shader Pipeline...", stage: "GPU_SYNC", threshold: 20 },
      { text: "Calibrating Spatial Gyroscope & Perspective Matrix...", stage: "TILT_CALIB", threshold: 45 },
      { text: "Buffering 12 Luxury Atelier Meshes & Specular Glare...", stage: "MESH_BUFFER", threshold: 70 },
      { text: "Synchronizing TOONHUB 3D Spatial Figurines...", stage: "FIGURINE_CACHE", threshold: 92 },
      { text: "Atelier Initialized • Welcome to AURA 3D", stage: "READY", threshold: 100 }
    ];

    this.init();
  }

  init() {
    if (!this.overlay) return;

    // Setup Full-Screen 3D Scene (Three.js WebGL or Canvas Fallback)
    if (this.canvas && window.THREE && this.checkWebGL()) {
      this.initThreeJS();
    } else if (this.canvas) {
      this.initCanvasFallback();
    }

    this.bindEvents();
    this.startProgressSimulation();
  }

  checkWebGL() {
    try {
      const gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
      return !!gl;
    } catch (e) {
      return false;
    }
  }

  // --- THREE.JS WEBGL FULL-SCREEN 3D IMPLEMENTATION ---
  initThreeJS() {
    const THREE = window.THREE;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.z = 95;
    this.targetCameraZ = 95;

    // Renderer (Full Screen)
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Master Rotational Group
    this.coreGroup = new THREE.Group();
    this.scene.add(this.coreGroup);

    // 1. Central Faceted Icosahedron Gem (Royal Gold)
    const gemGeo = new THREE.IcosahedronGeometry(22, 0);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      metalness: 0.92,
      roughness: 0.15,
      emissive: 0x78350F,
      emissiveIntensity: 0.4,
      flatShading: true
    });
    this.gemMesh = new THREE.Mesh(gemGeo, gemMat);
    this.coreGroup.add(this.gemMesh);

    // 2. Outer Luminous Wireframe Shell (Electric Indigo)
    const wireGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(22.4, 0));
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x818CF8,
      transparent: true,
      opacity: 0.95,
      linewidth: 2
    });
    this.wireframeMesh = new THREE.LineSegments(wireGeo, wireMat);
    this.coreGroup.add(this.wireframeMesh);

    // 3. Inner Quantum Pulsar (Electric Cyan)
    const innerGeo = new THREE.OctahedronGeometry(10, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    this.innerMesh = new THREE.Mesh(innerGeo, innerMat);
    this.coreGroup.add(this.innerMesh);

    // 4. Primary Orbital Gyro Ring (Royal Gold)
    const ring1Geo = new THREE.TorusGeometry(38, 1.1, 16, 90);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      metalness: 0.95,
      roughness: 0.18,
      emissive: 0xD97706,
      emissiveIntensity: 0.45
    });
    this.ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    this.coreGroup.add(this.ring1);

    // 5. Secondary Orbital Gyro Ring (Electric Indigo, 50° inclined)
    const ring2Geo = new THREE.TorusGeometry(49, 0.9, 16, 90);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x6366F1,
      metalness: 0.92,
      roughness: 0.22,
      emissive: 0x4338CA,
      emissiveIntensity: 0.5
    });
    this.ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    this.ring2.rotation.x = Math.PI / 3.2;
    this.ring2.rotation.y = Math.PI / 4;
    this.coreGroup.add(this.ring2);

    // 6. Tertiary Equatorial Ring (Spatial Emerald/Cyan)
    const ring3Geo = new THREE.TorusGeometry(60, 0.75, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x10B981,
      metalness: 0.88,
      roughness: 0.28,
      emissive: 0x059669,
      emissiveIntensity: 0.35
    });
    this.ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    this.ring3.rotation.x = Math.PI / 2;
    this.coreGroup.add(this.ring3);

    // 7. Orbiting Satellite Nodes
    const createSatellite = (radius, color, ring) => {
      const satGeo = new THREE.SphereGeometry(2.0, 16, 16);
      const satMat = new THREE.MeshBasicMaterial({ color: color });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      ring.add(satMesh);
      satMesh.position.x = radius;
      return { mesh: satMesh, ring: ring, angle: 0, speed: 0.035, radius: radius };
    };

    this.satellites.push(createSatellite(38, 0xFDE047, this.ring1));
    this.satellites.push(createSatellite(49, 0xA5B4FC, this.ring2));
    this.satellites.push(createSatellite(60, 0x6EE7B7, this.ring3));

    // 8. Full-Viewport Cosmic Stardust Particles (450 glittering micro-stars)
    const partCount = 450;
    const partPositions = new Float32Array(partCount * 3);
    const partColors = new Float32Array(partCount * 3);

    const goldColor = new THREE.Color(0xF59E0B);
    const indigoColor = new THREE.Color(0x818CF8);
    const cyanColor = new THREE.Color(0x38BDF8);

    for (let i = 0; i < partCount; i++) {
      const radius = 30 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      partPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      partPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      partPositions[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = (i % 3 === 0) ? goldColor : (i % 3 === 1) ? indigoColor : cyanColor;
      partColors[i * 3] = chosenColor.r;
      partColors[i * 3 + 1] = chosenColor.g;
      partColors[i * 3 + 2] = chosenColor.b;
    }

    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute("position", new THREE.BufferAttribute(partPositions, 3));
    partGeo.setAttribute("color", new THREE.BufferAttribute(partColors, 3));

    const partMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });

    this.particles = new THREE.Points(partGeo, partMat);
    this.scene.add(this.particles);

    // 9. Dynamic 3D Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambientLight);

    this.light1 = new THREE.PointLight(0xF59E0B, 3.8, 180);
    this.light1.position.set(45, 45, 60);
    this.scene.add(this.light1);

    this.light2 = new THREE.PointLight(0x6366F1, 3.0, 180);
    this.light2.position.set(-45, -45, 60);
    this.scene.add(this.light2);

    // Start Animation Loop
    this.animateThreeJS();
  }

  animateThreeJS() {
    if (this.isCompleted) return;

    // Smooth cursor tilt easing
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    // Handle Cinematic Camera Zoom-Out Animation
    if (this.isZoomingOut) {
      // Pull camera backwards into deep space (Zoom Out)
      this.camera.position.z += (340 - this.camera.position.z) * 0.085;
      // Accelerate spin rate
      if (this.coreGroup) {
        this.coreGroup.rotation.y += 0.075;
      }
      if (this.particles) {
        this.particles.scale.multiplyScalar(1.015);
      }
    } else {
      // Normal rotation with mouse tilt
      if (this.coreGroup) {
        this.coreGroup.rotation.y += this.rotationSpeed.y;
        this.coreGroup.rotation.x = this.mouse.y * 0.45 + Math.sin(Date.now() * 0.001) * 0.08;
        this.coreGroup.rotation.z = -this.mouse.x * 0.45;
      }
    }

    // Counter-rotate inner quantum core
    if (this.innerMesh) {
      this.innerMesh.rotation.x -= 0.025;
      this.innerMesh.rotation.z += 0.03;
    }

    // Individual Gyro Ring Rotations
    if (this.ring1) {
      this.ring1.rotation.z += 0.016;
    }
    if (this.ring2) {
      this.ring2.rotation.x -= 0.02;
      this.ring2.rotation.y += 0.014;
    }
    if (this.ring3) {
      this.ring3.rotation.z -= 0.012;
      this.ring3.rotation.x += 0.016;
    }

    // Orbit satellites
    this.satellites.forEach(sat => {
      sat.angle += sat.speed;
      sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
      sat.mesh.position.y = Math.sin(sat.angle) * sat.radius;
    });

    // Swirl particle field
    if (this.particles) {
      this.particles.rotation.y += 0.0025;
      this.particles.rotation.x += 0.0012;
    }

    // Dynamic light orbit
    if (this.light1) {
      const time = Date.now() * 0.002;
      this.light1.position.x = Math.cos(time) * 60;
      this.light1.position.y = Math.sin(time) * 60;
    }

    this.renderer.render(this.scene, this.camera);
    this.animFrameId = requestAnimationFrame(() => this.animateThreeJS());
  }

  // --- CANVAS 2D 3D-PERSPECTIVE PROJECTION FALLBACK ---
  initCanvasFallback() {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    let angle = 0;
    let fallbackScale = 1;

    const renderFallback = () => {
      if (this.isCompleted) return;

      const w = this.canvas.width;
      const h = this.canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      angle += 0.02;

      if (this.isZoomingOut) {
        fallbackScale *= 0.94; // Zoom out fallback
      }

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(fallbackScale, fallbackScale);

      // Ring 1 Gold
      ctx.beginPath();
      ctx.ellipse(0, 0, 110, 40 * Math.sin(angle), angle, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(245, 158, 11, 0.9)";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Ring 2 Indigo
      ctx.beginPath();
      ctx.ellipse(0, 0, 140, 55 * Math.cos(angle * 0.8), -angle * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(99, 102, 241, 0.9)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ring 3 Cyan
      ctx.beginPath();
      ctx.ellipse(0, 0, 170, 65 * Math.sin(angle * 0.5), angle * 0.4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Center Diamond Core
      ctx.beginPath();
      const r = 36 + Math.sin(angle * 3) * 3;
      ctx.moveTo(0, -r);
      ctx.lineTo(r, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r, 0);
      ctx.closePath();
      ctx.fillStyle = "rgba(245, 158, 11, 0.95)";
      ctx.fill();

      // Inner Wireframe Cross
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(0, r);
      ctx.moveTo(-r, 0);
      ctx.lineTo(r, 0);
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();

      this.animFrameId = requestAnimationFrame(renderFallback);
    };

    renderFallback();
  }

  // --- MOUSE, TOUCH & RESIZE EVENT LISTENERS ---
  bindEvents() {
    const handleMove = (clientX, clientY) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      this.mouse.targetX = (clientX - halfW) / halfW;
      this.mouse.targetY = (clientY - halfH) / halfH;
    };

    window.addEventListener("mousemove", (e) => {
      handleMove(e.clientX, e.clientY);
    });

    window.addEventListener("touchmove", (e) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener("resize", () => {
      if (!this.renderer || !this.camera) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  // --- PROGRESS SIMULATION & TELEMETRY (EXACTLY 3.0 SECONDS DURATION) ---
  startProgressSimulation() {
    const totalDuration = 3000; // 3.0 seconds duration
    const startTime = performance.now();

    const tick = (now) => {
      if (this.isCompleted) return;

      const elapsed = now - startTime;
      const progressRatio = Math.min(1, elapsed / totalDuration);

      // Smooth luxury cubic curve
      const eased = progressRatio < 0.5
        ? 4 * progressRatio * progressRatio * progressRatio
        : 1 - Math.pow(-2 * progressRatio + 2, 3) / 2;

      this.progress = Math.min(100, Math.round(eased * 100));

      // Update UI elements
      if (this.bar) this.bar.style.width = `${this.progress}%`;
      if (this.percent) this.percent.textContent = `${this.progress}%`;

      // Update Telemetry & Stages
      for (const stage of this.stages) {
        if (this.progress <= stage.threshold) {
          if (this.statusText && this.statusText.textContent !== stage.text) {
            this.statusText.textContent = stage.text;
          }
          if (this.stageName && this.stageName.textContent !== stage.stage) {
            this.stageName.textContent = stage.stage;
          }
          break;
        }
      }

      if (elapsed < totalDuration) {
        requestAnimationFrame(tick);
      } else {
        this.progress = 100;
        if (this.bar) this.bar.style.width = "100%";
        if (this.percent) this.percent.textContent = "100%";
        if (this.statusText) this.statusText.textContent = "Atelier Initialized • Welcome to AURA 3D";
        if (this.stageName) this.stageName.textContent = "READY";
        this.triggerZoomOutExit();
      }
    };

    requestAnimationFrame(tick);
  }

  // --- 100% CINEMATIC ZOOM-OUT EXIT SEQUENCE ---
  triggerZoomOutExit() {
    // 1. Activate Camera Zoom-Out in Three.js
    this.isZoomingOut = true;

    // 2. Play luxury harmonic audio chime
    if (window.soundFX && typeof window.soundFX.playSuccess === "function") {
      try {
        window.soundFX.playSuccess();
      } catch (e) {}
    }

    // 3. Trigger CSS Cinematic Zoom-Out Animation on Overlay & Dock
    setTimeout(() => {
      if (this.overlay) {
        this.overlay.classList.add("loader-fade-out");
      }

      setTimeout(() => {
        this.destroy();
      }, 750);
    }, 280);
  }

  // --- CLEANUP & MEMORY MANAGEMENT ---
  destroy() {
    this.isCompleted = true;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }

    if (this.overlay) {
      this.overlay.style.display = "none";
    }

    // Clean up Three.js WebGL resources to keep 100% GPU performance for main store
    if (this.renderer) {
      try {
        this.renderer.dispose();
      } catch (e) {}
    }
  }
}

// Instantiate immediately upon DOM readiness
document.addEventListener("DOMContentLoaded", () => {
  window.luxury3DLoader = new Luxury3DLoader();
});
