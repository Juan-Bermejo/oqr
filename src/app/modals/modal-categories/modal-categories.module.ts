import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalCategoriesPageRoutingModule } from './modal-categories-routing.module';

import { ModalCategoriesPage } from './modal-categories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalCategoriesPageRoutingModule
  ],
  declarations: [ModalCategoriesPage]
})
export class ModalCategoriesPageModule {}
