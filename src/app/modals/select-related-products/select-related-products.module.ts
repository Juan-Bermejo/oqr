import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectRelatedProductsPageRoutingModule } from './select-related-products-routing.module';

import { SelectRelatedProductsPage } from './select-related-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectRelatedProductsPageRoutingModule
  ],
  declarations: [SelectRelatedProductsPage]
})
export class SelectRelatedProductsPageModule {}
