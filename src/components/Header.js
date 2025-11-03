export class Header {
  mostrarHeader() {
    return `
      <input type="checkbox" id="menuLat" hidden>
      <nav class="navbar">
        <label for="menuLat" class="burger">☰</label>
          <div class="marca">
            <div class="logo">
              <img src="/src/assets/img/LogoBrand.png" alt="Logo Data Soul">
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

      <div class="modalConsentimiento">
        <div class="consentimiento-informado">
          <div class="titleConsentimientoI">
            <div class="frame-100">
              <img class="lucideImg" src="/src/assets/img/shield-check.svg" />
              <h2>Consentimiento Informado</h2>
            </div>
            <h3>Antes de comenzar tu evaluación, por favor lee y acepta los siguientes
            términos.</h3>
          </div>
          
          <div class="frame-110">
            <div class="proposito">
              <h4>Propósito:</h4>
              <p>Esta es una herramienta digital diseñada con el fin de permitir
                explorar ocho (8) de tus rasgos de personalidad mediante pruebas
                psicométricas estandarizadas (Big Five Inventory – BFI-44 y Short
                Dark Triad – SD3) y compararlos con los rasgos no cognitivos que
                reflejan los patrones de respuesta de cinco (5) modelos de lenguaje
                (LLM). No constituye un diagnóstico clínico ni reemplaza la
                orientación profesional.</p>
            </div>
            
            <div class="secret">
              <br><h4>Confidencialidad y tratamiento de la información:</h4>
              <p>• Data Soul no solicita ni almacena datos personales (nombre, correo,
              edad, género u otros identificadores).

              <br>• Las respuestas se procesan de forma local y temporal, únicamente
              para calcular los resultados de la prueba en la sesión actual.

              <br>• No se guardan ni transmiten los resultados a servidores externos.

              <br>• Los datos presentados son anónimos y no permiten identificar a los
              participantes.</p>
            </div>

            <div class="accept">
              <br><h4>Carácter voluntario de la participación:</h4>
              <p>La participación en esta aplicación es completamente voluntaria.
              Puede abandonar la prueba en cualquier momento antes de finalizarla,
              sin que esto tenga consecuencias de ningún tipo</p>
            </div>
            <div class="infoAccept">
              <br><br><br><h4>Consentimiento:</h4>
              <p>Al aceptar, confirmas que has leído la información anterior y deseas
              continuar con la evaluación.</p><br>
            </div>
          </div>

          <div class="btnsCons">
            <button class="frame-72">
              <h5>Rechazar y regresar</h5>
              <img class="lucideIX" src="/src/assets/img/btnX.svg"/>
            </button>
            <button class="frame-75">
              <h5>Aceptar y continuar</h5>
              <img class="lucidICheck" src="/src/assets/img/btnCheck.svg"/>
            </button>
          </div>
        </div>
      </div>
    `;
  }
}