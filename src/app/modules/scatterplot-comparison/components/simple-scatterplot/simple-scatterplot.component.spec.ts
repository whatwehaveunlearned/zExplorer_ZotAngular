import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleScatterplotComponent } from './simple-scatterplot.component';

describe('SimpleScatterplotComponent', () => {
  let component: SimpleScatterplotComponent;
  let fixture: ComponentFixture<SimpleScatterplotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleScatterplotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleScatterplotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
