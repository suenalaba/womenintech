import { TestBed } from '@angular/core/testing';

import { WorkoutAlgoService } from './workout-algo.service';

describe('WorkoutAlgoService', () => {
  let service: WorkoutAlgoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutAlgoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
