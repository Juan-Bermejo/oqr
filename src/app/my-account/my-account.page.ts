import { Component, OnInit } from '@angular/core';
import { User } from '../clases/user';
import { DbService } from '../services/db.service';
import { NavController, AlertController, ToastController, ModalController } from '@ionic/angular';
import { NewSellerComponent } from '../componentes/new-seller/new-seller.component';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {

  user:User;
  public is_seller:boolean=false;
  seller_check:boolean;

  constructor(private dbService: DbService,
      private navCtrl: NavController,
      private alertController:AlertController,
      private toastCtrl: ToastController,
      private modalctrl:ModalController) {

    this.getIs_seller();

    this.user= JSON.parse(localStorage.getItem("user_data")) ;
  
 
   }

   getIs_seller()
   {
    this.dbService.getIsSeller$().subscribe((data)=>{
    
      this.is_seller=data;
      this.seller_check=data;
      console.log("la data",data)
    });
   }



   async deleteConfirm() {
    const alert = await this.alertController.create({
      header: '',
      message: ' <strong>¿Estas seguro que quieres dejar de ser vendedor?</strong>!!!',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'primary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            this.deleteSeller();
            
          }
        }
      ]
    });

    await alert.present();
  }

  deleteSeller()
  {
     this.dbService.checkIsVendor(this.user._id).subscribe((data:any)=>
  { this.seller_check=false;
    this.dbService.deleteVendor(data.vendor_data._id).subscribe((dataDelete)=>
  { 
    this.toastCtrl.create({
      message:"Ya no eres un vendedor.",
      animated:true,
      position:"top",
      color:"success"
    
      
    }).then(()=>
  {
    this.is_seller=false;
    this.dbService.setIsSeller$(this.is_seller);
    console.log("proceso finalizado")
  })
  })
  });
  //sub.unsubscribe();
  
    
  }



   toSeller()
   {

    
     if(!this.is_seller)
     {
      this.dataModal()
     }
     else
     {

      this.deleteConfirm();
 
     }
     
   }


   async dataModal()
   {
     const modal = await this.modalctrl.create({
       component: NewSellerComponent,
 
       cssClass:"modal"
       
     });
      modal.present();
      modal.onDidDismiss().then((data)=>{
       this.getIs_seller();
     })
   }

  ngOnInit() {
  }

  ionViewWillEnter(){
  this.getIs_seller();
  }

}
