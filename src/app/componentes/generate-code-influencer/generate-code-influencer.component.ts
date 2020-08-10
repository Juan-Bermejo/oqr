import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { DbService } from '../../services/db.service';
import { User } from '../../clases/user';
import { TokenService } from '../../services/token.service';
import { Influencer } from '../../clases/influencer';
import { ModalCategoriesPage } from '../../modals/modal-categories/modal-categories.page';

@Component({
  selector: 'app-generate-code-influencer',
  templateUrl: './generate-code-influencer.component.html',
  styleUrls: ['./generate-code-influencer.component.scss'],
})
export class GenerateCodeInfluencerComponent implements OnInit {

  influencer_code:string;
  user:User;
  spinner= false;
  profileImg: File;
  category:string;
  

  constructor(private modalCtrl: ModalController, 
    private navCtrl: NavController,
    private dbServ: DbService,
    private tokenServ: TokenService,
    private modalController: ModalController) {
      
     }

     fileUpl(files: FileList){
      this.profileImg = files.item(0);
      
    }


     ionViewWillEnter()
     {
      this.user=this.tokenServ.GetPayLoad().usuario;
     }


     createInfluencer()
     {
       let fd = new FormData();
      console.log(this.profileImg);
       fd.append("code", this.influencer_code);
       fd.append("category", this.category);
       fd.append("image", this.profileImg);

       this.dbServ.createInfluencer(fd)
       .subscribe((data:any)=>{
         console.log(data);
       })
     }

     async ModalCategories() {
      
      const modal = await this.modalController.create({
        component: ModalCategoriesPage,
  
        cssClass:"modal"
        
      });
       modal.present();
       modal.onDidDismiss().then((data)=>{
      
        this.category = data.data.result.category;
      
        
      })
    }


  influencerCanal()
  {
    this.spinner = true;
    let i = new Influencer();
    i.user_id = this.user._id;
    i.code= this.influencer_code;
    console.log("Influencer a guardar: " ,i)
    this.dbServ.createInfluencer(i).toPromise().then((data)=>
  {
    console.log(data)
    this.spinner=false;
    this.navCtrl.navigateRoot('influencer-panel').then(()=>
  {
    this.dismissModal();
  })
  }).catch((error)=>
{this.spinner=false;
  console.log(error)
})


  }

  dismissModal()
  {
    
    this.modalCtrl.dismiss({

      'dismissed': true
    })
  }

  ngOnInit() {}



}
