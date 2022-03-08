import { TestBed } from '@angular/core/testing';

import { GymBuddyService } from './gym-buddy.service';

describe('GymBuddyService', () => {
  let service: GymBuddyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GymBuddyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
