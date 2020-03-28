import { Component, OnInit } from '@angular/core';
import { User } from '../clases/user';
import { DbService } from '../services/db.service';
import { NavController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {

  user:User;
  public is_seller:boolean=false;

  constructor(private dbService: DbService,
     private navCtrl: NavController,
    private alertController:AlertController,
  private toastCtrl: ToastController) {

    this.getIs_seller();

    this.user= JSON.parse(localStorage.getItem("user_data")) ;
  
 
   }

   getIs_seller()
   {
    this.dbService.getIsSeller$().subscribe((data)=>{
    
      this.is_seller=data;
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
  {console.log("entro ");
     this.dbService.checkIsVendor(this.user._id).subscribe((data:any)=>
  { console.log("seller: ", data);
    this.dbService.deleteVendor(data.vendor_data._id).subscribe((dataDelete)=>
  { console.log(dataDelete)
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
      this.navCtrl.navigateRoot("seller-panel");
     }
     else
     {

      this.deleteConfirm();
 
     }
     
   }

  ngOnInit() {
  }

  ionViewWillEnter(){
  this.getIs_seller();
  }

}
