import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalNewRegionPageRoutingModule } from './modal-new-region-routing.module';

import { ModalNewRegionPage } from './modal-new-region.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalNewRegionPageRoutingModule
  ],
  declarations: [ModalNewRegionPage]
})
export class ModalNewRegionPageModule {}
