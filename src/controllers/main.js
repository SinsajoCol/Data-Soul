// main.js
import { PaginaInicio } from "/src/assets/js/PaginaInicio.js";
import { PaginaTemplate } from "/src/assets/js/PaginaTemplate.js";

const app = document.getElementById("app");

// Controlador de navegación
async function cargarPagina(nombre) {
  let pagina;

  switch (nombre) {
    case "inicio":
      pagina = new PaginaInicio();
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

  // Reasignar eventos a los enlaces del navbar
  document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const destino = link.getAttribute("data-page");
      cargarPagina(destino);
    });
  });
}

// Cargar la página inicial
cargarPagina("inicio");