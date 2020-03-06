import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfferDetailsPageRoutingModule } from './offer-details-routing.module';

import { OfferDetailsPage } from './offer-details.page';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfferDetailsPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAfYTQGAvHWC7vd-1iTEQSGoDQT_xJNw2A'
    }),
    
  ],
  declarations: [OfferDetailsPage]
})
export class OfferDetailsPageModule {}
