import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs'; // Importamos 'map'
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        // El API nuevo devuelve { data: [...], total: ... }
        // Nosotros solo queremos el array 'data'
        return response.data.map((item: any) => ({
          _id: item.id,        // API usa 'id', Angular usa '_id'
          name: item.name,
          price: item.price,
          stock: item.stock,
          createdAt: item.created_at // Convertimos snake_case
        }));
      })
    );
  }

  createProduct(product: any): Observable<Product> {
    return this.http.post<any>(this.apiUrl, product).pipe(
      map(item => ({
        _id: item.id,
        name: item.name,
        price: item.price,
        stock: item.stock
      }))
    );
  }

  updateProduct(id: string, product: any): Observable<Product> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product).pipe(
        map(item => ({
            _id: item.id,
            name: item.name,
            price: item.price,
            stock: item.stock
        }))
    );
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}