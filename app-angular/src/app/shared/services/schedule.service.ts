/// <reference types="chrome"/>
import { Injectable } from '@angular/core';
import { RequestType } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private scheduleDays: number[] = [];
  private reloadData = true;
  constructor() {}

  sendScheduleChangeMessage(day: number, isAdd: boolean) {
    chrome.runtime.sendMessage({
      command: RequestType.ScheduleChange,
      scheduledDay: day,
      isOn: isAdd,
    });
  }

  async getSchedule(): Promise<number[]> {
    if (this.reloadData) {
      this.reloadData = false;
      this.scheduleDays = await this.getStoredSchedule();
      return this.scheduleDays;
    } else {
      return this.scheduleDays;
    }
  }
  addSchedule(day: number): void {
    const dayVal = Number(day);
    if (!this.scheduleDays.includes(dayVal)) {
      this.scheduleDays.push(dayVal);
      (async () => {
        await this.storeSchedule(this.scheduleDays);
        this.sendScheduleChangeMessage(dayVal, true);
      })();
    }
  }
  removeSchedule(day: number): void {
    const dayVal = Number(day);
    const index = this.scheduleDays.indexOf(dayVal);
    if (index > -1) {
      this.scheduleDays.splice(index, 1);
      (async () => {
        this.storeSchedule(this.scheduleDays);
        this.sendScheduleChangeMessage(dayVal, false);
      })();
    }
  }
  storeSchedule(newSchedule: number[]): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(
        {
          hydration_alert_schedule: newSchedule,
        },
        () => {
          const err = chrome.runtime.lastError;
          if (err == null) {
            resolve();
          } else {
            reject(err);
          }
          console.log('Schedule set to ' + this.scheduleDays); // For Debugging
        }
      );
    });
  }
  getStoredSchedule(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get('hydration_alert_schedule', (result) => {
        const err = chrome.runtime.lastError;
        let schedules: number[] = [];
        if (err == null) {
          if (result.hydration_alert_schedule == null) {
            schedules = [];
          } else {
            schedules = result.hydration_alert_schedule;
            console.log(`Schedule Service: ${this.scheduleDays}`);
          }
          resolve(schedules);
        } else {
          reject(err);
        }
      });
    });
  }
}
