import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RelatedProductsPage } from './related-products.page';

describe('RelatedProductsPage', () => {
  let component: RelatedProductsPage;
  let fixture: ComponentFixture<RelatedProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatedProductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RelatedProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
