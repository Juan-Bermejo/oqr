import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsociateOfferPageRoutingModule } from './asociate-offer-routing.module';

import { AsociateOfferPage } from './asociate-offer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsociateOfferPageRoutingModule
  ],
  declarations: [AsociateOfferPage]
})
export class AsociateOfferPageModule {}
