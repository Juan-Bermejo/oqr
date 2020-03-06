import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyLocationsPage } from './my-locations.page';

describe('MyLocationsPage', () => {
  let component: MyLocationsPage;
  let fixture: ComponentFixture<MyLocationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyLocationsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyLocationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
