import { Injectable } from '@angular/core';
import { menu_opt } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
public menu_opt = menu_opt;
  constructor() { }

  getMenuOpt(role:string)
  {
    return this.menu_opt;
  }
}
