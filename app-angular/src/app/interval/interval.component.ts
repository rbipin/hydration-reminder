import { Component, OnInit } from '@angular/core';
import { IntervalService } from '../interval/interval.service';

@Component({
  selector: 'app-interval',
  templateUrl: './interval.component.html',
  styleUrls: ['./interval.component.css'],
})
export class IntervalComponent implements OnInit {
  interval = 0;

  constructor(private intervalService: IntervalService) {}
  ngOnInit(): void {
    this.intervalService
      .getInterval()
      .then((interval) => (this.interval = interval))
      .catch((err) => console.log(err));
  }
  updateInterval(event) {
    const intervalVal = this.fromMmToMs(event.value);
    this.interval = intervalVal;
    this.intervalService.setInterval(intervalVal);
  }
  fromMmToMs(intervalInMinutes): number {
    if (intervalInMinutes === 0 || intervalInMinutes == null) {
      return 0;
    }
    return intervalInMinutes * 60 * 1000;
  }
}
