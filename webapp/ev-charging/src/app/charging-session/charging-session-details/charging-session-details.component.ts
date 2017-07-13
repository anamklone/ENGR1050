import { Component, Input } from '@angular/core';
import { ChargingSession } from '../charging-session';
import { ChargingSessionService } from '../charging-session.service';

@Component({
    selector: 'app-charging-session-details',
    templateUrl: './charging-session-details.component.html',
    styleUrls: ['./charging-session-details.component.css']
})
export class ChargingSessionDetailsComponent {

    @Input()
    chargingSession: ChargingSession;

    constructor(private chargingSessionService: ChargingSessionService) { }

}
