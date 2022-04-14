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
/**
 * This class initializes the display for the gym buddy home page and logs the user input into the application control.
 */
export class GbHomePage implements OnInit {
  private briefIntro: string;
  private buddyGoalsList = gymBuddyGoals;
  private currentUser: GymBuddyProfileInfo;
  private fullName: string;
  private gymBuddyGoals: string[] = [];
  private personalTraits: string[] = [];
  private personalTraitsList = personalTraits;
  private prefWorkoutTime: string[] = [];
  private profilePicture: string;
  private timePrefList = workoutTimePreference;
  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private dbRetrieveService: DbRetrieveService,
  ) {

   }

   //getter and setter functions
   public get getAge() {
     if(this.currentUser)
      {return this.currentUser.age;}
    return 0;
   }

  public get getFullName() {
    return this.fullName;
  }

  public get getBriefIntro() {
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
    return this.profilePicture;
  }

  /**
   * Main entry point into the page, which initialises when the class is instantiated.
   * It will retrieve the current user data from the database and set user details if the user has already signed up for gym buddy.
   */
  async ngOnInit() {
    await this.dbRetrieveService.setCurrentUser();
    this.currentUser=this.dbRetrieveService.retrieveCurrentUser();
    this.checkIfUserIsSignedUp();
    this.setUserDetails();
  }

  /**
   * Gets the index of the element to display and returns the corresponding color to display the element.
   *
   * @param i The index of element to display.
   * @returns The color to display for the element.
   */
  public getColor(i: number) {
    i = i % 5;
    const colors = ['#ED93D5','#94DAEC','#FB6175','#EFBCFF','#F2D28A'];
    return colors[i];
  }

  /**
   * This method is called when the user clicks the button to go to find buddy interface, the method will call the application router.
   * The router will route the user to the find a buddy page.
   */
  public async goToFindBuddy() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-find-buddy-boarding', { replaceUrl: true });
  }

  /**
   * This method is called when the user clicks the button to update account preferences, the method will call the application router.
   * The router will route the user to the update account preferences page.
   */
   public async goToUpdateAcc() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-update-account-preference', { replaceUrl: true });
  }

  /**
   * This method is called when the user clicks the button to go to the buddy list page, the method will call the application router.
   * The router will route the user to the buddy list page.
   */
  public async goToBuddyList() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-buddylist-home', { replaceUrl: true });
  }

  /**
   * This methods check if user is signed up.
   * If the user is not signed up, the user will be routed to the gym buddy sign up page.
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
      console.log(this.currentUser.profilePicture);
      this.profilePicture=this.currentUser.profilePicture;

      this.setWorkoutTimeTextDisplay();
      this.setGymBuddyGoalsTextDisplay();
      this.setPersonalTraitsTextDisplay();
  }

  private setPersonalTraitsTextDisplay() {
    this.personalTraits = [];
    for (const val of this.personalTraitsList) {
      if (this.currentUser.getPersonalTraits.includes(val.value)) {
        this.personalTraits.push(val.text);
      }
    }
  }

  private setGymBuddyGoalsTextDisplay() {
    this.gymBuddyGoals = [];
    for (const val of this.buddyGoalsList) {
      if (this.currentUser.getGymBuddyGoals.includes(val.value)) {
        this.gymBuddyGoals.push(val.text);
      }
    }
  }

  private setWorkoutTimeTextDisplay() {
    this.prefWorkoutTime = [];
    for (const val of this.timePrefList) {
      if (this.currentUser.getWorkoutTimePreference.includes(val.value)) {
        val.text = val.text.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        this.prefWorkoutTime.push(val.text);
      }
    }
  }
}
