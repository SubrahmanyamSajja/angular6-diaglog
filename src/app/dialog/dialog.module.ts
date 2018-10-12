import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';
import { DialogsComponent } from './dialog/dialog.component';
import { DialogService } from './dialog/dialog.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ModalDialogComponent,
    DialogsComponent
  ],
  exports:[
    DialogsComponent,
    ModalDialogComponent,
  ],
  providers:[
    DialogService
  ]
})
export class DialogModule { }
