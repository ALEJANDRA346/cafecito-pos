import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Asegúrate de que este puerto coincida con tu backend (3001 o el que diga tu terminal negra)
  private apiUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) { }

  // Función para Iniciar Sesión (Login)
  login(credentials: {username: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Si el login funciona, guardamos el "gafete" (token) en el navegador
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

  // Verificar si hay alguien logueado (¿Existe el gafete?)
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Obtener los datos del usuario actual (Nombre, Rol)
  getUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}