import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AsociateOfferPage } from './asociate-offer.page';

describe('AsociateOfferPage', () => {
  let component: AsociateOfferPage;
  let fixture: ComponentFixture<AsociateOfferPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsociateOfferPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AsociateOfferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
