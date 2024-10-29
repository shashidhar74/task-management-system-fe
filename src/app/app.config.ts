import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {  provideAuth } from 'angular-auth-oidc-client';
import { authInterceptor } from './interceptor/auth.interceptor';
import { authConfig } from './config/auth.config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
   provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])), // Ensure this is first
    provideAuth(authConfig),
    provideAnimationsAsync(),
  ]
};
