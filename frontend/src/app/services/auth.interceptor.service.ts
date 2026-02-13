import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Buscamos el token en la caja fuerte (localStorage)
  // (Asegúrate que tu Login esté guardando el token con la clave 'token')
  const token = localStorage.getItem('token');

  // 2. Si existe, lo pegamos en la frente de la petición
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // 3. Si no hay token, que pase así nomás (para el Login o rutas públicas)
  return next(req);
};