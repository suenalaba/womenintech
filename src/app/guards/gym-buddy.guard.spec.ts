import { TestBed } from '@angular/core/testing';

import { GymBuddyGuard } from './gym-buddy.guard';

describe('GymBuddyGuard', () => {
  let guard: GymBuddyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GymBuddyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
