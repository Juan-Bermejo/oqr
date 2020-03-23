import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BillingInformationPage } from './billing-information.page';

describe('BillingInformationPage', () => {
  let component: BillingInformationPage;
  let fixture: ComponentFixture<BillingInformationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingInformationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BillingInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
