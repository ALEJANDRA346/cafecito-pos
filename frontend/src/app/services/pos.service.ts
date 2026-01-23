import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PosService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Traer clientes para el selector
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers`);
  }

  // --- NUEVO: Crear Cliente ---
  createCustomer(customerData: any): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/customers`, customerData);
  }

  // Enviar la venta al backend
  createSale(saleData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sales`, saleData);
  }

  getSales(): Observable<any> {
  return this.http.get(`${this.apiUrl}/sales`);
}
}

