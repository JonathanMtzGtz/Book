import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.158.0/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js'; 




// Configuración básica de Three.js
const container = document.getElementById('three-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Habilitar sombras
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombra suave
container.appendChild(renderer.domElement);

// Fondo
//scene.background = new THREE.Color(0x222222); // Color cielo

// Cargar HDRI como EnvironmentMap
const rgbeLoader = new RGBELoader();
rgbeLoader.load(
  'hdri/2.hdr', // Ruta del archivo HDRI
  (texture) => {
    // Asignar la textura HDRI como mapa de entorno
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture; // Establecer el fondo de la escena
    scscene.environment = texture; // Establecer el entorno para reflejos
  },
  undefined,
  (error) => {
    console.error('Error al cargar HDRI:', error);
  }
);
// Función que maneja el cambio de tamaño de la ventana
function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // Ajustar el tamaño del renderizador
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Cambiar fondo según la resolución
  if (width < 678) {
    // Eliminar HDRI y poner color sólido
    if (hdrTexture) {
      scene.background = new THREE.Color(0x222222); // Color de fondo
      scene.environment = null; // Eliminar entorno HDRI
    }
  } else {
    // Si la resolución es mayor, vuelve a usar HDRI
    if (hdrTexture) {
      scene.background = hdrTexture;
      scene.environment = hdrTexture;
    }
  }
}


 // const axesHelper = new THREE.AxesHelper(5); // Longitud de los ejes
 // scene.add(axesHelper);
// Luz direccional con sombras
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
light.castShadow = true; // Habilitar sombras para la luz
light.shadow.mapSize.width = 1024; // Tamaño de mapa de sombras
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 50;
scene.add(light);
light.shadow.bias = -0.0005; // Ajustar para reducir líneas


// Luz ambiental para suavizar sombras
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);


// Controles de la cámara
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false; // Desactiva el zoom
controls.minDistance = 3; // Distancia mínima permitida en Z
controls.maxDistance = 3; // Distancia máxima permitida en Z
controls.minPolarAngle = Math.PI / 2.2; // Bloquear rotación (vertical fija)
controls.maxPolarAngle = Math.PI / 3;




// Añadir luces
let light1 = new THREE.PointLight(0xe499e4, 2);
light1.position.set(0, 1.5, 2.5);
scene.add(light1);



let light3 = new THREE.PointLight(0xe499e4, 2);
light3.position.set(0, 0.75, -4);
scene.add(light3);

let light4 = new THREE.PointLight(0xe499e4, 2);
light4.position.set(-2.5, 1.5, 0);
scene.add(light4);


// Modelo 3D
let carModel;
let leftFrontDoor, rightFrontDoor, leftRearDoor, rightRearDoor;

const loader = new GLTFLoader();

loader.load(
  '3d/omodav1.glb',
  function (gltf) {
      const model = gltf.scene;

      carModel = gltf.scene;
      carModel.set
      carModel.traverse(function (child) {
          console.log(child.name);
          if (child.name === 'Puerta-izquierda') {
              leftFrontDoor = child;
          }
          if (child.name === 'Puerta-derecha') {
              rightFrontDoor = child;
          }
          if (child.name === 'puertatraseraizquierda') {
              leftRearDoor = child;
          }
          if (child.name === 'puertatraseraerecha') {
              rightRearDoor = child;
          }
      });

      carModel.position.set(0, -0.8, -1.4);
      carModel.scale.set(1, 1, 1);
      carModel.rotation.y = Math.PI / 4;

      scene.add(carModel);
  },
  (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  (error) => {
      console.log(error);
  }
);



// Funciones para abrir y cerrar puertas de forma independiente
function openLeftFrontDoor() {
  if (leftFrontDoor) {
      leftFrontDoor.rotation.y = -Math.PI / 0.566; 
      abrirDoor.play();
  }
}

function closeLeftFrontDoor() {
  if (leftFrontDoor) {
      leftFrontDoor.rotation.y = 0; 
      cerrarDoor.play();
  }
}

function openRightFrontDoor() {
  if (rightFrontDoor) {
      rightFrontDoor.rotation.y = Math.PI / 0.566; 
      abrirDoor.play();
  }
}

function closeRightFrontDoor() {
  if (rightFrontDoor) {
      rightFrontDoor.rotation.y = 0; 
      cerrarDoor.play();
  }
}

function openLeftRearDoor() {
  if (leftRearDoor) {
      leftRearDoor.rotation.z = -Math.PI / 0.46; 
      abrirDoor.play();
  }
}

function closeLeftRearDoor() {
  if (leftRearDoor) {
      leftRearDoor.rotation.z =  -1.568;  
      cerrarDoor.play();
  }
}

function openRightRearDoor() {
  if (rightRearDoor) {
      rightRearDoor.rotation.z = Math.PI / 0.8; 
      abrirDoor.play();
  }
}

function closeRightRearDoor() {
  if (rightRearDoor) {
      rightRearDoor.rotation.z = -1.57; 
      cerrarDoor.play();
  }
}

const abrirDoor = new Audio('audio/abrir.mp3');
const cerrarDoor = new Audio('audio/cerrar.mp3');

document.getElementById('openLeftFrontDoorButton').addEventListener('click', openLeftFrontDoor);
document.getElementById('closeLeftFrontDoorButton').addEventListener('click', closeLeftFrontDoor);
document.getElementById('openRightFrontDoorButton').addEventListener('click', openRightFrontDoor);
document.getElementById('closeRightFrontDoorButton').addEventListener('click', closeRightFrontDoor);
document.getElementById('openLeftRearDoorButton').addEventListener('click', openLeftRearDoor);
document.getElementById('closeLeftRearDoorButton').addEventListener('click', closeLeftRearDoor);
document.getElementById('openRightRearDoorButton').addEventListener('click', openRightRearDoor);
document.getElementById('closeRightRearDoorButton').addEventListener('click', closeRightRearDoor);





// Configuración inicial de la cámara
camera.position.set(-0, 0.4, 3);

// Definir posiciones de la cámara para diferentes secciones
const cameraPositions = [
  { x: 2.5, y: 0.4, z: 4 }, // Vista frontal
  { x: 3, y: 0.4, z: 1.2 }, // Vista lateral
  { x: 2, y: 0.5, z: -2.8 }, // Vista trasera
  { x: -3, y: .5, z: -3 }, // Vista trasera
 
];

// Actualizar posición de la cámara según el scroll
function updateCameraPosition(scrollFraction) {
  const totalPositions = cameraPositions.length - 1;
  const currentIndex = Math.floor(scrollFraction * totalPositions);
  const nextIndex = Math.min(currentIndex + 1, totalPositions);

  const start = cameraPositions[currentIndex];
  const end = cameraPositions[nextIndex];
  const t = (scrollFraction * totalPositions) % 1;

  camera.position.x = start.x + (end.x - start.x) * t;
  camera.position.y = start.y + (end.y - start.y) * t;
  camera.position.z = start.z + (end.z - start.z) * t;

  camera.lookAt(0, 0, 0); // Asegurarse de que siempre apunte al centro
}

// Manejo del evento de scroll
function onScroll() {
  const scrollY = window.scrollY;
  const totalHeight = document.body.scrollHeight - window.innerHeight;
  const scrollFraction = scrollY / totalHeight;
  updateCameraPosition(scrollFraction);
}

// Ajustar el renderizador al tamaño de la ventana
function resizeRenderer() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// Escuchar el evento de scroll
window.addEventListener('scroll', onScroll);
window.addEventListener('resize', resizeRenderer);

// Crear un vector para almacenar la dirección de la cámara
const cameraDirection = new THREE.Vector3();















// Animación principal
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // Obtener la dirección de la cámara
  camera.getWorldDirection(cameraDirection);


}

// Iniciar animación
animate();
