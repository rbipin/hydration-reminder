import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSliderModule } from '@angular/material/slider';
import {IntervalComponent} from './interval.component';
import { FromMsToMm } from './fromMsToMm';



@NgModule({
  declarations: [
    IntervalComponent,
    FromMsToMm
  ],
  imports: [
    CommonModule,
    MatGridListModule,
    MatSliderModule
  ],
  exports: [
    IntervalComponent
  ]
})
export class IntervalModule { }
