import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Para el botón de "Volver"
import { PosService } from '../../services/pos.service';

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sales-history.component.html',
  styleUrl: './sales-history.component.css'
})
export class SalesHistoryComponent implements OnInit {
  private posService = inject(PosService);
  
  sales: any[] = [];
  loading = true;

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.posService.getSales().subscribe({
      next: (data: any[]) => { // <--- AQUÍ
        this.sales = data;
      },
      error: (err: any) => {   // <--- Y AQUÍ
        console.error('Error al cargar historial', err);
      }
    });
  }
}