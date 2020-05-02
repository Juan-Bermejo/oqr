import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectRelatedProductsPage } from './select-related-products.page';

const routes: Routes = [
  {
    path: '',
    component: SelectRelatedProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectRelatedProductsPageRoutingModule {}
