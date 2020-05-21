import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { IntervalComponent } from './interval/interval.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { BackgroundComponent } from './background/background.component';
import { PopupComponent } from './popup/popup.component';
import { FromMsToMm } from './shared/fromMsToMm';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';


const routes = [
  { path: 'background', component: BackgroundComponent },
  { path: 'popup', component: PopupComponent },
  { path: '', redirectTo: 'popup', pathMatch: 'full' },
  { path: '**', redirectTo: 'popup', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    IntervalComponent,
    ScheduleComponent,
    PopupComponent,
    BackgroundComponent,
    FromMsToMm
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatSliderModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatIconModule,
    MatGridListModule,
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
