import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargingSessionListComponent } from './charging-session-list.component';

describe('ChargingSessionListComponent', () => {
  let component: ChargingSessionListComponent;
  let fixture: ComponentFixture<ChargingSessionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargingSessionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargingSessionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
