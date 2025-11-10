# 05 Funcionamiento del sistema

## Flujo de datos

1. **Usuario no técnico**: El usuario selecciona “Prueba Individual” → responde el cuestionario → se ejecuta el cálculo del puntaje en el navegador → se compara con los perfiles de LLM → se muestra el dashboard de resultados → opción de descarga en PDF.
2. **Investigador**: El investigador carga archivo Excel/CSV → el sistema valida y procesa el archivo (hasta \~50 personas) → calcula puntajes promedio del grupo → compara con los perfiles de LLM → genera visualización grupal → descarga en PDF.

## ¿Cómo se hacen las comparaciones? &#x20;

### 1. Comparación de rasgos entre el modelo LLM y el grupo poblacional

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

<p align="center"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGEAAAAxCAMAAAD9VjdmAAAAAXNSR0IArs4c6QAAAIdQTFRFAAAAAAAAAAA6AABmADo6ADpmADqQAGa2OgAAOgA6OgBmOjpmOjqQOpC2OpDbZgAAZgA6ZgBmZjoAZjo6ZmYAZrbbZrb/kDoAkDo6kDpmkGY6kGZmkLb/kNv/tmYAtmY6tpBmttv/tv//25A627Zm27aQ29uQ2////7Zm/9uQ/9u2//+2///bPuEz7wAAAAF0Uk5TAEDm2GYAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAZdEVYdFNvZnR3YXJlAE1pY3Jvc29mdCBPZmZpY2V/7TVxAAAB6klEQVRYR+1XXVfCMAxdJ4wBwpSv+rUhVmXd+v9/n0nagxk8gHTRF+/DCJxD0t4kN1mS/OPXGXAfy1wBNlKRbT7cOS3mPknaYrRPkiqDhxCqmzfwXKWlkH+8Arr2cURg8zn4bQs5ltoCIxiFTxk4Dad/z4kqIbgnpQZrIed/7LYtsM8BUGXHtucUfh3uYk5pqb4oT0nXVr7wqlihsT79BqusY09WFMFOVpFNVDMp7NgZtafTs9gmMkxIuF3N6ZvJPqlZr4fTcNJmSXLVtTd4IzsuDdd7E+oCPy4M7OvHM81tcA1K4/Q8WstIsGpfl9yusz0ojcHnOS1j1+qanlnOAberEZA2GJc+bAy4njMbp6HTSDWvLzzQNy6LHDiwE0gEtyENYSLGDi3PQUPziduHum2KuLHYLMKlYUPgds3LK7KlY3J4+l84GUO/vr23SnBbogDtndgqE/iwt3LrWGjfy1rk+vy4B3GSsG9FgQLqXvO0dFuVvkiEwlo1a5uvn3fnFflHB3BbqqH2nkiy+RTXlj6XPzNd0BiEkXKYB9Gaf3RFv6PQuhL2+zpOL08pRIkPteo0Ruv9NaJWoyQ0NPHjw/QJp9PSeKc0EyHRzWO/zVGrWdBVz882ctc9vT7MdOlBhZmQBe5u/7iSgS/Pcioex/Tr9gAAAABJRU5ErkJggg==" alt=""></p>

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

* Límite inferior (LI):   <img src="../.gitbook/assets/image (3).png" alt="" data-size="line">
* Límite superior (LS): <img src="../.gitbook/assets/image (5).png" alt="" data-size="line">

El rango (\[LI, LS]) representa la posición estadística del modelo en ese rasgo.

</details>

<details>

<summary>5. Comparación con el grupo poblacional</summary>

El rango obtenido del modelo se compara con las puntuaciones de los usuarios en el mismo rasgo (escala 1–5). Se calcula el porcentaje de usuarios cuyas puntuaciones se encuentran dentro del intervalo de confianza del modelo.

Este porcentaje indica el grado de similitud entre los rasgos socioemocionales del modelo y el del grupo poblacional en ese rasgo.\
Por ejemplo, si el intervalo del modelo para el rasgo de “Responsabilidad” es \[3.8, 4.4] y el 60% de los usuarios tienen puntuaciones dentro de ese rango, se concluye que el modelo y el grupo presentan una similitud del 60% en dicho rasgo.

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

### 2. Comparación de rasgos entre el modelo LLM y el Usuario no técnico.





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



#### Modelo `Resultados`

El Model

#### Modelo `ProcesadorPsicometrico`

#### Modelo `Cuestionario`:

\
&#x20;





### Reglas de negocio importantes

* No se almacena datos personales en servidores externos; todo se maneja en el navegador.
* El procesamiento del cuestionario individual debe completarse en ≤ 3 s.
* El procesamiento grupal (hasta \~50 personas) debe completarse en ≤ 10 s.
* El archivo de carga Excel/CSV no debe superar 5 MB y debe respetar la plantilla oficial.
* Los PDFs generados no deben exceder 5 MB y cumplen con estándares de portabilidad.



##
