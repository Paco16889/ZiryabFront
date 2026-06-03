# Auditoría de accesibilidad WCAG 2.1 (nivel AA)

**Proyecto:** Ziryab · Frontend Angular  
**Ámbito inicial:** página `About` (`/about`) y patrones transversales del shell  
**Fecha:** junio 2026  
**Referencia:** [WCAG 2.1](https://www.w3.org/TR/WCAG21/)

## Metodología

1. Revisión manual de la página About frente a los criterios AA más relevantes (perceptible, operable, comprensible, robusto).
2. Comprobación de i18n (es / en / de), textos alternativos, jerarquía de encabezados y navegación por teclado en el componente refactorizado.
3. Eliminación de dependencias de CDN en iconos (activos locales en `src/assets/about/`).

Herramientas recomendadas para ampliar la auditoría al resto de la app: [axe DevTools](https://www.deque.com/axe/), Lighthouse (accesibilidad), teclado solo y lector de pantalla (NVDA / VoiceOver).

## Página About — criterios revisados

| Criterio | Nivel | Estado | Notas |
| -------- | ----- | ------ | ----- |
| 1.1.1 Contenido no textual | A | Cumple | Iconos de stack decorativos (`alt=""` + texto adyacente). Retratos del equipo con `alt` traducido. |
| 1.3.1 Información y relaciones | A | Cumple | `<main>`, `<header>`, `<section>`, `<nav>`, `<h1>`–`<h3>`, listas `<ul>`, estadísticas en `<dl>`. |
| 1.3.2 Secuencia significativa | A | Cumple | Orden DOM lógico: título → misión → stack → equipo → volver. |
| 2.4.1 Bloques de omisión | A | Parcial | Skip link global pendiente en layout principal. |
| 2.4.2 Título de página | A | Parcial | `aboutPage.pageTitle` en `<h1>`; falta sincronizar `document.title` vía `Title` service. |
| 2.4.4 Propósito de los enlaces | A | Cumple | Enlace «Volver al panel» con `routerLink="/dashboard"` (antes `href="#"`). |
| 2.4.6 Encabezados y etiquetas | AA | Cumple | Jerarquía h1 → h2 → h3 sin saltos. |
| 2.4.7 Foco visible | AA | Cumple | `focus-visible:ring` en enlace de navegación. |
| 3.1.1 Idioma de la página | A | Cumple | `lang` en `index.html` + ngx-translate. |
| 3.1.2 Partes en otro idioma | AA | Cumple | Nombres propios del equipo sin cambio de idioma. |
| 4.1.2 Nombre, función, valor | A | Cumple | Enlaces y listas con roles nativos. |

## Cambios aplicados (junio 2026)

- Iconos migrados a `src/assets/about/icons/` y equipo a `src/assets/about/team/` (sin Flaticon / IconScout / vectorlogo.zone).
- Eliminado `[innerHTML]` en la descripción (solo texto plano traducido).
- Añadido `<h1>` visible, landmarks y textos `alt` / nombres completos del equipo en i18n.
- Enlace de retorno accesible hacia `/dashboard`.
- Fotos reales de Ángela (`angela.png`) y Antonio (`antonio.png`); avatar SVG local para Francisco hasta disponer de foto en el repo.

## Hallazgos pendientes (resto de la aplicación)

| Área | Prioridad | Acción sugerida |
| ---- | --------- | --------------- |
| Layout global | Alta | Añadir «saltar al contenido» y `Title` service por ruta. |
| Formularios (login, admin CRUD) | Alta | Revisar `aria-describedby` en errores, contraste de mensajes de validación. |
| Tablas y grids admin | Media | Cabeceras `<th scope>`, captions donde aplique. |
| Modales / notificaciones | Media | Trap de foco, `aria-modal`, cierre con Escape. |
| Contraste global | Media | Auditoría Lighthouse en modo claro y oscuro. |
| Foto equipo About (Francisco) | Baja | Sustituir `francisco.svg` por foto en `assets/about/team/` cuando esté en el repo de exposición. |

## Conclusión

La página **About** cumple los criterios AA revisados en este informe. La auditoría **completa** de todas las pantallas por rol (alumno, profesor, admin) queda planificada en la tabla de hallazgos pendientes; este documento sirve como evidencia del módulo *Desarrollo de Interfaces* y punto de partida para ampliar la cobertura antes de la exposición.
