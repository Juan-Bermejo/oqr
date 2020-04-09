import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { DbService } from '../../services/db.service';
import { NavController } from '@ionic/angular';
import { TokenService } from '../../services/token.service';

 
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

  constructor(private menuSrv:MenuService,private tokenServ: TokenService, private dbService:DbService, private navCtrl: NavController) {

    if(localStorage.getItem("token")){
      this.dbService.is_logged = true;
      console.log("el boludo entro")
      localStorage.setItem("user_data", JSON.stringify(this.tokenServ.GetPayLoad().doc));
    }
    else {
      this.dbService.is_logged = false;
    }

    
   

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
    localStorage.removeItem("token");

    this.navCtrl.navigateRoot("login").then(()=>
  {
    this.dbService.setLogged(false);
    this.dbService.setIsSeller$(false);
  })
    

  }

  ngOnInit() {
    this.dbService.getLogged$().subscribe((data)=>{
      if(data==true)
      {
        this.is_logged=true;
      }
      else{
        this.is_logged=false;
      }
      //this.is_logged=data;
      console.log("is logged menu: ", this.is_logged);
    })
  
     this.getIs_seller();
    
  }

  /*ngAfterViewChecked(): void {
    this.menu_opt = this.menuSrv.menu_data;
  }*/
  







}
