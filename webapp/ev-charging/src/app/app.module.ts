import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChargingSessionDetailsComponent } from './charging-session/charging-session-details/charging-session-details.component';
import { ChargingSessionListComponent } from './charging-session/charging-session-list/charging-session-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ChargingSessionDetailsComponent,
    ChargingSessionListComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
