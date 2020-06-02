import { Injectable } from '@angular/core';
import { IntervalService } from '../shared/services/interval.service';
import { ScheduleService } from '../shared/services/schedule.service';

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  private interval: number;
  private schedule: number[];
  private alertTriggered = false;
  private intervalId: number;
  constructor(
    private intervalService: IntervalService,
    private scheduleService: ScheduleService
  ) {
    Promise.all([intervalService.getInterval(), scheduleService.getSchedule()])
      .then((result) => {
        this.interval = result[0];
        this.schedule = result[1];
      })
      .then(() => this.startNotifying());
  }

  startNotifying(): void {
    this.startNotificationListener();
    this.startAlert();
  }

  private startNotificationListener(): void {
    // When chrome notification is closed, reset triggered variable to false.
    chrome.notifications.onClosed.addListener((notificationID, byUser) => {
      // console.log('chrome notification closed'); //For Debugging
      this.resetAlertTrigger();
    });

    // When chrome notification is clicked, reset the triggered variable to false.
    chrome.notifications.onClicked.addListener((notificationID) => {
      // console.log('chrome notification closed'); //For Debugging
      this.resetAlertTrigger();
    });
  }

  restartAlert(): void {
    this.clearAlertInterval();
    this.startAlert();
  }
  setDisabledIcon(): void {
    chrome.browserAction.setIcon({ path: 'assets/water-32-disabled.png' });
  }
  setEnabledIcon(): void {
    chrome.browserAction.setIcon({ path: 'assets/water-32.png' });
  }

  triggerAlert(): void {
    const notificationOptions = {
      type: 'basic',
      title: 'Hydration Reminder',
      message: 'Time to drink water ',
      iconUrl: 'assets/water-100.png',
      silent: true,
    };
    chrome.notifications.create(notificationOptions, (notificationId) => {
      setTimeout(() => {
        chrome.notifications.clear(notificationId);
        this.resetAlertTrigger();
      }, 10000);
    });
  }
  startAlert(): void {
    if (this.interval === 0) {
      this.clearAlertInterval();
      this.setDisabledIcon();
      return;
    }
    /*
    // For Debugging
    console.log('Inside start alert alertInterval: '+ alertInvervalTime 
    + " alertTriggered: "+alertTriggered +" alertSchedule: "+alertScheduleDays);*/
    if (this.schedule == null || !this.isScheduledDay()) {
      // console.log("Reminder is not running"); //For Debugging
      this.clearAlertInterval();
      this.setDisabledIcon();
      return;
    }
    this.setEnabledIcon();
    // console.log('Setting the alert'); //For Debugging;
    this.intervalId = window.setInterval(() => {
      if (this.alertTriggered === false) {
        // const today = new Date(); // For Debugging
        // const date =
        //   today.getFullYear() +
        //   '-' +
        //   (today.getMonth() + 1) +
        //   '-' +
        //   today.getDate(); // For Debugging
        // console.log(`triggering alert ${date},  ${today.toTimeString()}`); //For Debugging
        this.triggerAlert();
        this.alertTriggered = true;
      }
    }, this.interval);
    // console.log('Alert Trigger Set, intervalId: '+intervalId); //For Debugging
  }

  // Reset the alert triggered
  private resetAlertTrigger(): void {
    this.alertTriggered = false;
  }

  clearAlertInterval(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
  }

  isScheduledDay(): boolean {
    if (this.schedule === undefined || this.schedule.length === 0) {
      return false;
    }
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay() + 1;
    if (this.schedule.includes(dayOfWeek)) {
      return true;
    }
    return false;
  }

  setInterval(newInterval): void {
    this.interval = newInterval;
    this.restartAlert();
  }

  setSchedule(newSchedule, isOn): void {
    if (isOn) {
      this.schedule.push(newSchedule);
    } else {
      const index = this.schedule.indexOf(newSchedule);
      this.schedule.splice(index, 1);
    }
    this.restartAlert();
  }
}
