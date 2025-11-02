import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";

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

    this.agregarEventosModal();
  }

  agregarEventosModal() {
    const modalSelect = document.getElementById('modalSelect');
    const btnAbrir = document.getElementById('btnRealizar');
    const btnCerrar = document.querySelector('.close');
    const btnIndividual = document.getElementById('btnIndividual');
    const btnGrupal = document.getElementById('btnGrupal');

    const modalConsent = document.querySelector('.modalConsentimiento');
    const btnRechazar = modalConsent?.querySelector('.frame-72');
    const btnAceptar = modalConsent?.querySelector('.frame-75');

    if (btnAbrir) {
      btnAbrir.addEventListener('click', (e) => {
        e.preventDefault();
        modalSelect.style.display = 'flex';
      });
    }

    if (btnCerrar) {
      btnCerrar.addEventListener('click', () => {
        modalSelect.style.display = 'none';
      });
    }

    window.addEventListener('click', (e) => {
      if (e.target === modalSelect) modalSelect.style.display = 'none';
      if (e.target === modalConsent) modalConsent.style.display = 'none';
    });

    if (btnIndividual) {
      btnIndividual.addEventListener('click', () => {
        modalSelect.style.display = 'none';
        modalConsent.style.display = 'flex';
      });
    }

    if (btnRechazar) {
      btnRechazar.addEventListener('click', () => {
        modalConsent.style.display = 'none';
        modalSelect.style.display = 'flex';
      });
    }

    if (btnAceptar) {
      btnAceptar.addEventListener('click', () => {
        modalConsent.style.display = 'none';
        this.cargarPagina('cuestionario');
      });
    }

    if (btnGrupal) {
      btnGrupal.addEventListener('click', () => {
        modalSelect.style.display = 'none';
        this.cargarPagina('grupal');
      });
    }
  }

}