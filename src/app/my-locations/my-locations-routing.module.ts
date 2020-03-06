import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyLocationsPage } from './my-locations.page';

const routes: Routes = [
  {
    path: '',
    component: MyLocationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyLocationsPageRoutingModule {}
