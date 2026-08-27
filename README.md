# Algorithm Playground

Aplicación web educativa para explorar crecimiento de funciones y notación asintótica siguiendo el ciclo **Predict → Experiment → Observe → Explain**.

## Versión 0.1

Incluye la página de inicio, las cinco actividades de la versión 1 y utilidades matemáticas compartidas. No usa backend, cuentas ni datos personales.

## Ejecutar

Necesita un servidor estático porque JavaScript usa módulos ES. Desde esta carpeta:

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000`. Bootstrap y ECharts se cargan desde CDN, por lo que requieren conexión a Internet.

Para ejecutar las pruebas de utilidades:

```bash
node tests/math-utils.test.mjs
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
