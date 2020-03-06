import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewOfferPageRoutingModule } from './new-offer-routing.module';

import { NewOfferPage } from './new-offer.page';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAfYTQGAvHWC7vd-1iTEQSGoDQT_xJNw2A'
    }),
    NewOfferPageRoutingModule
  ],
  declarations: [NewOfferPage]
})
export class NewOfferPageModule {}
