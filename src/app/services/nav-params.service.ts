import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavParamsService {

  myParams: any;
  param:any;
  constructor() { }

  set SetParam(l) {
    this.myParams = l;
  }

  get GetParam() {
    const t = this.myParams;
    this.myParams = undefined;
    return t;
  }
}
