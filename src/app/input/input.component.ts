import { Component, OnInit } from '@angular/core';
import { ChargingSession } from '../charging-session/charging-session';
import { ChargingSessionService } from '../charging-session/charging-session.service';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.css'],
    providers: [ChargingSessionService]
})
export class InputComponent implements OnInit {

    constructor(private chargingSessionService: ChargingSessionService) { }

    ngOnInit() {

    }

    updateChargingSession() {
        console.log("updating charging session");
    }
}
