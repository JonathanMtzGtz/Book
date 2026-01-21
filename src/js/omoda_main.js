import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
  
        <section class="modelo3d" style="height: 700px;">
            <div class="logo-car">
              <img src="img/logo.png" alt="">
            </div>
              <!-- Aquí se añadirá el canvas -->
               <div class="card-car">
                  <h1 class="car">Producto</h1>
                  <button id="toggleButton" class="">Encender luces</button>
                  <button id="resetCameraButton">Salir del interior</button>
                  <button id="startEngineButton" class="">Encender motor</button>
                  <button id="stopEngineButton" class="">Apagar motor</button>
                  <button id="openDoorsButton" class="">Abrir puertas</button>
                  <button id="closeDoorsButton" class="">Cerrar puertas</button>
                
                  <button id="moveCameraButton" class="moveCameraButton">ver interior</button>
      
      
               </div>
             
            </section>
`

setupCounter(document.querySelector('#counter'))
import * as THREE from 'three'
        import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
        import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
        import Stats from 'three/examples/jsm/libs/stats.module'
        import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
       
        let hemiLight;
        //crear scena
        const scene = new THREE.Scene()
        scene.add(new THREE.AxesHelper(500));
    // Cargar y configurar el HDRI
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('hdri/2.hdr', function(texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      scene.background = texture;
      scene.environment = texture;
    });

        let light1= new THREE.PointLight(0xffffff,3);
        light1.position.set(0,1.5,2.5);
        scene.add(light1);
        let light2= new THREE.PointLight(0xffffff,3);
        light2.position.set(2.5,0.5,0);
        scene.add(light2);
        let light3= new THREE.PointLight(0xffffff,3);
        light3.position.set(0,0.75,-4);
        scene.add(light3);
        let light4= new THREE.PointLight(0xffffff,3);
        light4.position.set(-2.5,1.5,0);
        scene.add(light4);
        //camara
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.z = 2.5
        camera.position.y = 1.2
        camera.position.x = 0.9
        light1.castShadow = true;
        //abtialias
        const renderer = new THREE.WebGLRenderer({antialias:true})
        
        renderer.shadowMap.enabled = true
        renderer.toneMapping =THREE.ReinhardToneMapping;
        renderer.toneMappingExposure=1.3;
       
        // Añadir el canvas al div con la clase modelo3d
        const modelContainer = document.querySelector('.modelo3d');
        modelContainer.appendChild(renderer.domElement);
        // Ajustar el tamaño del renderer al tamaño del contenedor
        renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
        
        //camara
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        
        const loader = new GLTFLoader()
        let carModel;
        let leftDoor;
        let rightDoor;
        let wheels= [];
        


            hemiLight =new THREE.HemisphereLight(0xd7e2e5, 0x080820,2)
            scene.add(hemiLight);

        
        loader.load(
          '3d/Omoda.glb',
          function (gltf) {
            const model = gltf.scene;
        
            //puertas
            carModel = gltf.scene;
            carModel.traverse(function (child) {
              console.log(child.name); 
              if (child.name === 'Puerta-izquierda') {
                leftDoor = child;
              }
              if (child.name === 'Puerta-derecha') {
                rightDoor = child;
              }
               // Identificar las ruedas (asegúrate de que los nombres coincidan con los del modelo GLTF)
               if (child.name === 'tire' || child.name === 'tire001' || child.name === 'tire002' || child.name === 'tire003') {
                    wheels.push(child);
                  }
            });
        
            model.position.x = 0.4;
            model.rotation.y = 0;
            
            scene.add(carModel)
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
          },
          (error) => {
            console.log(error)
          }
        )
        
        
        
        function openDoors() {
          if (leftDoor && rightDoor) {
            // Animación simple para abrir las puertas
            leftDoor.rotation.y = -Math.PI / 0.57; // Ajusta según tu modelo
            rightDoor.rotation.y = Math.PI / .57; // Ajusta según tu modelo
            abrirDoor.play();
          }
        }
        
        const abrirDoor = new Audio('audio/abrir.mp3');
        
        const openDoorsButton = document.getElementById('openDoorsButton');
        openDoorsButton.addEventListener('click', openDoors);
        
        
        let engineRunning = false;
        let wheelAnimationId;
        
         // Audio para el motor del auto
         const engineSound = new Audio('audio/encendido.mp3');
         
         //audio carro
        function startEngine() {
          engineSound.play();
          engineRunning = true;
          animateWheels();
          console.log('Motor encendido');
        }
        
        function stopEngine() {
          engineSound.pause();
          engineSound.currentTime = 0; // Reiniciar el audio
          console.log('Motor apagado');
          engineRunning = false;
          cancelAnimationFrame(wheelAnimationId);
        }

                // Posición y orientación original de la cámara
        const originalCameraPosition = new THREE.Vector3(0.9, 1.2, 2.5);
        const originalTargetPosition = new THREE.Vector3(0, 0, 0);


        function resetCamera() {
    // Restablecer la posición de la cámara
    camera.position.copy(originalCameraPosition);
    camera.lookAt(originalTargetPosition);
    
    // Restablecer los límites de rotación de OrbitControls
    controls.minAzimuthAngle = -Infinity; // Sin límite
    controls.maxAzimuthAngle = Infinity;  // Sin límite
    controls.minPolarAngle = 0;           // 0 grados
    controls.maxPolarAngle = Math.PI;     // 180 grados


    Camera = false;
  camera.position.copy(originalCameraPosition);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
    // Actualizar los controles para reflejar la nueva posición y orientación de la cámara
    controls.update();
}



// Agregar evento al botón para restablecer la cámara
const resetCameraButton = document.getElementById('resetCameraButton');
resetCameraButton.addEventListener('click', resetCamera);

        
        

 

        
        function animateWheels() {
              if (!engineRunning) return;
              wheels.forEach(wheel => {
                wheel.rotation.x += 0.1; // Ajusta la velocidad de rotación según sea necesario
              });
              wheelAnimationId = requestAnimationFrame(animateWheels);
            }
        
        
        const startEngineButton = document.getElementById('startEngineButton');
            startEngineButton.addEventListener('click', startEngine);
        
            const stopEngineButton = document.getElementById('stopEngineButton');
            stopEngineButton.addEventListener('click', stopEngine);
        
            const closeDoorsButton = document.getElementById('closeDoorsButton');
            closeDoorsButton.addEventListener('click', closeDoors);
        
        
            const cerrarDoor = new Audio('audio/cerrar.mp3');
        
            function closeDoors() {
          if (leftDoor && rightDoor) {
            // Animación simple para cerrar las puertas
            leftDoor.rotation.y = -0; // Ajusta según tu modelo
            rightDoor.rotation.y = -0; // Ajusta según tu modelo
           cerrarDoor.play();
          }
        }
        




        
                function moveCamera() {
        // Establecer la posición de la cámara
        camera.position.set(0.80, 1.2 , -0.56); // Cambia esta posición según tus necesidades
            


         // Cambiar a CubeCamera
       
    
        // Limitar la rotación horizontal (azimuthal angle) en radianes
        controls.minAzimuthAngle = -Math.PI / 1; // -45 grados
       controls.maxAzimuthAngle = Math.PI / 1;  // 45 grados

        // Limitar la rotación vertical (polar angle) en radianes
       // controls.minPolarAngle = 1;              // 0 grados
       // controls.maxPolarAngle = Math.PI / 2;    // 90 grados
       // camera.lookAt(originalTargetPosition);
        
        // Actualizar los controles para reflejar la nueva posición y orientación de la cámara
        //controls.update();
        }
        const moveCameraButton = document.getElementById('moveCameraButton');
        moveCameraButton.addEventListener('click', moveCamera);
        
        
        
        
        
        window.addEventListener('resize', onWindowResize, false)
        function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight
          camera.updateProjectionMatrix()
          renderer.setSize(window.innerWidth, window.innerHeight)
          render()
        }


        const light21 = new THREE.PointLight(0xffffff,3);
    light21.position.set(0.1, 0.4, 0.1);
    scene.add(light2);


 // Función para encender y apagar las luces
 function toggleLights(state) {
      const intensity = state ? 1 : 0; // 1 para encender, 0 para apagar

      light21.intensity = intensity;
    }

        let lightsOn = true;

        document.getElementById('toggleButton').addEventListener('click', () => {
      lightsOn = !lightsOn;
      toggleLights(lightsOn);
    });


  

      window.addEventListener('keydown', (event) => {
      if (event.key === 'l' || event.key === 'L') {
        const lightsAreOn = light1.intensity > 0;
        toggleLights(!lightsAreOn);
      }
    });




        
        //const stats = new Stats()
        //document.body.appendChild(stats.dom)
        
        function animate() {
          requestAnimationFrame(animate)
        
          controls.update()
        
          render()
        
         // stats.update()
        }
        
        function render() {
          renderer.render(scene, camera,
            hemiLight
          )
          
        }
        
        animate()