import { Component, OnInit } from '@angular/core';
import { PostLink } from '../clases/post-link';
import { NavParamsService } from '../services/nav-params.service';
import { Offer } from '../clases/offer';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-offer-videos',
  templateUrl: './offer-videos.page.html',
  styleUrls: ['./offer-videos.page.scss'],
 
})
export class OfferVideosPage implements OnInit {

  post: PostLink[];
  offer:Offer;

  constructor( private paramSrv: NavParamsService, private dbService: DbService) {
    this.offer=this.paramSrv.param;
    this.post= new Array<PostLink>();

   }



  ngOnInit(){

    console.log(this.offer._id);

    this.dbService.getLinkById(this.offer._id).subscribe((data:any)=>{
      this.post = new Array();
      document.getElementById("post").innerHTML="";
      this.post= data.link_data;
      for(let i = 0; i < this.post.length; i++)
      {
        document.getElementById("post").innerHTML += this.post[i].link;
      } 
     
    } )

  }





}
