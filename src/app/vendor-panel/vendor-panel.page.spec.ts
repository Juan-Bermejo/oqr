import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VendorPanelPage } from './vendor-panel.page';

describe('VendorPanelPage', () => {
  let component: VendorPanelPage;
  let fixture: ComponentFixture<VendorPanelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorPanelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorPanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
