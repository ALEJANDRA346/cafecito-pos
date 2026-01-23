import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PosService } from '../../services/pos.service';

@Component({
  selector: 'app-create-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.css'
})
export class CreateCustomerComponent {
  private posService = inject(PosService);
  private router = inject(Router);

  name: string = '';
  email: string = '';
  phone: string = '';

  // Mensajes de error específicos
  nameError: string = '';
  emailError: string = '';
  
  isLoading = false;

  validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  checkValidation() {
    // 1. Validar Nombre (No vacío y mínimo 3 letras)
    if (!this.name.trim()) {
      this.nameError = 'El nombre es obligatorio.';
    } else if (this.name.trim().length < 3) {
      this.nameError = 'El nombre es muy corto (mínimo 3 letras).';
    } else {
      this.nameError = '';
    }

    // 2. Validar Email (Formato correcto)
    if (!this.email.trim()) {
      this.emailError = 'El correo es obligatorio.';
    } else if (!this.validateEmail(this.email)) {
      this.emailError = 'Formato inválido (ej: cliente@gmail.com).';
    } else {
      this.emailError = '';
    }
  }

  saveCustomer() {
    this.checkValidation();

    if (this.nameError || this.emailError) {
      return; // Si hay errores, no avanzamos
    }

    this.isLoading = true;
    
    const newCustomer = {
      name: this.name,
      email: this.email,
      phone: this.phone
    };

    this.posService.createCustomer(newCustomer).subscribe({
      next: () => {
        alert('✅ Cliente registrado con éxito');
        this.router.navigate(['/']); // Volver a la Caja
      },
      error: (err) => {
        const errorMsg = err.error.error || 'Error desconocido';
        alert('❌ Error: ' + errorMsg);
        this.isLoading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}