import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para pipes de fecha y moneda
import { RouterLink } from '@angular/router';
import { PosService } from '../../services/pos.service';

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sales-history.component.html', // <--- Apunta al archivo HTML
  styleUrl: './sales-history.component.css'      // <--- Apunta al archivo CSS
})
export class SalesHistoryComponent implements OnInit {
  private posService = inject(PosService);
  
  sales: any[] = [];

  ngOnInit() {
    this.posService.getSales().subscribe({
      next: (data: any[]) => { // Tipado explícito para evitar error
        this.sales = data;
      },
      error: (err: any) => {   // Tipado explícito
        console.error('Error al cargar historial', err);
      }
    });
  }
}