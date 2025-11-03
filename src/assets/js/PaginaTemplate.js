import { Header } from "/src/components/Header.js";
import { Footer } from "/src/components/Footer.js";

export class PaginaTemplate {
  constructor(){
    this.header=new Header();
    this.footer=new Footer();
  }

  async mostrarPagina() {
    const navbar = this.header.mostrarHeader();
    const contenido = await this.mostrarContenido();
    const footer = this.footer.mostrarFooter();

    const html = `
      <div class="pagina">
        ${navbar}
        <main class="contenido">${contenido}</main>
        ${footer}
      </div>
    `;
    setTimeout(() => this.agregarActive(), 0);
    return html;
  }

  cargarCSS(ruta) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = ruta;
    document.head.appendChild(link);
  }

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
        this.cargarPagina(page);
      });
    });
  }
}