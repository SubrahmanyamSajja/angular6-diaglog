import { Component } from '@angular/core';
import { DialogService } from './dialog/dialog/dialog.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersListComponent } from './users-list/users-list.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  entryComponents: [DashboardComponent, UsersListComponent, EmployeeListComponent]
})
export class AppComponent {
  title = 'new1';
  sampleEmployees1 = ['Karthi', 'Thanush', 'Manju', 'Kavitha', 'Mohan Rao', 'Vimala'];
  sampleEmployees = ['Subbu', 'Neeraja', ...this.sampleEmployees1];
  answer: any;
  alertAns:any;
  constructor(private dialogService: DialogService, private api: ApiService) {

  }
  open(no) {
    switch (no) {
      case 1:
        this.dialogService.show(DashboardComponent);
        break;
      case 2:
        this.dialogService.show(UsersListComponent);
        break;
      case 3:
        this.dialogService.show(EmployeeListComponent, { heading: 'Employees List', id: 'EMP001', width: 450, height: 250, data: this.sampleEmployees1 });
        break;
    }
  }
  confirm() {
    this.dialogService.confirm({ heading: 'Test Confirmation', message: 'hello <strong>Test Html</strong> Messahe' }).subscribe((res) => {
      this.answer = res;

    })
  }
  alert() {
    this.dialogService.alert({ heading: 'Test Confirmation', message: 'hello <strong>Test Html</strong> Messahe' }).subscribe((res) => {
      this.alertAns = res;

    })
  }
  send() {
    this.api.gotData.emit(this.sampleEmployees);
  }
}
