import * as THREE from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

let scene, camera, renderer, cssRenderer, composer;
let particleSystem, lineMesh;
const particleCount = 120;
const maxDistance = 2.5;

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    init();
    animate();
});

function init() {
    console.log('=== Inicializar THREE.JS ===');
    
    // 1. ESCENA Y CÁMARA
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // 2. RENDERER WEBGL (Fondo)
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        preserveDrawingBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparente
    
    const threeContainer = document.getElementById('three-container');
    if (threeContainer) {
        threeContainer.appendChild(renderer.domElement);
        renderer.domElement.style.position = 'fixed';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.zIndex = '-1';
        console.log(' WebGL rendere añadido three-container');
    }

    cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    
    const cssContainer = document.getElementById('css-container');
    if (cssContainer) {
        cssContainer.appendChild(cssRenderer.domElement);
        cssRenderer.domElement.style.position = 'fixed';
        cssRenderer.domElement.style.top = '0';
        cssRenderer.domElement.style.left = '0';
        cssRenderer.domElement.style.zIndex = '0';
        cssRenderer.domElement.style.pointerEvents = 'none';
        console.log('CSS3D render agregado');
    }


    
    
    const vscodeElement = document.getElementById('vcode-window');
    if (vscodeElement) {
       
        vscodeElement.style.cssText = '';
        vscodeElement.classList.add('vscode-container');
        
        // 3. Posicionar como elemento HTML normal
        Object.assign(vscodeElement.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) perspective(1200px) rotateY(25deg) rotateX(5deg)',
            width: '700px',
            height: '550px',
            display: 'flex',
            visibility: 'visible',
            opacity: '1',
            zIndex: '1000',
            pointerEvents: 'auto',
            background: 'rgba(0, 20, 30, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0, 255, 255, 0.4)',
            borderRadius: '8px',
            boxShadow: '-20px 40px 60px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 255, 255, 0.3)',
            overflow: 'hidden'
        });
        
        // 4. Mover al body si está en el contenedor CSS3D
        const cssContainer = document.getElementById('css-container');
        if (cssContainer && cssContainer.contains(vscodeElement)) {
            console.log('Moving VSCode window from css-container to body');
            cssContainer.removeChild(vscodeElement);
            document.body.appendChild(vscodeElement);
        }
        
        console.log('VSCode añadido HTML element');
    } else {
        console.warn('VSCode no encontrado');
    }

    // 5. FONDO TECNOLÓGICO (PLEXUS) 
    console.log('Creando particulas...');
    const particlesGeom = new THREE.BufferGeometry();
    const coords = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        coords[i] = (Math.random() - 0.5) * 12;
    }
    
    particlesGeom.setAttribute('position', new THREE.BufferAttribute(coords, 3));
    const particlesMat = new THREE.PointsMaterial({ 
        color: 0x00ffff, 
        size: 0.05,
        transparent: true,
        opacity: 0.8
    });
    particleSystem = new THREE.Points(particlesGeom, particlesMat);
    scene.add(particleSystem);
    console.log(' Particulas creadas');

    // 6. LÍNEAS DEL PLEXUS
    const linesGeom = new THREE.BufferGeometry();
    const linesMat = new THREE.LineBasicMaterial({ 
        color: 0x0088ff, 
        transparent: true, 
        opacity: 0.2
    });
    lineMesh = new THREE.LineSegments(linesGeom, linesMat);
    scene.add(lineMesh);

    // 7. POST-PROCESADO (Glow)
    console.log('Setting up post-processing...');
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight), 
        1.2,  // strength
        0.2,  // radius
        0.8   // threshold
    );
    composer.addPass(bloomPass);
    console.log(' Post-processing configurado');

    // 8. ILUMINACIÓN
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 9. RESIZE HANDLER
    window.addEventListener('resize', onWindowResize);
    onWindowResize(); // Llamar inicialmente
    
    console.log('=== THREE.JS INITIALIZATION COMPLETE ===');
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (cssRenderer) {
        cssRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    if (composer) {
        composer.setSize(window.innerWidth, window.innerHeight);
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (particleSystem) {
        particleSystem.rotation.y += 0.001;
        particleSystem.rotation.x += 0.0005;
    }
    
    if (lineMesh) {
        lineMesh.rotation.y += 0.001;
        lineMesh.rotation.x += 0.0005;
    }

    if (particleSystem && lineMesh && performance.now() % 30 < 1) {
        updatePlexusLines();
    }

    if (composer) {
        composer.render();
    }
    
    if (cssRenderer) {
        cssRenderer.render(scene, camera);
    }
}

function updatePlexusLines() {
    const pos = particleSystem.geometry.attributes.position.array;
    const linePos = [];
    
    for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
            const ix = i * 3;
            const jx = j * 3;
            
            const dx = pos[ix] - pos[jx];
            const dy = pos[ix + 1] - pos[jx + 1];
            const dz = pos[ix + 2] - pos[jx + 2];
            
            const dist = dx * dx + dy * dy + dz * dz; // Sin sqrt para performance
            
            if (dist < maxDistance * maxDistance) {
                linePos.push(pos[ix], pos[ix + 1], pos[ix + 2]);
                linePos.push(pos[jx], pos[jx + 1], pos[jx + 2]);
            }
        }
    }
    
    lineMesh.geometry.setAttribute(
        'position', 
        new THREE.Float32BufferAttribute(linePos, 3)
    );
    lineMesh.geometry.attributes.position.needsUpdate = true;
}


function checkAndFixVSCodeWindow() {
    console.log('=== Verificar vscode ===');
    
    const element = document.getElementById('vcode-window');
    if (!element) {
        console.error('❌ VSCode  no encontrado');
        return;
    }
    
    const rect = element.getBoundingClientRect();
    const styles = window.getComputedStyle(element);
    
    console.log('Window status:', {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        position: styles.position,
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        inViewport: rect.top >= -100 && rect.left >= -100 && 
                   rect.bottom <= window.innerHeight + 100 && 
                   rect.right <= window.innerWidth + 100
    });

    if (rect.top < -100 || rect.left < -100 || 
        rect.top > window.innerHeight + 100 || 
        rect.left > window.innerWidth + 100 ||
        styles.display === 'none') {
        
        console.log('VSCcode corregido');
        
        Object.assign(element.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) perspective(1200px) rotateY(25deg) rotateX(5deg)',
            width: '700px',
            height: '550px',
            display: 'flex',
            visibility: 'visible',
            opacity: '1',
            zIndex: '1000'
        });
        
        
        element.style.border = '3px solid #00ff00';
        
        console.log(' VSCode cargado');
    } else {
        console.log('VSCode correcto');
        element.style.border = '3px solid #00ffff';
    }
}


window.addEventListener('load', () => {
    setTimeout(checkAndFixVSCodeWindow, 500);
    
    setInterval(checkAndFixVSCodeWindow, 5000);
});


window.addEventListener('error', (e) => {
    console.error('Three.js error:', e.error);
});

console.log('index.js cargado');