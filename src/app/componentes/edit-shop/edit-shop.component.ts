import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParamsService } from '../../services/nav-params.service';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-edit-shop',
  templateUrl: './edit-shop.component.html',
  styleUrls: ['./edit-shop.component.scss'],
})
export class EditShopComponent implements OnInit {

  bannerImg: File = null;
  profileImg: File = null;
  sellerImg: any;
  sellerId:string;
  type;
  photoSelectedBanner: string | ArrayBuffer;
  

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParamsService,
    private dbs: DbService) {

  
     }

     fileUpl(files: FileList){
       console.log(files);
      const reader = new FileReader();
      reader.onload = e => this.photoSelectedBanner = reader.result;
      reader.readAsDataURL(files[0]);
      
       this.bannerImg = files.item(0);
       
     }

     fileUplProfile(files: FileList){
      
      this.profileImg = files.item(0);
      console.log(this.profileImg)
    }

     enviar()
     { 
       let fd = new FormData();
       fd.append("image",this.bannerImg);
       fd.append("_id", this.sellerId);
       fd.append("type", "banner");
       console.log(this.bannerImg);
       console.log(fd);
       this.dbs.sendImage(fd).toPromise().then((res:any)=>
      {
        if(res.ok)
        {
          console.log(res);
        }
        
      })
     }

     enviarProfile()
     {
      let fd = new FormData();
      fd.append("image",this.profileImg);
      fd.append("_id", this.sellerId);
      fd.append("type", "profile");
      console.log(this.bannerImg);
      console.log(fd);
      this.dbs.sendImage(fd).toPromise().then((res:any)=>
     {
      if(res.ok)
        {
          console.log(res);
        }
     })
     }
  

  dismissModal()
  {
    
    this.modalCtrl.dismiss({

      'dismissed': true,
    })

    
    
  }
  ngOnInit() {}

  ionViewWillEnter()
  {
    this.sellerId= this.navParams.GetParam;
    console.log(this.sellerId)
  }

}
