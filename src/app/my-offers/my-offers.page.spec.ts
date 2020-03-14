import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyOffersPage } from './my-offers.page';

describe('MyOffersPage', () => {
  let component: MyOffersPage;
  let fixture: ComponentFixture<MyOffersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOffersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyOffersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
