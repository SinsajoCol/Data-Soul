// main.js
import { PaginaInicio } from "./src/assets/js/PaginaInicio.js";
import { PaginaCuestionario } from "./src/assets/js/PaginaCuestionario.js";
import { PaginaPruebaGrupal } from "../src/assets/js/PaginaPruebaGrupal.js";
import { PaginaResultados } from "/src/assets/js/PaginaResultados.js";
import { PaginaTerminos } from "../src/assets/js/PaginaTerminos.js";
import { PaginaPrivacidad } from "./src/assets/js/PaginaPrivacidad.js";
import { PaginaLLM } from "./src/assets/js/PaginaLLM.js";

const app = document.getElementById("app");

// Esta función sigue igual, pero ya no maneja los clics
async function cargarPagina(nombre, parametro) {
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
      break;
    case "resultados":
      pagina = new PaginaResultados(parametro);
      console.log("Página de resultados cargada");
      break;
    case "terminos":
      pagina = new PaginaTerminos();
      console.log("Página de términos cargada");
      break;
    case "privacidad":
      pagina = new PaginaPrivacidad();
      console.log("Página de privacidad cargada");
      break;
    case "llm":
      pagina = new PaginaLLM();
      console.log("Página de LLM cargada");
      break;
    default:
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
    const hash = window.location.hash.substring(1); // ej. "comparacion/grupo_123"
    const partes = hash.split('/');
    const ruta = partes[0] || 'inicio'; // ej. "comparacion"
    const parametro = partes[1] || null; // ej. "grupo_123"

    cargarPagina(ruta, parametro);
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