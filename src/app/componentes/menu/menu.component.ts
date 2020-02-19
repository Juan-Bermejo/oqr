import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  menu_opt:Array<any>;
  role:string= "";

  constructor(private menuSrv: MenuService) {

   }


  ngOnInit() {
   this.menu_opt = this.menuSrv.getMenuOpt(this.role);
  }

}
