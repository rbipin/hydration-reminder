import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { BackgroundComponent } from './background/background.component';
import { PopupComponent } from './popup/popup.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

import { IntervalModule } from './interval/interval.module';
import { ScheduleModule } from './schedule/schedule.module';


const routes = [
  { path: 'background', component: BackgroundComponent },
  { path: 'popup', component: PopupComponent },
  { path: '', redirectTo: 'popup', pathMatch: 'full' },
  { path: '**', redirectTo: 'popup', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    PopupComponent,
    BackgroundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    RouterModule.forRoot(routes, { useHash: true }),
    IntervalModule,
    ScheduleModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
