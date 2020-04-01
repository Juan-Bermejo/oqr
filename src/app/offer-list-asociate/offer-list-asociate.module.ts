import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfferListAsociatePageRoutingModule } from './offer-list-asociate-routing.module';

import { OfferListAsociatePage } from './offer-list-asociate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfferListAsociatePageRoutingModule
  ],
  declarations: [OfferListAsociatePage]
})
export class OfferListAsociatePageModule {}
