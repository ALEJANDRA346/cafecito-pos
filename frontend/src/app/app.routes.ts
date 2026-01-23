import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PosComponent } from './components/pos/pos.component';
import { authGuard } from './guards/auth.guard'; // <--- 1. Importar al guardia

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  
  { 
    path: '', 
    component: PosComponent,
    canActivate: [authGuard] // <--- 2. ¡Aquí ponemos al guardia! 🛡️
  },

  { path: '**', redirectTo: '' }
];