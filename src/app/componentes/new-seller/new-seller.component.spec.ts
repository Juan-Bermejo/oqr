import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewSellerComponent } from './new-seller.component';

describe('NewSellerComponent', () => {
  let component: NewSellerComponent;
  let fixture: ComponentFixture<NewSellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSellerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
