// pages/PaginaTemplate.js
export class PaginaTemplate {
  async mostrarPagina() {
    const navbar = this.mostrarNavbar();
    const contenido = await this.mostrarContenido();
    const footer = this.mostrarFooter();

    return `
      ${navbar}
      <main class="contenido">${contenido}</main>
      ${footer}
    `;
  }

  mostrarNavbar() {
    return `
      <nav class="navbar">
        <a href="#" data-page="inicio">Inicio</a>
        <a href="#" data-page="cuestionario">Cuestionario</a>
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