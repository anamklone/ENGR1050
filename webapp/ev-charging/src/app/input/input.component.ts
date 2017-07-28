import { Component, OnInit } from '@angular/core';
import { ChargingSession } from '../charging-session/charging-session';
import { ChargingSessionService } from '../charging-session/charging-session.service';
import 'rxjs/Rx';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.css'],
    providers: [ChargingSessionService]
})
export class InputComponent implements OnInit {

    chargingSession: ChargingSession;

    constructor(private chargingSessionService: ChargingSessionService) { }

    ngOnInit() {
        // Somehow get chargingSession object from database based on /:id????????
        //console.log("get charging session by id (id = " + id + ")");
        //this.chargingSessionService
        //    .getChargingSession("1234")
        //    .then((chargingSession: ChargingSession) => {
        //        this.chargingSession = chargingSession.map((chargingSession) => {
        //            return chargingSession;
        //        });
        //    });
    }

    updateChargingSession() {
        console.log("updating charging session");
        this.chargingSessionService.updateChargingSession(this.chargingSession);
    }
}
