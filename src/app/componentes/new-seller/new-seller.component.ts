import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { DbService } from '../../services/db.service';
import { Seller } from '../../clases/seller';
import { ModalCategoriesPage } from '../../modals/modal-categories/modal-categories.page';


@Component({
  selector: 'app-new-seller',
  templateUrl: './new-seller.component.html',
  styleUrls: ['./new-seller.component.scss'],
})
export class NewSellerComponent implements OnInit {

  userLocation: any;
  user_data: any;
  seller: Seller;
  cuit:number;
  category:string;
  shop_name:string;
  spinner:boolean=false;

  constructor(private navCtrl: NavController,
    private modalctrl: ModalController,
              private dbService: DbService) {
                this.seller= new Seller();
                this.user_data=JSON.parse(localStorage.getItem("user_data"));
                console.log(this.user_data);
                this.seller.owner=this.user_data._id;
                this.dbService.getLocation(this.user_data._id).subscribe((locs:any)=>
              { console.log(locs)
                this.userLocation= locs.location_data.map((loc:any) => {
                 return loc._id;
                });
              })
                
   }


   saveSeller()
   {
     this.spinner=true;
     this.user_data.role="seller";
    
     this.seller.category=this.category;
     this.seller.cuit= this.cuit;
     this.seller.location= this.userLocation;
     this.seller.shop_name= this.shop_name;
     
     setTimeout(() => {

      
      this.dbService.addVendor(this.seller).subscribe((data)=>{
        this.spinner=false;
        this.dbService.setIsSeller$(true);
        console.log(data)
      },
     (data)=>{
       this.spinner=false;
 
     })

      this.dismissModal("");

     }, 3000);


   }



   async modalCategories()
   {
     const modal = await this.modalctrl.create({
       component: ModalCategoriesPage,
 
       cssClass:"modal"
       
     });
      modal.present();
      modal.onDidDismiss().then((data)=>{
 
       this.category = data.data.result.category;
       
     })
   }

   dismissModal(category_selected)
   {
     this.modalctrl.dismiss({

       'dismissed': true
     })
   }


  ngOnInit() {}

}
