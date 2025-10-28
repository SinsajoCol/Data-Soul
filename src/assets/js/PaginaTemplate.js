import { Header } from "../../components/Header.js";
import { Footer } from "../../components/Footer.js";

export class PaginaTemplate {
  async mostrarPagina() {
    const navbar = new Header().render();
    const contenido = await this.mostrarContenido();
    const footer = new Footer().render();

    document.body.innerHTML = `
    ${navbar}
    <main class="contenido">${contenido}</main>
    ${footer}
  `;

    // Ahora que el HTML está en el DOM, se pueden agregar los eventos
    this.agregarActive();
  }

  // Por defecto lanza error; cada página concreta lo sobrescribe
  async mostrarContenido() {
    throw new Error("Debes implementar mostrarContenido() en la subclase");
  }

  agregarActive() {
    const enlaces = document.querySelectorAll('.menu a');
    const currentPage = document.body.getAttribute('data-page');

    enlaces.forEach(e => {
      e.classList.remove('active');
      if (e.dataset.page === currentPage) {
        e.classList.add('active');
      }

      e.addEventListener('click', (ev) => {
        ev.preventDefault();
        enlaces.forEach(x => x.classList.remove('active'));
        e.classList.add('active');

        const page = e.dataset.page;
        document.body.setAttribute('data-page', page);
      });
    });
  }
}