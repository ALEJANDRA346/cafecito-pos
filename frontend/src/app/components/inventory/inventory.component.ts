import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para los inputs
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  private productService = inject(ProductService);

  products: Product[] = [];
  
  // Variables para el formulario
  showForm = false;
  isEditing = false;
  currentProduct: any = { name: '', price: 0, stock: 0 }; // Modelo temporal

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => this.products = data);
  }

  // --- ACCIONES DE BOTONES ---

  openCreateForm() {
    this.isEditing = false;
    this.currentProduct = { name: '', price: 0, stock: 0 }; // Limpiar formulario
    this.showForm = true;
  }

  openEditForm(product: Product) {
    this.isEditing = true;
    this.currentProduct = { ...product }; // Copia para no modificar la tabla en vivo
    this.showForm = true;
  }

  deleteProduct(id: string) {
    if (confirm('¿Estás seguro de borrar este producto?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts(); // Recargar lista
      });
    }
  }

  saveProduct() {
    if (this.isEditing) {
      // EDITAR
      this.productService.updateProduct(this.currentProduct._id, this.currentProduct).subscribe(() => {
        this.closeForm();
        this.loadProducts();
      });
    } else {
      // CREAR
      this.productService.createProduct(this.currentProduct).subscribe(() => {
        this.closeForm();
        this.loadProducts();
      });
    }
  }

  closeForm() {
    this.showForm = false;
  }
}