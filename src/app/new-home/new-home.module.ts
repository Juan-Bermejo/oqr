import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewHomePageRoutingModule } from './new-home-routing.module';

import { NewHomePage } from './new-home.page';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewHomePageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAfYTQGAvHWC7vd-1iTEQSGoDQT_xJNw2A'
    }),
  ],
  declarations: [NewHomePage]
})
export class NewHomePageModule {}
