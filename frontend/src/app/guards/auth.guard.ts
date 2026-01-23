import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. ¿Está logueado? (Tiene token en localStorage)
  if (authService.isLoggedIn()) {
    return true; // ¡Pásale! ✅
  } else {
    // 2. No está logueado. ¡Fuera de aquí! 🚫
    router.navigate(['/login']);
    return false;
  }
};