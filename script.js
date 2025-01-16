// URL del archivo JSON en tu repositorio de GitHub
const url = "./noticias.json";

// Función para obtener las noticias desde GitHub
async function obtenerNoticias() {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al cargar el JSON: ${response.statusText}`);
        const noticias = await response.json();
        return noticias;
    } catch (error) {
        console.error("Error al obtener noticias:", error);
        return [];
    }
}

// Función para buscar noticias por término
async function buscarNoticias(termino) {
    const noticias = await obtenerNoticias();
    const terminoLower = termino.toLowerCase(); // Convertir término a minúsculas para comparación
    const resultado = noticias.filter(noticia =>
        noticia.titulo.toLowerCase().includes(terminoLower) ||
        (noticia.contenido && noticia.contenido.some(parrafo => parrafo.toLowerCase().includes(terminoLower))) ||
        (noticia.ubicacion && noticia.ubicacion.toLowerCase().includes(terminoLower))
    );
    mostrarResultados(resultado);
}

// Función para mostrar las noticias en el HTML
function mostrarResultados(noticias) {
    const contenedor = document.getElementById("resultados");
    contenedor.innerHTML = ""; // Limpiar resultados anteriores
    if (noticias.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron noticias.</p>";
        return;
    }

    noticias.forEach(noticia => {
        const noticiaDiv = document.createElement("div");
        noticiaDiv.style.border = "1px solid #ddd";
        noticiaDiv.style.padding = "15px";
        noticiaDiv.style.marginBottom = "15px";

        const titulo = document.createElement("h3");
        titulo.textContent = noticia.titulo;

        const imagen = document.createElement("img");
        imagen.src = noticia.imagen;
        imagen.alt = noticia.titulo;
        imagen.style.width = "100%";
        imagen.style.maxWidth = "600px";
        imagen.style.height = "auto";
        imagen.style.margin = "10px 0";

        const autor = document.createElement("p");
        autor.innerHTML = `<strong>Autor:</strong> ${noticia.autor}`;

        const fechaCategoria = document.createElement("p");
        fechaCategoria.innerHTML = `<strong>Fecha:</strong> ${noticia.fecha} - <strong>Categoría:</strong> ${noticia.categoria}`;

        const ubicacion = document.createElement("p");
        ubicacion.innerHTML = `<strong>Ubicación:</strong> ${noticia.ubicacion}`;

        noticiaDiv.appendChild(titulo);
        noticiaDiv.appendChild(imagen);
        noticiaDiv.appendChild(autor);
        noticiaDiv.appendChild(fechaCategoria);
        noticiaDiv.appendChild(ubicacion);

        if (noticia.contenido) {
            noticia.contenido.forEach(parrafo => {
                const p = document.createElement("p");
                p.textContent = parrafo;
                noticiaDiv.appendChild(p);
            });
        }

        contenedor.appendChild(noticiaDiv);
    });
}

// Evento para escuchar las búsquedas en tiempo real
document.getElementById("buscar").addEventListener("input", (e) => {
    const termino = e.target.value.trim(); // Elimina espacios en blanco innecesarios
    buscarNoticias(termino);
});
