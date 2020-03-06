import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfferListSearchPageRoutingModule } from './offer-list-search-routing.module';

import { OfferListSearchPage } from './offer-list-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfferListSearchPageRoutingModule
  ],
  declarations: [OfferListSearchPage]
})
export class OfferListSearchPageModule {}
