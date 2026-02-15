import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  products: Product[] = [];
  productForm: FormGroup;
  showForm = false;
  isEditing = false;
  currentId: string | null = null;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [null, [Validators.required, Validators.min(0.5)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        // 🕵️ LOG 1: VERIFICAR QUÉ LLEGA DE LA API
        console.log('📊 1. DATOS RECIBIDOS EN COMPONENTE:', data);
        if (data.length > 0) {
            console.log('   Ejemplo del primer producto:', data[0]);
            // Verificamos explícitamente las llaves para saber cuál usar
            console.log('   ¿Tiene _id?', data[0]._id);
            // Casteamos a any para preguntar por 'id' aunque la interfaz no lo tenga definido
            console.log('   ¿Tiene id?', (data[0] as any).id);
        }
        this.products = data;
      },
      error: (err) => console.error('❌ Error cargando productos:', err)
    });
  }

  // --- GETTERS ---
  hasError(field: string, errorType: string) {
    const control = this.productForm.get(field);
    return control?.hasError(errorType) && control?.touched;
  }

  openCreateForm() {
    this.isEditing = false;
    this.currentId = null;
    this.productForm.reset({ stock: 0 });
    this.showForm = true;
  }

  openEditForm(product: Product) {
    // 🕵️ LOG 2: VERIFICAR EL BOTÓN EDITAR
    console.log('✏️ 2. CLICK EN EDITAR. Producto recibido:', product);
    
    this.isEditing = true;
    
    // Intentamos capturar el ID de cualquiera de las dos formas
    this.currentId = product._id || (product as any).id || null;
    console.log('   🆔 ID capturado para edición:', this.currentId);

    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      stock: product.stock
    });
    this.showForm = true;
  }

  deleteProduct(id: string) {
    // 🕵️ LOG 3: VERIFICAR EL BOTÓN BORRAR
    console.log('🗑️ 3. CLICK EN BORRAR. ID recibido:', id);

    if (!id || id === 'undefined') {
        console.error('🔴 ERROR CRÍTICO: El ID está vacío. El HTML no está enviando el dato correcto.');
        alert('Error: No se puede borrar, ID no encontrado.');
        return;
    }

    if (confirm('¿Borrar producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
            console.log('✅ Eliminado con éxito');
            this.loadProducts();
        },
        error: (err) => console.error('❌ Error al eliminar:', err)
      });
    }
  }

  saveProduct() {
    console.log('💾 Click en Guardar detectado');

    if (this.productForm.invalid) {
      console.log('❌ El formulario es INVÁLIDO. Errores:', this.productForm.errors);
      Object.keys(this.productForm.controls).forEach(key => {
        const errors = this.productForm.get(key)?.errors;
        if (errors) {
          console.log(`   - Campo '${key}' tiene errores:`, errors);
        }
      });
      this.productForm.markAllAsTouched();
      return;
    }

    console.log('✅ Formulario Válido. Datos:', this.productForm.value);
    const productData = this.productForm.value;

    if (this.isEditing && this.currentId) {
      console.log(`🔄 Intentando ACTUALIZAR ID: ${this.currentId}`);
      this.productService.updateProduct(this.currentId, productData).subscribe({
        next: (res) => {
          console.log('✅ Éxito al Editar:', res);
          this.closeForm();
          this.loadProducts();
        },
        error: (err) => console.error('❌ Error al Editar:', err)
      });
    } else {
      console.log('✨ Intentando CREAR nuevo producto...');
      this.productService.createProduct(productData).subscribe({
        next: (res) => {
          console.log('✅ Éxito al Crear:', res);
          this.closeForm();
          this.loadProducts();
        },
        error: (err) => console.error('❌ Error al Crear:', err)
      });
    }
  }

  closeForm() {
    this.showForm = false;
  }
}