export class ChargingSession {
    id: string;
    active: boolean;
    pinId: number;
    estimatedTime: {
        hours: number;
        minutes: number;
    }
    startTime: string;
    maxChargeRate: number;
}
