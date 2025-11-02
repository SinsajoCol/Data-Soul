export class Header {
render() {
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
          <a href="#" data-page="">Prueba Grupal</a>
          <a href="#" data-page="">Rasgos LLM</a>
        </div>
      </nav>
    `;
  }
}