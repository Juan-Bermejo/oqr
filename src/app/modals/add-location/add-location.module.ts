import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddLocationPageRoutingModule } from './add-location-routing.module';

import { AddLocationPage } from './add-location.page';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddLocationPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAfYTQGAvHWC7vd-1iTEQSGoDQT_xJNw2A'
    })
  ],
  declarations: [AddLocationPage]
})
export class AddLocationPageModule {}
