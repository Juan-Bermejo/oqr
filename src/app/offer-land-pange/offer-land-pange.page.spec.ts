import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfferLandPangePage } from './offer-land-pange.page';

describe('OfferLandPangePage', () => {
  let component: OfferLandPangePage;
  let fixture: ComponentFixture<OfferLandPangePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLandPangePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfferLandPangePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
