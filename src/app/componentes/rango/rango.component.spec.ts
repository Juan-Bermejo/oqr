import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RangoComponent } from './rango.component';

describe('RangoComponent', () => {
  let component: RangoComponent;
  let fixture: ComponentFixture<RangoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RangoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
