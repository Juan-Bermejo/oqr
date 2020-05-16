import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CanalInfluencerPage } from './canal-influencer.page';

describe('CanalInfluencerPage', () => {
  let component: CanalInfluencerPage;
  let fixture: ComponentFixture<CanalInfluencerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanalInfluencerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CanalInfluencerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
