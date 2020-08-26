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
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-panel',
  templateUrl: './seller-panel.page.html',
  styleUrls: ['./seller-panel.page.scss'],
  providers: [DbService]
})
export class SellerPanelPage implements OnInit {

  
  public user_data: User;
  seller: Seller
  products = false;
  cuit: number;
  category: string;
  shop_name: string;
  public name: string = '';
  public user_name: string = '';
  userLocation = null;

  constructor(private navCtrl: NavController,
    private modalctrl: ModalController,
    private dbService: DbService,
    private tokenSrv: TokenService,
    private router: Router,
    private navParams: NavParamsService) {

    this.seller = new Seller();
    this.user_data = this.tokenSrv.GetPayLoad().usuario;

    this.dbService.checkIsVendor(this.user_data._id).subscribe((data: any) => {
      if (data.ok) {
        this.seller = data.vendor_data;
        if (data.vendor_data.location != null) {
          this.userLocation = data.vendor_data.location;
        }

      }


    })

    this.seller.owner = this.user_data._id;

    //   this.dbService.getLocation(this.user_data._id).subscribe((locs:any)=>
    // { console.log(locs)
    //   this.userLocation= locs.location_data.map((loc:any) => {
    //    return loc._id;
    //   });
    // })

  }

  goTo(path: string) {
    this.navCtrl.navigateRoot(path);
  }

  saveSeller() {
    this.user_data.role = "seller";

    this.seller.category = this.category;
    this.seller.cuit = this.cuit;
    // this.seller.location= this.userLocation;
    this.seller.shop_name = this.shop_name;

    console.log(this.seller);
    this.dbService.addVendor(this.seller).subscribe((data) => {
      console.log(data)
    })
  }

  ngOnInit() {

  }

  async dataModal() {
    const modal = await this.modalctrl.create({
      component: NewSellerComponent,

      cssClass: "modal",
      componentProps:
        {
          "seller": this.seller
        }


    });
    modal.present();
    modal.onDidDismiss().then((data) => {

    })
  }

  ionViewWillEnter() {
    this.user_data = this.tokenSrv.GetPayLoad().usuario;

    this.name = this.user_data.name;
    this.user_name = this.user_data.user_name;

    if(this.seller._id)
    {
      this.dbService.getProductsVendor(this.seller._id)
      .subscribe((data:any)=>
    {
      console.log(data)
      if(data.ok && data.data.length >= 1)
      {
        this.products = true;
      }
    })
    }

  }


  goToMyShop() {
    this.router.navigateByUrl('shop/' + this.seller.shop_name);
  }

  goToMyOrders() {
    this.router.navigateByUrl('orders/' + this.seller._id);
  }




  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("content-seller").style.backgroundColor = "rgba(0,0,0,0.4)";

  }
  
   closeNav() {
    document.getElementById("mySidenav").style.width = "0";

    document.body.style.backgroundColor = "white";
  }


}
