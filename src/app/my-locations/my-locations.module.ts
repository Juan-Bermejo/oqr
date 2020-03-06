import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyLocationsPageRoutingModule } from './my-locations-routing.module';

import { MyLocationsPage } from './my-locations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyLocationsPageRoutingModule
  ],
  declarations: [MyLocationsPage]
})
export class MyLocationsPageModule {}
