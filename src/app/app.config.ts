import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { authInterceptorFn } from './core/interceptors/auth.interceptor';
import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyADRm1ot81xIDrrW3iKu6ywdAd8NR1G0gA",
  authDomain: "ziryab-7006e.firebaseapp.com",
  projectId: "ziryab-7006e",
  storageBucket: "ziryab-7006e.firebasestorage.app",
  messagingSenderId: "708163806772",
  appId: "1:708163806772:web:274c85353970b612c14c61",
  measurementId: "G-WNWVENZL8X"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptorFn])
    ),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
  ],
};