# 05 Funcionamiento del sistema

### Flujo de datos

1. **Usuario no técnico**: El usuario selecciona “Prueba Individual” → responde el cuestionario → se ejecuta el cálculo del puntaje en el navegador → se compara con los perfiles de LLM → se muestra el dashboard de resultados → opción de descarga en PDF.
2. **Investigador**: El investigador carga archivo Excel/CSV → el sistema valida y procesa el archivo (hasta \~50 personas) → calcula puntajes promedio del grupo → compara con los perfiles de LLM → genera visualización grupal → descarga en PDF.

### Módulos principales

#### 1. Procesamiento

* **Modelo :**
* **Controlador:**
* **Vista:**

#### 2. Comparación

* **Modelo :**
* **Controlador:**
* **Vista:**

#### 3. Reportes



<h3 align="center">Comparación de rasgos entre el modelo LLM y el grupo poblacional</h3>

El proceso de comparación de rasgos tiene como objetivo analizar la similitud entre los resultados obtenidos por los modelos de lenguaje (LLM) y los del grupo poblacional, en base a los rasgos no cognitivos que mide el dataset TRAIT a los LLM.

TRAIT permite identificar si un modelo presenta una tendencia alta o baja en cada rasgo, mientras que los usuarios son evaluados con una prueba psicométrica en escala numérica de 1 a 5. Para realizar la comparación, se traduce la información cualitativa del modelo a valores cuantitativos dentro de esa misma escala, y posteriormente se aplican métodos estadísticos que permiten establecer un intervalo de confianza y medir la coincidencia con los valores del grupo poblacional.

### Procedimiento de comparación

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

<p align="center"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF0AAAAxCAMAAACPmVXQAAAAAXNSR0IArs4c6QAAAIdQTFRFAAAAAAAAAAA6AABmADo6ADpmADqQAGa2OgAAOgA6OgBmOjpmOjqQOpC2OpDbZgAAZgA6ZgBmZjoAZjo6ZmYAZrbbZrb/kDoAkDo6kDpmkGY6kGZmkLb/kNv/tmYAtmY6tpBmttv/tv//25A627Zm27aQ29uQ2////7Zm/9uQ/9u2//+2///bPuEz7wAAAAF0Uk5TAEDm2GYAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAZdEVYdFNvZnR3YXJlAE1pY3Jvc29mdCBPZmZpY2V/7TVxAAAB6UlEQVRYR+1W2XLCMAx0UggBCmm53Cuh1G2JE///91WSPUWBzsDENn1hH4JgBsnerFYS4oarMGC+lnkC2MSopvPhzsgoqYVoi9FeiCqDRwRUdx+QtUrLCLnx6JjW1ggOnc8hZ1vEYaYtMLtK8BkeRsKpP3OiJwLMS5IM1hES/1PKtsDeBYCSjmPLIfw63PU9nSYN0TsR3Tix4qp8jEPb16xQSZ14sqLserLyaJCaWVonzqjtjJz5NIhixsDjak7fVPZNTdgPRsIJmyVZTzfe4E30uFTcr5XTAH5cUNTqxDLLY0gLzmHk3MuXyHxqqz0e19kenEPh85wvset0QtQKuzePqxEQNRiXtmRfcD9mMU4wI5FariM8zAHnq7p76wkQz2Og3U0xn2Fj793QXOHxrzabov8oaxbuojDJeVxzGXm0at/39ff/4FQHhE2Njhdpm7Fm/RBl3XAk6Ps4q5JNTzYeC+YpKjHYk9GAZmje87Q02yR9C10G9ajWOl+/7s4768XFzZa00j4SMTqf4noRailT0wXZOIwEEg5+8fLto2vZXcLpkXy87u99p5ShTTs9GomVgq7xdTISrlGJE1siFIxMS2UT0iyDl9o8h0qOOWfOHy0nW4/d8/RUMINjDhlkPh5wr7rhQgZ+AN/vKfqqNwCkAAAAAElFTkSuQmCC" alt="" data-size="original"></p>

donde:

* σ: desviación estándar.
* n: número de ítems o preguntas asociadas al rasgo.

</details>

<details>

<summary>Paso 4. Cálculo del intervalo de confianza</summary>

Con el error estándar calculado, se determina un intervalo de confianza del 95%, que establece el rango dentro del cual se encuentra la verdadera media del modelo con un 95% de certeza.\
Se utiliza la siguiente expresión:

<p align="center"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoAAAAbCAMAAACUY+ewAAAAAXNSR0IArs4c6QAAAJxQTFRFAAAAAAAAAAA6AABmADo6ADpmADqQAGaQAGa2OgAAOgA6OgBmOjoAOjo6OjpmOmaQOma2OpC2OpDbZgAAZjoAZjo6ZjpmZmYAZpC2ZpDbZrbbZrb/kDoAkDo6kGY6kGZmkNvbkNv/tmYAtmY6tpA6ttvbttv/tv//25A625Bm27aQ29uQ29u22////7Zm/9uQ/9u2/9vb//+2///bf/sePQAAAAF0Uk5TAEDm2GYAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAZdEVYdFNvZnR3YXJlAE1pY3Jvc29mdCBPZmZpY2V/7TVxAAACMklEQVRIS+1V23baMBCUSCC4JCmxaSngkNROW/WC5Vr//2/ZiyytMIGe04e8WA+clW2tZmZnF6XGNSowKvB/ChhNa3aIaeyHr2nOdj+PD9p9pvWy/xx24t0QSldwfn31Qx3HfBCeTr+/xeEISrvXOl7XFfODshlDd/VkKzicSmgL/NSV+JvGnn6l9e5NNVMo9v4bXB8+roCeUoaOu3KKm365J69mCOCNZdVMfhwv1kTHLtaU8fQaFEhA8SFfYCZJJV3F+wRhIzgn8YxIufKBZINVayDmyiTnP0Dp8LwUi5IxFldKmhKujKucdmb2O0PBlPq5tVnuHlObnoPCRWezNHpbZ3qyESUCLCkS2rWfvFoy3qFGcBXXmtW8qaNtfD+R5xksLknf6IeD+rNCI1d6+qzci3Qd6HJ7JfuBu4ZlkjFgQBHKXLH5aFV6GWlRdE4VEBKEWP5CVdkaVCuBOu0HuE+phl0v42Z26Irc4G883qTeuwiFspKqDCUpCLhuleSL8vdt5wWYw8FrGGCEz4u/GrT1eVXwGDumhxJpof/THhDyy1K4cgdJ0AOiq+rn8nhcXobCXBuykzBS6KDgFi+/XYAfZExXVJEPKU2+Mcm8G0Dxw7Ur2GF/6wl9T/z7YYL7MFeCE1n+lkakjENbt4Wvp8FOtJnsx4FX3P4Wm+BuA7R4KF1/8T51Nbz4GCQIQ6H77J+1K/8PBNBl3MimOjNsYzu8a3R6rrwrpPHyUYFRgcsKvAKwb0JghVxyBgAAAABJRU5ErkJggg==" alt=""></p>

donde 1.96 corresponde al valor z para un nivel de confianza del 95%.\
Esto genera dos límites:

* Límite inferior (LI):   ![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoAAAAbCAMAAACUY+ewAAAAAXNSR0IArs4c6QAAAJxQTFRFAAAAAAAAAAA6AABmADo6ADpmADqQAGaQAGa2OgAAOgA6OgBmOjoAOjo6OjpmOmaQOma2OpC2OpDbZgAAZjoAZjo6ZjpmZmYAZpC2ZpDbZrbbZrb/kDoAkDo6kGY6kGZmkNvbkNv/tmYAtmY6tpA6ttvbttv/tv//25A625Bm27aQ29uQ29u22////7Zm/9uQ/9u2/9vb//+2///bf/sePQAAAAF0Uk5TAEDm2GYAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAZdEVYdFNvZnR3YXJlAE1pY3Jvc29mdCBPZmZpY2V/7TVxAAACHUlEQVRIS+1V23aCMBBMvFXUtgq0VqVWoZfYVqDk//+tm90AG2nRnr6SB84Gks3M7GwQohudAp0C/1NASRyjY0uafDuuv+ZbT8p5uRxm7FszRxFQftl/E6cxbYS3w9cLOeRbKevjimB8FJlH0HXSW7dxgCVZYJbqyDzd2NKPpdxciCS7eYHjq8Ux0BNC4XYdDc2kHPppT2EVGCikmvJP4+kS6WTTJWa8cDAoNqQDVM+ebRHENHcQpoyzE4+QlI4WKBuMRAIxHbk5TxE2oRRmPxeL1EAsOuI0OVwexz7O1OjDM4IJcVhnnq8fHXJNqdiZVHQySyrXiSd7K1YiwOIiwVl+Z9Xi8cZolE32VGtS8yo5ZxtOX8nFUXyGxsixHO6EfuauA11mfd4P1DUkE48BgxEh8gWZD0cs5zUt29rYfqQb5WANewAh5u9GVbIG1ootdfsBzhMipe08TkfHIvCVedbb03afNKBgVlSVoDgFAdeFTr5a/rLtrABj2DiY7AmfZRyeb+umP9ExJZSalvG/2wNMfl4KHW0AihGedVWyi1qvyx9VIa4p1pB7uuygyi1W/mwKfuAxWAWo1HxQafSNajeuvVyLgBz2lfRwPfKnBsZRhqxkJH+OXuNx1dZ5YLcr04mZx/uxdmB5wHZmTHy9Alp0KQ0erE91Ah9uKwmqS6G4t+/y0P6BADqPU95Uf7lsG+i6F50CnQKdAr8p8A2RHj3jK2jlxgAAAABJRU5ErkJggg==)
* Límite superior (LS): ![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoAAAAbCAMAAACUY+ewAAAAAXNSR0IArs4c6QAAAJxQTFRFAAAAAAAAAAA6AABmADo6ADpmADqQAGaQAGa2OgAAOgA6OgBmOjoAOjo6OjpmOmaQOma2OpC2OpDbZgAAZjoAZjo6ZjpmZmYAZpC2ZpDbZrbbZrb/kDoAkDo6kGY6kGZmkNvbkNv/tmYAtmY6tpA6ttvbttv/tv//25A625Bm27aQ29uQ29u22////7Zm/9uQ/9u2/9vb//+2///bf/sePQAAAAF0Uk5TAEDm2GYAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAZdEVYdFNvZnR3YXJlAE1pY3Jvc29mdCBPZmZpY2V/7TVxAAACKUlEQVRIS+1V2VbCMBBNQJCKC7QoAhWxdakLbW3+/9+cJU0nrVbP8bV56JmQZObOzb1BqWEMDAwM/I+BTNOYHnvSlPtZs1ruA60X9XaYibVujiri/Hr8otoxH4RfJ88/FS/OHuRSude6KVdFs6MqAoZu0tG2rwfYUkS41cT49WPbfqL17kcafCjF5ROUd5sTaE+pjI6beIKTeph724ILEAqzloXteL6mdor5mjJ+P1qsIIcOig25QDby6DMJzz2EuejZi6fUlImXRBuMVENjJvZy/gFKheclWZSMsZhYtinhyjgJaZZN3wMkTKnXbRGE5s5rTvVB4UtnseR6mwZ6tBFXBFh8JDQrry1bMt4hR1CK75rZPE1bsumDAipZHtXHCoWc6MlBmUepOuDlfCz9wK5hmmQMNZCEOFQsPhqJXjRtWWuT/Zg3ziEM+wpELN6QVZYG3ZXY6vsB6imV83EZ59NjFYUZfpvjua89POKbuQWFshKrDMW7EFDdysvX0F/bzhIwg4MnUIjw2Y5XHVv/DoUVU0Np2kL9+x4Q9MurMPEOoCDxwlXpIW4/l79D4V5zukNxe85BTi2W/mIOepAxlUiafohp0k3mCbcDxT6uVcQK+0xHtJ/6rx8TnLt3xSmR6S9JazJ2ti4je58ZOrEIpB87WjH7cxTxxQba4kfp5Nbq1KSwcOUocI9CdWN/K1f2HwigyziXpup5bLuybQwyRAMDAwMDA/0MfAFAFkIbDnExpgAAAABJRU5ErkJggg==)

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

### Reglas de negocio importantes

* No se almacena datos personales en servidores externos; todo se maneja en el navegador.
* El procesamiento del cuestionario individual debe completarse en ≤ 3 s.
* El procesamiento grupal (hasta \~50 personas) debe completarse en ≤ 10 s.
* El archivo de carga Excel/CSV no debe superar 5 MB y debe respetar la plantilla oficial.
* Los PDFs generados no deben exceder 5 MB y cumplen con estándares de portabilidad.
