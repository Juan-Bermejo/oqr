import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectRelatedProductsPage } from './select-related-products.page';

describe('SelectRelatedProductsPage', () => {
  let component: SelectRelatedProductsPage;
  let fixture: ComponentFixture<SelectRelatedProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectRelatedProductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectRelatedProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
