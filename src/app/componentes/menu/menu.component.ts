import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { DbService } from '../../services/db.service';
import { NavController } from '@ionic/angular';

 
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent{

  /*menu_opt = [

  ]*/
  
  role:string= "";
  is_logged:boolean;
  is_seller: boolean=false;

  constructor(private menuSrv:MenuService, private dbService:DbService, private navCtrl: NavController) {
  this.dbService.getLogged$().subscribe((data)=>{
    this.is_logged=data;
    console.log(this.is_logged);
  })

   this.getIs_seller();
  
  
  }


  getIs_seller()
  {
   this.dbService.getIsSeller$().subscribe((data)=>{
   
     this.is_seller=data;
     console.log("la data",data)
   });
  }

  closeSession()
  { 
    localStorage.removeItem("user_data");
    this.dbService.setLogged(false);
    this.navCtrl.navigateRoot("login");
    

  }

  ngOnInit() {
  
  }

  /*ngAfterViewChecked(): void {
    this.menu_opt = this.menuSrv.menu_data;
  }*/
  







}
