// main.js
import { PaginaInicio } from "./src/assets/js/PaginaInicio.js";
import { PaginaCuestionario } from "./src/assets/js/PaginaCuestionario.js";
import { PaginaPruebaGrupal } from "./src/assets/js/PaginaPruebaGrupal.js";
import { PaginaResultados } from "/src/assets/js/PaginaResultados.js";

const app = document.getElementById("app");

// Esta función sigue igual, pero ya no maneja los clics
async function cargarPagina(nombre) {
  let pagina;

  switch (nombre) {
    case "inicio":
      pagina = new PaginaInicio();
      console.log("Página de inicio cargada");
      break;
    case "cuestionario":
      pagina = new PaginaCuestionario();
      console.log("Página de cuestionario cargada");
      break;
    case "PruebaGrupal":
      pagina = new PaginaPruebaGrupal();
      console.log("Página de prueba grupal cargada");
    case "resultados":
      pagina = new PaginaResultados();
      console.log("Página de resultados cargada");
      break;
    default:
      // ¡IMPORTANTE! Asegúrate de que tu PaginaTemplate implemente
      // mostrarPagina() o cambia esto a PaginaInicio()
      pagina = new PaginaInicio(); 
      break;
  }

  const views = await pagina.mostrarPagina();
  app.innerHTML = views;

  if (pagina.despuesDeCargar) {
    pagina.despuesDeCargar();
  }
}

/**
 * Función 'Router'
 * Lee el hash de la URL (ej. #cuestionario) y llama a cargarPagina
 */
function router() {
    // Obtiene el hash, quita el '#' y si está vacío, usa 'inicio'
    const ruta = window.location.hash.substring(1) || 'inicio';
    cargarPagina(ruta);
}

// --- PUNTO DE ENTRADA DE LA APLICACIÓN ---

// 1. Escucha cambios en el hash (cuando el usuario navega)
window.addEventListener('hashchange', router);

// 2. Carga la página inicial (cuando el sitio carga por primera vez)
// Usamos 'DOMContentLoaded' para asegurar que 'app' exista
document.addEventListener('DOMContentLoaded', () => {
    router(); // Carga la página basada en el hash (o 'inicio')

    // 3. Conecta los enlaces de navegación UNA SOLA VEZ
    // Usamos 'document.body' para que funcione incluso
    // si el navbar se vuelve a dibujar.
    document.body.addEventListener('click', e => {
        // Busca si el clic fue en un enlace con 'data-page'
        const link = e.target.closest('a[data-page]');
        
        if (link) {
            e.preventDefault(); // Evita la recarga
            const destino = link.getAttribute('data-page');
            
            // ¡AQUÍ ESTÁ LA MAGIA!
            // En lugar de llamar a cargarPagina, solo cambia el hash.
            // El listener 'hashchange' de arriba hará el trabajo.
            window.location.hash = destino;
        }
    });
});