import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RelatedProductsPageRoutingModule } from './related-products-routing.module';

import { RelatedProductsPage } from './related-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RelatedProductsPageRoutingModule
  ],
  declarations: [RelatedProductsPage]
})
export class RelatedProductsPageModule {}
