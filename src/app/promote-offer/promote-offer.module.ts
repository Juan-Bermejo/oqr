import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromoteOfferPageRoutingModule } from './promote-offer-routing.module';

import { PromoteOfferPage } from './promote-offer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromoteOfferPageRoutingModule
  ],
  declarations: [PromoteOfferPage]
})
export class PromoteOfferPageModule {}
