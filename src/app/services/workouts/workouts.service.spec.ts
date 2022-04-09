import { TestBed } from '@angular/core/testing';

import { WorkoutsService } from './workouts.service';

describe('WorkoutsService', () => {
  let service: WorkoutsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
