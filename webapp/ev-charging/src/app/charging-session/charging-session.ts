export class ChargingSession {
    id: string;
    valid: boolean;
    estimatedTime: {
        hours: number;
        minutes: number;
    }
}
