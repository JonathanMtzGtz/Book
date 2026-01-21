import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// ===== CONFIGURACIÓN DE RUTAS =====
// IMPORTANTE: En desarrollo con Vite, usa '/'
// En producción, serán rutas relativas
const IS_DEV = import.meta.env.DEV;
const BASE_PATH = IS_DEV ? '/' : './';

const PATHS = {
  model: `${BASE_PATH}src/3d/Omoda.glb`,
  hdri: `${BASE_PATH}src/hdri/2.hdr`,
  audioOpen: `${BASE_PATH}src/audio/abrir.mp3`,
  audioClose: `${BASE_PATH}src/audio/cerrar.mp3`
};

console.log('📍 Rutas configuradas:', PATHS);

// ===== VARIABLES GLOBALES =====
let scene, camera, renderer, controls;
let carModel = null;
let hdrTexture = null;
const doors = {
  leftFront: null,
  rightFront: null, 
  leftRear: null,
  rightRear: null
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Iniciando aplicación 3D...');
  
  try {
    await init();
    setupEventListeners();
    animate();
    console.log('✅ Aplicación 3D iniciada correctamente');
  } catch (error) {
    console.error('❌ Error crítico al iniciar:', error);
    showError('Error al cargar la vista 3D: ' + error.message);
  }
});

async function init() {
  // 1. Contenedor
  const container = document.getElementById('three-container');
  if (!container) throw new Error('Elemento #three-container no encontrado');
  
  // 2. Escena
  scene = new THREE.Scene();
  
  // 3. Cámara
  camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
  );
  camera.position.set(0, 0.4, 4);
  
  // 4. Renderer
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  
  container.appendChild(renderer.domElement);
  
  // 5. Controles Orbit - CONFIGURACIÓN CORRECTA
  controls = new OrbitControls(camera, renderer.domElement);
  configureOrbitControls();
  
  // 6. Luces (PRIMERO las luces, luego el fondo)
  setupLights();
  
  // 7. Cargar HDRI
  await loadHDRI();
  
  // 8. Cargar modelo
  await loadModel();
  
  // 9. Eventos de ventana
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('scroll', onScroll);
  
  // 10. Mostrar controles
  showControls();
}

function configureOrbitControls() {
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false; // Zoom deshabilitado
  controls.enablePan = true;
  controls.minPolarAngle = Math.PI / 6; // Límite vertical: 30 grados
  controls.maxPolarAngle = Math.PI / 2; // Límite vertical: 90 grados
  // Se eliminan las restricciones de Azimuth para permitir órbita horizontal libre
  controls.target.set(0, 0.2, 0);
  controls.update();
}

function setupLights() {
  // Luz direccional principal (sol)
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
  sunLight.position.set(10, 20, 10);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 50;
  sunLight.shadow.camera.left = -10;
  sunLight.shadow.camera.right = 10;
  sunLight.shadow.camera.top = 10;
  sunLight.shadow.camera.bottom = -10;
  sunLight.shadow.bias = -0.0001;
  scene.add(sunLight);
  
  // Luz ambiental (cielo)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  // Luces de relleno
  const fillLight1 = new THREE.DirectionalLight(0x4466ff, 0.3);
  fillLight1.position.set(-10, 5, -10);
  scene.add(fillLight1);
  
  const fillLight2 = new THREE.DirectionalLight(0xff8866, 0.2);
  fillLight2.position.set(5, 3, 10);
  scene.add(fillLight2);
  
  // Luz puntual para acentos
  const accentLight = new THREE.PointLight(0xe499e4, 1.5, 20);
  accentLight.position.set(0, 3, 5);
  scene.add(accentLight);
}

async function loadHDRI() {
  return new Promise((resolve, reject) => {
    console.log('🌄 Cargando HDRI desde:', PATHS.hdri);
    
    const rgbeLoader = new RGBELoader();
    
    // Timeout para no bloquear si falla
    const timeout = setTimeout(() => {
      console.warn('⏰ Timeout cargando HDRI, usando fallback');
      createHDRIFallback();
      resolve();
    }, 5000);
    
    rgbeLoader.load(
      PATHS.hdri,
      (texture) => {
        clearTimeout(timeout);
        console.log('✅ HDRI cargado correctamente');
        
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        
        scene.background = texture;
        scene.environment = texture;
        hdrTexture = texture;
        
        // Ajustar exposición para el HDRI
        renderer.toneMappingExposure = 0.8;
        
        resolve();
      },
      undefined,
      (error) => {
        clearTimeout(timeout);
        console.warn('⚠️ Error cargando HDRI, usando fallback:', error.message);
        createHDRIFallback();
        resolve();
      }
    );
  });
}

function createHDRIFallback() {
  // Fondo degradado
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#87CEEB'); // Cielo azul claro
  gradient.addColorStop(0.5, '#B0E0E6'); // Azul polvo
  gradient.addColorStop(1, '#F5F5DC'); // Tierra beige
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  
  scene.background = texture;
  scene.environment = texture;
  
  console.log('🎨 Usando fondo degradado como fallback');
}

async function loadModel() {
  return new Promise((resolve, reject) => {
    console.log('🚗 Cargando modelo desde:', PATHS.model);
    
    const loader = new GLTFLoader();
    
    // Mostrar indicador de carga
    showLoading(true);
    
    // Intentar diferentes estrategias de carga
    const loadStrategies = [
      // Estrategia 1: Ruta directa
      () => loader.load(PATHS.model, onLoad, onProgress, onError),
      
      // Estrategia 2: Intentar con fetch primero para verificar
      async () => {
        try {
          const response = await fetch(PATHS.model);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          console.log('📡 Modelo encontrado en:', PATHS.model);
          loader.load(PATHS.model, onLoad, onProgress, onError);
        } catch (fetchError) {
          throw fetchError;
        }
      }
    ];
    
    let currentStrategy = 0;
    
    function tryNextStrategy() {
      if (currentStrategy >= loadStrategies.length) {
        onError(new Error('Todas las estrategias de carga fallaron'));
        return;
      }
      
      try {
        loadStrategies[currentStrategy]();
      } catch (error) {
        console.warn(`Estrategia ${currentStrategy + 1} falló:`, error.message);
        currentStrategy++;
        setTimeout(tryNextStrategy, 500);
      }
    }
    
    function onLoad(gltf) {
      console.log('✅ Modelo GLB cargado correctamente');
      setupCarModel(gltf.scene);
      showLoading(false);
      resolve();
    }
    
    function onProgress(xhr) {
      if (xhr.lengthComputable) {
        const percent = (xhr.loaded / xhr.total) * 100;
        console.log(`📦 Cargando modelo: ${percent.toFixed(1)}%`);
        updateLoadingProgress(percent);
      }
    }
    
    function onError(error) {
      console.error('❌ Error cargando modelo:', error);
      console.log('🛠️ Creando modelo de prueba...');
      createTestModel();
      showLoading(false);
      resolve(); // Resolvemos igual para continuar
    }
    
    // Iniciar carga
    tryNextStrategy();
  });
}

function setupCarModel(model) {
  carModel = model;
  
  // Configurar sombras y materiales
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      
      // Mejorar materiales
      if (child.material) {
        child.material.envMapIntensity = 1.0;
        child.material.needsUpdate = true;
      }
      
      // Identificar puertas por nombre
      const name = child.name.toLowerCase();
      console.log(`🔍 Objeto encontrado: ${child.name}`);
      
      if (name.includes('puerta') || name.includes('door')) {
        if (name.includes('izquierda') || name.includes('derecha')) {
          if (name.includes('doorbackderecha') || name.includes('rear')) {
            doors.leftRear = child;
            console.log('🚪 Asignada: Puerta izquierda trasera');
          } else {
            doors.leftFront = child;
            console.log('🚪 Asignada: Puerta izquierda delantera');
          }
        } else if (name.includes('der') || name.includes('right')) {
          if (name.includes('tras') || name.includes('rear')) {
            doors.rightRear = child;
            console.log('🚪 Asignada: Puerta derecha trasera');
          } else {
            doors.rightFront = child;
            console.log('🚪 Asignada: Puerta derecha delantera');
          }
        }
      }
    }
  });
  
  // Posicionar modelo
  model.position.set(0, -0.8, 0);
  model.scale.set(1, 1, 1);
  model.rotation.y = Math.PI / 6;
  
  scene.add(model);
  console.log('🎯 Modelo añadido a la escena');
}

function createTestModel() {
  console.log('🛠️ Creando coche de prueba...');
  
  const carGroup = new THREE.Group();
  carGroup.name = 'test_car';
  
  // Cuerpo principal
  const bodyGeometry = new THREE.BoxGeometry(3, 1.2, 5);
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x2c3e50,
    metalness: 0.8,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });
  
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = -0.6;
  body.castShadow = true;
  body.receiveShadow = true;
  carGroup.add(body);
  
  // Techo
  const roofGeometry = new THREE.BoxGeometry(2.6, 0.8, 2.5);
  const roof = new THREE.Mesh(roofGeometry, bodyMaterial);
  roof.position.set(0, 0.2, -0.8);
  carGroup.add(roof);
  
  // Ventanas (material vidrio)
  const windowMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1a1a1a,
    metalness: 0.9,
    roughness: 0.05,
    transmission: 0.9,
    thickness: 0.5,
    transparent: true,
    opacity: 0.3
  });
  
  const frontWindow = new THREE.PlaneGeometry(2.5, 0.8);
  const frontWindowMesh = new THREE.Mesh(frontWindow, windowMaterial);
  frontWindowMesh.position.set(0, 0.1, -2.2);
  frontWindowMesh.rotation.x = Math.PI / 12;
  carGroup.add(frontWindowMesh);
  
  // Ruedas
  const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.8,
    roughness: 0.2
  });
  
  const wheelPositions = [
    [-1.2, -0.8, -1.5], [1.2, -0.8, -1.5],
    [-1.2, -0.8, 1.5], [1.2, -0.8, 1.5]
  ];
  
  wheelPositions.forEach((pos, i) => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.position.set(pos[0], pos[1], pos[2]);
    wheel.rotation.z = Math.PI / 2;
    carGroup.add(wheel);
    
    // Crear puertas de prueba
    if (i < 2) { // Delanteras
      const doorGeometry = new THREE.BoxGeometry(0.1, 1.2, 1.2);
      const doorMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x3498db,
        metalness: 0.9,
        roughness: 0.1
      });
      
      const door = new THREE.Mesh(doorGeometry, doorMaterial);
      door.position.set(pos[0] > 0 ? 1.5 : -1.5, -0.1, -1.2);
      door.name = pos[0] > 0 ? 'Puerta-izquierda' : 'Puerta-derecha';
      carGroup.add(door);
      
      if (pos[0] > 0) {
        doors.rightFront = door;
      } else {
        doors.leftFront = door;
      }
    }
  });
  
  carGroup.position.set(0, -0.8, 0);
  scene.add(carGroup);
  carModel = carGroup;
  
  console.log('✅ Coche de prueba creado con puertas funcionales');
}

// ===== FUNCIONES DE INTERACCIÓN =====
function openDoor(door, axis = 'y', angle = Math.PI / 3) {
  if (!door) {
    console.warn('⚠️ Puerta no encontrada');
    return;
  }
  
  const currentRotation = door.rotation[axis] || 0;
  const targetRotation = axis === 'y' ? -angle : angle;
  
  // Animación suave
  const duration = 500; // ms
  const startTime = Date.now();
  
  function animateDoor() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing
    const easeProgress = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    door.rotation[axis] = currentRotation + (targetRotation - currentRotation) * easeProgress;
    
    if (progress < 1) {
      requestAnimationFrame(animateDoor);
    }
  }
  
  animateDoor();
  console.log(`🚪 Abriendo puerta (${axis}: ${targetRotation.toFixed(2)} rad)`);
}

function closeDoor(door, axis = 'y') {
  if (!door) {
    console.warn('⚠️ Puerta no encontrada');
    return;
  }
  
  const currentRotation = door.rotation[axis] || 0;
  const duration = 500;
  const startTime = Date.now();
  
  function animateDoor() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeProgress = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    door.rotation[axis] = currentRotation * (1 - easeProgress);
    
    if (progress < 1) {
      requestAnimationFrame(animateDoor);
    }
  }
  
  animateDoor();
  console.log(`🚪 Cerrando puerta`);
}

// ===== CONTROLADORES DE PUERTAS =====
const doorActions = {
  openLeftFront: () => openDoor(doors.leftFront, 'y', Math.PI / 3),
  closeLeftFront: () => closeDoor(doors.leftFront, 'y'),
  openRightFront: () => openDoor(doors.rightFront, 'y', -Math.PI / 3),
  closeRightFront: () => closeDoor(doors.rightFront, 'y'),
  openLeftRear: () => openDoor(doors.leftRear, 'z', Math.PI / 4),
  closeLeftRear: () => closeDoor(doors.leftRear, 'z'),
  openRightRear: () => openDoor(doors.rightRear, 'z', -Math.PI / 4),
  closeRightRear: () => closeDoor(doors.rightRear, 'z')
};

function setupEventListeners() {
  const buttonConfig = [
    { id: 'openLeftFrontDoorButton', action: doorActions.openLeftFront },
    { id: 'closeLeftFrontDoorButton', action: doorActions.closeLeftFront },
    { id: 'openRightFrontDoorButton', action: doorActions.openRightFront },
    { id: 'closeRightFrontDoorButton', action: doorActions.closeRightFront },
    { id: 'openLeftRearDoorButton', action: doorActions.openLeftRear },
    { id: 'closeLeftRearDoorButton', action: doorActions.closeLeftRear },
    { id: 'openRightRearDoorButton', action: doorActions.openRightRear },
    { id: 'closeRightRearDoorButton', action: doorActions.closeRightRear }
  ];
  
  buttonConfig.forEach(({ id, action }) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener('click', action);
      console.log(`✅ Botón configurado: ${id}`);
    } else {
      console.warn(`⚠️ Botón no encontrado: ${id}`);
    }
  });
  
  // También permitir controles por teclado
  document.addEventListener('keydown', (e) => {
    switch(e.key) {
      case '1': doorActions.openLeftFront(); break;
      case '2': doorActions.closeLeftFront(); break;
      case '3': doorActions.openRightFront(); break;
      case '4': doorActions.closeRightFront(); break;
      case '5': doorActions.openLeftRear(); break;
      case '6': doorActions.closeLeftRear(); break;
      case '7': doorActions.openRightRear(); break;
      case '8': doorActions.closeRightRear(); break;
    }
  });
}

// ===== UTILIDADES UI =====
function showLoading(show) {
  let loadingEl = document.getElementById('loading');
  if (!loadingEl && show) {
    loadingEl = document.createElement('div');
    loadingEl.id = 'loading';
    loadingEl.innerHTML = `
      <div style="
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 10px;
        z-index: 1000; text-align: center;
      ">
        <div>Cargando modelo 3D...</div>
        <div id="loading-progress" style="margin-top: 10px;">0%</div>
      </div>
    `;
    document.body.appendChild(loadingEl);
  }
  
  if (loadingEl) {
    loadingEl.style.display = show ? 'block' : 'none';
  }
}

function updateLoadingProgress(percent) {
  const progressEl = document.getElementById('loading-progress');
  if (progressEl) {
    progressEl.textContent = `${percent.toFixed(1)}%`;
  }
}

function showControls() {
  const controlsEl = document.querySelector('.controls');
  if (controlsEl) {
    controlsEl.style.display = 'flex';
    console.log('🎮 Controles mostrados');
  }
}

function showError(message) {
  const errorEl = document.createElement('div');
  errorEl.innerHTML = `
    <div style="
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      background: #e74c3c; color: white; padding: 15px; border-radius: 5px;
      z-index: 1000; max-width: 80%; text-align: center;
    ">
      <strong>Error:</strong> ${message}
      <button onclick="this.parentElement.remove()" style="
        margin-left: 10px; background: white; color: #e74c3c; border: none;
        padding: 5px 10px; border-radius: 3px; cursor: pointer;
      ">Cerrar</button>
    </div>
  `;
  document.body.appendChild(errorEl);
}

// ===== EVENTOS DE VENTANA =====
function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  
  console.log(`📐 Ventana redimensionada: ${width}x${height}`);
}

function onScroll() {
  // Puedes implementar scroll-based camera aquí si lo necesitas
}

// ===== ANIMACIÓN PRINCIPAL =====
function animate() {
  requestAnimationFrame(animate);
  
  // Actualizar controles (esto hace que OrbitControls funcionen)
  if (controls) {
    controls.update();
  }
  
  // Rotación suave del modelo (opcional)
  if (carModel && !controls?.getAzimuthalAngle) {
    carModel.rotation.y += 0.001;
  }
  
  renderer.render(scene, camera);
}

// Exportar para debugging
window.THREE_APP = { scene, camera, renderer, controls, carModel, doors };
console.log('🎮 App exportada como window.THREE_APP para debugging');