import { Component, OnInit, Input, ElementRef, Renderer2, OnDestroy, AfterViewInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, Output, EventEmitter, ViewEncapsulation, HostListener } from '@angular/core';
import { DialogService } from '../dialog/dialog.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls:['./modal-dialog.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ModalDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('content', {read: ViewContainerRef}) container: ViewContainerRef;

  @HostListener('document:mousedown', ['$event.target'])
  public onClick(targetElement) {
    this.clickInSide = this.ele.nativeElement.contains(targetElement);
  }
  isCollapsed: boolean = false;
  isMaxmised: boolean = false;
  isMinimized: boolean = false;
  isVisible: boolean = false;

  element: any;
  mouseDownMoveHandle: any = () => { };
  mouseDownResizeHandle: any = () => { };
  mouseUpHandle: any = () => { };
  mouseMoveHandle: any = () => { };
  x: number;
  y: number;
  startX: number;
  startY: number;
  maxWidth:number;
  maxHeight:number;
  mouseDown: boolean = false;
  mode: string = 'MOVE';
  initWidth: number;
  initHeight: number;
  restoreSettings: any = {};
  parentRef:any;
  clickInSide:boolean=true;
  blinkMe:boolean=false;
  defaultOptions:any={
      width:530,
      height:175,
      heading:'Dialog',
      id:null,
      buttons:[
        {text:'Ok',cssClass:'btn btn-primary',value:true},
        {text:'Yes',cssClass:'btn btn-primary',value:true},
        {text:'No',cssClass:'btn btn-default',value:false}
    ]
  }
  defaultAlertOptions:any={
    width:530,
    height:175,
    heading:'Alert',
    id:null,
    message:'Sample Message',
    buttons:[
      {text:'Ok',cssClass:'btn btn-primary',value:true},
    ]
  };
  defaultConfirmOptions:any={
    width:530,
    height:175,
    heading:'Confirmation',
    id:null,
    message:'Sample Message',
    buttons:[
      {text:'Yes',cssClass:'btn btn-primary',value:true},
      {text:'No',cssClass:'btn btn-default',value:false}
    ]
  };
  dialogMode:string='dialog';
  subject:any;
  arrivedOptions:any={};
  constructor(private renderer: Renderer2, private ele: ElementRef,private cfr:ComponentFactoryResolver,private service:DialogService,protected sanitizer: DomSanitizer) {
  }

  ngOnInit() {
      this.maxWidth=window.innerWidth;
      this.maxHeight=window.innerHeight;
  }
  send(btn){
    this.subject.next(btn.value);
    this.hide();
  }

  alert(parentRef:any,data:any){
    this.subject=data.subject;
    this.parentRef=parentRef;
    this.defaultOptions=Object.assign(this.defaultAlertOptions,data.options);
    this.dialogMode='alert';
    setTimeout(()=>{ this.ngAfterViewInit(); this.restore(); },5);
  }

  confirm(parentRef:any,data:any){
    this.subject=data.subject;
    this.parentRef=parentRef;
    this.defaultOptions=Object.assign(this.defaultConfirmOptions,data.options);
    this.dialogMode='confirm';
    setTimeout(()=>{ this.ngAfterViewInit(); this.restore(); },5);
  }

  show(component:any,parentRef:any,options=this.defaultOptions){
    this.parentRef=parentRef;
    this.arrivedOptions=Object.assign({},options);
    let componentFactory = this.cfr.resolveComponentFactory(component);
    let componentRef = this.container.createComponent(componentFactory);
    let instance=componentRef.instance;
    let defKeys=Object.keys(this.defaultOptions);
    Object.keys(options).forEach((k)=>{
        if(defKeys.indexOf(k)>=0){
          this.defaultOptions[k]=((k=='message')?this.sanitizer.bypassSecurityTrustHtml(options[k]):options[k]);
        } else {
          instance[k]=options[k];
        }
    })
    this.isVisible = true;
    setTimeout(()=>{ this.ngAfterViewInit(); this.restore(); },10);
  }

  hide() {
    this.isVisible = false;
    setTimeout(()=>{this.ngOnDestroy()},100);
    this.service.dialogClose.emit(this.defaultOptions.id);
    if(this.parentRef && this.parentRef.destroy){
      this.parentRef.destroy();
    }
    //this.escapeHandler();
  }
  setCenter(){

  }
  blink(){
    this.blinkMe=true;
    setTimeout(()=>{this.blinkMe=false;},500);
  }
  restore() {
    this.isMaxmised = false;
    this.isMinimized = false;
    this.element.style.width = this.defaultOptions.width + 'px';
    this.element.style.height = this.defaultOptions.height + 'px';
    let y=(window.innerHeight-this.defaultOptions.height)/2;
    let x=(window.innerWidth-this.defaultOptions.width)/2; 
    this.element.style.top =  y+'px';
    this.element.style.left = x+'px';
  }
  maximize() {
    this.isMinimized = false;
    this.isMaxmised = !this.isMaxmised;
  }
  minimize() {
    this.isMaxmised = false;
    this.isMinimized = !this.isMinimized;
    if(this.isMinimized ){
      this.service.minimize.emit({ref:this.parentRef.instance,isMinimized:this.isMinimized, heading:this.defaultOptions.heading});
    }
  }
  saveOffsets() {
    this.restoreSettings.left = this.element.clientX;
    this.restoreSettings.top = this.element.clientY;
    this.restoreSettings.width = this.element.clientWidth;
    this.restoreSettings.height = this.element.clientHeight;
  }

  ngAfterViewInit() {
    this.element = this.ele.nativeElement.querySelector('.ui-dialog');
    if (this.element) {
      let moveHandle = this.element.querySelector('.ui-dialog-title');
      if(moveHandle!=null){
        this.mouseDownMoveHandle = this.renderer.listen(moveHandle, 'mousedown', (event) => { this.mode = 'MOVE'; this.handleDown(event); });
      }
      let resizeHandle = this.element.querySelector('.resize');
      if(resizeHandle!=null){
        this.mouseDownResizeHandle = this.renderer.listen(resizeHandle, 'mousedown', (event) => { this.mode = 'RESIZE'; this.handleDown(event); });
      }
    }
  }


  handleDown($event) {
    this.mouseUpHandle();
    this.mouseMoveHandle();
    this.initWidth = this.element.clientWidth;
    this.initHeight = this.element.clientHeight;

    let x = parseInt(this.element.offsetLeft);
    x = (isNaN(x) ? 0 : x);
    let y = parseInt(this.element.offsetTop);
    y = (isNaN(y) ? 0 : y);
    this.mouseDown = true;
    event.preventDefault();
    if (this.mode == "MOVE") {
      this.startX = $event.screenX - x;
      this.startY = $event.screenY - y;
    } else {
      this.startX = $event.clientX;
      this.startY = $event.clientY;
    }
    this.mouseUpHandle = this.renderer.listen('document', 'mouseup', (event) => { this.handleUp(event) });
    this.mouseMoveHandle = this.renderer.listen('document', 'mousemove', (event) => { this.handleMove(event) });
  }


  handleMove($event) {
    if (this.mouseDown) {
      if (this.mode == 'MOVE') {
        this.x = $event.screenX - this.startX;
        this.y = $event.screenY - this.startY;
        let allowedHeight=this.maxHeight-this.initHeight-3;
        let allowedWidth=this.maxWidth-this.initWidth-3;
        this.element.style.top = ((this.y < 1) ? 1 : ((this.y<allowedHeight)?this.y:allowedHeight)) + 'px';
        this.element.style.left = ((this.x < 1) ? 1 : ((this.x<allowedWidth)?this.x:allowedWidth)) + 'px';
      } else {
        let newWidth = this.initWidth + ($event.clientX - this.startX);
        newWidth = newWidth > 110 ? newWidth : 110;
        let newHeight = this.initHeight + ($event.clientY - this.startY);
        newHeight = newHeight > 50 ? newHeight : 50;
        this.element.style.width = newWidth + 'px';
        this.element.style.height = newHeight + 'px';
      }
    }
  }

  handleUp($event) {
    this.mouseDown = false;
    this.mouseUpHandle();
    this.mouseMoveHandle();
  }
  ngOnDestroy() {
    this.mouseDownMoveHandle();
    this.mouseDownResizeHandle();
    this.handleUp(null);
  }
}
