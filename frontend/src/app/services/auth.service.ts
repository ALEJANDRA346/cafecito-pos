import { Injectable, inject } from '@angular/core'; // <--- Importamos inject
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 1. MODERNIZACIÓN: Usamos inject() igual que en tus otros servicios
  private http = inject(HttpClient);
  
  private apiUrl = environment.apiUrl + '/auth';

  // Función para Iniciar Sesión (Login)
  login(credentials: {username: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Si el login funciona, guardamos el token
        // OJO: La clave 'token' DEBE coincidir con lo que busca el Interceptor
        if (response.token) {
          localStorage.setItem('token', response.token);
          
          localStorage.setItem('user', JSON.stringify({
            username: response.username,
            role: response.role
          }));
        }
      })
    );
  }

  // Función para Cerrar Sesión (Logout)
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Verificar si hay alguien logueado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Obtener los datos del usuario actual
  getUser(): any {
    const userStr = localStorage.getItem('user');
    // Agregamos un try-catch silencioso por si el localStorage se corrompe
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  }
}