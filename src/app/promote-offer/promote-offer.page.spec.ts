import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PromoteOfferPage } from './promote-offer.page';

describe('PromoteOfferPage', () => {
  let component: PromoteOfferPage;
  let fixture: ComponentFixture<PromoteOfferPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoteOfferPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PromoteOfferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
