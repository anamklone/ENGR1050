import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { InputComponent } from './input/input.component';
import { StatusComponent } from './status/status.component';
import { ChargingSessionDetailsComponent } from './charging-session/charging-session-details/charging-session-details.component';
import { ChargingSessionListComponent } from './charging-session/charging-session-list/charging-session-list.component';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    StatusComponent,
    ChargingSessionDetailsComponent,
    ChargingSessionListComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
