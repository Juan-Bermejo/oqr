import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfferLandPangePageRoutingModule } from './offer-land-pange-routing.module';

import { OfferLandPangePage } from './offer-land-pange.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfferLandPangePageRoutingModule
  ],
  declarations: [OfferLandPangePage]
})
export class OfferLandPangePageModule {}
