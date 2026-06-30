document.addEventListener("DOMContentLoaded", () => {
    // Extraer el parámetro '?id=' de la URL
    const params = new URLSearchParams(window.location.search);
    const mapaId = params.get('id');

    if (!mapaId) {
        document.getElementById('titulo').textContent = "Error";
        document.getElementById('texto').textContent = "No se ha especificado ningún mapa en el código QR.";
        return;
    }

    // Cargar el JSON correspondiente
    fetch(`datos/${mapaId}.json`)
        .then(response => {
            if (!response.ok) throw new Error("No se encontró la información de este mapa.");
            return response.json();
        })
        .then(data => {
            // Detectar el idioma del dispositivo (ej: 'en-US' -> 'en')
            let userLang = navigator.language.slice(0, 2);
            
            // Fallback: si no tienes traducción para ese idioma, usa español
            if (!data[userLang]) {
                userLang = 'en'; 
            }

            // Inyectar el texto en el HTML
            document.getElementById('titulo').textContent = data[userLang].titulo;
            document.getElementById('texto').textContent = data[userLang].contenido;
        })
        .catch(error => {
            document.getElementById('titulo').textContent = "Error de conexión";
            document.getElementById('texto').textContent = error.message;
        });