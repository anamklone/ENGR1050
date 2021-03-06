import { Component, OnInit } from '@angular/core';
import { ChargingSession } from '../charging-session';
import { ChargingSessionService } from '../charging-session.service';
import { ChargingSessionDetailsComponent } from '../charging-session-details/charging-session-details.component';

@Component({
    selector: 'charging-session-list',
    templateUrl: './charging-session-list.component.html',
    styleUrls: ['./charging-session-list.component.css'],
    providers: [ChargingSessionService]
})
export class ChargingSessionListComponent implements OnInit {

    chargingSessions: ChargingSession[]
    selectedChargingSession: ChargingSession

    constructor(private chargingSessionService: ChargingSessionService) { }

    ngOnInit() {
        this.chargingSessionService
         .getChargingSessions()
         .then((chargingSessions: ChargingSession[]) => {
            this.chargingSessions = chargingSessions.map((chargingSession) => {
                return chargingSession;
            });
         });
    }

    selectChargingSession(chargingSession: ChargingSession) {
        this.selectedChargingSession = chargingSession
    }
}
