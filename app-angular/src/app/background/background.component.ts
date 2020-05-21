import { Component, OnInit } from '@angular/core';
import { BackgroundService } from './background.service';
import { RequestType } from '../shared/enums';
@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
})
export class BackgroundComponent implements OnInit {
  constructor(private backgroundSvc: BackgroundService) {}
  ngOnInit(): void {
    this.startRequestHanlder();
  }

  startRequestHanlder() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.command) {
        case RequestType.IntervalChange:
          this.backgroundSvc.setInterval(request.interval);
          break;
        case RequestType.ScheduleChange:
          this.backgroundSvc.setSchedule(request.scheduledDay, request.isOn);
          break;
      }
    });
  }

  startNotificationScheduler() {
    this.backgroundSvc.startAlert();
  }
}
