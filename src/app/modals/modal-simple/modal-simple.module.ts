import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalSimplePageRoutingModule } from './modal-simple-routing.module';

import { ModalSimplePage } from './modal-simple.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalSimplePageRoutingModule
  ],
  declarations: [ModalSimplePage]
})
export class ModalSimplePageModule {}
