export class Header {
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
            <a href="#" id="btnRealizar">Realizar Prueba</a>
            <a href="#" data-page="">Rasgos LLM</a>
          </div>
      </nav>

      <div id="modalSelect" class="modal">
        <div class="modalText">
          <span class="close">&times;</span>
          <h2>Selecciona el Tipo de Prueba</h2>
          
          <br><h3>Prueba individual</h3>
          <p>Permite responder directamente en el aplicativo y obtener resultados personales que podrás comparar 
          con los patrones de distintos modelos de lenguaje (LLM).</p>
          
          <br><br><h3>Prueba Grupal</h3>
          <p>Está orientada al análisis colectivo de resultados psicométricos para contrastarlos con los LLM, ideal 
          si tienes conocimiento en el tema o deseas trabajar con un conjunto de respuestas.</p>
          
          <br><br><p>Si no estás familiarizado con el proceso, puedes comenzar con la prueba individual.</p>

          <div class="modalBtn">
            <button id="btnIndividual">Prueba Individual</button>
            <button id="btnGrupal">Prueba Grupal</button>
          </div>
        </div>
      </div>
    `;
  }
}