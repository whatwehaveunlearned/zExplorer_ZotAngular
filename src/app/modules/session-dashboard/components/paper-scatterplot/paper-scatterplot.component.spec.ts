import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperScatterplotComponent } from './paper-scatterplot.component';

describe('PaperScatterplotComponent', () => {
  let component: PaperScatterplotComponent;
  let fixture: ComponentFixture<PaperScatterplotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaperScatterplotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperScatterplotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
