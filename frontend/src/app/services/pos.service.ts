import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class PosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/api';

  // Traer clientes para el selector
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers`);
  }

  // Enviar la venta al backend
  createSale(saleData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sales`, saleData);
  }

  getSales(): Observable<any> {
  return this.http.get(`${this.apiUrl}/sales`);
}
}

