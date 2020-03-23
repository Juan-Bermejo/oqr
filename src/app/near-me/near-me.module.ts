import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NearMePageRoutingModule } from './near-me-routing.module';

import { NearMePage } from './near-me.page';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NearMePageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAfYTQGAvHWC7vd-1iTEQSGoDQT_xJNw2A'
    }),
  ],
  declarations: [NearMePage]
})
export class NearMePageModule {}
