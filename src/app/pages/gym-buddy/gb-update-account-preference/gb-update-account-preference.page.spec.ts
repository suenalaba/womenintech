import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GbUpdateAccountPreferencePage } from './gb-update-account-preference.page';

describe('GbUpdateAccountPreferencePage', () => {
  let component: GbUpdateAccountPreferencePage;
  let fixture: ComponentFixture<GbUpdateAccountPreferencePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GbUpdateAccountPreferencePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GbUpdateAccountPreferencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
