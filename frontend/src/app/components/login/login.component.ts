import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para poder usar formularios
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importamos módulos necesarios
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // 1. Limpiamos errores previos
    this.errorMessage = '';

    // 2. Enviamos los datos al backend usando el servicio
    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (res) => {
          console.log('Login exitoso:', res);
          // 3. Si todo sale bien, nos vamos a la pantalla principal (Caja)
          // NOTA: Asumo que la ruta principal es vacía ('') o '/pos'. 
          // Ajustaremos esto en el siguiente paso de Rutas.
          this.router.navigate(['/']); 
        },
        error: (err) => {
          console.error('Error login:', err);
          this.errorMessage = 'Usuario o contraseña incorrectos';
        }
      });
  }
}