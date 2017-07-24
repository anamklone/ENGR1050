import { Component, OnInit } from '@angular/core';
import { ChargingSession } from '../charging-session/charging-session';
import { ChargingSessionService } from '../charging-session/charging-session.service';

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.css'],
    providers: [ChargingSessionService]
})
export class StatusComponent implements OnInit {

    constructor(private chargingSessionService: ChargingSessionService) { }

    ngOnInit() {

    }
}
