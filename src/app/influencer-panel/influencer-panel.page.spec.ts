import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfluencerPanelPage } from './influencer-panel.page';

describe('InfluencerPanelPage', () => {
  let component: InfluencerPanelPage;
  let fixture: ComponentFixture<InfluencerPanelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfluencerPanelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfluencerPanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
