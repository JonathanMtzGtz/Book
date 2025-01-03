if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('./sw.js');
    console.log ('Instalacion correcta');
}else{
    console.log('No se logro instalar');
}
