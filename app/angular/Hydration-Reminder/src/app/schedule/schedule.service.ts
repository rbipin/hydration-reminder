import { Injectable } from '@angular/core';
import { StorageService } from '../shared/storage.service';

@Injectable({
    providedIn: 'root'
})
export class ScheduleService{
    private scheduleDays: number[] = [];
    private observers: any = [];
    // get schedule(): number[]{
    //     return this._schedule;
    // }

    // set schedule(value: number[]){
    //     this._schedule = value;
    //     this.notify();
    // }

    getSchedule(): number[]{
        return this.scheduleDays;
    }
    addSchedule(day: number): void {
        if (!this.scheduleDays.includes(day)) {
            this.scheduleDays.push(day);
            this.notify(day, true);
        }
    }

    removeSchedule(day: number): void {
        const index = this.scheduleDays.indexOf(day);
        if (index > -1){
            this.scheduleDays.splice(index, 1);
            this.notify(day, false);
        }
    }

    constructor(private storageService: StorageService){
    }

    subscribe(observer: any): void{
        this.observers.push(observer);
    }
    notify(value: number, isOn: boolean): void{
        if (this.observers.length >= 1){
            this.observers.forEach(obs => obs(value, isOn));
        }
    }
}
