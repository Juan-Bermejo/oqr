import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfferVideosPage } from './offer-videos.page';

const routes: Routes = [
  {
    path: '',
    component: OfferVideosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfferVideosPageRoutingModule {}
