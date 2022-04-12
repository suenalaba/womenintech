import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { gymBuddyGoals } from 'src/app/data/gym-buddy-data/GymBuddyGoals';
import { personalTraits } from 'src/app/data/gym-buddy-data/Traits';
import { workoutTimePreference } from '../../../data/gym-buddy-data/WorkoutTimePreference';
import { DbRetrieveService } from 'src/app/services/db-retrieve.service';
import { GymBuddyProfileInfo } from '../gb-findbuddy/GymBuddyInformation';
@Component({
  selector: 'app-gb-home',
  templateUrl: './gb-home.page.html',
  styleUrls: ['./gb-home.page.scss'],
})
export class GbHomePage implements OnInit {

  private timePrefList = workoutTimePreference;
  private buddyGoalsList = gymBuddyGoals;
  private personalTraitsList = personalTraits;
  private fullName: string;
  private profilePicture: string;
  private briefIntro: string;
  private prefWorkoutTime: string[] = [];
  private gymBuddyGoals: string[] = [];
  private personalTraits: string[] = [];
  private currentUser: GymBuddyProfileInfo;


  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private dbRetrieveService: DbRetrieveService,
  ) {

   }


  public get getFullName() {
    // this.fullName = this.userInfo.firstName + ' ' + this.userInfo.lastName;
    return this.fullName;
  }

  public get getBriefIntro() {
    // this.briefIntro = this.gymBuddyInfo.briefIntro;
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

  public get getProfilePicture() {
    return this.profilePicture
  }

  async ngOnInit() {
    await this.dbRetrieveService.setCurrentUser();
    this.currentUser=this.dbRetrieveService.retrieveCurrentUser();
    /** checks if the user has signed up for Gym Buddy */
    // if(this.gymBuddyService.isSignedUp())
    //check if user is signed up.

    this.checkIfUserIsSignedUp();
    this.setUserDetails();
    //this line only follows if user is signed up, basically to set the status of current user.

  }

  public getColor(i: number) {
    i = i % 5;
    const colors = ['#ED93D5','#94DAEC','#FB6175','#EFBCFF','#F2D28A'];
    return colors[i];
  }

  /**
   * Navigate to find a buddy.
   */
  public async goToFindBuddy() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-find-buddy-boarding', { replaceUrl: true });
    //this.router.navigateByUrl('tabs/gym-buddy/gb-findbuddy', { replaceUrl: true });
    //pages/gym-buddy/gb-find-buddy-boarding/gb-find-buddy-boarding.module
  }

  /**
   * Navigate to update account preferences
   */
   public async goToUpdateAcc() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-update-account-preference', { replaceUrl: true });
  }

  /**
   * Navigate to Buddy list (Chat Home Page)
   */
  public async goToBuddyList() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-buddylist-home', { replaceUrl: true });
  }

  /**
   * CALLING USER DYNAMICALLY, check if user is signed up.
   * If yes, load info else, reroute to sign up page.
   */
  private async checkIfUserIsSignedUp(){
    const loading = await this.loadingController.create();
    await loading.present();
      if(!this.currentUser.isSignUp) {
       this.router.navigateByUrl('tabs/gym-buddy/gb-sign-up', { replaceUrl: true });
       loading.dismiss();
      }
    loading.dismiss();
  }

  private setUserDetails() {
    this.fullName = this.currentUser.name;
      this.briefIntro = this.currentUser.getbriefIntro;
      console.log("Profile picture:")
      console.log(this.currentUser.profilePicture)
      this.profilePicture=this.currentUser.profilePicture;

      this.setWorkoutTimeTextDisplay();
      this.setGymBuddyGoalsTextDisplay();
      this.setPersonalTraitsTextDisplay();
  }

  private setPersonalTraitsTextDisplay() {
    this.personalTraits = [];
    for (const val of this.personalTraitsList) {
      //console.log(val.value);
      //console.log(this.gymBuddyInfo.workoutTimePreference);
      if (this.currentUser.getPersonalTraits.includes(val.value)) {
        //console.log(val.text);
        this.personalTraits.push(val.text);
      }
      //console.log(this.prefWorkoutTime);
    }
  }

  private setGymBuddyGoalsTextDisplay() {
    this.gymBuddyGoals = [];
    for (const val of this.buddyGoalsList) {
      //console.log(val.value);
      //console.log(this.gymBuddyInfo.workoutTimePreference);
      if (this.currentUser.getGymBuddyGoals.includes(val.value)) {
        //console.log(val.text);
        this.gymBuddyGoals.push(val.text);
      }
      //console.log(this.prefWorkoutTime);
    }
  }

  private setWorkoutTimeTextDisplay() {
    this.prefWorkoutTime = [];
    for (const val of this.timePrefList) {
      //console.log(val.value);
      //console.log(this.gymBuddyInfo.workoutTimePreference);
      if (this.currentUser.getWorkoutTimePreference.includes(val.value)) {
        //console.log(val.text);
        //convert all but first letter to lower case.
        val.text = val.text.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        this.prefWorkoutTime.push(val.text);
      }
      //console.log(this.prefWorkoutTime);
    }
  }
}
