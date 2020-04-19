import { Component, OnInit } from '@angular/core';
import { ScheduleService } from './schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  providers: [ScheduleService],
})
export class ScheduleComponent implements OnInit {
  scheduled: number[];
  checkedDays: boolean[] = [false, false, false, false, false, false, false];

  constructor(private scheduleService: ScheduleService) {
    this.scheduled = this.scheduleService.getSchedule();
    this.initializeDaysToggle();
  }
  initializeDaysToggle(): void{
    this.scheduled.map(x => {
        this.checkedDays[x - 1] = true;
    });
  }
  ngOnInit(): void {
    this.scheduleService.subscribe(this.next);
  }

  next = (scheduleValue, isOn) => {
    if (!this.scheduled.includes(scheduleValue)) {
      if (isOn) {
        this.scheduled.push(scheduleValue);
      } else {
        const index = this.scheduled.indexOf(scheduleValue);
        this.scheduled.splice(index, 1);
      }
    }
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
