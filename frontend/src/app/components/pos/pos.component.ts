import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // <--- NUEVO

import { ProductService } from '../../services/product.service';
import { PosService } from '../../services/pos.service';
import { AuthService } from '../../services/auth.service'; // <--- NUEVO
import { Product } from '../../models/product.model';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.css'
})
export class PosComponent implements OnInit {
  // Servicios
  private productService = inject(ProductService);
  private posService = inject(PosService);
  private authService = inject(AuthService); // <--- NUEVO
  private router = inject(Router);           // <--- NUEVO

  // Datos
  products: Product[] = [];
  customers: Customer[] = [];
  currentUser: any = null; // <--- Para guardar quién es el usuario
  
  // Estado del Carrito
  cart: any[] = [];
  selectedCustomerId: string = '';
  totalLocal: number = 0;
  
  // Mensaje de éxito/ticket
  lastTicket: any = null;

  ngOnInit() {
    this.loadData();
    this.currentUser = this.authService.getUser(); // <--- Obtenemos el usuario al iniciar
  }

  loadData() {
    this.productService.getProducts().subscribe(data => this.products = data);
    this.posService.getCustomers().subscribe(data => this.customers = data);
  }

  addToCart(product: Product) {
    const existingItem = this.cart.find(item => item.productId === product._id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
    }
    this.calculateLocalTotal();
  }

  calculateLocalTotal() {
    this.totalLocal = this.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  pay() {
    if (this.cart.length === 0) return;

    const saleRequest = {
      customerId: this.selectedCustomerId || null,
      items: this.cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    this.posService.createSale(saleRequest).subscribe({
      next: (response) => {
        console.log('Venta exitosa:', response);
        this.lastTicket = response;
        this.cart = [];
        this.totalLocal = 0;
        this.selectedCustomerId = '';
        this.loadData();
      },
      error: (err) => {
        alert('Error en la venta: ' + (err.error.error || 'Desconocido'));
        console.error(err);
      }
    });
  }

  // <--- NUEVA FUNCIÓN PARA SALIR
  logout() {
    this.authService.logout(); // Borra el token
    this.router.navigate(['/login']); // Nos manda a la puerta
  }
}