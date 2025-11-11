export class Footer {
  mostrarFooter() {
    return `
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-left">
            <div class="footer-logo">
              <img src="/src/assets/img/LogoBrand.png" alt="Logo Data Soul">
              <h2>Data Soul</h2>
            </div>
          </div>

          <div class="footer-right">
            <div class="footer-copy">
              <p>© 2025 Data Soul. Todos los derechos reservados</p>
            </div>

            <div class="footer-links">
              <a href="#" data-page="inicio">Inicio</a> •
              <a href="#" id="btnRealizarFooter">Realizar Prueba</a> •
              <a href="#" data-page="rasgos">Rasgos LLM</a> •
              <a href="#" data-page="terminos">Términos del servicio</a> •
              <a href="#" data-page="politicas">Políticas de privacidad</a>
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
}