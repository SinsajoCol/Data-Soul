// pages/PaginaTemplate.js
export class PaginaTemplate {
  async mostrarPagina() {
    const navbar = this.mostrarHeader();
    const contenido = await this.mostrarContenido();
    const footer = this.mostrarFooter();

    return `
      ${navbar}
      <main class="contenido">${contenido}</main>
      ${footer}
    `;
  }

  mostrarHeader() {
    return `
      <input type="checkbox" id="menuLat" hidden>
      <label for="menuLat" class="burger">☰</label>
      <nav class="navbar">
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
          <a href="#" data-page="cuestionario">Prueba Grupal</a>
          <a href="#" data-page="cuestionario">Rasgos LLM</a>
        </div>
      </nav>
    `;
  }

  // Por defecto lanza error; cada página concreta lo sobrescribe
  async mostrarContenido() {
    throw new Error("Debes implementar mostrarContenido() en la subclase");
  }

  mostrarFooter() {
    return `<footer><p>© 2025 Mi Aplicativo</p></footer>`;
  }
}