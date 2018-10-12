import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { DialogService } from './dialog.service';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialog.component.html',
  entryComponents: [ModalDialogComponent],
})
export class DialogsComponent implements OnInit {
  @ViewChild('dialogs', { read: ViewContainerRef }) dialogs: ViewContainerRef;
  openedDialogs: any[] = [];
  activeDialogs:any=[];
  confirmation:boolean=false;
  constructor(private dialogService: DialogService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef) {
    this.dialogService.close.subscribe((component) => {
    })

    this.dialogService.open.subscribe((data) => {
      let exist=this.checkExist(data.options);
      let override=false;
      if(!exist){
        this._openDialog(data);
      } else {
        if(this.confirmation){
          this.dialogService.confirm({message:'Same Dialog alreay exist. Are you want open again?'}).subscribe(res=>{
            if(res){
              this._openDialog(data);
              this.activeDialogs.push(data.options.id);
            }
          });
        } else {
          this.checkMinimize(data.options);
        }
      }
    });
    this.dialogService.minimize.subscribe((dialog) => {
      this.openedDialogs.push(dialog);
    });
    this.dialogService.dialogClose.subscribe((dialogId)=>{
      if(dialogId!=null && this.activeDialogs.indexOf(dialogId)>=0){
          this.activeDialogs.splice(this.activeDialogs.indexOf(dialogId),1);
      }
    });
    

    this.dialogService._alert.subscribe((data)=>{
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(ModalDialogComponent);
      let componentRef = this.dialogs.createComponent(componentFactory);
      (<ModalDialogComponent>componentRef.instance).alert(componentRef,data);
    });
    this.dialogService._confirm.subscribe((data)=>{
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(ModalDialogComponent);
      let componentRef = this.dialogs.createComponent(componentFactory);
      (<ModalDialogComponent>componentRef.instance).confirm(componentRef,data);
    });
  }

  _openDialog(data){
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(ModalDialogComponent);
    let componentRef = this.dialogs.createComponent(componentFactory);
    (<ModalDialogComponent>componentRef.instance).show(data.component, componentRef, data.options);
  }

  hide(ind) {
    this.openedDialogs[ind].ref.hide();
    this.openedDialogs.splice(ind, 1);
  }

  maximize(ind) {
    this.openedDialogs[ind].ref.maximize();
    this.openedDialogs.splice(ind, 1);
  }
  minimize(ind) {
    this.openedDialogs[ind].ref.minimize();
    this.openedDialogs.splice(ind, 1);
  }
  ngOnInit() {
  }
  checkExist(data) {
    let result =  false;
    if (data.id) {
      result=(this.activeDialogs.indexOf(data.id)>=0);
      if(!result){
        this.activeDialogs.push(data.id);
      }
    }
    return result;
  }
  checkMinimize(data) {
    this.openedDialogs.forEach((dialog,i)=>{
      if(dialog.ref.defaultOptions.id==data.id){
        this.minimize(i);
      }
    });
  }
}
