import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalSimplePage } from './modal-simple.page';

describe('ModalSimplePage', () => {
  let component: ModalSimplePage;
  let fixture: ComponentFixture<ModalSimplePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSimplePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalSimplePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
