// main.js
import { PaginaInicio } from "/src/assets/js/PaginaInicio.js";
import { PaginaTemplate } from "/src/assets/js/PaginaTemplate.js";
import { PaginaCuestionario } from "/src/assets/js/PaginaCuestionario.js";

const app = document.getElementById("app");

// Controlador de navegación
async function cargarPagina(nombre) {
  let pagina;

  switch (nombre) {
    case "inicio":
      pagina = new PaginaInicio();
      break;
      case "cuestionario":
      pagina = new PaginaCuestionario();
      break;
    default:
      pagina = new PaginaTemplate(); // fallback
      break;
  }

  const views = await pagina.mostrarPagina();
  app.innerHTML = `<main class="pagina">
    ${views}
    </main>
    `;

    if (pagina.despuesDeCargar) pagina.despuesDeCargar();

  // Reasignar eventos a los enlaces del navbar
  document.querySelectorAll(".navbar a, .footer a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const destino = link.getAttribute("data-page");
      cargarPagina(destino);
    });
  });
}

// Cargar la página inicial
cargarPagina("inicio");