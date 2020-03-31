import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { DbService } from '../../services/db.service';
import { Seller } from '../../clases/seller';
import { ModalCategoriesPage } from '../../modals/modal-categories/modal-categories.page';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-new-seller',
  templateUrl: './new-seller.component.html',
  styleUrls: ['./new-seller.component.scss'],
})
export class NewSellerComponent implements OnInit {

  userLocation: any;
  user_data: any;
  seller: Seller;
  spinner:boolean=false;


  constructor(private navCtrl: NavController,
              private modalctrl: ModalController,
              private dbService: DbService,
              private builder: FormBuilder) {

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


   
  category = new FormControl('', [
    Validators.required
  ]);

  cuit = new FormControl('', [
    Validators.required
  ]);



  shop_name = new FormControl('', [
    Validators.required
  ]);


  registroForm: FormGroup = this.builder.group({
    category: this.category,
    cuit: this.cuit,
    shop_name: this.shop_name,

  });


   saveSeller()
   {
     this.spinner=true;
     this.user_data.role="seller";
    
     this.seller.category = this.registroForm.value.category;
     this.seller.cuit = this.registroForm.value.cuit;
     this.seller.location = this.registroForm.value.location;
     this.seller.shop_name = this.registroForm.value.shop_name;
     
     setTimeout(() => {

      
      this.dbService.addVendor(this.seller).subscribe((data)=>{
        this.spinner=false;
        this.dbService.setIsSeller$(true);
        this.registroForm.reset();
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
 
       this.category.setValue(data.data.result.category);
       
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
