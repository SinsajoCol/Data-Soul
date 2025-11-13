import { Header } from "../../components/Header.js";
import { Footer } from "../../components/Footer.js";

export class PaginaTemplate {
  constructor(){
    this.header=new Header();
    this.footer=new Footer();
  }

  async mostrarPagina() {
    const navbar = new Header().mostrarHeader();
    const contenido = await this.mostrarContenido();
    const footer = new Footer().mostrarFooter();

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
    const currentPage = window.location.hash.substring(1) || 'inicio';

    enlaces.forEach(e => {
            e.classList.remove('active');
            if (e.dataset.page === currentPage) {
                e.classList.add('active');
            }
    });

    this.agregarEventosModal();
  }

  agregarEventosModal() {
    const modalSelect = document.getElementById('modalSelect');
    const btnAbrirHeader = document.getElementById('btnRealizar');
    const btnAbrirFooter = document.getElementById('btnRealizarFooter');
    const btnCerrar = document.querySelector('.close');
    const btnIndividual = document.getElementById('btnIndividual');
    const btnGrupal = document.getElementById('btnGrupal');
    const btnRasgos = document.getElementById('btnRasgos');

    const modalConsent = document.querySelector('.modalConsentimiento');
    const btnRechazar = modalConsent?.querySelector('.frame-72');
    const btnAceptar = modalConsent?.querySelector('.frame-75');

    if (btnRasgos) {
      btnRasgos.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = 'llm';
      });
    }

    if (btnAbrirHeader) {
    btnAbrirHeader.addEventListener('click', (e) => {
      e.preventDefault();
      modalSelect.style.display = 'flex';
      }); 
    }

    if (btnAbrirFooter) {
      btnAbrirFooter.addEventListener('click', (e) => {
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
          
          // --- ¡CORRECCIÓN! ---
          // En lugar de: this.cargarPagina('cuestionario');
          window.location.hash = 'cuestionario';
      });
    }

    if (btnGrupal) {
      btnGrupal.addEventListener('click', () => {
          modalSelect.style.display = 'none';

          // --- ¡CORRECCIÓN! ---
          // En lugar de: this.cargarPagina('grupal');
          window.location.hash = 'PruebaGrupal'; // (o la página que corresponda)
      });
    }
  }
}