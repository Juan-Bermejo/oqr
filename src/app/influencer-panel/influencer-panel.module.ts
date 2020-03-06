import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfluencerPanelPageRoutingModule } from './influencer-panel-routing.module';

import { InfluencerPanelPage } from './influencer-panel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfluencerPanelPageRoutingModule
  ],
  declarations: [InfluencerPanelPage]
})
export class InfluencerPanelPageModule {}
