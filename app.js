document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const mapaId = params.get('id');

    if (!mapaId) {
        mostrarError("Error", "No se ha especificado ningún mapa en el código QR.");
        return;
    }

    // 1. Cargar los datos del JSON
    fetch(`datos/${mapaId}.json`)
        .then(response => {
            if (!response.ok) throw new Error("No se encontró la información de este mapa.");
            return response.json();
        })
        .then(data => {
            let userLang = navigator.language.slice(0, 2);
            if (!data[userLang]) {
                userLang = 'es'; 
            }
            document.getElementById('titulo').textContent = data[userLang].titulo;
            document.getElementById('texto').textContent = data[userLang].contenido;
        })
        .catch(error => {
            mostrarError("Fin del recorrido", error.message);
        });

    // 2. Lógica de Paginación Dinámica
    configurarNavegacion(mapaId);
});

function configurarNavegacion(mapaId) {
    // Extraer el número del ID (ej: "mapa_01" -> "01")
    const match = mapaId.match(/mapa_(\d+)/);
    
    if (match) {
        const numActual = parseInt(match[1], 10);
        
        // Calcular los números anterior y siguiente asegurando los 2 dígitos (padStart)
        const prevId = `mapa_${String(numActual - 1).padStart(2, '0')}`;
        const nextId = `mapa_${String(numActual + 1).padStart(2, '0')}`;
        
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        
        // Configurar botón "Anterior"
        if (numActual > 0) {
            btnPrev.href = `?id=${prevId}`;
        } else {
            // Si es el mapa_00, ocultamos el botón de retroceso
            btnPrev.classList.add('oculto');
        }
        
        // Configurar botón "Siguiente"
        btnNext.href = `?id=${nextId}`;
    }
}

function mostrarError(titulo, mensaje) {
    document.getElementById('titulo').textContent = titulo;
    document.getElementById('texto').textContent = mensaje;
    document.querySelector('.navegacion').style.display = 'none';
}