import { Injectable } from '@angular/core';
import { IInterval } from './interval';
import { StorageService } from '../shared/storage.service';

@Injectable({
    providedIn: 'root'
})
export class IntervalService{
    private _interval: number =0;
    private observers: any = [];
    get interval(): number{
        return this._interval;
    }

    set interval(value: number){
        this._interval = value;
        this.notify(value);
    }

    constructor(private storageService: StorageService){
    }

    subscribe(observer: any): void{
        this.observers.push(observer);
    }
    notify(value: number): void{
        if (this.observers.length >= 1){
            this.observers.forEach(obs => obs(value));
        }
    }
}
