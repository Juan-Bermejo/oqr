import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InputCodeInfluencerComponent } from './input-code-influencer.component';

describe('InputCodeInfluencerComponent', () => {
  let component: InputCodeInfluencerComponent;
  let fixture: ComponentFixture<InputCodeInfluencerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputCodeInfluencerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InputCodeInfluencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
