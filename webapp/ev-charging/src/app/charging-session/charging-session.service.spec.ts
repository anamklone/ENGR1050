import { TestBed, inject } from '@angular/core/testing';

import { ChargingSessionService } from './charging-session.service';

describe('ChargingSessionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChargingSessionService]
    });
  });

  it('should be created', inject([ChargingSessionService], (service: ChargingSessionService) => {
    expect(service).toBeTruthy();
  }));
});
