let escalaActual = 1;
const escalaMinima = 0.5;
const escalaMaxima = 3;
const incrementoZoom = 0.2;
let rotacion = 0;
let modoNocturno = false;


function hideLoader() {
    const loader = document.getElementById('cargando');
    if(loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
}


setTimeout(hideLoader, 5000);


function handleStreamError() {
    const loader = document.getElementById('cargando');
    if(loader) {
        loader.innerHTML = `
            <div style="color: #e74c3c; text-align: center;">
                <i class="bi bi-exclamation-triangle" style="font-size: 3rem;"></i>
                <p>Error al conectar con la cámara</p>
                <button onclick="location.reload()" class="btn-reintentar">
                    Reintentar
                </button>
            </div>
        `;
    }
}


function togglePantallaCompleta() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
        document.exitFullscreen();
    }
}


function rotarVista() {
    rotacion += 90;
    const video = document.getElementById('video-stream');
    video.style.transform = `rotate(${rotacion}deg) ${rotacion % 180 ? 'scaleX(-1)' : ''} scale(${escalaActual})`;
}


function toggleModoNocturno() {
    modoNocturno = !modoNocturno;
    document.body.style.filter = modoNocturno 
        ? 'brightness(0.6) contrast(1.4) grayscale(20%)' 
        : 'none';
}


function capturarFoto() {
    alert('Foto capturada de la cámara <?= $camara ?>');
}


function zoomIn() {
    if (escalaActual < escalaMaxima) {
        escalaActual += incrementoZoom;
        aplicarZoom();
    }
}

function zoomOut() {
    if (escalaActual > escalaMinima) {
        escalaActual -= incrementoZoom;
        aplicarZoom();
    }
}

function resetZoom() {
    escalaActual = 1;
    aplicarZoom();
}

function aplicarZoom() {
    const video = document.getElementById('video-stream');
    const transformaciones = `scale(${escalaActual}) ${rotacion ? `rotate(${rotacion}deg) ${rotacion % 180 ? 'scaleX(-1)' : ''}` : ''}`;
    video.style.transform = transformaciones.trim();
}


document.getElementById('btn-reportar').addEventListener('click', () => {
    document.getElementById('modal-reporte').style.display = 'flex';
});

function cerrarModal() {
    document.getElementById('modal-reporte').style.display = 'none';
    document.getElementById('form-reporte').reset();
}

document.getElementById('form-reporte').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const datosReporte = {
        camara: document.getElementById('camara-reporte').value,
        mascota: document.getElementById('mascota-reporte').value,
        tipo: document.getElementById('tipo-reporte').value,
        descripcion: document.getElementById('descripcion-reporte').value,
        fecha: new Date().toISOString()
    };
    
    console.log('Reporte enviado:', datosReporte);
    
    setTimeout(() => {
        cerrarModal();
        mostrarNotificacion();
    }, 1000);
});

function mostrarNotificacion() {
    const notificacion = document.getElementById('notificacion');
    notificacion.style.display = 'block';
    
    setTimeout(() => {
        notificacion.style.display = 'none';
    }, 3000);
}


document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const actions = {
        'f': togglePantallaCompleta,
        'r': rotarVista,
        'n': toggleModoNocturno,
        'c': capturarFoto,
        'z': zoomIn,
        'x': zoomOut,
        'v': resetZoom,
        'e': () => document.getElementById('btn-reportar').click()
    };
    
    if (actions[key]) {
        actions[key]();
    } else if (key >= '1' && key <= '4') {
        document.querySelector(`.btn-camara:nth-child(${key})`).click();
    }
});


if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    document.querySelector('#header-camara').style.fontSize = '0.8rem';
    document.querySelectorAll('.btn-camara').forEach(btn => {
        btn.style.width = '40px';
        btn.style.height = '40px';
    });
    
    document.getElementById('video-stream').src += "&quality=medium";
}