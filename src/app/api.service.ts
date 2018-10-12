import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  gotData:EventEmitter<any>=new EventEmitter<any>();
  
  constructor() { }
}
