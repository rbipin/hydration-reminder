import { Component, OnInit } from '@angular/core';
import { ScheduleService } from './schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  providers: [ScheduleService],
})
export class ScheduleComponent {
  schedule: number[];
  checkedDays: boolean[] = [false, false, false, false, false, false, false];

  constructor(private scheduleService: ScheduleService) {
    this.scheduleService
      .getSchedule()
      .then((schedules) => {
        this.schedule = schedules;
        this.initializeDaysToggle();
      })
      .catch((err) => console.log(err));
  }

  initializeDaysToggle(): void {
    this.schedule.map((x) => {
      this.checkedDays[x - 1] = true;
    });
  }
  updateSchedule(event) {
    const isOn = event.source.checked;
    if (isOn) {
      this.scheduleService.addSchedule(event.value);
    } else {
      this.scheduleService.removeSchedule(event.value);
    }
  }
}
