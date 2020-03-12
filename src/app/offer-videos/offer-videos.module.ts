import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfferVideosPageRoutingModule } from './offer-videos-routing.module';

import { OfferVideosPage } from './offer-videos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfferVideosPageRoutingModule
  ],
  declarations: [OfferVideosPage]
})
export class OfferVideosPageModule {}
