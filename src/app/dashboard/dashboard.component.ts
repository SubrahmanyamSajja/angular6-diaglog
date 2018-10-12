import { Component, OnInit } from '@angular/core';
import { DialogService } from '../dialog/dialog/dialog.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <p>
      dashboard works!
    </p>
    <div>
    <button (click)="confirm()">Confirm</button>
    <span>Confirm : {{answer}}</span>
</div>
<div>
    <button (click)="alert()">Alert</button>
    <span>Alert : {{alertAns}}</span>
</div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  answer:any;
  alertAns:any;
  constructor(private dialogService:DialogService) { }

  ngOnInit() {
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
}
