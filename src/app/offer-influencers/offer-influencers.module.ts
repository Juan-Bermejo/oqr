import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfferInfluencersPageRoutingModule } from './offer-influencers-routing.module';

import { OfferInfluencersPage } from './offer-influencers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfferInfluencersPageRoutingModule
  ],
  declarations: [OfferInfluencersPage]
})
export class OfferInfluencersPageModule {}
