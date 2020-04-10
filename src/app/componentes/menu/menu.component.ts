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
  is_logged:boolean=false;
  is_seller: boolean=false;

  constructor(private menuSrv:MenuService,private tokenServ: TokenService, private dbService:DbService, private navCtrl: NavController) {
    

  }

   getIs_logged()
  {
     this.dbService.getLogged$().subscribe((data:any)=>
    {
      this.is_logged=data;
    })
  }

   getIs_seller()
  {
     this.dbService.getIsSeller$().subscribe((data)=>{
   
     this.is_seller=data;

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
     
    this.getIs_logged();
    this.getIs_seller();

    if(localStorage.getItem("token")){
    
     this.dbService.setLogged(true);

      localStorage.setItem("user_data", JSON.stringify(this.tokenServ.GetPayLoad().doc));

      this.dbService.checkIsVendor(this.tokenServ.GetPayLoad().doc._id).subscribe((dataSeller:any)=>
      { 
        if(dataSeller.vendor_data._id)
        {
          this.dbService.setIsSeller$(true);
          
        }
        else{
          this.dbService.setIsSeller$(false);
        }
        
      })
      
    }
    else {
      this.dbService.setLogged(false);
      this.dbService.setIsSeller$(false)
    }

    
  }

 







}
