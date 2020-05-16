import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanalInfluencerPage } from './canal-influencer.page';

const routes: Routes = [
  {
    path: '',
    component: CanalInfluencerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CanalInfluencerPageRoutingModule {}
