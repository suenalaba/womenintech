import { TestBed } from '@angular/core/testing';

import { DbRetrieveService } from './db-retrieve.service';

describe('DbRetrieveService', () => {
  let service: DbRetrieveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbRetrieveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
