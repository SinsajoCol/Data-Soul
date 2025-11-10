# 05 Funcionamiento del sistema

## Flujo de datos

1. **Usuario no técnico**: El usuario selecciona “Prueba Individual” → responde el cuestionario → se ejecuta el cálculo del puntaje en el navegador → se compara con los perfiles de LLM → se muestra el dashboard de resultados → opción de descarga en PDF.
2. **Investigador**: El investigador carga archivo Excel/CSV → el sistema valida y procesa el archivo (hasta \~50 personas) → calcula puntajes promedio del grupo → compara con los perfiles de LLM → genera visualización grupal → descarga en PDF.

## ¿Cómo se hacen las comparaciones?&#x20;

### 1. Comparación de rasgos entre el modelo LLM y el Usuario no técnico.

La comparación de resultados de rasgos entre un modelo LLM  y un usuario no técnico se realiza a través de un proceso estadístico y de similitud implementado en el código de la aplicación. A continuación, se explicará el paso a paso de cómo funciona:

<details>

<summary>1. Datos de Entrada</summary>

* **Usuario no técnico**:Los datos provienen de cuestionarios psicométricos que miden rasgos de personalidad (ej. Extraversión, Amabilidad, etc.). Cada rasgo tiene un puntaje numérico (generalmente en una escala de 1 a 5).
  * **Individuo**: El puntaje directo del usuario se usa como "media" (promedio), con intervalo de confianza (IC) igual al valor mismo (sin varianza).
* **Modelo LLM**: Los datos se cargan desde un archivo JSON (`llm_raw.json`) que contiene conteos de respuestas "altas" y "bajas" por rasgo (ej. para Extraversión: 200 altos, 800 bajos). A partir de esto, se calculan estadísticas similares:
  * Media: Promedio ponderado (ej. alto = 4.2, bajo = 1.8).
  * Desviación estándar: Basada en varianza binomial.
  * Error estándar y IC 95%: Usando z-crítico de 1.96 para 95% de confianza.



</details>

<details>

<summary>2. Proceso de Comparación</summary>

* **Clase `ComparadorRasgos`**: Es el núcleo de la comparación. Usa una estrategia de similitud (correlación de Pearson normalizada entre 0 y 1).
  * **Comparación individual**: Toma los valores de rasgos del usuario y del modelo, calcula la similitud (coeficiente de correlación). Resultado: Un objeto `ComparacionResultado` con etiquetas de rasgos, valores del usuario, valores del modelo y puntaje de similitud.
  * **Comparación con todos los modelos**: Repite la comparación individual para cada modelo LLM disponible.
* **Fórmula de similitud por defecto**: Correlación de Pearson simplificada:
  * Calcula medias de los valores de usuario y modelo.
  * Computa numerador (suma de diferencias) y denominadores (varianzas).
  * Resultado: Un valor entre 0 (sin similitud) y 1 (perfecta correlación positiva).

</details>

<details>

<summary>3. Visualización y Salida</summary>

* **Controlador (`ComparacionController`)**: Carga los datos, bifurca entre individuo/grupo, calcula estadísticas y pasa a la vista.
* **Vista (`ComparacionView`)**: Renderiza tablas HTML comparativas:
  * Una tabla para el usuario/grupo (con media, límites IC 95%).
  * Una tabla por modelo LLM (con las mismas estadísticas).
  * No se muestra directamente el puntaje de similitud en la vista actual; se calcula en el comparador pero se usa para análisis interno (ej. en consola para depuración).
* **Salida en consola**: Para depuración, imprime tablas de estadísticas humanas y de LLMs.

</details>

<details>

<summary>4. Ejemplo </summary>

Supongamos un rasgo "Extraversión":

* Usuario (individuo): Puntaje = 3.5 → Media = 3.5, IC = \[3.5, 3.5].
* Modelo LLM (ej. Gemma): Media = 3.2, IC = \[3.0, 3.4].
* Similitud: Correlación basada en arrays de valores (si hay múltiples rasgos).

</details>

### 2. Comparación de rasgos entre el modelo LLM y el grupo poblacional

El proceso de comparación de rasgos tiene como objetivo analizar la similitud entre los resultados obtenidos por los modelos de lenguaje (LLM) y los del grupo poblacional, en base a los rasgos no cognitivos que mide el dataset TRAIT a los LLM.

TRAIT permite identificar si un modelo presenta una tendencia alta o baja en cada rasgo, mientras que los usuarios son evaluados con una prueba psicométrica en escala numérica de 1 a 5. Para realizar la comparación, se traduce la información cualitativa del modelo a valores cuantitativos dentro de esa misma escala, y posteriormente se aplican métodos estadísticos que permiten establecer un intervalo de confianza y medir la coincidencia con los valores del grupo poblacional.

#### Procedimiento de comparación

<details>

<summary>1. Asignación de valores al modelo</summary>

Los modelos LLM evaluados mediante TRAIT no generan valores numéricos, sino categorías cualitativas ("alto" o "bajo").\
Para integrarlos en la misma escala que los usuarios (1–5), se les asignan valores promedio representativos:

* Bajo: de 1 a 2.6\
  Promedio = (1 + 2.6) / 2 = 1.8
* Alto: de 3.4 a 5\
  Promedio = (3.4 + 5) / 2 = 4.2

Cada pregunta clasificada como “baja” recibe una puntuación de 1.8, y cada pregunta clasificada como “alta” una puntuación de 4.2.\
De esta manera, el modelo obtiene valores numéricos que permiten su comparación con la escala de los usuarios.



</details>

<details>

<summary>2. Cálculo de la media y la desviación estándar</summary>

Una vez asignadas las puntuaciones, se agrupan las respuestas por rasgo (por ejemplo, apertura, responsabilidad, amabilidad, etc.).\
Para cada rasgo se calcula:

* Media (x̄): promedio de las puntuaciones del modelo.
* Desviación estándar (σ): medida de la dispersión de las puntuaciones respecto al promedio.

Estos valores representan el comportamiento promedio del modelo y la variabilidad de sus respuestas por rasgo.

</details>

<details>

<summary>3. Cálculo del error estándar de la media (EEM)</summary>

El error estándar de la media permite estimar la precisión de la media calculada, considerando la cantidad de preguntas que evalúan el rasgo.\
Se obtiene mediante la fórmula:

<figure><img src="../.gitbook/assets/image (1).png" alt="" width="161"><figcaption></figcaption></figure>

donde:

* σ: desviación estándar.
* n: número de ítems o preguntas asociadas al rasgo.

</details>

<details>

<summary>4. Cálculo del intervalo de confianza</summary>

Con el error estándar calculado, se determina un intervalo de confianza del 95%, que establece el rango dentro del cual se encuentra la verdadera media del modelo con un 95% de certeza.\
Se utiliza la siguiente expresión:

<figure><img src="../.gitbook/assets/image (2).png" alt="" width="176"><figcaption></figcaption></figure>

donde 1.96 corresponde al valor z para un nivel de confianza del 95%.\
Esto genera dos límites:

* Límite inferior (X<sub>1</sub>):   <img src="../.gitbook/assets/image (3).png" alt="" data-size="line">
* Límite superior (X<sub>2</sub>): <img src="../.gitbook/assets/image (5).png" alt="" data-size="line">

El rango (\[X<sub>1</sub>, X<sub>2</sub>]) representa la posición estadística del modelo en ese rasgo.

<figure><img src="../.gitbook/assets/Grafica comparacion.png" alt="" width="480"><figcaption></figcaption></figure>

</details>

<details>

<summary>5. Comparación con el grupo poblacional</summary>

El rango obtenido del modelo se compara con las puntuaciones de los usuarios en el mismo rasgo (escala 1–5). Se calcula el porcentaje de usuarios cuyas puntuaciones se encuentran dentro del intervalo de confianza del modelo.

<figure><img src="../.gitbook/assets/image (7).png" alt="" width="518"><figcaption></figcaption></figure>

Este porcentaje indica el grado de similitud entre los rasgos socioemocionales del modelo y el del grupo poblacional en ese rasgo.

Por ejemplo, si el intervalo del modelo para el rasgo de “Responsabilidad” es \[3.62, 3.74] y el 12% de los usuarios tienen puntuaciones dentro de ese rango, se concluye que el modelo y el grupo presentan una similitud del 12% en dicho rasgo.

</details>

<details>

<summary>6. Determinación del modelo más similar</summary>

Cuando se evalúan los demás modelos LLM, se aplica el mismo procedimiento para cada uno. Luego, se comparan los resultados de todos los rasgos con los del grupo poblacional.

Para determinar cuál modelo es el más similar al grupo poblacional, es necesario que todos los rasgos del modelo se encuentren dentro de los rangos que abarcan los valores del grupo poblacional, así que:

1. Calcular, para cada rasgo, el porcentaje de usuarios dentro del rango de confianza del modelo.
2. Verificar que en todos los rasgos el modelo tenga un nivel de coincidencia representativo.
3. Identificar el modelo que presenta la mayor coincidencia en todos los rasgos.

Este modelo se considera el que mejor refleja el perfil promedio del grupo poblacional, ya que sus rasgos son los más cercano a los rasgos analizados.

</details>



## Módulos principales del Sistema

### &#x20;`PaginaBase`– El Corazón de Todas las Páginas

&#x20;Renderiza la información necesaria para mostrar a los usuarios.&#x20;

* Crea una `PaginaBase` para todas las páginas del aplicativo, esta contiene un `Header`, `Nav` y un `Footer` estático.

{% code expandable="true" %}
```javascript
  class PaginaTemplate {
  constructor() {
    this.header = new Header();
    this.footer = new Footer();
  }
  async mostrarPagina() {
    const navbar   = this.header.mostrar();
    const contenido = await this.mostrarContenido();  // ← ¡Subclase decide qué mostrar!
    const pie      = this.footer.mostrar();
    return ;
  }
  async mostrarContenido() { // Método obligatorio: cada página lo implementa
    throw "¡Implementa esto en la página específica!";
  }
```
{% endcode %}

### `PaginaCuestionario,PaginaComparación,PaginaPruebaGrupal` - Páginas del sistema

Todas las páginas del sistema son herencia de la `PaginaBase`, solo se modifica su contenido.

{% code expandable="true" %}
```javascript
class PaginasDelSistema extends PaginaTemplate {
  constructor() {
    super(); // → hereda header, footer, menú activo, modales...
  }
  async mostrarContenido() {
    // 1. Carga el HTML estático de la página
    return await cargarArchivo("/src/pages/Pagina.html");
  }
  async despuesDeCargar() {
    // 2. ¡Aquí arranca todo!
    console.log("Página lista");
    this.controller.iniciar(); // → enciende: drag & drop, botón cargar, eventos...
  }
}
```
{% endcode %}

### Modelo `Cuestionario`:

Se encarga de cargar las preguntas(Big five y Dark Triad) que el _Usuario no Técnico_ tiene que responder

{% code expandable="true" %}
```javascript
class Cuestionario {
  constructor() {
    this.preguntas = [];      // Lista de preguntas
    this.respuestas = {};     // Respuestas del usuario
    this.preguntasPorPagina = 5;
    this.paginaActual = 0;
    this.storageKey = "respuestas";
  }
  // Carga preguntas desde un archivo JSON
  async cargarPreguntas(url) {
    const res = await fetch(url);
    const datos = await res.json();
    this.preguntas = datos.map(p => new Pregunta(p.id, p.texto, p.rasgo, p.invertida));
  }
  // Carga respuestas guardadas
  cargarRespuestas() {
    this.respuestas = AlmacenamientoLocal.cargar(this.storageKey) || {};
  }
  // Guarda una respuesta en memoria y en almacenamiento local
  guardarRespuesta(id, valor) {
    this.respuestas[id] = valor;
    AlmacenamientoLocal.guardar(this.storageKey, this.respuestas);
  }
  // Calcula el porcentaje de progreso
  getProgreso() {
    return (Object.keys(this.respuestas).length / this.preguntas.length) * 100;
  }
  // Devuelve las preguntas actuales (paginadas)
  currentGroup() {
    const inicio = this.paginaActual * this.preguntasPorPagina;
    const fin = inicio + this.preguntasPorPagina;
    return this.preguntas.slice(inicio, fin);
  }
  // Navegación entre páginas
  nextGroup() {
    if (!this.esPaginaFinal()) this.paginaActual++;
  }
  prevGroup() {
    if (!this.esPaginaInicial()) this.paginaActual--;
  }
  esPaginaInicial() {
    return this.paginaActual === 0;
  }
  esPaginaFinal() {
    const total = Math.ceil(this.preguntas.length / this.preguntasPorPagina);
    return this.paginaActual >= total - 1;
  }
}

```
{% endcode %}

### Modelo `ProcesadorPsicometrico`

Se encarga de **procesar respuestas psicométricas** y calcular los **promedios por rasgo** del _Usuario no Técnico_ y el grupo poblacional del _Investigador_  &#x20;

{% code expandable="true" %}
```javascript
class ProcesadorPsicometrico {
  calcularRasgos(preguntas, respuestas) {
    // Objetos para acumular sumas y conteos por rasgo
    const puntajesTemporales = {};
    const conteoTemporales = {};
    // Recorre todas las preguntas
    for (const pregunta of preguntas) {
      const rasgo = pregunta.rasgoAsociado;
      const respuesta = respuestas[pregunta.id];
      // Obtiene el valor ajustado según la lógica de la pregunta
      const puntaje = pregunta.obtenerValorAjustado(Number(respuesta));

      // Acumula la suma y el conteo por rasgo
      if (puntajesTemporales[rasgo]) {
        puntajesTemporales[rasgo] += puntaje;
        conteoTemporales[rasgo]++;
      } else {
        puntajesTemporales[rasgo] = puntaje;
        conteoTemporales[rasgo] = 1;
      }
    }

    // Crea un nuevo objeto Rasgos con los promedios finales
    const rasgosResultado = new Rasgos();

    for (const rasgo in puntajesTemporales) {
      const suma = puntajesTemporales[rasgo];
      const cantidad = conteoTemporales[rasgo];
      const promedio = suma / cantidad;

      rasgosResultado.agregarRasgo(rasgo, promedio);
    }

    // Devuelve los rasgos calculados
    return rasgosResultado;
  }
}

```
{% endcode %}

### Modelo `Resultados`

&#x20;Se encarga de almacenar, de manera local en navegador, los resultados del _Usuario no Técnico_ y el _Investigador_, con el fin de tener una persistencia temporal de los datos mientras el usuario está en el aplicativo.

<pre class="language-javascript" data-expandable="true"><code class="lang-javascript"><strong>class Resultados {
</strong>  // Propiedad estática: solo una instancia (Singleton)
  static instance = null;
  constructor() {
    this.individuales = {};   // Guarda resultados por usuario
    this.poblaciones = {};    // Guarda resultados por grupo
    this.cargarDeLocalStorage();
  }
  static getInstance() {
    if (!Resultados.instance) {
      Resultados.instance = new Resultados();
    }
    return Resultados.instance;
  }
  agregarResultadoIndividual(individuo) {
    // Agrega o actualiza un resultado individual
    this.individuales[individuo.usuarioId] = individuo;
    this.guardarEnLocalStorage();
  }
  agregarResultadosPoblacion(grupo) {
    // Agrega o actualiza un resultado grupal
    this.poblaciones[grupo.nombreGrupo] = grupo;
    this.guardarEnLocalStorage();
  }
  obtenerResultadosIndividuales() {
    return this.individuales;
  }
  obtenerResultadosPoblacion() {
    return this.poblaciones;
  }
  guardarEnLocalStorage() {
    // Convierte los datos a JSON y los guarda localmente
  }
  cargarDeLocalStorage() {
    // Carga los datos desde el almacenamiento local
  }
  limpiar() {
    // Borra todos los datos
  }
  limpiarResultadosPoblacion() {
    // Borra solo los resultados grupales
  }
}

</code></pre>



## Reglas de negocio importantes

* No se almacena datos personales en servidores externos; todo se maneja en el navegador.
* El procesamiento del cuestionario individual debe completarse en ≤ 3 s.
* El procesamiento grupal (hasta \~50 personas) debe completarse en ≤ 10 s.
* El archivo de carga Excel/CSV no debe superar 5 MB y debe respetar la plantilla oficial.
* Los PDFs generados no deben exceder 5 MB y cumplen con estándares de portabilidad.



##
