import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GbFindBuddyBoardingPage } from './gb-find-buddy-boarding.page';

describe('GbFindBuddyBoardingPage', () => {
  let component: GbFindBuddyBoardingPage;
  let fixture: ComponentFixture<GbFindBuddyBoardingPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GbFindBuddyBoardingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GbFindBuddyBoardingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
