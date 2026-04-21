# Frontend - Panel de Control (Angular)

Este proyecto maneja la interfaz web cliente del sistema. Fue generado utilizando [Angular CLI](https://github.com/angular/angular-cli) versión 19.2.18.

## 🛠️ Requisitos previos

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- npm (incluido en la instalación de Node.js)

## 🚀 Instalación

1. Abre un terminal y navega al directorio del proyecto de Angular:
   ```bash
   cd angular
   ```

2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

## 💻 Uso (Modo Desarrollo)

Para iniciar un servidor de desarrollo local, ejecuta el siguiente comando:

```bash
npm start
# o alternativamente: ng serve
```

Una vez que el servidor esté en ejecución, abre tu navegador web y visita `http://localhost:4200/`. La aplicación web detectará cambios en los archivos fuente y se recargará automáticamente en el navegador.

## 🏗️ Construcción para Producción

Para compilar el proyecto en modo producción y optimizar su rendimiento, ejecuta:

```bash
npm run build
# o alternativamente: ng build
```

Esto procesará y empaquetará el código del proyecto, y los artefactos finales se guardarán en el directorio `dist/`. Estos archivos están listos para ser servidos por un servidor web estático.

## 📚 Documentación (Compodoc)

Este proyecto incluye una configuración completa de documentación mediante Compodoc. Para generarla y servirla localmente, ejecuta:

```bash
npm run docs:serve
```

Para generar los archivos estáticos en la carpeta `docs/` sin levantar un servidor, ejecuta:

```bash
npm run docs:build
```

## 🧪 Testing

- **Tests unitarios:** Ejecuta `npm test` para correr los tests unitarios con [Karma](https://karma-runner.github.io).
- **Format y Linter:** (Si se requieren, según configuración en el `package.json`).
