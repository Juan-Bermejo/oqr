import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewHomePage } from './new-home.page';

describe('NewHomePage', () => {
  let component: NewHomePage;
  let fixture: ComponentFixture<NewHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
