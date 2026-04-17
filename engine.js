// ============================================================
//  engine.js  —  Motor 3D inmersivo con Three.js + Depth Maps
//  Efecto: desplazamiento de imagen por profundidad + mouse
//  NO modifica game.js · NO modifica data.js · NO modifica style.css
// ============================================================

(function () {
  'use strict';

  const THREE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

  const CONFIG = {
    strength : 0.35,   // intensidad del desplazamiento (0.1 suave — 0.6 exagerado)
    smoothing: 0.075,  // factor lerp del mouse (menor = más suave)
    segments : 128,    // resolución de la malla
  };

  // ── Estado global ──────────────────────────────────────────
  let renderer    = null;
  let animFrameId = null;
  let activeScene = null; // { canvas, scene, camera, mat, textures[] }

  const mouse     = { x: 0, y: 0 };
  const mouseLerp = { x: 0, y: 0 };

  // ── Helpers ───────────────────────────────────────────────

  function extractImagePath(el) {
    const bg = el.style.backgroundImage || '';
    const m  = bg.match(/url\(["']?([^"')]+)["']?\)/);
    return m ? m[1] : null;
  }

  function depthPath(imgPath) {
    // 'images/room-1-presidencia.jpg' → 'images/room-1-presidencia-depth.jpg'
    return imgPath.replace(/(\.[^.]+)$/, '-depth$1');
  }

  // ── Destruir escena activa y liberar recursos ─────────────

  function destroyScene() {
    if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }

    if (activeScene) {
      const { scene, mat, textures, canvas } = activeScene;

      // Liberar geometría, material y texturas de GPU
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      textures.forEach(t => t.dispose());

      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      activeScene = null;
    }

    if (renderer) {
      renderer.dispose();
      renderer = null;
    }
  }

  // ── Vertex shader ─────────────────────────────────────────

  const vertexShader = /* glsl */`
    uniform sampler2D uDepth;
    uniform vec2      uMouse;
    uniform float     uStrength;
    varying vec2      vUv;

    void main() {
      vUv = uv;

      // Profundidad en este vértice (canal R del depth map)
      float d = texture2D(uDepth, uv).r;

      // Desplazar vértice: los objetos cercanos (d≈1) se mueven más
      vec3 pos = position;
      pos.x += uMouse.x * d * uStrength * 0.18;
      pos.y += uMouse.y * d * uStrength * 0.18;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  // ── Fragment shader ───────────────────────────────────────

  const fragmentShader = /* glsl */`
    uniform sampler2D uTexture;
    uniform sampler2D uDepth;
    uniform vec2      uMouse;
    uniform float     uStrength;
    varying vec2      vUv;

    void main() {
      float d  = texture2D(uDepth, vUv).r;

      // Desplazar coordenadas UV según profundidad y posición del mouse
      vec2 uv  = vUv;
      uv.x -= uMouse.x * d * uStrength * 0.042;
      uv.y += uMouse.y * d * uStrength * 0.042;

      gl_FragColor = texture2D(uTexture, uv);
    }
  `;

  // ── Crear escena Three.js para un screen element ──────────

  function createScene(screenEl, imagePath) {
    const depth = depthPath(imagePath);

    // Eliminar background-image CSS (el canvas lo sustituye)
    screenEl.style.backgroundImage = 'none';
    // Asegurar que el screen sea el contexto de posicionamiento del canvas
    if (getComputedStyle(screenEl).position === 'static') {
      screenEl.style.position = 'relative';
    }

    // Los hijos del HUD deben quedar por encima del canvas (z-index explícito)
    ['.room-top-bar', '.room-scene', '.room-bottom-panel',
     '.intro-overlay', '.iframe-section'].forEach(sel => {
      const node = screenEl.querySelector(sel);
      if (node && !node.style.zIndex) {
        node.style.position = node.style.position || 'relative';
        node.style.zIndex   = '1';
      }
    });

    // Crear y posicionar canvas detrás del HUD
    const canvas = document.createElement('canvas');
    canvas.style.cssText = [
      'position:absolute', 'inset:0',
      'width:100%', 'height:100%',
      'z-index:0', 'display:block',
      'pointer-events:none'
    ].join(';');
    screenEl.insertBefore(canvas, screenEl.firstChild);

    const w = screenEl.clientWidth  || window.innerWidth;
    const h = screenEl.clientHeight || window.innerHeight;

    // Three.js renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false); // false = no actualizar style width/height

    // Cámara ortográfica — imagen plana que llena el viewport
    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    const loader   = new THREE.TextureLoader();
    const textures = [];

    // Cargar imagen principal…
    loader.load(
      imagePath,
      (texture) => {
        textures.push(texture);

        // …luego cargar depth map
        loader.load(
          depth,
          (depthTexture) => {
            textures.push(depthTexture);

            const geo = new THREE.PlaneGeometry(2, 2, CONFIG.segments, CONFIG.segments);
            const mat = new THREE.ShaderMaterial({
              uniforms: {
                uTexture : { value: texture },
                uDepth   : { value: depthTexture },
                uMouse   : { value: new THREE.Vector2(0, 0) },
                uStrength: { value: CONFIG.strength },
              },
              vertexShader,
              fragmentShader,
            });

            const mesh = new THREE.Mesh(geo, mat);
            scene.add(mesh);

            activeScene = { canvas, scene, camera, mat, textures };

            // Loop de renderizado
            function tick() {
              animFrameId = requestAnimationFrame(tick);

              // Lerp del mouse para movimiento suave
              mouseLerp.x += (mouse.x - mouseLerp.x) * CONFIG.smoothing;
              mouseLerp.y += (mouse.y - mouseLerp.y) * CONFIG.smoothing;

              mat.uniforms.uMouse.value.set(mouseLerp.x, mouseLerp.y);
              renderer.render(scene, camera);
            }
            tick();
          },
          undefined,
          () => {
            // Depth map no existe → fallback imagen estática
            console.info(`[engine] depth map no encontrado para ${imagePath} — modo estático`);
            restoreBackground(screenEl, imagePath, canvas);
          }
        );
      },
      undefined,
      () => {
        // Imagen principal no cargó
        restoreBackground(screenEl, imagePath, canvas);
      }
    );
  }

  // ── Fallback: restaurar background-image original ─────────

  function restoreBackground(screenEl, imagePath, canvas) {
    screenEl.style.backgroundImage = `url('${imagePath}')`;
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    if (renderer) { renderer.dispose(); renderer = null; }
  }

  // ── Resize ────────────────────────────────────────────────

  window.addEventListener('resize', () => {
    if (!renderer || !activeScene) return;
    const screenEl = document.querySelector('.room-screen, .intro-screen');
    if (!screenEl) return;
    const w = screenEl.clientWidth;
    const h = screenEl.clientHeight;
    renderer.setSize(w, h, false);
  });

  // ── Mouse tracking ────────────────────────────────────────

  document.addEventListener('mousemove', (e) => {
    mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2; // −1..1
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2; // −1..1
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = 0;
    mouse.y = 0;
  });

  // ── MutationObserver — detectar cada cuarto nuevo ─────────

  function tryBindScreen(screenEl) {
    if (screenEl.dataset.engineBound) return;
    screenEl.dataset.engineBound = 'true';

    const imagePath = extractImagePath(screenEl);
    if (!imagePath) return;

    destroyScene();
    createScene(screenEl, imagePath);
  }

  function initObserver() {
    const app = document.getElementById('app');
    if (!app) return;

    // Observar cambios directos en #app (game.js inyecta innerHTML directamente)
    const observer = new MutationObserver(() => {
      const screen = document.querySelector('.room-screen, .intro-screen');
      if (screen) tryBindScreen(screen);
    });

    observer.observe(app, { childList: true });

    // Aplicar al screen ya presente si lo hay
    const existing = document.querySelector('.room-screen, .intro-screen');
    if (existing) tryBindScreen(existing);
  }

  // ── Interceptar showDoorOpening para el efecto de entrada ─

  function interceptDoorAnimation() {
    const original = window.showDoorOpening;
    if (typeof original !== 'function') return;

    window.showDoorOpening = function () {
      const screen = document.querySelector('.room-screen');

      if (!screen || !activeScene) {
        original();
        return;
      }

      document.body.style.overflow = 'hidden';

      // Exagerar uStrength progresivamente → sensación de "correr hacia la puerta"
      if (activeScene.mat) {
        let t = 0;
        const ramp = setInterval(() => {
          t += 0.04;
          if (activeScene && activeScene.mat) {
            activeScene.mat.uniforms.uStrength.value = CONFIG.strength + t * 2.5;
          }
          if (t >= 1) clearInterval(ramp);
        }, 25);
      }

      // Fade a negro
      const overlay = document.createElement('div');
      overlay.style.cssText = [
        'position:fixed', 'inset:0', 'background:#000',
        'opacity:0', 'z-index:5000',
        'transition:opacity 0.65s ease-in',
        'pointer-events:none'
      ].join(';');
      document.body.appendChild(overlay);

      setTimeout(() => { overlay.style.opacity = '1'; }, 800);

      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
        destroyScene();
        original();
      }, 1600);
    };
  }

  // ── Cargar Three.js e inicializar ─────────────────────────

  function init() {
    initObserver();
    interceptDoorAnimation();
  }

  function loadThree() {
    if (window.THREE) { init(); return; }

    const script  = document.createElement('script');
    script.src    = THREE_CDN;
    script.onload = init;
    script.onerror = () => {
      console.warn('[engine] Three.js no disponible — efectos 3D desactivados.');
    };
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadThree);
  } else {
    loadThree();
  }

})();
