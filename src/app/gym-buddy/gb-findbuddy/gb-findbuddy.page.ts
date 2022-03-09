import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GymBuddyProfileInfo } from './GymBuddyInformation';

@Component({
  selector: 'app-gb-findbuddy',
  templateUrl: './gb-findbuddy.page.html',
  styleUrls: ['./gb-findbuddy.page.scss'],
})
export class GbFindbuddyPage implements OnInit {

  private userInfo = JSON.parse(localStorage.getItem('userInfo'));
  private gymBuddyInfo = this.userInfo.gymBuddyDetails;
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    //const test = new Testz();
    //console.log(test.name);
    console.log(2/3*20/100);
    let mainuser = new GymBuddyProfileInfo();
    console.log(mainuser.getbriefIntro);
    mainuser.setbriefIntro = 'hellotinysherwin';
    console.log(mainuser.getbriefIntro);
    console.log(mainuser.getBuddyTrainStyle);
    mainuser.updateGymBuddyArrays(mainuser.getBuddyTrainStyle,'test');
    console.log(mainuser.getBuddyTrainStyle);
    mainuser.removeFromGymBuddyArrays(mainuser.getBuddyTrainStyle, 'test');
    console.log(mainuser.getBuddyTrainStyle);
  }
  async goToGBHome() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-home', { replaceUrl: true });
  }
}
