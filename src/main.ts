import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';


/**
 * Punto de entrada de la aplicación.
 * Inicializa la aplicación Angular con el componente raíz y la configuración global.
 */
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  //rama lista para mergear a develop
