import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptor } from './core/loading-overlay/interceptors/loading.interceptor';
import { authInterceptor } from './core/auth/intercepters/auth.interceptor';
import { errorHandlerInterceptor } from './core/auth/intercepters/error-handler.interceptor';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';

registerLocaleData(localeTr, 'tr');

export const appConfig: ApplicationConfig = {
  
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(), 
    provideHttpClient(withInterceptors([loadingInterceptor,authInterceptor,errorHandlerInterceptor])), 
    { provide: LOCALE_ID, useValue: 'tr' },
  ]
};
