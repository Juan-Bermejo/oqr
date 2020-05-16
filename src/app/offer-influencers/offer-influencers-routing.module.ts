import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfferInfluencersPage } from './offer-influencers.page';

const routes: Routes = [
  {
    path: '',
    component: OfferInfluencersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfferInfluencersPageRoutingModule {}
