import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GbDeleteBuddyModalPage } from './gb-delete-buddy-modal.page';

describe('GbDeleteBuddyModalPage', () => {
  let component: GbDeleteBuddyModalPage;
  let fixture: ComponentFixture<GbDeleteBuddyModalPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GbDeleteBuddyModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GbDeleteBuddyModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
