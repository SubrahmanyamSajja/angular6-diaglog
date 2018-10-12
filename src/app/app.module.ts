import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Route} from '@angular/router';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersListComponent } from './users-list/users-list.component';
import { DialogModule } from './dialog/dialog.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
const appRoutes:Route[]=[
  {
    path:'',
    redirectTo:'dashboard',
    pathMatch:'full',
  },
  {
    path:'dashboard',
    component:DashboardComponent
  },
  {
    path:'users',
    component:UsersListComponent
  },
  {
    path:'employees',
    component:EmployeeListComponent
  },


];
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UsersListComponent,
    EmployeeListComponent
  ],
  imports: [
    BrowserModule,
    DialogModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
  ], 
  bootstrap: [AppComponent]
})
export class AppModule { }
