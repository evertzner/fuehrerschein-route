# Fahrplan

Una guía interactiva para obtener por primera vez el permiso de conducir alemán **Klasse B**. Un coche modelado con geometrías de Three.js recorre una carretera curva a medida que avanzas con el scroll.

## Desarrollo

Requiere Node.js 20.19+ o 22.12+ y pnpm 11.

```sh
pnpm install
pnpm dev
```

Abre la dirección que muestra Vite (por defecto http://127.0.0.1:5173).

```sh
pnpm build
pnpm preview
```

## Características

- Ocho etapas con requisitos, documentos, formación y exámenes.
- Español, inglés y alemán; terminología administrativa alemana en todos los idiomas.
- Temas claro y oscuro, con preferencia del sistema en la primera visita.
- Checklist, idioma y tema persistidos en localStorage.
- Navegación por scroll, botones y marcadores del mapa.
- Vista aérea en escritorio y cámara de seguimiento detrás del coche en móvil (hasta 720 px), con controles para ir a la etapa anterior o siguiente.
- Diseño adaptable, teclado, diálogos nativos y movimiento reducido.
- Contenido accesible si el dispositivo no dispone de WebGL.

## Estructura

- [src/content.ts](./src/content.ts): textos, traducciones y enlaces oficiales.
- [src/scene.ts](./src/scene.ts): circuito Catmull–Rom, coche, paisaje y renderizado bajo demanda.
- [src/main.ts](./src/main.ts): navegación, scroll, checklist y preferencias.
- [src/style.css](./src/style.css): diseño adaptable y temas.

El coche y el entorno se generan localmente: no necesitan modelos externos. La tipografía usa Google Fonts con alternativas del sistema.

## Alcance de la información

Guía general para la primera obtención de Klasse B, con advertencia específica para BF17 y licencias extranjeras (Umschreibung). Los trámites pueden prepararse en paralelo. La autoridad local confirma requisitos, tasas, fotografías y plazos. Los costes de formación no se estiman: dependen de la autoescuela y del alumno.

Referencias:

- [ServicePortal Berlin: Fahrerlaubnis – Ersterteilung](https://service.berlin.de/dienstleistung/121627/), consultado el 9 de noviembre de 2026 para documentos y requisitos locales.
- [Fahrerlaubnis-Verordnung](https://www.gesetze-im-internet.de/fev_2010/).
- [Fahrschüler-Ausbildungsordnung](https://www.gesetze-im-internet.de/fahrschausbo_2012/).
- [Anlage 11 FeV](https://www.gesetze-im-internet.de/fev_2010/anlage_11.html).

## Verificación

Compilación TypeScript y Vite, comprobación en navegador de idiomas, cambio de tema, navegación entre etapas, apertura y cierre de diálogos y persistencia de checklist. Las imágenes del circuito son una ilustración del proceso, no una simulación de conducción ni un mapa geográfico.

## Netlify

Sitio publicado: https://fahrplan-fuehrerschein.netlify.app

Panel: https://app.netlify.com/projects/fahrplan-fuehrerschein

La configuración de [netlify.toml](./netlify.toml) ejecuta `pnpm build` y publica `dist`, con Node.js 24 y pnpm 11. Los assets versionados de Vite se sirven con caché de un año; el HTML puede actualizarse en cada despliegue.

Para usar la CLI sin añadirla a las dependencias del proyecto:

```sh
pnpm --allow-build=esbuild --allow-build=unix-dgram --allow-build=netlify-cli \
  --package=netlify-cli dlx netlify login
```

Una vez asociado el sitio y autenticada la CLI, los siguientes despliegues se pueden realizar con:

```sh
pnpm build
pnpm --allow-build=esbuild --allow-build=unix-dgram --allow-build=netlify-cli \
  --package=netlify-cli dlx netlify deploy --prod --dir=dist --no-build
```

La asociación local al sitio se guarda en `.netlify/`, excluido de Git. Esta configuración también sirve para futuros despliegues desde un repositorio conectado a Netlify; esa conexión se configura por separado.
