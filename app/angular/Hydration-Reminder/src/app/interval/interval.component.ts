import { Component, OnInit } from '@angular/core';
import { IntervalService } from '../interval/interval.service';

@Component({
    selector: 'app-interval',
    templateUrl: './interval.component.html',
    styleUrls: ['./interval.component.css']
})

export class IntervalComponent implements OnInit{
    interval = 0;

    constructor(private intervalService: IntervalService){
    }

    ngOnInit(): void {
        this.intervalService.subscribe(this.next);
        this.interval = this.intervalService.interval;
    }

    next = (intervalValue) => {
        this.interval = intervalValue;
    }

    updateInterval(event){
        this.intervalService.interval = event.value;
    }
};