import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PosComponent } from './components/pos/pos.component';
import { authGuard } from './guards/auth.guard'; // <--- 1. Importar al guardia
import { SalesHistoryComponent } from './components/sales-history/sales-history.component';
import { CreateCustomerComponent } from './components/create-customer/create-customer.component';
import { InventoryComponent } from './components/inventory/inventory.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  
  { 
    path: '', 
    component: PosComponent,
    canActivate: [authGuard] // <--- 2. ¡Aquí ponemos al guardia! 🛡️
  },

  { 
  path: 'history', 
  component: SalesHistoryComponent,
  canActivate: [authGuard] // ¡También la protegemos!
},
{ path: 'inventory', component: InventoryComponent, canActivate: [authGuard] },

    { path: 'new-customer', component: CreateCustomerComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '' }
];