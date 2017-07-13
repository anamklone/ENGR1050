import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargingSessionDetailsComponent } from './charging-session-details.component';

describe('ChargingSessionDetailsComponent', () => {
  let component: ChargingSessionDetailsComponent;
  let fixture: ComponentFixture<ChargingSessionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargingSessionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargingSessionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
