import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { gymBuddyGoals } from 'src/app/data/gym-buddy-data/GymBuddyGoals';
import { personalTraits } from 'src/app/data/gym-buddy-data/Traits';
import { workoutTimePreference } from '../../data/gym-buddy-data/WorkoutTimePreference';

@Component({
  selector: 'app-gb-home',
  templateUrl: './gb-home.page.html',
  styleUrls: ['./gb-home.page.scss'],
})
export class GbHomePage implements OnInit {

  timePrefList = workoutTimePreference;
  buddyGoalsList = gymBuddyGoals;
  personalTraitsList = personalTraits;
  private userInfo = JSON.parse(localStorage.getItem('userInfo'));
  private gymBuddyInfo = this.userInfo.gymBuddyDetails;
  private fullName: string;
  private briefIntro: string;
  private prefWorkoutTime: string[] = [];
  private gymBuddyGoals: string[] = [];
  private personalTraits: string[] = [];

  constructor(
    private router: Router,
  ) { }

  public get getFullName() {
    this.fullName = this.userInfo.firstName + ' ' + this.userInfo.lastName;
    return this.fullName;
  }

  public get getBriefIntro() {
    this.briefIntro = this.gymBuddyInfo.briefIntro;
    return this.briefIntro;
  }

  public get getPrefWorkoutTime() {
    return this.prefWorkoutTime;
  }

  public get getGymBuddyGoals() {
    return this.gymBuddyGoals;
  }

  public get getPersonalTraits() {
    return this.personalTraits;
  }
  /*public get getPrefWorkoutTime() {
    for (const val of this.timePrefList) {
      //console.log(val.value);
      //console.log(this.gymBuddyInfo.workoutTimePreference);
      if (this.gymBuddyInfo.workoutTimePreference.includes(val.value)) {
        //console.log(val.text);
        this.prefWorkoutTime.push(val.text);
      }
      console.log(this.prefWorkoutTime);
    }
    return this.prefWorkoutTime;
  }*/



  ngOnInit() {
    /*for (const val of this.timePrefList) {
      console.log(val.value);
      if (this.gymBuddyInfo.workoutTimePreference.includes(val.value)) {
        this.prefWorkoutTime.push(val.text);
      }
    }*/
    this.getWorkoutTimeTextDisplay();
    this.getGymBuddyGoalsTextDisplay();
    this.getPersonalTraitsTextDisplay();
  }
  async goToFindBuddy() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-findbuddy', { replaceUrl: true });
  }

  async goToBuddyList() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-buddylist-home', { replaceUrl: true });
  }
  private getPersonalTraitsTextDisplay() {
    for (const val of this.personalTraitsList) {
      //console.log(val.value);
      //console.log(this.gymBuddyInfo.workoutTimePreference);
      if (this.gymBuddyInfo.personalTraits.includes(val.value)) {
        //console.log(val.text);
        this.personalTraits.push(val.text);
      }
      //console.log(this.prefWorkoutTime);
    }
  }

  private getGymBuddyGoalsTextDisplay() {
    for (const val of this.buddyGoalsList) {
      //console.log(val.value);
      //console.log(this.gymBuddyInfo.workoutTimePreference);
      if (this.gymBuddyInfo.gymBuddyGoals.includes(val.value)) {
        //console.log(val.text);
        this.gymBuddyGoals.push(val.text);
      }
      //console.log(this.prefWorkoutTime);
    }
  }

  private getWorkoutTimeTextDisplay() {
    for (const val of this.timePrefList) {
      //console.log(val.value);
      //console.log(this.gymBuddyInfo.workoutTimePreference);
      if (this.gymBuddyInfo.workoutTimePreference.includes(val.value)) {
        //console.log(val.text);
        this.prefWorkoutTime.push(val.text);
      }
      //console.log(this.prefWorkoutTime);
    }
  }
  /*signUp(){
    this.router.navigateByUrl('tabs/gym-buddy/gb-sign-up', { replaceUrl: true });
  }*/

}
