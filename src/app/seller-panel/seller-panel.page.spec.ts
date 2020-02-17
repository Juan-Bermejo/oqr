import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SellerPanelPage } from './seller-panel.page';

describe('SellerPanelPage', () => {
  let component: SellerPanelPage;
  let fixture: ComponentFixture<SellerPanelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerPanelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SellerPanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
