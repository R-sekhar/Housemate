import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Auth
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { AuthGuard } from './core/auth.guard';

// House
import { CreateHouseComponent } from './features/house/create-house/create-house.component';


// Dashboard, Inventory, Expenses
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { InventoryComponent } from './features/inventory/inventory.component';
import { ExpensesComponent } from './features/expenses/expenses.component';



const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'create-house', component: CreateHouseComponent },
  
  { path: 'inventory', component: InventoryComponent },
  { path: 'expenses', component: ExpensesComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
