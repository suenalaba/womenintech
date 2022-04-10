import { TestBed } from '@angular/core/testing';

import { GestureControllerService } from './gesture-controller.service';

describe('GestureControllerService', () => {
  let service: GestureControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestureControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
