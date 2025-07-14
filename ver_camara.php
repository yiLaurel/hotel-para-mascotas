<?php
$IP_BASE = "10.13.15.118:8080";  

$camara = htmlspecialchars($_POST['numero_camara'] ?? '1', ENT_QUOTES, 'UTF-8');
$mascota = htmlspecialchars($_POST['nombre_mascota'] ?? 'Invitado', ENT_QUOTES, 'UTF-8');

$camaras = [
    '1' => [
        'nombre' => 'Vista Frontal',
        'filtro' => '', 
        'descripcion' => 'Área principal de juegos',
        'ip' => "10.13.15.118:8080"  
    ],
    '2' => [
        'nombre' => 'Vista Lateral',
        'filtro' => 'flip=h', 
        'descripcion' => 'Zona de descanso',
        'ip' => "10.13.15.118:8080"  
    ],
    '3' => [
        'nombre' => 'Vista Superior',
        'filtro' => 'rotate=180',
        'descripcion' => 'Comedero y bebederos',
        'ip' => "10.13.15.118:8080"  
    ],
    '4' => [
        'nombre' => 'Vista Panorámica',
        'filtro' => 'transpose=1', 
        'descripcion' => 'Vista general 360°',
        'ip' => "10.13.15.118:8080"  
    ]
];

$camara_actual = $camaras[$camara] ?? $camaras['1'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cámara <?= $camara ?> - Hotel de Perros VIP</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="css/camara.css">
</head>
<body>
    <div id="contenedor-principal">
        <header id="header-camara">
            <div id="info-camara">
                <div class="info-badge">
                    <i class="bi bi-camera-video-fill"></i>
                    <?= $camara_actual['nombre'] ?>
                </div>
                <div class="info-badge">
                    <i class="bi bi-heart-fill"></i>
                    <?= $mascota ?>
                </div>
                <div class="info-badge">
                    <i class="bi bi-info-circle"></i>
                    <?= $camara_actual['descripcion'] ?>
                </div>
            </div>
            <a href="index.html" class="btn-control" title="Volver al menú">
                <i class="bi bi-x-lg"></i>
            </a>
        </header>
        
        <div id="contenedor-video">
            
            <button id="btn-reportar" title="Reportar novedad con la mascota">
                <i class="bi bi-exclamation-triangle"></i> Reportar
            </button>
            
           
            <div id="cargando">
                <div class="spinner"></div>
                <p style="margin-top: 15px;">Iniciando vista <?= strtolower($camara_actual['nombre']) ?>...</p>
            </div>
            
           
            <iframe 
                id="video-stream"
                src="http://<?= $camara_actual['ip'] ?>/video?buffer=500&lowlatency=1" 
                frameborder="0"
                allowfullscreen
                allow="autoplay"
                loading="eager"
                onload="hideLoader()"
                onerror="handleStreamError()">
            </iframe>
            
            
            <div id="selector-camaras">
                <?php for($i = 1; $i <= 4; $i++): ?>
                    <form method="post" action="ver_camara.php" style="display: inline;">
                        <input type="hidden" name="numero_camara" value="<?= $i ?>">
                        <input type="hidden" name="nombre_mascota" value="<?= $mascota ?>">
                        <button type="submit" class="btn-camara <?= $camara == $i ? 'activa' : '' ?>" 
                                title="<?= $camaras[$i]['nombre'] ?>">
                            <?= $i ?>
                        </button>
                    </form>
                <?php endfor; ?>
            </div>
            
            
            <div id="controles-avanzados">
                <button class="btn-control" onclick="togglePantallaCompleta()" title="Pantalla Completa (F)">
                    <i class="bi bi-fullscreen"></i>
                </button>
                <button class="btn-control" onclick="rotarVista()" title="Rotar Vista (R)">
                    <i class="bi bi-arrow-repeat"></i>
                </button>
                <button class="btn-control" onclick="toggleModoNocturno()" title="Modo Nocturno (N)">
                    <i class="bi bi-moon-stars"></i>
                </button>
                <button class="btn-control" onclick="capturarFoto()" title="Capturar Foto (C)">
                    <i class="bi bi-camera-fill"></i>
                </button>
            </div>
            
        
            <div id="controles-zoom">
                <button class="btn-control" onclick="zoomIn()" title="Acercar (Z)">
                    <i class="bi bi-zoom-in"></i>
                </button>
                <button class="btn-control" onclick="zoomOut()" title="Alejar (X)">
                    <i class="bi bi-zoom-out"></i>
                </button>
                <button class="btn-control" onclick="resetZoom()" title="Restablecer (V)">
                    <i class="bi bi-fullscreen"></i>
                </button>
            </div>
        </div>
    </div>

   
    <div id="modal-reporte" class="modal-reporte">
        <div class="modal-contenido">
            <h2><i class="bi bi-exclamation-triangle"></i> Reportar Novedad</h2>
            <form id="form-reporte">
                <input type="hidden" id="camara-reporte" value="<?= $camara ?>">
                <input type="hidden" id="mascota-reporte" value="<?= $mascota ?>">
                
                <label for="tipo-reporte">Tipo de novedad:</label>
                <select id="tipo-reporte" required>
                    <option value="">Seleccione una opción</option>
                    <option value="salud">Problema de salud</option>
                    <option value="comportamiento">Comportamiento inusual</option>
                    <option value="alimentacion">Problema con alimentación</option>
                    <option value="seguridad">Situación de seguridad</option>
                    <option value="otro">Otro</option>
                </select>
                
                <label for="descripcion-reporte">Descripción detallada:</label>
                <textarea id="descripcion-reporte" required placeholder="Describa lo que está ocurriendo..."></textarea>
                
                <div class="botones-modal">
                    <button type="button" class="btn-cancelar" onclick="cerrarModal()">Cancelar</button>
                    <button type="submit" class="btn-enviar">Enviar Reporte</button>
                </div>
            </form>
        </div>
    </div>
    
   
    <div id="notificacion" class="notificacion">
        <i class="bi bi-check-circle"></i> Reporte enviado correctamente
    </div>

    <script src="js/camara.js"></script>
</body>
</html>