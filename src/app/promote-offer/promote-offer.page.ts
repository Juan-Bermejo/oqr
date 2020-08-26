import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';

import { PostLink } from '../clases/post-link';
import { PostService } from '../services/post.service';
import { Offer } from '../clases/offer';
import { User } from '../clases/user';
import { DbService } from '../services/db.service';
import { TokenService } from '../services/token.service';


@Component({
  selector: 'app-promote-offer',
  templateUrl: './promote-offer.page.html',
  styleUrls: ['./promote-offer.page.scss'],
})
export class PromoteOfferPage implements OnInit {

  total_vendors: number;
  offer:Offer;
  link:string;
  tiktok_link:string;
  post: PostLink[];
  spinner:boolean;
  spinnerTT:boolean;
  messaje="";
  messajeTT="";
  spinnerInsta:boolean;
  messajeInsta="";
  user:User;
  is_logged:boolean=false;
  offer_id;
  offer_img;
  influencer:any;
  join:boolean = false;

  constructor(private route: ActivatedRoute, 
    public navCtrl: NavController,
    public paramSrv: NavParamsService,
    private postSrv: PostService,
    private token: TokenService,
    private dbService: DbService) {

  this.offer=new Offer();
    this.spinner=false;
    this.spinnerTT=false;
    this.offer=this.paramSrv.param
    console.log(this.offer);
   }

  ngOnInit() {
    
    if (document.URL.indexOf("/") > 0) {
      let splitURL = document.URL.split("/");
      console.log(splitURL)
     this.offer_id = splitURL[5].split("?")[0];

  //  this.dbService.getOffer(this.offer_id).toPromise().then((data:any)=>
  // {
  //   if(data.ok)
  //   {
  //     this.offer = data.offer;
  //     this.total_vendors= data.total;

  //   }
  // })


  

  }

  }

  addInstagramLink()
  {
    this.spinnerInsta=true;
    this.postSrv.getInstaPost("https://www.instagram.com/p/B-381HJhAG2/").subscribe((data:any)=>
  {
    let l = new PostLink();
    l.link=data.html;
    l.influencer=this.user._id;
    l.offer_id=this.offer._id;

    console.log(data);
    this.dbService.postLink(l)
    .subscribe((data: any) => {
      setTimeout(() => {
        this.spinnerInsta=false;
      }, 2000);
      if(data.status == 200) {

        const toast = document.createElement('ion-toast');
        toast.message = 'Link agregado';
        toast.duration = 2000;
        document.body.appendChild(toast);
        return toast.present();

      }
    });
  })
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
      l.influencer=this.user._id;
      l.offer_id=this.offer._id;
    
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
          l.offer_id=this.offer._id; 
         

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

   traerOferta()
  {
     this.dbService.getOfferInf(this.offer_id, this.influencer._id).toPromise().then((data:any)=>
    {
      console.log(data);
      
      if(data.ok)
      {
        this.offer = data.offer;
        this.total_vendors= data.total_vendors;
        this.join = data.join

      }


    })
  }


  promoteOffer()
  {
    console.log(this.influencer)
    console.log(this.offer_id)
    this.spinner = true;
    this.dbService.promoteOffer(this.influencer._id,this.offer_id)
    .subscribe((data:any)=>
  {
    if(data.ok)
    {
      console.log(data);
      this.traerOferta();
      this.spinner = false;
    }
  })
  }


  removePromote()
  {
    this.dbService.removePromete(this.influencer._id, this.offer_id).toPromise()
    .then((data:any)=>
  {
    console.log(data);
    this.traerOferta();
    this.spinner = false;
  })
  }

  async ionViewWillEnter()
  {

    if (document.URL.indexOf("/") > 0) {
      let splitURL = document.URL.split("/");
      console.log(splitURL)
     this.offer_id = splitURL[5].split("?")[0];

     this.dbService.getLogged$().subscribe((logged_check)=>
     {
       this.is_logged=logged_check;
     })
 
     this.user= this.token.GetPayLoad().usuario;

     this.dbService.getInfluencerByUser(this.user._id)
     .subscribe((data:any)=>
   {
     if(data)
     {
       this.influencer = data.influencer_data;

        this.dbService.getOfferInf(this.offer_id, this.influencer._id).toPromise().then((data:any)=>
       {
         console.log(data);
         
         if(data.ok)
         {
           this.offer = data.offer;
           this.total_vendors= data.total_vendors;
           this.join = data.join
   
         }
   
   
       })
     }
     
   })
    
    this.dbService.getLogged$().subscribe((logged_check)=>
    {
      this.is_logged=logged_check;
    })

    this.user= this.token.GetPayLoad().usuario;

  }
  }

}
