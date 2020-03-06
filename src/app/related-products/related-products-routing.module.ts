import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RelatedProductsPage } from './related-products.page';

const routes: Routes = [
  {
    path: '',
    component: RelatedProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelatedProductsPageRoutingModule {}
