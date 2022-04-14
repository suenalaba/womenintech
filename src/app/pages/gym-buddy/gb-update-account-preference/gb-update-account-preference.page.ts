/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController, IonicSwiper, LoadingController, IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import { workoutTimePreference } from '../../../data/gym-buddy-data/WorkoutTimePreference';
import { buddyGender } from '../../../data/gym-buddy-data/BuddyGender';
import { gymBuddyGoals } from 'src/app/data/gym-buddy-data/GymBuddyGoals';
import { personalTraits, buddyTraits } from 'src/app/data/gym-buddy-data/Traits';
import { personalTrainStyle, buddyTrainStyle } from 'src/app/data/gym-buddy-data/TrainStyle';
import { locationPreference } from 'src/app/data/gym-buddy-data/LocationPreference';
import SwiperCore, { Keyboard, Pagination, Scrollbar } from 'swiper';
import { GymBuddyService } from 'src/app/services/gym-buddy.service';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { GymBuddyProfileInfo } from '../gb-findbuddy/GymBuddyInformation';
import { DbRetrieveService } from 'src/app/services/db-retrieve.service';
export interface ImgFile {
  name: string;
  filepath: string;
  size: number;
}

SwiperCore.use([Keyboard, Pagination, Scrollbar, IonicSwiper]);
@Component({
  selector: 'app-gb-update-account-preference',
  templateUrl: './gb-update-account-preference.page.html',
  styleUrls: ['./gb-update-account-preference.page.scss'],
})
export class GbUpdateAccountPreferencePage implements OnInit {
  @ViewChild(IonContent, { static: false }) private content: IonContent;
  public gymBuddyTimePref = 0;

  public gymBuddyGoalsChecked = 0;
  public gymBuddyGoalsLimit = 3;
  public personalTraitsChecked = 0;
  public personalTraitsLimit = 3;
  public personalTrainStyleChecked = 0;
  public personalTrainStyleLimit = 2;
  public locationPrefChecked = 0;
  public locationPrefLimit = 2;

  public buddyTraitsChecked = 0;
  public buddyTraitsLimit = 3;
  public buddyTrainStyleChecked = 0;
  public buddyTrainStyleLimit = 2;
  private buddyStyleList = buddyTrainStyle;
  private buddyTraitsList = buddyTraits;
  private currentUser: GymBuddyProfileInfo;
  private gymBuddyPersonalFormData: FormGroup;
  private timePrefList = workoutTimePreference;
  private genderList = buddyGender;
  private gymBuddyGoalsList = gymBuddyGoals;
  private personalTraitsList = personalTraits;
  private personalStyleList = personalTrainStyle;
  private locationPrefList = locationPreference;
  private progress = 0.0;
  private slideIndex = 0;




  private slides: any;

  private loadingPresent = true;

  // File upload task
  private fileUploadTask: AngularFireUploadTask;
  // Upload progress
  private percentageVal: Observable<number>;
  // Track file uploading with snapshot
  private trackSnapshot: Observable<any>;
  // Uploaded File URL
  private uploadedImageURL: Observable<string>;
  // Uploaded image collection
  private files: Observable<ImgFile[]>;
  // Image specifications
  private imgName: string;
  private imgSize: number;
  // File uploading status
  private isFileUploading: boolean;
  private isFileUploaded: boolean;
  private filesCollection: AngularFirestoreCollection<ImgFile>;
  private imgFilePath: string;
  constructor(
    private formBuilder: FormBuilder,
    private dbRetrieve: DbRetrieveService,
    private gymBuddyService: GymBuddyService,
    private toastCtrl: ToastController,
    private router: Router,
    private loadingController: LoadingController,
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {
    this.isFileUploading = false;
    this.isFileUploaded = false;
    // Define uploaded files collection
    this.filesCollection = afs.collection<ImgFile>('imagesCollection');
    this.files = this.filesCollection.valueChanges();
  }
  /**
   * Gets the full name of the curent user
   */
     public get getFullName() {
      return this.currentUser.name;
    }

  ngOnInit() {
    this.currentUser = this.dbRetrieve.retrieveCurrentUser();
    this.gymBuddyPersonalFormData = new FormGroup({
      briefIntro: new FormControl(this.currentUser.getbriefIntro, [Validators.required, Validators.minLength(3)]),
      timePref: new FormArray([],Validators.required),
      profilePicture: new FormControl(''),
      buddyPref: new FormControl(this.currentUser.getPrefBuddyGender,Validators.required),
      gymBuddyGoals: new FormArray([],[Validators.required,Validators.maxLength(3)]),
      personalTraits: new FormArray([],[Validators.required,Validators.maxLength(3)]),
      personalStyle: new FormArray([],[Validators.required,Validators.maxLength(2)]),
      locationPref: new FormArray([],[Validators.required,Validators.maxLength(2)]),
      buddyTraits: new FormArray([],[Validators.required,Validators.maxLength(3)]),
      buddyTrainStyle: new FormArray([],[Validators.required,Validators.maxLength(2)]),
      matches: new FormArray([],[Validators.required,Validators.maxLength(2)]),
      unmatches: new FormArray([],[Validators.required,Validators.maxLength(2)]),
      chats: new FormArray([],[Validators.required,Validators.maxLength(2)]),
    });
    this.fillUpPreviousInformation();
  }


  /**
   * Signs up for gym buddy
   */
     async updateGymBuddy() {
      this.populateForm();
      console.log(this.currentUser.getUserId);
      console.log(this.gymBuddyPersonalFormData.value);
      if(this.gymBuddyService.addGymBuddyDetails(this.gymBuddyPersonalFormData.value, this.currentUser.getUserId)){
        console.log('Successful Update');
      }
      const toast = await this.toastCtrl.create({
        message: 'User updated!',
        duration: 2000
      });
      toast.present();
      this.router.navigateByUrl('tabs/gym-buddy/gb-home', { replaceUrl: true });
    }
  /**
   * Tracks if slide has changed and updates progress
   *
   * @returns
   */
  public slideDidChange() {
    console.log('Slide did change');
    if (!this.slides) {
      return;
    }

    console.table({
      isBeginning: this.slides.isBeginning,
      isEnd: this.slides.isEnd
    });

    this.progress = this.getProgress(this.slides.activeIndex);
  }

  /**
   * Tracks if slide has changed
   */
  public slideWillChange() {
    console.log('Slide will change');
  }

  /**
   * Converts progress into a percentage
   *
   * @param i
   * @returns progress percentage
   */
  public getProgress(i){
    const val = (i+1) * 0.18;
    console.log(val);
    return val;
  }

  /**
   * Creates loading screen
   */
  async showLoading() {
    this.loadingPresent = true;
    const load = await this.loadingController.create({
      message: 'Please wait....',

    });
    await load.present();
  }

/**
 * Dismisses loading screen
 */
  async dismissLoading() {
    if (this.loadingPresent) {
      await this.loadingController.dismiss();
    }
    this.loadingPresent = false;
  }

 /**
  * Fills up the past information for all relevant fields
  */
  private fillUpPreviousInformation(){

    //Profile Picture
    if(this.currentUser.profilePicture){
      this.imgFilePath=this.currentUser.profilePicture;
    }

    //Workout Time Preference
    this.currentUser.getWorkoutTimePreference.forEach(element => {
      for (let i = 0; i < this.timePrefList.length; i++) {
        if(this.timePrefList[i].value===element){
          this.timePrefList[i].isChecked=true;
          this.gymBuddyTimePref++;
        }
      }
    });

    //Gym Buddy Goals
    this.currentUser.getGymBuddyGoals.forEach(element => {
      for (let i = 0; i < this.gymBuddyGoalsList.length; i++) {
        if(this.gymBuddyGoalsList[i].value===element){
          this.gymBuddyGoalsList[i].isChecked=true;
          this.gymBuddyGoalsChecked++;
        }
      }
    });

    //Personal traits
    this.currentUser.getPersonalTraits.forEach(element => {
      for (let i = 0; i < this.personalTraitsList.length; i++) {
        if(this.personalTraitsList[i].value===element){
          this.personalTraitsList[i].isChecked=true;
          this.personalTraitsChecked++;
        }
      }
    });

    //Personal train style
    this.currentUser.getPersonalTrainStyle.forEach(element => {
      for (let i = 0; i < this.personalStyleList.length; i++) {
        if(this.personalStyleList[i].value===element){
          this.personalStyleList[i].isChecked=true;
          this.personalTrainStyleChecked++;
        }
      }
    });

    //Preferred Location
    this.currentUser.getLocationPreference.forEach(element => {
      for (let i = 0; i < this.locationPrefList.length; i++) {
        if(this.locationPrefList[i].value===element){
          this.locationPrefList[i].isChecked=true;
          this.locationPrefChecked++;
        }
      }
    });

    //Buddy Traits
    this.currentUser.getBuddyTraits.forEach(element => {
      for (let i = 0; i < this.buddyTraitsList.length; i++) {
        if(this.buddyTraitsList[i].value===element){
          this.buddyTraitsList[i].isChecked=true;
          this.buddyTraitsChecked++;
        }
      }
    });

    //Buddy Train Style
    this.currentUser.getBuddyTrainStyle.forEach(element => {
      for (let i = 0; i < this.buddyStyleList.length; i++) {
        if(this.buddyStyleList[i].value===element){
          this.buddyStyleList[i].isChecked=true;
          this.buddyTrainStyleChecked++;
        }
      }
    });

  }


  /**
   * Converts the image and uploads it to Firebase
   */
  private uploadImage(event: FileList) {
    const file = event.item(0);
    // Image validation
    if (file.type.split('/')[0] !== 'image') {
      console.log('File type is not supported!');
      return;
    }
    this.isFileUploading = true;
    this.isFileUploaded = false;
    this.imgName = file.name;
    // Storage path
    const fileStoragePath = `filesStorage/${new Date().getTime()}_${file.name}`;
    // Image reference
    const imageRef = this.afStorage.ref(fileStoragePath);
    // File upload task
    this.fileUploadTask = this.afStorage.upload(fileStoragePath, file);
    // Show uploading progress
    this.percentageVal = this.fileUploadTask.percentageChanges();
    this.trackSnapshot = this.fileUploadTask.snapshotChanges().pipe(
      finalize(() => {
        // Retreive uploaded image storage path
        this.uploadedImageURL = imageRef.getDownloadURL();
        this.uploadedImageURL.subscribe(
          (resp) => {
            this.storeFilesFirebase({
              name: file.name,
              filepath: resp,
              size: this.imgSize,
            });
            this.isFileUploading = false;
            this.isFileUploaded = true;
            this.imgFilePath=resp;
          },
          (error) => {
            console.log(error);
          }
        );
      }),
      tap((snap) => {
        this.imgSize = snap.totalBytes;
      })
    );
  }

  /**
   * Stores the image into the "imagesCollection" in Firebase
   */
  private storeFilesFirebase(image: ImgFile) {
    const fileId = this.afs.createId();
    this.filesCollection
      .doc(fileId)
      .set(image)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * Tracks the number of WORKOUT TIME PREFERENCES that the user has selected
   */
  private checkTimePref(entry) {
    if (!entry.isChecked){
      this.gymBuddyTimePref++;
    } else {
      this.gymBuddyTimePref--;
    }
  }

  /**
   * Tracks the number of GYM GOALS that the user has selected
   */
  private checkGymBuddyGoals(entry) {
    if (!entry.isChecked){
      this.gymBuddyGoalsChecked++;
    } else {
      this.gymBuddyGoalsChecked--;
    }
  }
  /**
   * Tracks the number of PERSONAL TRAITS that the user has selected
   */
  private checkPersonalTraits(entry) {
    if (!entry.isChecked){
      this.personalTraitsChecked++;
    } else {
      this.personalTraitsChecked--;
    }
  }
  /**
   * Tracks the number of PERSONAL TRAIN STYLES that the user has selected
   */
  private checkPersonalTrainStyle(entry) {
    if (!entry.isChecked){
      this.personalTrainStyleChecked++;
    } else {
      this.personalTrainStyleChecked--;
    }
  }
  /**
   * Tracks the number of LOCATION PREFERENCES that the user has selected
   */
  private checkLocationPref(entry) {
    if (!entry.isChecked){
      this.locationPrefChecked++;
    } else {
      this.locationPrefChecked--;
    }
  }
  /**
   * Tracks the number of BUDDY TRAITS that the user has selected
   */
  private checkBuddyTraits(entry) {
    if (!entry.isChecked){
      this.buddyTraitsChecked++;
    } else {
      this.buddyTraitsChecked--;
    }
  }
  /**
   * Tracks the number of BUDDY TRAIN STYLES that the user has selected
   */
  private checkBuddyTrainStyle(entry) {
    if (!entry.isChecked){
      this.buddyTrainStyleChecked++;
    } else {
      this.buddyTrainStyleChecked--;
    }
  }
  /**
   * Checks if the user has selected at least 1 option for each field for the first page
   */
  private checkGBFirstPageValidity() {
    if (this.locationPrefChecked === 0) {
      return false;
    }
    if (this.personalTrainStyleChecked === 0) {
      return false;
    }
    if (this.gymBuddyGoalsChecked === 0) {
      return false;
    }/**/
    if (this.gymBuddyTimePref === 0) {
      return false;
    }
    if (this.personalTraitsChecked === 0) {
      return false;
    }
    if (this.gymBuddyPersonalFormData.value.buddyPref === '') {
      return false;
    }
    if (this.gymBuddyPersonalFormData.value.briefIntro === '') {
      return false;
    }
    return true;
  }
  /**
   * Checks if the user has selected at least 1 option for each field for the second page
   */
  private checkGBSecondPageValidity() {
    if (this.buddyTraitsChecked === 0) {
      return false;
    }
    if (this.buddyTrainStyleChecked === 0) {
      return false;
    }
    return true;
  }

  /**
   * Populates the form with the list of inputs that are selected
   */
     private populateForm(){
      //Workout Time Preference
    this.timePrefList.forEach((element) => {
      if(element.isChecked===true){
        this.gymBuddyPersonalFormData.value.timePref.push(element.value);
      }
    });

    //Gym Buddy Goals
    this.gymBuddyGoalsList.forEach((element) => {
      if(element.isChecked===true){
        this.gymBuddyPersonalFormData.value.gymBuddyGoals.push(element.value);
      }
    });

    //Personal traits
    this.personalTraitsList.forEach((element) => {
      if(element.isChecked===true){
        this.gymBuddyPersonalFormData.value.personalTraits.push(element.value);
      }
    });

    //Personal train style
    this.personalStyleList.forEach((element) => {
      if(element.isChecked===true){
        this.gymBuddyPersonalFormData.value.personalStyle.push(element.value);
      }
    });

    //Preferred Location
    this.locationPrefList.forEach((element) => {
      if(element.isChecked===true){
        this.gymBuddyPersonalFormData.value.locationPref.push(element.value);
      }
    });

    //Buddy Traits
    this.buddyTraitsList.forEach((element) => {
      if(element.isChecked===true){
        this.gymBuddyPersonalFormData.value.buddyTraits.push(element.value);
      }
    });

    //Buddy Train Style
    this.buddyStyleList.forEach((element) => {
      if(element.isChecked===true){
        this.gymBuddyPersonalFormData.value.buddyTrainStyle.push(element.value);
      }
    });
    if(this.imgFilePath) {
      console.log('imgpath:',this.imgFilePath);
      this.gymBuddyPersonalFormData.value.profilePicture=this.imgFilePath;
    }
    this.currentUser.matches.forEach((element) => {
      this.gymBuddyPersonalFormData.value.matches.push(element);
    });
    this.currentUser.unmatches.forEach((element) => {
      this.gymBuddyPersonalFormData.value.unmatches.push(element);
    });
    this.currentUser.chats.forEach((element) => {
      this.gymBuddyPersonalFormData.value.chats.push(element);
    });
  }


  private setSwiperInstance(swiper: any) {
    this.slides = swiper;
    this.slideIndex = this.slides.activeIndex;
    this.progress = this.getProgress(this.slides.activeIndex);

  }
  private nextPage(){
    console.log(this.slides);
    this.content.scrollToTop(1500);
    this.slides.slideNext();
  }

  private prevPage(){
    this.slides.slidePrev();
  }


}

