import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import {BrowserModule} from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
// import {MatGridListModule} from '@angular/material/grid-list';
import {NavbarComponent} from './pages/navbar/navbar.component'
import {DragDropModule} from '@angular/cdk/drag-drop';

import { ColorSketchModule } from 'ngx-color/sketch';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSortModule,
  MatStepperModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatPaginatorModule,
} from '@angular/material';

import { MatTableModule } from '@angular/material/table';
import {MatTreeModule} from '@angular/material/tree';
import {ClusterDialog} from '../shared/services/scatterplot.service'



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,

    //Colorpicker
    // BrowserModule,
    ColorSketchModule,
    // BrowserAnimationsModule,

    

    // Material 
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSortModule,
    MatStepperModule,
    MatPaginatorModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTableModule,
    DragDropModule,
    MatTreeModule
  ],
  exports :[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    FlexLayoutModule,
    ClusterDialog,

    ColorSketchModule,

    // Material 
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSortModule,
    MatStepperModule,
    MatPaginatorModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTableModule,
    DragDropModule,
    MatTreeModule
  ],
  declarations: [
    NavbarComponent,
    ClusterDialog,
  ],
  entryComponents: [ClusterDialog],
})
export class SharedModule { }
