import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { userInfo } from 'os';
import { user } from 'rxfire/auth';
import { GymBuddyDetails } from 'src/app/class/GymBuddyProfile';
import { User } from 'src/app/class/user';
import { gymBuddyGoals } from 'src/app/data/gym-buddy-data/GymBuddyGoals';
import { personalTraits } from 'src/app/data/gym-buddy-data/Traits';
import { CameraService } from 'src/app/services/camera.service';
import { workoutTimePreference } from '../../../data/gym-buddy-data/WorkoutTimePreference';
import { UserService } from '../../../services/user.service'
import { GymBuddyProfileInfo } from '../gb-findbuddy/GymBuddyInformation';
@Component({
  selector: 'app-gb-home',
  templateUrl: './gb-home.page.html',
  styleUrls: ['./gb-home.page.scss'],
})
export class GbHomePage implements OnInit {

  timePrefList = workoutTimePreference;
  buddyGoalsList = gymBuddyGoals;
  personalTraitsList = personalTraits;
  private fullName: string;
  private briefIntro: string;
  private prefWorkoutTime: string[] = [];
  private gymBuddyGoals: string[] = [];
  private personalTraits: string[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private cameraService: CameraService
    
  ) { }

  private userInfo: User;
  private gymBuddyInfo: GymBuddyDetails;

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
    this.loadUserDetails();
    /*for (const val of this.timePrefList) {
      console.log(val.value);
      if (this.gymBuddyInfo.workoutTimePreference.includes(val.value)) {
        this.prefWorkoutTime.push(val.text);
      }
    }*/
  }

  /**
   * CALLING USER DYNAMICALLY
   */
  async loadUserDetails(){
   const loading = await this.loadingController.create();
   await loading.present();
   this.userService.getUserById(JSON.parse(localStorage.getItem('userID'))).subscribe((res) =>{
     console.log(res)
     if(!res.gymBuddyDetails.isSignUp) {
       this.router.navigateByUrl('tabs/gym-buddy/gb-sign-up', { replaceUrl: true });
       loading.dismiss();
     }
     this.fullName = res.firstName + ' ' + res.lastName;
     this.briefIntro = res.gymBuddyDetails.briefIntro;
     this.userInfo = res;

     this.gymBuddyInfo = this.userInfo.gymBuddyDetails;

     this.getWorkoutTimeTextDisplay();
     this.getGymBuddyGoalsTextDisplay();
     this.getPersonalTraitsTextDisplay();
     

     loading.dismiss();
   })

   await this.cameraService.loadSaved();

  }

  async loadGymBuddyDetails(){
    this.gymBuddyInfo = this.userInfo.gymBuddyDetails;
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


  /**
   * Upload user profile pictures
   */
  async takePhoto() {
    const alert = await this.alertController.create({
      cssClass: 'profile-photos',
      header: 'Take your image from...',
      message: '',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            console.log('Camera');
            this.cameraService.getCamera();
          }
        },
        {
          text: 'Gallery',
          handler: () => {
            console.log('Gallery')
            this.cameraService.getGallery();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await alert.present();
    // this.cameraService.getCamera();
  }

  removePhoto(i) {
    this.cameraService.removePhoto(i)
  }

  async uploadImages() {
    let loading = await this.loadingController.create({
      message: 'Loading ...'
    });

    await loading.present();

    let photo = this.cameraService.photoStash;
    let c = 1;
    if (photo.length != 0) {
      for(let i of photo)
        await this.userService.uploadProfilePicture(c, i.webviewPath, this.userInfo.id);
        c++;
    }

      loading.dismiss();
  
  }
}
