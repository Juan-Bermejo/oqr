import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfferListAsociatePage } from './offer-list-asociate.page';

const routes: Routes = [
  {
    path: '',
    component: OfferListAsociatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfferListAsociatePageRoutingModule {}
