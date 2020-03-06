import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalNewRegionPage } from './modal-new-region.page';

describe('ModalNewRegionPage', () => {
  let component: ModalNewRegionPage;
  let fixture: ComponentFixture<ModalNewRegionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewRegionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalNewRegionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
