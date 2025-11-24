export class ResultadosView {
  constructor() {
    this.conectarDOM();
    this.rasgos = [
      "Apertura", "Responsabilidad", "Extraversión", "Amabilidad",
      "Neuroticismo", "Maquiavelismo", "Narcisismo", "Psicopatía"
    ];

    this.descripciones = {
      "Apertura": 
        "La apertura refleja la inclinación hacia la curiosidad, la imaginación y el interés por ideas o experiencias nuevas.",
      "Responsabilidad": 
        "La responsabilidad describe la tendencia a planificar, organizarse y mantener constancia en las actividades y compromisos.",
      "Extraversión": 
        "La extraversión se relaciona con la energía social, la expresión interpersonal y la motivación por interactuar con otros.",
      "Amabilidad": 
        "La amabilidad se vincula con la cooperación, la empatía y la preferencia por relaciones basadas en consideración y apoyo mutuo.",
      "Neuroticismo": 
        "El neuroticismo hace referencia a la sensibilidad emocional y a cómo se experimentan y gestionan situaciones estresantes o demandantes.",
      "Maquiavelismo": 
        "El maquiavelismo describe un estilo más estratégico y orientado a la planificación personal en las relaciones y decisiones.",
      "Narcisismo": 
        "El narcisismo se relaciona con la autovaloración, la búsqueda de reconocimiento y la importancia dada a la propia imagen.",
      "Psicopatía": 
        "La psicopatía señala una preferencia por la toma rápida de decisiones, la acción directa y la búsqueda de estímulos intensos."
    };


    this.DescriptionsScore = {
      "bigfive": {
        "openness": {
          "high": "Nivel de apertura a la experiencia <strong>alto</strong>.</br> Este nivel refleja una marcada inclinación hacia la imaginación, la curiosidad y la apertura a nuevas ideas, emociones y experiencias. También suele asociarse con interés por explorar lo creativo y lo novedoso.",
          "medium": "Nivel de apertura a la experiencia <strong>medio</strong>.</br> Este nivel indica un equilibrio entre la curiosidad y la preferencia por lo familiar. Se combinan la disposición a explorar nuevas ideas con la valoración de la estabilidad.",
          "low": "Nivel de apertura a la experiencia <strong>bajo</strong>.</br> Este nivel refleja una preferencia por lo práctico, lo conocido y lo estructurado. Suelen priorizarse la rutina y la estabilidad por encima de la novedad."
        },
        "conscientiousness": {
          "high": "Nivel de responsabilidad <strong>alto</strong>.</br> Este nivel se caracteriza por organización, disciplina y constancia. Se suele planificar con anticipación y perseverar en el logro de metas.",
          "medium": "Nivel de responsabilidad <strong>medio</strong>.</br> Este nivel muestra un balance entre estructura y flexibilidad. Puede adaptarse según las demandas, manteniendo capacidad de organización cuando es necesario.",
          "low": "Nivel de responsabilidad <strong>bajo</strong>.</br> Este nivel indica mayor espontaneidad y flexibilidad. Puede observarse menor estructura o planificación, priorizando la libertad de acción."
        },
        "extraversion": {
          "high": "Nivel de extraversión <strong>alto</strong>.</br> Este nivel refleja una alta energía social, expresividad interpersonal y preferencia por entornos estimulantes o interactivos.",
          "medium": "Nivel de extraversión <strong>medio</strong>.</br> Este nivel combina comodidad en entornos sociales con la valoración de espacios de calma. Se adapta bien tanto a actividades grupales como individuales.",
          "low": "Nivel de extraversión <strong>bajo</strong>.</br> Este nivel indica una preferencia por la introspección y ambientes tranquilos. Suelen favorecerse interacciones más reservadas o en grupos pequeños."
        },
        "agreeableness": {
          "high": "Nivel de amabilidad <strong>alto</strong>.</br> Este nivel se asocia con cooperación, empatía y disposición para mantener relaciones armoniosas.",
          "medium": "Nivel de amabilidad <strong>medio</strong>.</br> Este nivel combina una actitud colaborativa con la capacidad de establecer límites cuando es necesario.",
          "low": "Nivel de amabilidad <strong>bajo</strong>.</br> Este nivel se caracteriza por una comunicación más directa y orientada a objetivos, priorizando la claridad y la afirmación personal."
        },
        "neuroticism": {
          "high": "Nivel de neuroticismo <strong>alto</strong>.</br> Este nivel refleja mayor sensibilidad emocional y respuestas más intensas ante situaciones de presión. Esto describe estilo emocional, no implica patología.",
          "medium": "Nivel de neuroticismo <strong>medio</strong>.</br> Se observan variaciones emocionales ocasionales, combinadas con periodos de estabilidad y regulación adecuada.",
          "low": "Nivel de neuroticismo <strong>bajo</strong>.</br> Este nivel se asocia con estabilidad emocional, respuesta calmada y adaptación efectiva ante situaciones demandantes."
        }
      },

      "darktriad": {
        "machiavellianism": {
          "high": "Nivel de maquiavelismo <strong>alto</strong>.</br> Este nivel refleja una orientación estratégica en la toma de decisiones y un enfoque pragmático para alcanzar objetivos personales.",
          "medium": "Nivel de maquiavelismo <strong>medio</strong>.</br> Este nivel combina la capacidad de planear estratégicamente con la consideración de límites personales y criterios éticos.",
          "low": "Nivel de maquiavelismo <strong>bajo</strong>.</br> Este nivel se asocia con una preferencia por la comunicación directa, la claridad en las intenciones y la transparencia en las relaciones."
        },
        "narcissism": {
          "high": "Nivel de narcisismo <strong>alto</strong>.</br> Este nivel refleja una orientación elevada hacia la autovaloración, el reconocimiento y la importancia personal en contextos sociales.",
          "medium": "Nivel de narcisismo <strong>medio</strong>.</br> Este nivel se vincula con una autoestima estable y la valoración del reconocimiento sin que sea un aspecto dominante.",
          "low": "Nivel de narcisismo <strong>bajo</strong>.</br> Este nivel indica una preferencia por la colaboración, la igualdad en las relaciones y una menor necesidad de atención externa."
        },
        "psychopathy": {
          "high": "Nivel de psicopatía <strong>alto</strong>.</br> Este nivel refleja una orientación hacia la acción rápida, la toma de decisiones impulsiva y la búsqueda de situaciones estimulantes o intensas.",
          "medium": "Nivel de psicopatía <strong>medio</strong>.</br> Este nivel combina firmeza y determinación con consideración moderada por las consecuencias.",
          "low": "Nivel de psicopatía <strong>bajo</strong>.</br> Este nivel se asocia con empatía, prudencia y reflexión antes de actuar."
        }
      }
    }



    // --- 2. INICIALIZA LOS DATOS COMO VACÍOS ---
    this.usuario = []; // (BORRA LOS DATOS DE PRUEBA)
    this.llms = {};    // (BORRA LOS DATOS DE PRUEBA)


    // Rutas de imágenes de cada LLM (ajústalas según tu estructura)
    this.llmImages = {
      "ChatGPT": "src/assets/img/images.png",
      "Mistral-7b": "src/assets/img/Logo_mistral.png",
      "Llama-3.1": "src/assets/img/Logo_llama.png",
      "DeepSeek-r1": "src/assets/img/Logo_deepseek.png",
      "Gemma-3": "src/assets/img/Logo_gemini.png"
    };
  }

  conectarDOM() {
    this.llmCardsContainer = document.querySelector(".llm-cards");
    this.cardsContainer = document.querySelector(".summary-cards");
    this.tableBody = document.querySelector("#comparison tbody");
    this.mostSimilarEl = document.querySelector(".most-similar-llm");
    this.radarCanvas = document.getElementById("radarChart");
    this.barCanvas = document.getElementById("barChart");
    this.barCanvasBigFive = document.getElementById("barChartBigFive");
    this.barCanvasDark = document.getElementById("barChartDark");
    this.distanciasContainer = document.querySelector(".distancias-container");
  }

  render(usuarioData, llmsData, nombreModeloMasSimilar) {
    // 4. Guarda los datos reales en la instancia
    this.usuario = usuarioData;
    this.llms = llmsData;
    console.log("data llms cargada",llmsData)
    this.nombreModeloMasSimilar = nombreModeloMasSimilar;

    // 5. Llama a todos los métodos que antes estaban en init()
    this.generarLLMCards();
    this.generarCardsResumen();
    this.generarTabla("usuario"); 
    this.inicializarGraficos();
    this.configurarEventos();
    this.generarTablaDistancias();
  }

/**
 * Renderiza la vista para la comparación de un GRUPO.
 * @param {Array<number>} groupData - El array de promedios del grupo.
 * @param {Object} llmsData - Los datos de las medias de los LLMs
 * @param {ResultadosComparacion} datosComparacion - El objeto con los porcentajes del grupo.
 */
  renderGrupo(groupData, llmsData, datosComparacion) {
    console.log("Renderizando vista de GRUPO con:", llmsData, datosComparacion);
    
    this.usuario = groupData;
    this.llms = llmsData;
    this.datosComparacion = datosComparacion;

    const masSimilar = this.calcularLLMMasSimilar(); // <-- ¡Ya funciona!
    
    if (this.mostSimilarEl) {
        // (Opcional) Cambiamos el texto para que sea claro
        const parentLabel = this.mostSimilarEl.parentElement.querySelector('h2');
        if (parentLabel) parentLabel.textContent = "El LLM más similar al PROMEDIO DEL GRUPO es:";
        
        // Mostramos el nombre del LLM
        this.mostSimilarEl.textContent = masSimilar;
    }

    this.generarLLMCards();
    this.generarCardsResumen();
    this.generarTabla("llm"); 
    this.generarTablaDistancias();

    this.inicializarGraficos();
    this.configurarEventos();
    
  }

  determinarNivel(valor) {
    if (valor <= 2.6) return "low";
    if (valor <= 3.3) return "medium";
    return "high";
  }


  calcularLLMMasSimilar() {
  let menorDistancia = Infinity;
  let masSimilar = null;

  for (const [nombre, valores] of Object.entries(this.llms)) {
    const distancia = Math.sqrt(
      valores.reduce((acc, val, i) => acc + Math.pow(val - this.usuario[i], 2), 0)
    );
    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      masSimilar = nombre;
    }
  }
  return masSimilar;
  }

  generarLLMCards() {
    // Crear dinámicamente las cards según los llms disponibles
    this.llmCardsContainer.innerHTML = Object.keys(this.llms).map(llm => `
      <div class="llm-card">
        <img src="${this.llmImages[llm] || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}" alt="${llm} logo">
        <div class="llm-info">
          <span>${llm}</span>
          <label class="checkbox-container">
            <input type="checkbox" value="${llm}" checked>
            <span class="checkmark"></span>
          </label>
        </div>
      </div>
    `).join('');
  }

  generarCardsResumen() {
     const masSimilar = this.calcularLLMMasSimilar();
    const valoresLLM = this.llms[masSimilar];

    // Actualiza el nombre en el encabezado
    if (this.mostSimilarEl) {
      this.mostSimilarEl.textContent = masSimilar;
    }

    // Crea las cards solo con ese LLM
    this.cardsContainer.innerHTML = this.rasgos.map((r, i) => `
      <div class="card" data-rasgo="${r}">
        <h3>${r}</h3>
        <p>Usuario: ${this.usuario[i]}</p>
        <p>${masSimilar}: ${valoresLLM[i]}</p>
        <p class="descripcion-rasgo">
          ${this.descripciones[r]}
        </p>
      </div>
    `).join('');
  }

  //Aquí se define el tipo de tabla a mostrar
  generarTabla(tipo) {
    const tabla = document.getElementById("comparison");
    tabla.innerHTML = ""; // limpiar contenido previo

    if (tipo === "usuario") {
      // Tabla individual (la que ya tienes)
      this.generarTablaIndividual(tabla);
    } else if (tipo === "llm") {
      // Tabla por LLM y rasgos (lo que me pediste)
      this.generarTablaLLM(tabla);
    }
  }

  //Tabla para el usuario no técnico
  generarTablaIndividual() {
    const masSimilar = this.calcularLLMMasSimilar();
    const valores = this.llms[masSimilar];

    const tabla = document.getElementById("comparison");
    if(!tabla) return;
    tabla.innerHTML = ""; // limpiar contenido anterior

    // 🔹 Crear encabezados dinámicos
    const headers = ["Rasgo", "Usuario", masSimilar, "Diferencia"];
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");

    headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    tabla.appendChild(thead);

    // 🔹 Crear cuerpo de tabla
    const tbody = document.createElement("tbody");

    this.rasgos.forEach((r, i) => {
      const fila = document.createElement("tr");
      const dif = (this.usuario[i] - valores[i]).toFixed(1);
      const signo = dif > 0 ? "+" : "";

      fila.innerHTML = `
        <td>${r}</td>
        <td>${this.usuario[i]}</td>
        <td>${valores[i]}</td>
        <td>${signo}${dif}</td>
      `;

      tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);
  }

  //Tabla para el grupo y los LLM con los %
  generarTablaLLM(tabla) {
    // Comprueba que los datos de comparación existan
    if (!tabla || !this.datosComparacion) {
        console.warn("No hay datos de comparación de grupo para renderizar la tabla LLM.");
        return;
    }

    // 1. CREAR ENCABEZADOS (igual que antes)
    tabla.innerHTML = ""; // Limpiar tabla
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.innerHTML = "<th>LLM</th>"; // Celda de esquina
    
    this.rasgos.forEach(r => {
        const th = document.createElement("th");
        th.textContent = r;
        headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    tabla.appendChild(thead);

    // 2. CREAR CUERPO DE TABLA
    const tbody = document.createElement("tbody");
    const resultados = this.datosComparacion.resultadosPorModelo;

    // Itera sobre cada LLM en los resultados (ej: "Gemma-3")
    Object.keys(resultados).forEach(llmName => {
        const fila = document.createElement("tr");
        
        // Añade la primera celda con el nombre del LLM
        const nombreTd = document.createElement("td");
        nombreTd.textContent = llmName;
        fila.appendChild(nombreTd);

        // Obtiene el array de estadísticas para este LLM
        const statsDelLLM = resultados[llmName];

        // Itera sobre 'this.rasgos' para GARANTIZAR el orden de las columnas
        this.rasgos.forEach(nombreRasgo => {
            const td = document.createElement("td");
            
            // Busca la estadística para este rasgo (ej: "Apertura")
            const stat = statsDelLLM.find(s => s.rasgo === nombreRasgo);

            if (stat) {

                // 1. Convertir valores a números (esto se mantiene igual)
                const porDebajo = parseFloat(stat.porcentaje.porDebajo);
                const dentro = parseFloat(stat.porcentaje.dentro);
                const porArriba = parseFloat(stat.porcentaje.porArriba);

                //    Creamos el HTML con los tres valores, uno debajo del otro.
                //    Reutilizamos las clases 'stat-single' para mantener el estilo.
                td.innerHTML = `
                    <div class="stat-single">
                        <span class="stat-value strong">${porDebajo.toFixed(1)}%</span>
                        <span class="stat-label">Debajo</span>
                    </div>
                    <div class="stat-single">
                        <span class="stat-value strong">${dentro.toFixed(1)}%</span>
                        <span class="stat-label">Dentro</span>
                    </div>
                    <div class="stat-single">
                        <span class="stat-value strong">${porArriba.toFixed(1)}%</span>
                        <span class="stat-label">Arriba</span>
                    </div>
                `;
                td.classList.add("cell-grupo-single"); // Nueva clase para estilizar

                
            } else {
                td.textContent = "N/A";
            }
            fila.appendChild(td);
        });

        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);
  }

  inicializarGraficos() {

    if (this.radarChart) this.radarChart.destroy();
    if (this.barChartBigFive) this.barChartBigFive.destroy();
    if (this.barChartDark) this.barChartDark.destroy();

    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const USER_COLOR = '#16348C';
    const LLM_PALETTE = ['#6586E7', '#884FFD', '#B18BFD', '#FFA64D', '#FF8000'];

    this.llmColors = {};
    Object.keys(this.llms).forEach((name, index) => {
      const color = LLM_PALETTE[index % LLM_PALETTE.length];
      this.llmColors[name] = {
        fill: hexToRgba(color, 0.2),
        border: color,
        bar: hexToRgba(color, 0.8)
      };
    });

    // 🔹 Radar general (sigue igual)
    this.radarChart = new Chart(this.radarCanvas, {
      type: 'radar',
      data: {
        labels: this.rasgos,
        datasets: [
          {
            label: 'Usuario',
            data: this.usuario,
            backgroundColor: hexToRgba(USER_COLOR, 0.2),
            borderColor: USER_COLOR,
            borderWidth: 2
          },
          ...Object.keys(this.llms).map(llm => ({
            label: llm,
            data: this.llms[llm],
            backgroundColor: this.llmColors[llm].fill,
            borderColor: this.llmColors[llm].border,
            borderWidth: 2
          }))
        ]
      },
      options: { 
        responsive: true,
        plugins: {
          legend:{
            display: true,
            onClick: null
          }
        } 
      }
    });

    // --- División de rasgos ---
    const bigFiveIndices = [0, 1, 2, 3, 4]; // primeros cinco
    const darkIndices = [5, 6, 7]; // últimos tres

    // --- Gráfica de barras Big Five ---
    this.barChartBigFive = new Chart(this.barCanvasBigFive, {
      type: 'bar',
      data: {
        labels: bigFiveIndices.map(i => this.rasgos[i]),
        datasets: [
          {
            label: 'Usuario',
            data: bigFiveIndices.map(i => this.usuario[i]),
            backgroundColor: hexToRgba(USER_COLOR, 0.8)
          },
          ...Object.keys(this.llms).map(llm => ({
            label: llm,
            data: bigFiveIndices.map(i => this.llms[llm][i]),
            backgroundColor: this.llmColors[llm].bar
          }))
        ]
      },
      options: { 
        responsive: true,
        plugins: {
          legend: {
            display: true,
            onClick: null
          }
        }
      }
    });

    // --- Gráfica de barras Dark Traits ---
    this.barChartDark = new Chart(this.barCanvasDark, {
      type: 'bar',
      data: {
        labels: darkIndices.map(i => this.rasgos[i]),
        datasets: [
          {
            label: 'Usuario',
            data: darkIndices.map(i => this.usuario[i]),
            backgroundColor: hexToRgba(USER_COLOR, 0.8)
          },
          ...Object.keys(this.llms).map(llm => ({
            label: llm,
            data: darkIndices.map(i => this.llms[llm][i]),
            backgroundColor: this.llmColors[llm].bar
          }))
        ]
      },
      options: { 
        responsive: true,
        plugins: {
          legend: {
            display: true,
            onClick: null
          }
        }
      }
    });
}

  configurarEventos() {
  // --- Eventos de selección de LLM ---
  const checkboxes = document.querySelectorAll(".llm-card input[type='checkbox']");
  checkboxes.forEach(chk => {
    chk.addEventListener("change", () => this.actualizarGraficos());
  });

  // --- Eventos para abrir el modal al hacer clic en una summary card ---
    const cards = document.querySelectorAll(".summary-cards .card");
    const modal = document.getElementById("rasgoModal");
    const closeBtn = modal.querySelector(".close-btn");

    cards.forEach(card => {
      card.addEventListener("click", () => {
        const rasgo = card.getAttribute("data-rasgo");
        const index = this.rasgos.indexOf(rasgo);
        const masSimilar = this.calcularLLMMasSimilar();
        const descripcion = this.descripciones[rasgo] || "Sin descripción disponible.";

        // Actualiza el modal
        document.getElementById("modalRasgoTitulo").textContent = rasgo;
        document.getElementById("modalUsuarioScore").textContent = this.usuario[index];
        document.getElementById("modalLLMScore").textContent = this.llms[masSimilar][index];
        const valorUsuario = this.usuario[index];
        const nivel = this.determinarNivel(valorUsuario);

        // Mapa entre los nombres visibles y los del JSON
        const mapKeys = {
          "Apertura": "openness",
          "Responsabilidad": "conscientiousness",
          "Extraversión": "extraversion",
          "Amabilidad": "agreeableness",
          "Neuroticismo": "neuroticism",
          "Maquiavelismo": "machiavellianism",
          "Narcisismo": "narcissism",
          "Psicopatía": "psychopathy"
        };

        const clave = mapKeys[rasgo];
        const source = clave in this.DescriptionsScore.bigfive
          ? this.DescriptionsScore.bigfive
          : this.DescriptionsScore.darktriad;

        const descripcionFinal = source[clave][nivel];

        document.getElementById("modalDescripcion").innerHTML = descripcionFinal;


        modal.classList.add("show");
      });
    });

    // --- Cerrar el modal ---
    closeBtn.addEventListener("click", () => modal.classList.remove("show"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("show");
    });
  }

  actualizarGraficos() {
    const checkedLLMs = Array.from(document.querySelectorAll(".llm-card input:checked"))
      .map(input => input.value);

    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const USER_COLOR = '#16348C';
    const bigFiveIndices = [0, 1, 2, 3, 4];
    const darkIndices = [5, 6, 7];

    // Radar
    this.radarChart.data.datasets = [
      {
        label: 'Usuario',
        data: this.usuario,
        backgroundColor: hexToRgba(USER_COLOR, 0.2),
        borderColor: USER_COLOR,
        borderWidth: 2
      },
      ...checkedLLMs.map(llm => ({
        label: llm,
        data: this.llms[llm],
        backgroundColor: this.llmColors[llm].fill,
        borderColor: this.llmColors[llm].border,
        borderWidth: 2
      }))
    ];

    // Big Five
    this.barChartBigFive.data.datasets = [
      {
        label: 'Usuario',
        data: bigFiveIndices.map(i => this.usuario[i]),
        backgroundColor: hexToRgba(USER_COLOR, 0.8)
      },
      ...checkedLLMs.map(llm => ({
        label: llm,
        data: bigFiveIndices.map(i => this.llms[llm][i]),
        backgroundColor: this.llmColors[llm].bar
      }))
    ];

    // Dark Traits
    this.barChartDark.data.datasets = [
      {
        label: 'Usuario',
        data: darkIndices.map(i => this.usuario[i]),
        backgroundColor: hexToRgba(USER_COLOR, 0.8)
      },
      ...checkedLLMs.map(llm => ({
        label: llm,
        data: darkIndices.map(i => this.llms[llm][i]),
        backgroundColor: this.llmColors[llm].bar
      }))
    ];

    this.radarChart.update();
    this.barChartBigFive.update();
    this.barChartDark.update();
  }

    generarTablaDistancias() {
      if (!this.distanciasContainer || !this.llms || !this.usuario) return;

      const distancias = Object.entries(this.llms).map(([nombre, valores]) => {
        const distancia = Math.sqrt(
          valores.reduce((acc, val, i) => acc + Math.pow(val - this.usuario[i], 2), 0)
        );
        return { nombre, distancia };
      });

      distancias.sort((a, b) => a.distancia - b.distancia);

      const top3 = distancias.slice(0, 3);
      const resto = distancias.slice(3);

      let html = `<h3>Ranking de Similitud</h3>`;

      // 🔹 Podio con círculos y base
      html += `<div class="top3-container">`;
      const clases = ["first", "second", "third"];
      top3.forEach((item, i) => {
        html += `
          <div class="badge-rank ${clases[i]}">
            <div class="badge-circle" data-rank="#${i + 1}"></div>
            <div class="badge-base">${item.nombre}</div>
            <div class="badge-distance">${item.distancia.toFixed(2)}</div>
          </div>
        `;
      });
      html += `</div>`;

      // 🔹 Lista inferior
      if (resto.length > 0) {
        html += `<ul>`;
        resto.forEach((item, index) => {
          html += `
            <li>
              <span class="nombre-llm">${index + 4}. ${item.nombre}</span>
              <span class="distancia-valor">${item.distancia.toFixed(2)}</span>
            </li>
          `;
        });
        html += `</ul>`;
      }

      html += `<small>(Distancia Euclidiana — 0 indica mayor similitud)</small>`;

      this.distanciasContainer.innerHTML = html;
    }
}
