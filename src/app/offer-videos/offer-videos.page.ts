import { Component, OnInit, ViewChild } from '@angular/core';
import { PostLink } from '../clases/post-link';
import { NavParamsService } from '../services/nav-params.service';
import { Offer } from '../clases/offer';
import { DbService } from '../services/db.service';
import { NavController, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-offer-videos',
  templateUrl: './offer-videos.page.html',
  styleUrls: ['./offer-videos.page.scss'],
 
})
export class OfferVideosPage implements OnInit {

  @ViewChild("slides",{static:true}) slides: IonSlides;
  post: PostLink[];
  offer:Offer;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  constructor( private paramSrv: NavParamsService, private dbService: DbService,
  private navCtrl: NavController) {
    this.offer=this.paramSrv.param;
    this.post= new Array<PostLink>();

    console.log(this.offer._id);

    this.dbService.getLinkById(this.offer._id).subscribe((data:any)=>{
      this.post = new Array();
      //document.getElementById("post").innerHTML="";
      this.post= data.link_data;
      for(let i = 0; i < this.post.length; i++)
      { console.log(this.post[i])
        
         //this.post[i].link  + "<br> < (click)='goTo("+this.post[i].influencer+")'>Comprar</ion-button>";
        document.getElementById("post").innerHTML += this.post[i].link
        + "<br> <button onClick='goTo("+this.post[i].influencer+")'>Comprar</button>"
      } 
     
    } )

   }

   ionViewDidEnter()
   {

   }

   
  goTo(link)
  {
    this.paramSrv.param= 
    {
      "offer": this.offer,
      "link": link
    }
    console.log(this.paramSrv.param)
    this.navCtrl.navigateRoot('offer-details');
  }


  ngOnInit(){

   /* console.log(this.offer._id);

    this.dbService.getLinkById(this.offer._id).subscribe((data:any)=>{
      this.post = new Array();
      document.getElementById("post").innerHTML="";
      this.post= data.link_data;
      for(let i = 0; i < this.post.length; i++)
      {
        document.getElementById("post").innerHTML += this.post[i].link
        + "<br> <ion-button (click)='goTo("+this.post[i].influencer+")'>Comprar</ion-button>"
      } 
     
    } )*/

    

  }






}
