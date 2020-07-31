import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { FilterPipe } from '../filter.pipe';
import { PipesModuleModule } from '../pipes-module/pipes-module.module';
import { RemovePipePipe } from '../pipes/remove-pipe.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModuleModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage,
  RemovePipePipe]
})
export class HomePageModule {}
