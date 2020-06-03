import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {ScheduleComponent} from './schedule.component';



@NgModule({
  declarations: [
    ScheduleComponent
  ],
  imports: [
    CommonModule,
    MatButtonToggleModule
  ],
  exports: [
    ScheduleComponent
  ]
})
export class ScheduleModule { }
