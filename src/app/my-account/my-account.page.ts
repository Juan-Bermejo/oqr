import { Component, OnInit } from '@angular/core';
import { User } from '../clases/user';
import { DbService } from '../services/db.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {

  user:User;
  public is_seller:boolean=false;

  constructor(private dbService: DbService, private navCtrl: NavController) {

    this.getIs_seller();

    this.user= JSON.parse(localStorage.getItem("user_data")) ;
  
 
   }

   getIs_seller()
   {
    this.dbService.getIsSeller$().subscribe((data)=>{
    
      this.is_seller=data;
      console.log(data)
    });
   }

   toSeller()
   {

    
     if(!this.is_seller)
     {
      this.navCtrl.navigateRoot("seller-panel");
     }
     else
     {
       this.is_seller=false;
       this.dbService.setIsSeller$(this.is_seller);
     }
     
   }

  ngOnInit() {
  }

}
