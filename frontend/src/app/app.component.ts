import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- Importante para los inputs

import { ProductService } from './services/product.service';
import { PosService } from './services/pos.service';
import { Product } from './models/product.model';
import { Customer } from './models/customer.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css' // O .scss si elegiste eso
})
export class AppComponent implements OnInit {
  // Servicios
  private productService = inject(ProductService);
  private posService = inject(PosService);

  // Datos
  products: Product[] = [];
  customers: Customer[] = [];
  
  // Estado del Carrito
  cart: any[] = [];
  selectedCustomerId: string = '';
  totalLocal: number = 0;
  
  // Mensaje de éxito/ticket
  lastTicket: any = null;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Cargar productos
    this.productService.getProducts().subscribe(data => this.products = data);
    // Cargar clientes
    this.posService.getCustomers().subscribe(data => this.customers = data);
  }

  addToCart(product: Product) {
    // Verificar si ya está en el carrito
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

    // Armar el objeto que pide el Backend (ver contrato API)
    const saleRequest = {
      customerId: this.selectedCustomerId || null, // Si está vacío, manda null
      items: this.cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    // Enviar al backend
    this.posService.createSale(saleRequest).subscribe({
      next: (response) => {
        console.log('Venta exitosa:', response);
        this.lastTicket = response; // Guardamos respuesta para mostrar ticket
        this.cart = []; // Limpiar carrito
        this.totalLocal = 0;
        this.selectedCustomerId = '';
        this.loadData(); // Recargar productos (para actualizar stock visualmente)
      },
      error: (err) => {
        alert('Error en la venta: ' + (err.error.error || 'Desconocido'));
        console.error(err);
      }
    });
  }
}