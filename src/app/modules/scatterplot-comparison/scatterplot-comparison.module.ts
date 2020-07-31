import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScatterplotComparisonPageComponent } from './pages/scatterplot-comparison-page/scatterplot-comparison-page.component';
import { SimpleScatterplotComponent } from './components/simple-scatterplot/simple-scatterplot.component';

import {SharedModule} from '../../shared/shared.module'

@NgModule({
  declarations: [ScatterplotComparisonPageComponent, SimpleScatterplotComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ScatterplotComparisonModule { }
