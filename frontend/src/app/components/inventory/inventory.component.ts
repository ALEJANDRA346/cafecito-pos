import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // <--- IMPORTANTE
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // <--- ReactiveFormsModule AQUÍ
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder); // <--- Inyectamos el constructor de formularios

  products: Product[] = [];
  productForm: FormGroup; // <--- Nuestro formulario reactivo
  showForm = false;
  isEditing = false;
  currentId: string | null = null; // Para saber qué ID estamos editando

  constructor() {
    // Definimos las reglas del juego (Validadores)
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // Mínimo 3 letras
      price: [null, [Validators.required, Validators.min(0.5)]], // Mínimo 50 centavos
      stock: [0, [Validators.required, Validators.min(0)]]       // No negativos
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error(err)
    });
  }

  // --- GETTERS (Para que el HTML sea más limpio) ---
  // Nos ayuda a saber si un campo específico tiene error y fue "tocado" por el usuario
  hasError(field: string, errorType: string) {
    const control = this.productForm.get(field);
    return control?.hasError(errorType) && control?.touched;
  }

  openCreateForm() {
    this.isEditing = false;
    this.currentId = null;
    this.productForm.reset({ stock: 0 }); // Limpiamos y dejamos stock en 0 por defecto
    this.showForm = true;
  }

  openEditForm(product: Product) {
    this.isEditing = true;
    this.currentId = product._id || null;
    // Llenamos el formulario con los datos del producto (patchValue es mágico)
    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      stock: product.stock
    });
    this.showForm = true;
  }

  deleteProduct(id: string) {
    if (confirm('¿Borrar producto?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }

  saveProduct() {
    console.log('1. Click detectado en Guardar');

    // Revisar validez
    if (this.productForm.invalid) {
      console.log('2. ❌ El formulario es INVÁLIDO. Errores:', this.productForm.errors);
      
      // Vamos a ver qué campo falla específicamente
      Object.keys(this.productForm.controls).forEach(key => {
        const errors = this.productForm.get(key)?.errors;
        if (errors) {
          console.log(`   - Campo '${key}' tiene errores:`, errors);
        }
      });
      
      this.productForm.markAllAsTouched();
      return;
    }

    console.log('3. ✅ Formulario Válido. Datos a enviar:', this.productForm.value);

    const productData = this.productForm.value;

    if (this.isEditing && this.currentId) {
      console.log('4. Intentando EDITAR producto...');
      this.productService.updateProduct(this.currentId, productData).subscribe({
        next: (res) => {
          console.log('5. ✅ Éxito al Editar:', res);
          this.closeForm();
          this.loadProducts();
        },
        error: (err) => console.error('5. ❌ Error al Editar:', err)
      });
    } else {
      console.log('4. Intentando CREAR producto...');
      this.productService.createProduct(productData).subscribe({
        next: (res) => {
          console.log('5. ✅ Éxito al Crear:', res);
          this.closeForm();
          this.loadProducts();
        },
        error: (err) => console.error('5. ❌ Error al Crear:', err)
      });
    }
  }

  closeForm() {
    this.showForm = false;
  }
}