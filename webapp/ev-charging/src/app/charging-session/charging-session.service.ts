import { Injectable } from '@angular/core';
import { ChargingSession } from './charging-session';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ChargingSessionService {
    private chargingSessionUrl = 'api/charging-session';

    constructor(private http: Http) { }

    // get("/api/charging-session")
    getChargingSessions(): Promise<ChargingSession[]> {
        return this.http.get(this.chargingSessionUrl)
                   .toPromise()
                   .then(response => response.json() as ChargingSession[])
                   .catch(this.handleError);
    }

    // post("/api/charging-session")
    createChargingSession(newChargingSession: ChargingSession): Promise<ChargingSession> {
        return this.http.post(this.chargingSessionUrl, newChargingSession)
                   .toPromise()
                   .then(response => response.json() as ChargingSession)
                   .catch(this.handleError);
    }

    // get("/api/charging-session/:id")
    getChargingSession(): Promise<ChargingSession> {
        return this.http.get(this.chargingSessionUrl)
                   .toPromise()
                   .then(response => response.json() as ChargingSession)
                   .catch(this.handleError);
    }

    // put("/api/charging-session/:id")
    updateChargingSession(putChargingSession: ChargingSession): Promise<ChargingSession> {
        return this.http.put(this.chargingSessionUrl + '/' + putChargingSession.id, putChargingSession)
                   .toPromise();
                   .then(response => response.json() as ChargingSession)
                   .catch(this.handleError);
    }

    // delete("/api/charging-session/:id")
    deleteChargingSession(delChargingSessionId: String): Promise<String> {
        return this.http.delete(this.chargingSessionUrl + '/' + delContactId)
                   .toPromise()
                   .then(response => response.json() as String)
                   .catch(this.handleError);
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);  // log to console instead
    }

}
