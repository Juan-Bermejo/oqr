import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfluencerPanelPage } from './influencer-panel.page';

const routes: Routes = [
  {
    path: '',
    component: InfluencerPanelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfluencerPanelPageRoutingModule {}
