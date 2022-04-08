import { TestBed } from '@angular/core/testing';

import { WorkoutExercisesService } from './workout-exercises.service';

describe('WorkoutExercisesService', () => {
  let service: WorkoutExercisesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutExercisesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
