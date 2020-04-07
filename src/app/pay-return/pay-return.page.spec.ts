import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PayReturnPage } from './pay-return.page';

describe('PayReturnPage', () => {
  let component: PayReturnPage;
  let fixture: ComponentFixture<PayReturnPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayReturnPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PayReturnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
