import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { IonicModule } from '@ionic/angular';
import { MenuService } from '../../services/menu.service';
import { RouterModule } from '@angular/router';
import { PopOverProductsComponent } from '../pop-over-products/pop-over-products.component';



@NgModule({
  declarations: [
    MenuComponent,
    PopOverProductsComponent
  ],
  exports:[
    MenuComponent,
    PopOverProductsComponent
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
