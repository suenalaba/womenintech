import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera.service';
import { userInfo } from 'os';
import { user } from 'rxfire/auth';
import { GymBuddyDetails } from 'src/app/class/GymBuddyProfile';
import { User } from 'src/app/class/user';
import { gymBuddyGoals } from 'src/app/data/gym-buddy-data/GymBuddyGoals';
import { personalTraits } from 'src/app/data/gym-buddy-data/Traits';
import { workoutTimePreference } from '../../../data/gym-buddy-data/WorkoutTimePreference';
import { UserService } from '../../../services/user.service'
import { GymBuddyProfileInfo } from '../gb-findbuddy/GymBuddyInformation';
import { GymBuddyService } from 'src/app/services/gym-buddy.service';
import { DbRetrieveService } from 'src/app/services/db-retrieve.service';
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
  private briefIntro: string;
  private prefWorkoutTime: string[] = [];
  private gymBuddyGoals: string[] = [];
  private personalTraits: string[] = [];

  private userInfo: User;
  private gymBuddyInfo: GymBuddyDetails;


  constructor(
    private router: Router,
    private userService: UserService,
    //private gymBuddyService: GymBuddyService,
    private loadingController: LoadingController,
    private dbRetrieveService: DbRetrieveService,
    //private alertController: AlertController,
    //private cameraService: CameraService

  ) { }


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
    /** checks if the user has signed up for Gym Buddy */
    // if(this.gymBuddyService.isSignedUp())
    //check if user is signed up.
    this.checkIfUserIsSignedUp();
    //this line only follows if user is signed up, basically to set the status of current user.
    this.dbRetrieveService.setCurrentUser();
    // else
      /** user has NOT signed up for Gym Buddy, will be navigated to sign up page*/
      // this.router.navigateByUrl('tabs/gym-buddy/gb-sign-up', { replaceUrl: true });
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
    this.router.navigateByUrl('tabs/gym-buddy/gb-findbuddy', { replaceUrl: true });
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

    this.userService.getUserById(JSON.parse(localStorage.getItem('userID'))).subscribe((res) =>{
      /** checks if user signed up */
      if(!res.gymBuddyDetails.isSignUp) {
       this.router.navigateByUrl('tabs/gym-buddy/gb-sign-up', { replaceUrl: true });
       loading.dismiss();
      }

    this.setUserDetails(res);
      // this.fullName = res.firstName + ' ' + res.lastName;
      // this.briefIntro = res.gymBuddyDetails.briefIntro;
      // this.userInfo = res;

      // this.gymBuddyInfo = this.userInfo.gymBuddyDetails;

      // this.getWorkoutTimeTextDisplay();
      // this.getGymBuddyGoalsTextDisplay();
      // this.getPersonalTraitsTextDisplay();

      loading.dismiss();
   });

  }

  private setUserDetails(userDetail) {
    this.fullName = userDetail.firstName + ' ' + userDetail.lastName;
      this.briefIntro = userDetail.gymBuddyDetails.briefIntro;
      this.userInfo = userDetail;

      this.gymBuddyInfo = this.userInfo.gymBuddyDetails;

      this.setWorkoutTimeTextDisplay();
      this.setGymBuddyGoalsTextDisplay();
      this.setPersonalTraitsTextDisplay();
  }

  // async loadGymBuddyDetails(){
  //   this.gymBuddyInfo = this.userInfo.gymBuddyDetails;
  // }


  private setPersonalTraitsTextDisplay() {
    this.personalTraits = [];
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

  private setGymBuddyGoalsTextDisplay() {
    this.gymBuddyGoals = [];
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

  private setWorkoutTimeTextDisplay() {
    this.prefWorkoutTime = [];
    for (const val of this.timePrefList) {
      //console.log(val.value);
      //console.log(this.gymBuddyInfo.workoutTimePreference);
      if (this.gymBuddyInfo.workoutTimePreference.includes(val.value)) {
        //console.log(val.text);
        //convert all but first letter to lower case.
        val.text = val.text.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        this.prefWorkoutTime.push(val.text);
      }
      //console.log(this.prefWorkoutTime);
    }
  }
  /*signUp(){
    this.router.navigateByUrl('tabs/gym-buddy/gb-sign-up', { replaceUrl: true });
  }*/


  // /**
  //  * Upload user profile pictures
  //  */
  // async takePhoto() {
  //   const alert = await this.alertController.create({
  //     cssClass: 'profile-photos',
  //     header: 'Take your image from...',
  //     message: '',
  //     buttons: [
  //       {
  //         text: 'Camera',
  //         handler: () => {
  //           console.log('Camera');
  //           this.cameraService.getCamera();
  //         }
  //       },
  //       {
  //         text: 'Gallery',
  //         handler: () => {
  //           console.log('Gallery')
  //           this.cameraService.getGallery();
  //         }
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: (blah) => {
  //           console.log('Confirm Cancel: blah');
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  //   // this.cameraService.getCamera();
  // }

  // removePhoto(i) {
  //   this.cameraService.removePhoto(i)
  // }

  // async uploadImages() {
  //   let loading = await this.loadingController.create({
  //     message: 'Loading ...'
  //   });

  //   await loading.present();

  //   let photo = this.cameraService.photoStash;
  //   let c = 1;
  //   if (photo.length != 0) {
  //     for(let i of photo)
  //       await this.userService.uploadProfilePicture(c, i.webviewPath, this.userInfo.id);
  //       c++;
  //   }

  //     loading.dismiss();

  // }
}
