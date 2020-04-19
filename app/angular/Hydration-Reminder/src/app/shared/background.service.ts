import { Injectable } from '@angular/core';
import { IntervalService } from '../interval/interval.service';
import { ScheduleService } from '../schedule/schedule.service';

@Injectable({
    providedIn: 'root'
})
export class BackgroundService{
    private interval: number;
    private schedule: number[];
    constructor(private intervalService: IntervalService, private scheduleService: ScheduleService){
        this.interval = intervalService.interval;
        this.schedule = scheduleService.schedule;
    }




}
