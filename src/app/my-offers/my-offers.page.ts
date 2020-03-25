import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';
import { Offer } from '../clases/offer';

@Component({
  selector: 'app-my-offers',
  templateUrl: './my-offers.page.html',
  styleUrls: ['./my-offers.page.scss'],
})
export class MyOffersPage implements OnInit {

  constructor(private dbService: DbService
              ) {

                
               }

  public data_offers: Offer[];

  ngOnInit() {
  }

  ionViewWillEnter(){
  
  }

}
