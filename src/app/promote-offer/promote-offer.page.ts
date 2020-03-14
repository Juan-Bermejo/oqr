import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';

import { PostLink } from '../clases/post-link';
import { PostService } from '../services/post.service';
import { Offer } from '../clases/offer';
import { User } from '../clases/user';
import { DbService } from '../services/db.service';


@Component({
  selector: 'app-promote-offer',
  templateUrl: './promote-offer.page.html',
  styleUrls: ['./promote-offer.page.scss'],
})
export class PromoteOfferPage implements OnInit {

  offer:Offer;
  link:string;
  tiktok_link:string;
  post: PostLink[];
  spinner:boolean;
  spinnerTT:boolean;
  messaje="";
  messajeTT="";
  user:User;

  constructor(private route: ActivatedRoute, 
    public navCtrl: NavController,
    public paramSrv: NavParamsService,
    private postSrv: PostService,
    private dbService: DbService) {

this.user= JSON.parse(localStorage.getItem("user"));
  this.offer=new Offer();
    this.spinner=false;
    this.spinnerTT=false;
    this.offer=this.paramSrv.param
   }

  ngOnInit() {
    

  }

  addTikTokLink()
  {
    this.spinnerTT=true;
    this.messajeTT="";

    setTimeout(() => {
      this.spinnerTT=false;
    }, 2000);

    this.postSrv.getTikTok(this.tiktok_link).subscribe((data:any)=>{
      console.log(data.html);
      let l = new PostLink();
      l.link=data.html;
      l.influencer=this.user.id;
      l.offer_id=this.offer.id;
    
    },
    (data:any)=>{
     
      this.messajeTT="Tiene que ingresar un link.";
    }
  )
  }

  addLink()
  {
    
    this.messaje="";

    if(this.link!= undefined)
    {
      let prueba=this.link.split("/");

      if(prueba[0]=="https:"&&
        prueba[1]==""&&
        prueba[2]=="www.facebook.com"&&
        prueba[4]=="videos")
        {
          this.spinner=true;
          let l = new PostLink();
          l.link='   <iframe src="https://www.facebook.com/plugins/video.php?href= ' +this.link + '&show_text=0&width=250" width="250" height="250" style="border:solid;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="false"></iframe>'
          l.influencer=this.dbService.user_id;
          l.offer_id=this.offer.id; 

          console.log(l);
          
          this.dbService.postLink(l)
          .subscribe((data: any) => {
            if(data.status == 200) {

              const toast = document.createElement('ion-toast');
              toast.message = 'Link agregado';
              toast.duration = 2000;
              document.body.appendChild(toast);
              return toast.present();
    
            }
          });

        }
        else{
          this.messaje="Tiene que ingresar un link valido. \n Ej: https://www.facebook.com/perfilfacebok/videos/11111111111111/";
        }

    }
    else{
      this.messaje="Tiene que ingresar un link.";
    }


  }

}
