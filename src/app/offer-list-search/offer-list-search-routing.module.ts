import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfferListSearchPage } from './offer-list-search.page';

const routes: Routes = [
  {
    path: '',
    component: OfferListSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfferListSearchPageRoutingModule {}
