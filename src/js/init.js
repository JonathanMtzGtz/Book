// init.js - Colócalo al final de tu body, después de index.js
document.addEventListener('DOMContentLoaded', function() {
    // Forzar visibilidad de la ventana VS Code
    const vscodeWindow = document.getElementById('vcode-window');
    if (vscodeWindow) {
        vscodeWindow.style.display = 'flex';
        vscodeWindow.style.visibility = 'visible';
        vscodeWindow.style.opacity = '1';
        vscodeWindow.style.zIndex = '1000';
        
        // También prevenir que CSS3D la oculte
        vscodeWindow.style.cssText += 'transform:none !important;';
    }
    
    // Inicializar AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true
        });
    }
});

// Función para mostrar la ventana si está oculta
function showVSCodeWindow() {
    const vscodeWindow = document.getElementById('vcode-window');
    if (vscodeWindow) {
        vscodeWindow.style.display = 'flex';
        vscodeWindow.style.visibility = 'visible';
        vscodeWindow.style.opacity = '1';
    }
}

// Llamar después de que Three.js se cargue
setTimeout(showVSCodeWindow, 1000);