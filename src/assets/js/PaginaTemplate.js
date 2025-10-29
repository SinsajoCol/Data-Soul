// pages/PaginaTemplate.js
export class PaginaTemplate {
  async mostrarPagina() {
    const navbar = this.mostrarHeader();
    const contenido = await this.mostrarContenido();
    const footer = this.mostrarFooter();

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

  mostrarHeader() {
    return `
      <input type="checkbox" id="menuLat" hidden>
      <nav class="navbar">
        <label for="menuLat" class="burger">☰</label>
          <div class="marca">
            <div class="logo">
              <img src="/src/assets/img/LogoBrand.png">
            </div>

            <div class="nameBrand">
              <h1>Data Soul</h1>
            </div>
          </div>
          
          <div class="menu">
            <a href="#" data-page="inicio">Inicio</a>
            <a href="#" data-page="cuestionario">Prueba Individual</a>
            <a href="#" data-page="">Prueba Grupal</a>
            <a href="#" data-page="">Rasgos LLM</a>
          </div>
      </nav>
    `;
  }

  // Por defecto lanza error; cada página concreta lo sobrescribe
  async mostrarContenido() {
    throw new Error("Debes implementar mostrarContenido() en la subclase");
  }

  mostrarFooter() {
    return `
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-left">
            <div class="footer-logo">
              <img src="./assets/img/LogoBrand.png" alt="Logo Data Soul">
              <h2>Data Soul</h2>
            </div>
          </div>

          <div class="footer-right">
            <div class="footer-copy">
              <p>© 2025 Data Soul. Todos los derechos reservados</p>
            </div>
            <div class="footer-links">
              <a href="#" data-page="inicio">Inicio</a> •
              <a href="#" data-page="cuestionario">Prueba Individual</a>•
              <a href="#" data-page="">Prueba Grupal</a> •
              <a href="#" data-page="">Rasgos LLM</a> •
              <a href="#" data-page="">Términos del servicio</a> •
              <a href="#" data-page="">Políticas de privacidad</a>
            </div>
            <div class="footer-info">
              <p>
                Los resultados son informativos y no constituyen diagnóstico psicológico •
                Uso de los inventarios Big Five (BFI-44) y Short Dark Triad (SD3) y el modelo TRAIT
                para comparación con LLM • No se almacenan datos personales
              </p>
            </div>

          </div>
        </div>
      </footer>
  `;
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
        this.cargarPagina(page); // método que renderiza la página
      });
    });
  }
}