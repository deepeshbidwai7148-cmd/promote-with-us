// 3D Animation Module using Three.js
class ThreeDScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8f9ff);
    this.scene.fog = new THREE.Fog(0xf8f9ff, 10, 50);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    // Lights
    this.setupLights();

    // Create objects
    this.objects = [];
    this.createAnimatedObjects();

    // Animation loop
    this.animate();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Mouse interaction
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Point light
    const pointLight = new THREE.PointLight(0x20c5b5, 1);
    pointLight.position.set(-5, 5, 5);
    pointLight.castShadow = true;
    this.scene.add(pointLight);
  }

  createAnimatedObjects() {
    // Animated cube
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshPhongMaterial({
      color: 0x164069,
      shininess: 100,
      wireframe: false
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.position.x = -3;
    cube.rotation.speed = 0.01;
    this.scene.add(cube);
    this.objects.push({ mesh: cube, rotationSpeed: 0.01, type: 'cube' });

    // Animated sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(1.5, 4);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x20c5b5,
      emissive: 0x20c5b5,
      emissiveIntensity: 0.2,
      shininess: 100
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.position.x = 3;
    sphere.position.y = 1;
    this.scene.add(sphere);
    this.objects.push({ mesh: sphere, rotationSpeed: 0.008, type: 'sphere', floatSpeed: 0.05 });

    // Torus (rotating ring)
    const torusGeometry = new THREE.TorusGeometry(1.5, 0.4, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({
      color: 0xff6b6b,
      emissive: 0xff6b6b,
      emissiveIntensity: 0.3,
      shininess: 100
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.castShadow = true;
    torus.receiveShadow = true;
    torus.position.y = -2;
    torus.rotation.x = Math.PI / 4;
    this.scene.add(torus);
    this.objects.push({ mesh: torus, rotationSpeed: 0.015, type: 'torus' });

    // Tetrahedron
    const tetGeometry = new THREE.TetrahedronGeometry(1.2, 0);
    const tetMaterial = new THREE.MeshPhongMaterial({
      color: 0x20c5b5,
      wireframe: true,
      emissive: 0x20c5b5,
      emissiveIntensity: 0.4
    });
    const tetrahedron = new THREE.Mesh(tetGeometry, tetMaterial);
    tetrahedron.position.set(0, 2, 0);
    this.scene.add(tetrahedron);
    this.objects.push({ mesh: tetrahedron, rotationSpeed: 0.012, type: 'tetrahedron' });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Animate objects
    this.objects.forEach((obj, index) => {
      // Rotation
      obj.mesh.rotation.x += obj.rotationSpeed;
      obj.mesh.rotation.y += obj.rotationSpeed * 0.8;

      // Floating animation for sphere
      if (obj.type === 'sphere') {
        obj.mesh.position.y = 1 + Math.sin(Date.now() * 0.001) * 0.5;
      }

      // Bobbing for torus
      if (obj.type === 'torus') {
        obj.mesh.position.y = -2 + Math.sin(Date.now() * 0.001 + index) * 0.3;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  onMouseMove(event) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Adjust camera based on mouse position
    this.camera.position.x = x * 2;
    this.camera.position.y = y * 2;
    this.camera.lookAt(this.scene.position);
  }

  onWindowResize() {
    if (!this.container) return;
    
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}

// Initialize 3D scenes when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Create 3D scenes if containers exist
  const scenes = document.querySelectorAll('[data-3d-scene]');
  scenes.forEach(sceneContainer => {
    new ThreeDScene(sceneContainer.id);
  });
});

// Particle system for background
class ParticleSystem {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.particles = [];
    this.createParticles();
    this.animate();

    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }

  createParticles() {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#20c5b5' : '#164069',
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Draw particle
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.opacity;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p2.x - p.x;
        const dy = p2.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          this.ctx.strokeStyle = p.color;
          this.ctx.globalAlpha = (1 - distance / 100) * 0.2;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    });

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
}

// Scroll animation observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply observer to animatable elements
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
});

// Smooth scroll enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
