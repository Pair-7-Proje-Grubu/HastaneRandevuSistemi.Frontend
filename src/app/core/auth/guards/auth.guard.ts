import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  //ÇALIŞMIYOR KONTROL EDİLECEK
  const url: string = state.url;
  
    if (authService.isAuthenticated) {
      // Eğer kullanıcı giriş yapmışsa ve '/home' veya kök ('/') sayfasına gitmeye çalışıyorsa, dashboard'a yönlendir
      if (url === '/' || url === '/home'|| url === '/auth/login') {
      
        const role =  authService.getUserRoles().reverse()[0].toLowerCase();
        router.navigate([`${role}/dashboard`]);
      return false;
      }
      return true;
    } else {
      // Eğer kullanıcı giriş yapmamışsa ve '/dashboard' sayfasına gitmeye çalışıyorsa, login sayfasına yönlendir
      if (url.startsWith('/dashboard')) {
            router.navigate(['/login']);
        return false;
      }
      return true;
    }
};
