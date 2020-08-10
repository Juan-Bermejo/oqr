import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, NavParams, AlertController } from '@ionic/angular';
import { DbService } from '../../services/db.service';
import { Seller } from '../../clases/seller';
import { ModalCategoriesPage } from '../../modals/modal-categories/modal-categories.page';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { TokenService } from '../../services/token.service';
import { CountriesService } from '../../services/countries.service';



@Component({
  selector: 'app-new-seller',
  templateUrl: './new-seller.component.html',
  styleUrls: ['./new-seller.component.scss'],
})
export class NewSellerComponent implements OnInit {

  countries: Object;
  userLocation: any;
  user_data: any;
  seller: Seller;
  spinner:boolean=false;
  is_seller:boolean=false;
  efectivo:boolean = false;
  tarjeta:boolean = false;
  delivery:boolean = false;
  retiro:boolean = false;

  currency_commission;
  prod_currency= "ars";

  constructor(private navCtrl: NavController,
              private modalctrl: ModalController,
              private dbService: DbService,
              private builder: FormBuilder,
              private navParams: NavParams,
              private countrySrv:CountriesService,
              private alert: AlertController,
              private token: TokenService) {

                if(this.navParams.get("seller"))
                {
                  this.seller=this.navParams.get("seller")
                  this.is_seller=true;
                  this.registroForm.controls['cuit'].setValue(this.seller.cuit)
                  this.registroForm.controls['shop_name'].setValue(this.seller.shop_name)
                  this.registroForm.controls['category'].setValue(this.seller.category)
                  this.registroForm.controls['desde'].setValue(this.seller.desde)
                  this.registroForm.controls['hasta'].setValue(this.seller.hasta)
                  this.delivery = this.seller.delivery;
                  this.retiro = this.seller.retiro;
                  this.efectivo = this.seller.efectivo;
                  this.tarjeta = this.seller.tarjeta;
                
                }
                else{
                  this.seller= new Seller();
                }

                
                this.user_data=token.GetPayLoad().usuario;
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

  currency = new FormControl('', [
    Validators.required
  ]);


  shop_name = new FormControl('', [
    Validators.required
  ]);

  desde = new FormControl('', [
    Validators.required
  ]);

  hasta = new FormControl('', [
    Validators.required
  ]);



  registroForm: FormGroup = this.builder.group({
    category: this.category,
    cuit: this.cuit,
    shop_name: this.shop_name,
    currency: this.currency,
    desde: this.desde,
    hasta: this.hasta,
   

  });


   async saveSeller()
   {
     if((!this.retiro && !this.delivery) || (!this.tarjeta && !this.efectivo))
     {
       console.log("alert")
     const errAlert= await this.alert.create({
        header: "Tienes datos incompletos!",
        subHeader: "Condiciones de pago o condiciones de entrega.",
        message: "Debes seleccionar al menos uno de cada uno.",
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
           
            handler: () => {
              
            }
          }
        ]
      })
      await errAlert.present();
     }
     else
     {
      this.spinner=true;
      this.user_data.role="seller";
     
      this.seller.category = this.registroForm.value.category;
      this.seller.cuit = this.registroForm.value.cuit;
      this.seller.location = this.registroForm.value.location;
      this.seller.shop_name = this.registroForm.value.shop_name;
      this.seller.currency = this.registroForm.value.currency;
      this.seller.desde = this.registroForm.value.desde;
      this.seller.hasta = this.registroForm.value.hasta;
      this.seller.delivery = this.delivery;
      this.seller.retiro = this.retiro;
      this.seller.efectivo = this.efectivo;
      this.seller.tarjeta = this.tarjeta;
   
      console.log(this.seller)
      
      setTimeout(() => {
 
       if(this.is_seller)
       {
         console.log("Modificar el vendedor")
       }
       else{
 
         this.dbService.addVendor(this.seller).subscribe((data)=>{
           this.spinner=false;
           this.dbService.setIsSeller$(true);
           this.registroForm.reset();
           console.log(data)
         },
        (data)=>{
          this.spinner=false;
    
        })
        
 
       }



 
       this.dismissModal("");
 
      }, 3000);
 
 
     }

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

   ionViewWillEnter()
   {
    this.countrySrv.getCountries().subscribe((c)=>{
      this.countries= c;
      console.log(c);
    })
   }


  ngOnInit() {}

}
