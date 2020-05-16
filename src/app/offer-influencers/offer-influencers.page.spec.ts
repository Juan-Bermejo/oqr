import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfferInfluencersPage } from './offer-influencers.page';

describe('OfferInfluencersPage', () => {
  let component: OfferInfluencersPage;
  let fixture: ComponentFixture<OfferInfluencersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferInfluencersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfferInfluencersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
