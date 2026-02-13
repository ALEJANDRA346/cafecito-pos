import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PosService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl; 

  // --- CLIENTES (Con traducción snake_case -> camelCase) ---
  getCustomers(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/customers`).pipe(
      map(response => {
        // El API devuelve { data: [...], total: ... }
        return response.data.map((item: any) => ({
          _id: item.id,
          name: item.name,
          email: item.phone_or_email, 
          purchasesCount: item.purchases_count 
        }));
      })
    );
  }

  createCustomer(data: any): Observable<any> {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone
    };
    return this.http.post(`${this.apiUrl}/customers`, payload);
  }

  // --- VENTAS (Crear) ---
  createSale(saleData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sales`, saleData).pipe(
      map(res => {
        return {
            ...res,
            ticket: {
                ...res.ticket,
                discountPercent: res.discount_percent, 
                discountAmount: res.discount_amount
            }
        };
      })
    );
  }

  // --- HISTORIAL (Esta es la que faltaba) ---
  getSales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sales`).pipe(
      map(sales => sales.map(sale => ({
        // Mapeamos lo que devuelve el backend nuevo al formato viejo del front
        _id: sale.sale_id,
        total: sale.total,
        createdAt: sale.created_at,
        customerName: sale.customer_name
      })))
    );
  }
}