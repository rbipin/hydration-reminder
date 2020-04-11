import { Component } from '@angular/core';

@Component({
    selector: 'app-interval',
    templateUrl: './interval.component.html',
    styleUrls: ['./interval.component.css']
})

export class IntervalComponent{
    interval = 0;

    updateInterval(event){
        this.interval = event.value;
    }
};