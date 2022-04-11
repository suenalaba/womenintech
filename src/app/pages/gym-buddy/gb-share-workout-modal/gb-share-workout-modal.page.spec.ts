import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GbShareWorkoutModalPage } from './gb-share-workout-modal.page';

describe('GbShareWorkoutModalPage', () => {
  let component: GbShareWorkoutModalPage;
  let fixture: ComponentFixture<GbShareWorkoutModalPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GbShareWorkoutModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GbShareWorkoutModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
