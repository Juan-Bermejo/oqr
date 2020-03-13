import { Component, OnInit } from '@angular/core';
import { PostLink } from '../clases/post-link';
import { NavParamsService } from '../services/nav-params.service';
import { Offer } from '../clases/offer';

@Component({
  selector: 'app-offer-videos',
  templateUrl: './offer-videos.page.html',
  styleUrls: ['./offer-videos.page.scss'],
 
})
export class OfferVideosPage implements OnInit {

  post: PostLink[];
  offer;

  constructor( private paramSrv: NavParamsService) {
    this.offer=this.paramSrv.param;
    this.post= new Array<PostLink>();

   }



  ngOnInit(){


  }





}
