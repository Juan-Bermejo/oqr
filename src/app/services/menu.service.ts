import { Injectable } from '@angular/core';
import { menu_opt, menu_opt_logged } from '../../environments/environment';
import { DbService } from '../services/db.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

public menu_opt = menu_opt;
public menu_opt_logged = menu_opt_logged;
public menu_data = menu_opt;
  constructor(private dbService: DbService) { }

  getMenuOpt(set: boolean)
  {
    if(set == true){
      this.menu_data = this.menu_opt_logged;
    }
    else{
      this.menu_data = this.menu_opt;
    }
    
  }
}
