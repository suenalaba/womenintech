import { TestBed } from '@angular/core/testing';

import { WorkoutAPIService } from './workout-API.service';

describe('WorkoutAPIService', () => {
  let service: WorkoutAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
