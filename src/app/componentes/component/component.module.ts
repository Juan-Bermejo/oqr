import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { IonicModule } from '@ionic/angular';
import { MenuService } from '../../services/menu.service';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    MenuComponent
  ],
  exports:[
    MenuComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  providers:[
    MenuService,
  ]
})
export class ComponentModule { }
