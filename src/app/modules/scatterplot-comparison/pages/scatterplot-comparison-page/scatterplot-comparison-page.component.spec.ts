import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterplotComparisonPageComponent } from './scatterplot-comparison-page.component';

describe('ScatterplotComparisonPageComponent', () => {
  let component: ScatterplotComparisonPageComponent;
  let fixture: ComponentFixture<ScatterplotComparisonPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScatterplotComparisonPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterplotComparisonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
