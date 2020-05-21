/// <reference types="chrome"/>
import { Injectable } from '@angular/core';
import { RequestType } from '../shared/enums';

@Injectable({
  providedIn: 'root',
})
export class IntervalService {
  private _interval = 0;
  private reloadData = true;
  constructor() {}

  async getInterval(): Promise<number> {
    if (this.reloadData) {
      this.reloadData = false;
      const intervalValue = await this.getStoredInterval();
      this._interval = intervalValue;
      return intervalValue;
    } else {
      return this._interval;
    }
  }

  setInterval(value: number) {
    this._interval = value;
    (async () => {
      await this.storeInterval(this._interval);
      this.sendIntervalChangeMessage();
    })();
  }

  private sendIntervalChangeMessage(): void {
    chrome.runtime.sendMessage({
      command: RequestType.IntervalChange,
      interval: this._interval,
    });
  }

  storeInterval(newIntervalValue): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(
        { hydration_alert_interval: newIntervalValue },
        () => {
          const lastErr = chrome.runtime.lastError;
          if (lastErr == null) {
            resolve();
          } else {
            reject(lastErr);
          }
          // console.log('Reminder Interval set to ' + newInterval); //For Debugging
        }
      );
    });
  }
  getStoredInterval(): Promise<number> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get('hydration_alert_interval', (result) => {
        const err = chrome.runtime.lastError;
        let intervalValue: number = 0;
        if (err == null) {
          if (result.hydration_alert_interval == null) {
            intervalValue = 0;
          } else {
            intervalValue = result.hydration_alert_interval;
          }
          resolve(intervalValue);
        } else {
          reject(err);
        }
      });
    });
  }
  fromMsToMm(intervalInMs): number {
    if (intervalInMs === 0 || intervalInMs == null) {
      return 0;
    }
    return intervalInMs / 1000 / 60;
  }
}
