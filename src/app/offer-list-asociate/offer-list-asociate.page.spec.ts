import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfferListAsociatePage } from './offer-list-asociate.page';

describe('OfferListAsociatePage', () => {
  let component: OfferListAsociatePage;
  let fixture: ComponentFixture<OfferListAsociatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferListAsociatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfferListAsociatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
