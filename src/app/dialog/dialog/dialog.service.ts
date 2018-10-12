import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable()
export class DialogService {
  open:EventEmitter<any>=new EventEmitter<any>();
  close:EventEmitter<any>=new EventEmitter<any>();
  minimize:EventEmitter<any>=new EventEmitter<any>();
  maximize:EventEmitter<any>=new EventEmitter<any>();
  dialogClose:EventEmitter<any>=new EventEmitter<any>();
  _alert:EventEmitter<any>=new EventEmitter<any>();
  _confirm:EventEmitter<any>=new EventEmitter<any>();
  alertAnswer:Subject<any>=new Subject<any>();
  confirmAnswer:Subject<any>=new Subject<any>();

  constructor(){

  }

  alert(options={}):Observable<any>{
    let o=new Subject<any>();
    this._alert.emit({options:options,subject:o});
    return o;
  }

  confirm(options={}){
    let o=new Subject<any>();
    this._confirm.emit({options:options,subject:o});
    return o;
  }

  show(content:any,options={}){
    this.open.emit({component:content,options:options});
  }

  hide(content:any){
    this.close.emit(content);
  }
  
}
