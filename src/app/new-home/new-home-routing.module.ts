import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewHomePage } from './new-home.page';

const routes: Routes = [
  {
    path: '',
    component: NewHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewHomePageRoutingModule {}
