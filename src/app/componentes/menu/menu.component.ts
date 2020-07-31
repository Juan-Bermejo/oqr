import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { DbService } from '../../services/db.service';
import { NavController, MenuController, ModalController } from '@ionic/angular';
import { TokenService } from '../../services/token.service';
import { User } from '../../clases/user';
import { LoginComponent } from '../login/login.component';

 
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
  is_influencer: boolean = false;

  constructor(private menuSrv:MenuService,
              private tokenServ: TokenService, 
              private dbService:DbService, 
              private navCtrl: NavController,
              public  menu: MenuController,
              private modalController: ModalController) {
    

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

  getIs_influencer()
  {
     this.dbService.getIsInfluencer$().subscribe((data)=>{
   
     this.is_influencer=data;

   });
  }

  async goToLogin()
{
  const modal = await this.modalController.create({
    component: LoginComponent,
    cssClass:"modal"
    
  });
   modal.present();

   modal.onDidDismiss().then((data)=>{

     
    
  })

}


  closeSession()
  { 
    this.menu.close("first").then(()=>
  {
    localStorage.removeItem("user_data");
    localStorage.removeItem("token");
    this.dbService.setLogged(false);
    this.dbService.setIsSeller$(false);
    this.dbService.setIsInfluencer$(false);

  /*  this.navCtrl.navigateRoot("login").then(()=>
  {
    this.dbService.setLogged(false);
    this.dbService.setIsSeller$(false);
    this.dbService.setIsInfluencer$(false);
    
  })*/

  })

    

  }

  ngAfterViewInit()
  {/*

    let user:User = this.tokenServ.GetPayLoad().usuario._id
    this.getIs_logged();
    this.getIs_seller();
    this.getIs_influencer();

    if(localStorage.getItem("token")){
    
     this.dbService.setLogged(true);

      localStorage.setItem("user_data", JSON.stringify(this.tokenServ.GetPayLoad().usuario));

      this.dbService.checkIsVendor(user._id).subscribe((dataSeller:any)=>
      { 
        if(dataSeller.vendor_data._id)
        {
          this.dbService.setIsSeller$(true);
          
        }
        else{
          this.dbService.setIsSeller$(false);
        }
        
      })



      this.dbService.getInfluencerByUser(user._id).subscribe((dataInfluencer:any)=>
      { 
        console.log(dataInfluencer)
        if(dataInfluencer.influencer_data)
        {
          console.log("haydata")
          this.dbService.setIsInfluencer$(true);
          
        }
        else{
          console.log("No haydata")
          this.dbService.setIsInfluencer$(false);
        }
        
      })
      
    }
    else {
      this.dbService.setLogged(false);
      this.dbService.setIsSeller$(false);
      this.dbService.setIsInfluencer$(false);
    }*/

  }

   ngOnInit() {
   
    this.getIs_logged();
    this.getIs_seller();
    this.getIs_influencer();

    if(localStorage.getItem("token")){
    
     this.dbService.setLogged(true);

     // localStorage.setItem("user_data", JSON.stringify(this.tokenServ.GetPayLoad().usuario));

      this.dbService.checkIsVendor(this.tokenServ.GetPayLoad().usuario._id).subscribe((dataSeller:any)=>
      { 
        if(dataSeller.vendor_data._id)
        {
          this.dbService.setIsSeller$(true);
          
        }
        else{
          this.dbService.setIsSeller$(false);
        }
        
      })



      this.dbService.getInfluencerByUser(this.tokenServ.GetPayLoad().usuario._id).subscribe((dataInfluencer:any)=>
      { 
        if(dataInfluencer)
        {
         
          if(dataInfluencer.ok)
          {
            this.dbService.setIsInfluencer$(true);
            
          }
          else{
            this.dbService.setIsInfluencer$(false);
          }
        }

        
      })
      
    }
    else {
      this.dbService.setLogged(false);
      this.dbService.setIsSeller$(false);
      this.dbService.setIsInfluencer$(false);
    }

    
  }

 







}
