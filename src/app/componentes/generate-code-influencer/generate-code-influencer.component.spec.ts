import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GenerateCodeInfluencerComponent } from './generate-code-influencer.component';

describe('GenerateCodeInfluencerComponent', () => {
  let component: GenerateCodeInfluencerComponent;
  let fixture: ComponentFixture<GenerateCodeInfluencerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateCodeInfluencerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GenerateCodeInfluencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
