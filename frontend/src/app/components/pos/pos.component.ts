import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { PosService } from '../../services/pos.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.css'
})
export class PosComponent implements OnInit {
  private productService = inject(ProductService);
  private posService = inject(PosService);
  private authService = inject(AuthService);
  private router = inject(Router);

  products: Product[] = [];
  customers: Customer[] = [];
  currentUser: any = null;
  
  cart: any[] = [];
  selectedCustomerId: string = '';
  totalLocal: number = 0;
  
  lastTicket: any = null;

  // --- NUEVO: Variable para el buscador ---
  searchText: string = '';

  ngOnInit() {
    this.loadData();
    this.currentUser = this.authService.getUser();
  }

  loadData() {
    this.productService.getProducts().subscribe(data => this.products = data);
    this.posService.getCustomers().subscribe(data => this.customers = data);
  }

  // --- NUEVO: Lógica del Filtro Mágico ---
  get filteredProducts() {
    // 1. Si no hay texto, devolvemos todo el menú
    if (!this.searchText.trim()) {
      return this.products;
    }
    
    // 2. Si hay texto, filtramos (ignorando mayúsculas)
    const search = this.searchText.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(search)
    );
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
        this.lastTicket = response;
        this.cart = [];
        this.totalLocal = 0;
        this.selectedCustomerId = '';
        this.loadData(); // Recargamos para actualizar stock y puntos del cliente
      },
      error: (err) => {
        alert('Error: ' + (err.error.error || 'Desconocido'));
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToHistory() {
    this.router.navigate(['/history']);
  }
}