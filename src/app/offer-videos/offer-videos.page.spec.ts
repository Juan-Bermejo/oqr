import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfferVideosPage } from './offer-videos.page';

describe('OfferVideosPage', () => {
  let component: OfferVideosPage;
  let fixture: ComponentFixture<OfferVideosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferVideosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfferVideosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
