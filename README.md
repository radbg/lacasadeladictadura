# La Casa de la Dictadura — Escape Room Electoral

Juego de escape room interactivo en el navegador sobre derechos electorales venezolanos.
HTML + CSS + JavaScript vanilla puro. Sin dependencias externas.

---

## Cómo abrir localmente

```bash
# Opción 1: abrir directamente en el navegador
open escape-room/index.html

# Opción 2: servidor local (recomendado para que el iframe funcione)
cd escape-room
python3 -m http.server 8080
# luego abre http://localhost:8080
```

> **Nota sobre el iframe:** navegadores modernos bloquean iframes en páginas abiertas con `file://`. Para que el cuarto de la biblioteca cargue `quieroelegir.org` correctamente, sirve el juego desde un servidor local (ver Opción 2) o despliégalo en un servidor web.

---

## Estructura de archivos

```
escape-room/
├── index.html   — página única, carga CSS y JS
├── style.css    — estilos (paleta oscura, tipografía monospace)
├── game.js      — lógica del juego, estado, renderizado
└── data.js      — preguntas, contenido de cada cuarto y mensajes
```

---

## Agregar o editar preguntas

Todo el contenido vive en `data.js` dentro del array `ROOMS`. Cada cuarto tiene esta estructura:

```javascript
{
  id: 1,
  power: "NOMBRE DEL PODER",      // aparece en mayúsculas arriba del cuarto
  name: "Nombre descriptivo",      // subtítulo
  isTransition: false,
  ambience: "Descripción ambiental en primera persona.",
  ascii: `...arte ASCII del espacio...`,
  questions: [
    {
      text: "Texto de la pregunta",
      options: [
        { text: "Opción incorrecta", correct: false },
        { text: "Opción correcta",   correct: true  }
      ],
      fact: "Dato que aparece al responder correctamente."
    }
  ]
}
```

Las opciones se **mezclan en orden aleatorio** cada vez que se muestra la pregunta, así que no importa el orden en que las escribas.

---

## Reemplazar los placeholders de la biblioteca

En `data.js`, busca el objeto con `id: "biblioteca"` y localiza el array `questions`. Reemplaza los tres objetos placeholder con preguntas reales basadas en el contenido de `quieroelegir.org`:

```javascript
// ANTES (placeholder):
{
  text: "[ PLACEHOLDER: Pregunta 1 sobre el contenido de quieroelegir.org ]",
  options: [
    { text: "[ Opción A ]",             correct: false },
    { text: "[ Opción B — correcta ]",  correct: true  }
  ],
  fact: "[ PLACEHOLDER: Dato o cita de quieroelegir.org ]"
}

// DESPUÉS (ejemplo real):
{
  text: "¿Cuál es el primer paso según quieroelegir.org para organizarse electoralmente?",
  options: [
    { text: "Esperar instrucciones del CNE",        correct: false },
    { text: "Inscribirse como testigo electoral",   correct: true  }
  ],
  fact: "Según quieroelegir.org, los testigos electorales son la primera línea de defensa del voto ciudadano."
}
```

---

## Configurar el iframe de quieroelegir.org

Para que el iframe cargue dentro del juego, el servidor de `quieroelegir.org` debe enviar uno de estos headers HTTP:

### Nginx

```nginx
# En el bloque server {} o location {} correspondiente:
add_header X-Frame-Options "ALLOWALL";

# Alternativa más moderna (recomendada):
add_header Content-Security-Policy "frame-ancestors *;";
```

### Apache

```apache
# En .htaccess o en el bloque <Directory>:
Header set X-Frame-Options "ALLOWALL"

# Alternativa moderna:
Header set Content-Security-Policy "frame-ancestors *;"
```

### Nota de seguridad

Permitir que cualquier sitio incrueste tu página en un iframe tiene implicaciones de seguridad (clickjacking). Si prefieres restringirlo solo al dominio donde aloje el juego (por ejemplo `tudominio.com`), usa:

```
Content-Security-Policy: frame-ancestors 'self' https://tudominio.com;
```

Si el iframe no carga (el servidor de `quieroelegir.org` no puede modificar sus headers), el juego muestra automáticamente un fallback con un enlace para abrir la página directamente. El temporizador de 60 segundos sigue corriendo normalmente en ambos casos.

---

## Cambiar la URL del recurso final (pantalla de victoria)

En `game.js`, busca la función `renderVictory()`. Localiza esta línea:

```javascript
<a href="https://esdata.info" ...>
```

Reemplaza `https://esdata.info` con la URL deseada. El texto del botón está en la misma línea debajo:

```javascript
[ CONOCE TUS DERECHOS ELECTORALES ]
```

---

## Personalización adicional

| Qué cambiar | Dónde |
|---|---|
| Mensajes de represión al fallar | `data.js` → array `REPRESSION_MESSAGES` |
| Tiempo del temporizador de la biblioteca | `data.js` → `timerSeconds: 60` |
| Colores / tipografía | `style.css` → variables `:root` |
| Arte ASCII de cada cuarto | `data.js` → campo `ascii` de cada cuarto |
| Texto narrativo de cada cuarto | `data.js` → campo `ambience` |

---

## Despliegue

El juego es un sitio estático: sube los 4 archivos (`index.html`, `style.css`, `game.js`, `data.js`) a cualquier hosting estático (GitHub Pages, Netlify, Vercel, etc.). No requiere servidor backend.
