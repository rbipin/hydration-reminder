import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackBarMessageNotification{
    private snackBarRef: any;
    constructor(private snackBar: MatSnackBar){
        this.snackBarRef.afterDismissed().subscribe(this.onDismissSnackBarNotification);
    }
    ShowMessage(): void {
        this.snackBarRef =  this.snackBar.open('Drink Now!!');
        console.log('Open message');
    }

    private onDismissSnackBarNotification = () => {
        console.log('The snack-bar was dismissed');
    }

};