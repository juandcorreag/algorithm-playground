# Algorithm Playground

Entorno educativo para experimentar con crecimiento, notación asintótica y algoritmos predefinidos siguiendo el ciclo **Predict → Construct → Experiment → Count/Observe → Conjecture → Derive → Explain**. No es un analizador automático de complejidad y nunca ejecuta algoritmos o código introducidos por estudiantes.

## Estado de implementación

Release 0.1 incluye las cinco actividades originales. Release 0.2 añadió el registro central y motor instrumentado. Release 0.3 completó `operation-counter.html`. Release 0.4 añadió `case-explorer.html`. Release 0.5 incorpora `binary-search.html`, una visualización especializada que deriva el crecimiento logarítmico mediante reducción progresiva de candidatos.

## Ejecutar

Necesita un servidor estático porque JavaScript usa módulos ES. Desde esta carpeta:

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000`. Bootstrap y ECharts se cargan desde CDN, por lo que requieren conexión a Internet.

Para ejecutar las pruebas de utilidades:

```bash
node tests/math-utils.test.mjs
node tests/algorithm-engine.test.mjs
node tests/detective-cases.test.mjs
node tests/case-analysis.test.mjs
```

## Decisiones matemáticas

- La interfaz evalúa valores enteros de `n ≥ 0`.
- `factorial(n)` solo se define para enteros no negativos y se limita antes del overflow de `Number`.
- En escala logarítmica se omiten cero, negativos y valores no finitos, con una advertencia visible.
- El cruce es la primera igualdad o cambio de signo de `f(n)-g(n)` encontrado entre 1 y 100 000. Es evidencia numérica limitada, no una prueba asintótica.
- “Winner” significa exclusivamente menor valor estimado de operaciones en el `n` seleccionado.

## Expresiones

El parser propio acepta `+`, `-`, `*`, `/`, `^`, paréntesis y las funciones `sqrt`, `log`, `log2` y `factorial`. Solo permite la variable `n`; no usa `eval` ni `Function`.

Para agregar una función, añada su nombre a `FUNCTIONS` y su cálculo en `safeEvaluate`, dentro de `js/math-utils.js`. Para agregar un preset, añada una entrada a `presets` en `js/growth.js` y una opción con la misma clave en `growth.html`.

Los casos de Complexity Detective están separados de la interfaz en `js/detective-cases.js`. Cada caso define `id`, `title`, `complexity`, cuatro observaciones en `values` y una explicación. La clave `complexity` debe corresponder a una de las opciones declaradas en `js/detective.js`.

## Algorithm Engine

Los algoritmos se registran en `js/algorithms/index.js` y cumplen una interfaz común: metadatos, pseudocódigo como datos, generación de entrada y ejecución instrumentada. `js/core/algorithm-engine.js` ejecuta únicamente identificadores registrados y produce `{ result, counters, trace }`. La interfaz visual consume la traza; no contiene la implementación de los algoritmos.

`js/core/operation-experiments.js` ejecuta series sin conservar trazas y devuelve registros `{n, operations}` compatibles con Complexity Detective. Esto evita construir miles de snapshots al comparar tamaños grandes.

Para agregar un algoritmo predefinido, cree su definición en `js/algorithms/`, expórtela y regístrela en `js/algorithms/index.js`. No acepte funciones, código o pseudocódigo desde parámetros URL ni controles de estudiante.

Binary Search admite internamente una entrada virtual de solo conteo para comparar tamaños de hasta mil millones sin reservar arreglos enormes. Esa ruta no está expuesta como entrada editable: ejecuta la misma recurrencia de índices del algoritmo registrado y se utiliza únicamente con `collectTrace: false`.

## Operation-counting conventions

- **Comparison:** comparación entre valores del problema, como `a[i] > maximum` o `a[i] = target`. No se cuentan pruebas internas del lenguaje anfitrión.
- **Assignment:** inicialización o actualización explícita de una variable en el pseudocódigo. Un intercambio de Bubble Sort cuenta tres asignaciones.
- **Array access:** lectura o escritura explícita de una posición del arreglo. Repetir `a[i]` en otra operación produce otro acceso.
- **Arithmetic operation:** actualización aritmética pedagógicamente visible, incluyendo avanzar un índice.
- **Loop iteration:** entrada al cuerpo de un ciclo. En Bubble Sort se registran por separado las iteraciones exteriores y las comparaciones del ciclo interior.

Estas convenciones priorizan correspondencia con el pseudocódigo del curso. Otras implementaciones pueden producir constantes distintas; dentro del Playground todos los algoritmos deben usar estas reglas consistentemente.

## Enlaces parametrizados y Moodle

Growth Explorer acepta `f` y `g`:

```text
growth.html?f=100*n^2%2B17*n%2B4&g=n^3
```

Witness Explorer acepta los mismos parámetros:

```text
witnesses.html?f=n^2%2B2*n%2B1&g=n^2
```

Copie la carpeta a cualquier servidor estático y enlace la página desde Moodle. También puede embeberla en un iframe si las políticas del servidor y Moodle lo permiten.
