import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { IonicModule } from '@ionic/angular';
import { MenuService } from '../../services/menu.service';
import { RouterModule } from '@angular/router';
import { PopOverProductsComponent } from '../pop-over-products/pop-over-products.component';
import { NewSellerComponent } from '../new-seller/new-seller.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InputCodeInfluencerComponent } from '../input-code-influencer/input-code-influencer.component';



@NgModule({
  declarations: [
    MenuComponent,
    PopOverProductsComponent,
    NewSellerComponent,
    InputCodeInfluencerComponent
  ],
  exports:[
    MenuComponent,
    PopOverProductsComponent,
    NewSellerComponent,
    InputCodeInfluencerComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[
    MenuService,
  ]
})
export class ComponentModule { }
