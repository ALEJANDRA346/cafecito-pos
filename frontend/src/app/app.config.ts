import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// 1. IMPORTA ESTAS DOS COSAS:
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/auth.interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // 2. MODIFICA AQUÍ PARA ACTIVAR EL INTERCEPTOR:
    provideHttpClient(withInterceptors([authInterceptor])) 
  ]
};