import { Component, OnInit, ViewChild } from '@angular/core';
import { kind_offer, slideOpts, categories } from '../../environments/environment';
import { IonSlides, IonSlide } from '@ionic/angular';
import { User } from '../clases/user';





@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  
 // @ViewChild('slider',{ read: true, static: false }) private slider: IonSlides;
 @ViewChild('slides', {static: true}) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  kind_offer= kind_offer;
  categories = categories

  id: number;
  product: string;
  price: number;
  stock: number;
  commission: number;
  category: string;
  sellers: User;
  locations: Location[];
  is_active:boolean;
  kind: string;
  description:string;
  cuantity:number;

  desc=[10,20,30,40,50,60,70,80,90,100];

  constructor() {

   }

  onChange(value)
  {
    console.log(value);
  }

 /* next()
  {
    this.unlock()
    
    this.slides.slideNext().then(()=>{
      this.slides.lockSwipeToNext(true);
    })
    
  }*/

  next()
  {

    

    this.slides.getActiveIndex().then((index)=>{

      switch(index)
      {
        case 0:
        this.cuantity > 1 && this.cuantity < 101 ? this.slides.lockSwipeToNext(false).then(()=>{
          this.slides.slideNext().then(()=>{
            this.slides.lockSwipeToNext(true);
          })
        }) : this.slides.lockSwipeToNext(true)
        break;

        case 1:
        console.log(this.category)
        this.category != undefined ? this.slides.lockSwipeToNext(false).then(()=>{
          this.slides.slideNext().then(()=>{
            this.slides.lockSwipeToNext(true);
          })
        }) : this.slides.lockSwipeToNext(true)
        break;

        case 2:
        this.description != "" ? this.slides.lockSwipeToNext(false).then(()=>{
          this.slides.slideNext().then(()=>{
            this.slides.lockSwipeToNext(true);
          })
        }) : this.slides.lockSwipeToNext(true)
        break;

        case 3:
        this.stock >= 0 ? this.slides.lockSwipeToNext(false).then(()=>{
          this.slides.slideNext().then(()=>{
            this.slides.lockSwipeToNext(true);
          })
        }) : this.slides.lockSwipeToNext(true)
        break;

        case 4:
        this.commission >= 0 ? this.slides.lockSwipeToNext(false) : this.slides.lockSwipeToNext(true)
        break;

      }

    
    })

    
  }

  loadOffer(offer)
  {
    console.log(offer);
  }


  ngOnInit() {
    this.slides.lockSwipeToNext(true);
   /* setTimeout(() => {
      this.slider.lockSwipes(true);
  }, 500);   
   */
  }

}
