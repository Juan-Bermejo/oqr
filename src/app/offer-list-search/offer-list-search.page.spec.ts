import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfferListSearchPage } from './offer-list-search.page';

describe('OfferListSearchPage', () => {
  let component: OfferListSearchPage;
  let fixture: ComponentFixture<OfferListSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferListSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfferListSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
