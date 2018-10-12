import { Component, OnInit, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { ApiService } from '../api.service';
import { DialogService } from '../dialog/dialog/dialog.service';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-employee-list',
  template: `
    <p>
      employee-list works!
    </p>
    <button (click)="openDashboard()">Dashboard</button>
    <table>
    <tr *ngFor="let row of data;let ind=index;">
      <td>{{ind+1}}</td>
      <td>{{row}}</td>
      <td><a (click)="delete()">delete</a></td>
    </tr></table>
  `,
  styles: []
})
export class EmployeeListComponent implements OnInit {
  data=[];

  constructor(private api:ApiService,private dialog:DialogService) { }

  ngOnInit() {
      this.api.gotData.subscribe(res=>{
        this.data=res;
      })
  }

  openDashboard(){
    this.dialog.show(DashboardComponent,{heading:'Sample Head',width:500,height:400,id:'santhu'});
  }
  delete(){
    this.dialog.confirm().subscribe(res=>{
        if(res){
          alert('Hi');
        }
    });
  }
}
