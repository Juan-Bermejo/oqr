import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CanalInfluencerPageRoutingModule } from './canal-influencer-routing.module';

import { CanalInfluencerPage } from './canal-influencer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CanalInfluencerPageRoutingModule
  ],
  declarations: [CanalInfluencerPage]
})
export class CanalInfluencerPageModule {}
