import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRole = route.data['role'];
    if (authService.isAuthenticated && authService.isAuthorized(requiredRole)) {
      return true;
    }
    console.log("No authorization!");
    
    // Yetki yoksa login sayfasına yönlendir
    router.navigate(['/auth/login']);
    return false;
};
