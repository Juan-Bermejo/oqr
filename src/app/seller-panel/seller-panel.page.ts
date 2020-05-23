import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

import { DbService } from '../services/db.service';
import { User } from '../clases/user';
import { AddProductPage } from '../modals/add-product/add-product.page';
import { Seller } from '../clases/seller';
import { Location } from '../clases/location';
import { NewSellerComponent } from '../componentes/new-seller/new-seller.component';
import { NavParamsService } from '../services/nav-params.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-seller-panel',
  templateUrl: './seller-panel.page.html',
  styleUrls: ['./seller-panel.page.scss'],
  providers: [DbService]
})
export class SellerPanelPage implements OnInit {

  public user_data: User;
  seller:Seller

cuit:number;
category:string;
shop_name:string;
  public name: string = '';
  public user_name: string = '';
  userLocation:string[];

  constructor(private navCtrl: NavController,
    private modalctrl: ModalController,
              private dbService: DbService,
              private tokenSrv: TokenService,
            private navParams: NavParamsService) 
            {

                this.seller= new Seller();
                this.user_data=this.tokenSrv.GetPayLoad().doc;

                this.dbService.checkIsVendor(this.user_data._id).subscribe((data:any)=>
              {
                console.log(data)
                this.seller= data.vendor_data;
              })

                this.seller.owner=this.user_data._id;

                this.dbService.getLocation(this.user_data._id).subscribe((locs:any)=>
              { console.log(locs)
                this.userLocation= locs.location_data.map((loc:any) => {
                 return loc._id;
                });
              })
                
   }

  goTo(path:string)
  {
    this.navCtrl.navigateRoot(path);
  }

  saveSeller()
  {
    this.user_data.role="seller";
   
    this.seller.category=this.category;
    this.seller.cuit= this.cuit;
   // this.seller.location= this.userLocation;
    this.seller.shop_name= this.shop_name;
    
console.log(this.seller);
    this.dbService.addVendor(this.seller).subscribe((data)=>{
      console.log(data)
    })
  }

  ngOnInit() {

  }

  async dataModal()
  {
    const modal = await this.modalctrl.create({
      component: NewSellerComponent,

      cssClass:"modal",
      componentProps:
      {
        "seller":this.seller
      }

      
    });
     modal.present();
     modal.onDidDismiss().then((data)=>{
      
    })
  }

  ionViewWillEnter(){
    this.user_data = JSON.parse(localStorage.getItem("user_data"));

    this.name = this.user_data.name;
    this.user_name = this.user_data.user_name;
  }





}
