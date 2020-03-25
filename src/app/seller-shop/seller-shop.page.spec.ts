import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SellerShopPage } from './seller-shop.page';

describe('SellerShopPage', () => {
  let component: SellerShopPage;
  let fixture: ComponentFixture<SellerShopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerShopPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SellerShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
