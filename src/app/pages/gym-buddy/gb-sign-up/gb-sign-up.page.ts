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
import { User } from 'src/app/class/user';
import { UserService } from 'src/app/services/user.service';
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
export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}

SwiperCore.use([Keyboard, Pagination, Scrollbar, IonicSwiper]);

@Component({
  selector: 'app-gb-sign-up',
  templateUrl: './gb-sign-up.page.html',
  styleUrls: ['./gb-sign-up.page.scss'],
})
export class GbSignUpPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;

  gymBuddyPersonalFormData: FormGroup;
  timePrefList = workoutTimePreference;
  genderList = buddyGender;
  gymBuddyGoalsList = gymBuddyGoals;
  personalTraitsList = personalTraits;
  personalStyleList = personalTrainStyle;
  locationPrefList = locationPreference;

  buddyTraitsList = buddyTraits;
  buddyStyleList = buddyTrainStyle;

  progress = 0.0;
  slideIndex = 0;

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


  private selectedGymBuddyGoals = [];
  private selectedWorkoutTimes = [];
  private selectedPersonalTraits = [];
  private selectedPersonalStyles = [];
  private selectedLocations = [];
  private selectedBuddyTraits = [];
  private selectedBuddyTrainStyles = [];

  private slides: any;

  private userInfo;
  private fullName: string;
  private userId: string;
  private personalTraitsFormArray = [];

  private loadingPresent = true;

  // File upload task
  fileUploadTask: AngularFireUploadTask;
  // Upload progress
  percentageVal: Observable<number>;
  // Track file uploading with snapshot
  trackSnapshot: Observable<any>;
  // Uploaded File URL
  UploadedImageURL: Observable<string>;
  // Uploaded image collection
  files: Observable<imgFile[]>;
  // Image specifications
  imgName: string;
  imgSize: number;
  // File uploading status
  isFileUploading: boolean;
  isFileUploaded: boolean;
  private filesCollection: AngularFirestoreCollection<imgFile>;
  private imgFilePath: string;


  constructor(
    private formBuilder: FormBuilder,
    private gymBuddyService: GymBuddyService,
    private toastCtrl: ToastController,
    private router: Router,
    private loadingController: LoadingController,
    private userService: UserService,
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage
	){
    this.isFileUploading = false;
    this.isFileUploaded = false;
    // Define uploaded files collection
    this.filesCollection = afs.collection<imgFile>('imagesCollection');
    this.files = this.filesCollection.valueChanges();

  }

  public get getFullName() {
    return this.fullName;
  }

  ngOnInit() {

    // this.checkGymBuddySignUp();


    //getting data from local storage which was imported from firebase
    /*let userinfo_string  = localStorage.getItem('userInfo');
    this.userinfo =  JSON.parse(userinfo_string);
    this.gender = this.userinfo.gender;
    this.birthday = this.userinfo.birthday;
    console.log(this.gender);
    console.log(this.birthday);
    this.injury = this.userinfo.userDetails.injury;
    console.log(this.injury);*/
    /*get User Details*/
    this.loadUserDetails()

    //loadingController
    //create service to check if person sign up already
    //if person havent sign up stay
    //else redirect



    this.gymBuddyPersonalFormData = new FormGroup({
      briefIntro: new FormControl('', [Validators.required, Validators.minLength(3)]),
      timePref: new FormArray([],Validators.required),
      buddyPref: new FormControl('',Validators.required),
      gymBuddyGoals: new FormArray([],[Validators.required,Validators.maxLength(3)]),
      personalTraits: new FormArray([],[Validators.required,Validators.maxLength(3)]),
      personalStyle: new FormArray([],[Validators.required,Validators.maxLength(2)]),
      locationPref: new FormArray([],[Validators.required,Validators.maxLength(2)]),
      buddyTraits: new FormArray([],[Validators.required,Validators.maxLength(3)]),
      buddyTrainStyle: new FormArray([],[Validators.required,Validators.maxLength(2)]),
    });
    //this.personaltraits = this.gymBuddyPersonalFormData.get('personalTraits') as FormArray;
    /*this.gymBuddyPersonalFormData = new FormGroup({
      //title: new FormControl(),
      briefIntro: new FormControl(),
      timePref: new FormControl(),
      buddyPref: new FormControl(),
      gymBuddyGoals: new FormControl(),
      personalTraits: new FormControl(),
      personalStyle: new FormControl(),
      locationPref: new FormControl(),
      buddyTraits: new FormControl(),
      buddyTrainStyle: new FormControl()
    });*/
  }

  /**
   *
   * load user info from user service
   */

  async loadUserDetails(){
    const loading = await this.loadingController.create();
   await loading.present();
   this.userService.getUserById(JSON.parse(localStorage.getItem('userID'))).subscribe((res) =>{
    if(res.gymBuddyDetails.isSignUp) {
      this.router.navigateByUrl('tabs/gym-buddy/gb-home', { replaceUrl: true });
      loading.dismiss();
    }

     this.userInfo = res;
     console.log(this.userInfo);
     /*get full name*/
     this.fullName = this.userInfo.firstName + ' ' + this.userInfo.lastName;
     console.log(this.fullName);
     /* get user Id */
     this.userId = this.userInfo.id;
     console.log(this.userId);

     loading.dismiss();
   })
  }

  uploadImage(event: FileList) {
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
        this.UploadedImageURL = imageRef.getDownloadURL();
        this.UploadedImageURL.subscribe(
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
  storeFilesFirebase(image: imgFile) {
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

  /* store gymBuddyGoals data
  * if entry is not checked, check it and store the data
  * else find its index and remove it from the array. (uncheck)
  */

  storeGBGoalsData(entry) {
    if (!entry.isChecked) {
      this.gymBuddyPersonalFormData.value.gymBuddyGoals.push(entry.value);
    } else {
      const index = this.gymBuddyPersonalFormData.value.gymBuddyGoals.indexOf(entry.value);
      if (index > -1) {
      this.gymBuddyPersonalFormData.value.gymBuddyGoals.splice(index,1); //2nd parameter means remove 1 item only
      }
    }
    this.gymBuddyPersonalFormData.value.gymBuddyGoals.forEach((element) => {
      console.log(element);
    });
  }
  /* stores gym buddy preferred workout time data
  * if entry is not checked, check it and store the data
  * else find its index and remove it from the array. (uncheck)
  */

  storeGBTimePrefData(entry) {
    if (!entry.isChecked) {
      this.gymBuddyPersonalFormData.value.timePref.push(entry.value);
      entry.isChecked = true;
    } else {
      const index = this.gymBuddyPersonalFormData.value.timePref.indexOf(entry.value);
      if (index > -1) {
      this.gymBuddyPersonalFormData.value.timePref.splice(index,1); //2nd parameter means remove 1 item only
      entry.isChecked = false;
      }
    }
    this.gymBuddyPersonalFormData.value.timePref.forEach((element) => {
      console.log(element);
    });
  }
  /* stores gym buddy personal traits data
  * if entry is not checked, check it and store the data
  * else find its index and remove it from the array. (uncheck)
  */

  storeGBPersonalTraitsData(entry) {
    if (!entry.isChecked) {
      this.gymBuddyPersonalFormData.value.personalTraits.push(entry.value);
    } else {
      const index = this.gymBuddyPersonalFormData.value.personalTraits.indexOf(entry.value);
      if (index > -1) {
      this.gymBuddyPersonalFormData.value.personalTraits.splice(index,1); //2nd parameter means remove 1 item only
      }
    }
    this.gymBuddyPersonalFormData.value.personalTraits.forEach((element) => {
      console.log(element);
    });
  }
  /* stores gym buddy personal training style data
  * if entry is not checked, check it and store the data
  * else find its index and remove it from the array. (uncheck)
  */

  storeGBPersonalStylesData(entry) {
    if (!entry.isChecked) {
      this.gymBuddyPersonalFormData.value.personalStyle.push(entry.value);
    } else {
      const index = this.gymBuddyPersonalFormData.value.personalStyle.indexOf(entry.value);
      if (index > -1) {
      this.gymBuddyPersonalFormData.value.personalStyle.splice(index,1); //2nd parameter means remove 1 item only
      }
    }
    this.gymBuddyPersonalFormData.value.personalStyle.forEach((element) => {
      console.log(element);
    });
  }
  /* stores gym buddy preferred locations data
  * if entry is not checked, check it and store the data
  * else find its index and remove it from the array. (uncheck)
  */

  storeGBPrefLocationsData(entry) {
    if (!entry.isChecked) {
      this.gymBuddyPersonalFormData.value.locationPref.push(entry.value);
    } else {
      const index = this.gymBuddyPersonalFormData.value.locationPref.indexOf(entry.value);
      if (index > -1) {
      this.gymBuddyPersonalFormData.value.locationPref.splice(index,1); //2nd parameter means remove 1 item only
      }
    }
    this.gymBuddyPersonalFormData.value.locationPref.forEach((element) => {
      console.log(element);
    });
  }
  /* stores gym buddy preferred buddy traits data
  * if entry is not checked, check it and store the data
  * else find its index and remove it from the array. (uncheck)
  */
  storeGBBuddyTraitsData(entry) {
    if (!entry.isChecked) {
      this.gymBuddyPersonalFormData.value.buddyTraits.push(entry.value);
    } else {
      const index = this.gymBuddyPersonalFormData.value.buddyTraits.indexOf(entry.value);
      if (index > -1) {
      this.gymBuddyPersonalFormData.value.buddyTraits.splice(index,1); //2nd parameter means remove 1 item only
      }
    }
    this.gymBuddyPersonalFormData.value.buddyTraits.forEach((element) => {
      console.log(element);
    });
  }
  /* stores gym buddy preferred buddy training style data
  * if entry is not checked, check it and store the data
  * else find its index and remove it from the array. (uncheck)
  */
  storeGBBuddyTrainStyleData(entry) {
    if (!entry.isChecked) {
      this.gymBuddyPersonalFormData.value.buddyTrainStyle.push(entry.value);
    } else {
      const index = this.gymBuddyPersonalFormData.value.buddyTrainStyle.indexOf(entry.value);
      if (index > -1) {
      this.gymBuddyPersonalFormData.value.buddyTrainStyle.splice(index,1); //2nd parameter means remove 1 item only
      }
    }
    this.gymBuddyPersonalFormData.value.buddyTrainStyle.forEach((element) => {
      console.log(element);
    });
  }
  /* limit number of checks for gymBuddyGoals */
  checkGymBuddyGoals(entry) {
    if (!entry.isChecked){
      this.gymBuddyGoalsChecked++;
      entry.isChecked = true;
      console.log(this.gymBuddyGoalsChecked);
    } else {
      this.gymBuddyGoalsChecked--;
      entry.isChecked = false;
      console.log(this.gymBuddyGoalsChecked);
    }
  }
  /*limit number of checks for personal traits */
  checkPersonalTraits(entry) {
    if (!entry.isChecked){
      this.personalTraitsChecked++;
      entry.isChecked = true;
      console.log(this.personalTraitsChecked);
    } else {
      this.personalTraitsChecked--;
      entry.isChecked = false;
      console.log(this.personalTraitsChecked);
    }
  }
  /*limit number of checks for personal traits */
  checkPersonalTrainStyle(entry) {
    if (!entry.isChecked){
      this.personalTrainStyleChecked++;
      entry.isChecked = true;
      console.log(this.personalTrainStyleChecked);
    } else {
      this.personalTrainStyleChecked--;
      entry.isChecked = false;
      console.log(this.personalTrainStyleChecked);
    }
  }
  /*limit number of checks for location preference */
  checkLocationPref(entry) {
    if (!entry.isChecked){
      this.locationPrefChecked++;
      entry.isChecked = true;
      console.log(this.locationPrefChecked);
    } else {
      this.locationPrefChecked--;
      entry.isChecked = false;
      console.log(this.locationPrefChecked);
    }
  }
  /*limit number of checks for buddy traits */
  checkBuddyTraits(entry) {
    if (!entry.isChecked){
      this.buddyTraitsChecked++;
      entry.isChecked = true;
      console.log(this.buddyTraitsChecked);
    } else {
      this.buddyTraitsChecked--;
      entry.isChecked = false;
      console.log(this.buddyTraitsChecked);
    }
  }
  /*limit number of checks for personal traits */
  checkBuddyTrainStyle(entry) {
    if (!entry.isChecked){
      this.buddyTrainStyleChecked++;
      entry.isChecked = true;
      console.log(this.buddyTrainStyleChecked);
    } else {
      this.buddyTrainStyleChecked--;
      entry.isChecked = false;
      console.log(this.buddyTrainStyleChecked);
    }
  }
  /* check the first page validity */
  checkGBFirstPageValidity() {
    if (this.gymBuddyPersonalFormData.value.locationPref.length === 0) {
      return false;
    }
    if (this.gymBuddyPersonalFormData.value.personalStyle.length === 0) {
      return false;
    }
    if (this.gymBuddyPersonalFormData.value.gymBuddyGoals.length === 0) {
      return false;
    }/**/
    if (this.gymBuddyPersonalFormData.value.timePref.length === 0) {
      return false;
    }
    if (this.gymBuddyPersonalFormData.value.personalTraits.length === 0) {
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

  checkGBSecondPageValidity() {
    if (this.gymBuddyPersonalFormData.value.buddyTraits.length === 0) {
      return false;
    }
    if (this.gymBuddyPersonalFormData.value.buddyTrainStyle.length === 0) {
      return false;
    }
    return true;
  }
  async signUpForGymBuddy() {
    //console.log(this.gymBuddyPersonalFormData.value);
    this.selectedGymBuddyGoals.forEach((element) => {
      console.log(element);
    });
    this.selectedWorkoutTimes.forEach((element) => {
      console.log(element);
    });
    this.selectedPersonalTraits.forEach((element) => {
      console.log(element);
    });
    this.selectedPersonalStyles.forEach((element) => {
      console.log(element);
    });
    this.selectedLocations.forEach((element) => {
      console.log(element);
    });
    this.selectedBuddyTraits.forEach((element) => {
      console.log(element);
    });
    this.selectedBuddyTrainStyles.forEach((element) => {
      console.log(element);
    });
    console.log(this.userId);
    console.log(this.gymBuddyPersonalFormData.value);
    this.gymBuddyService.addGymBuddyDetails(this.gymBuddyPersonalFormData.value, this.userId);
    this.gymBuddyService.uploadProfilePicture(this.imgFilePath,this.userId);
    const toast = await this.toastCtrl.create({
      message: 'User updated!',
      duration: 2000
    });

    toast.present();
    this.router.navigateByUrl('tabs/gym-buddy/gb-home', { replaceUrl: true });
  }

  setSwiperInstance(swiper: any) {
    this.slides = swiper;
    this.slideIndex = this.slides.activeIndex;
    this.progress = this.getProgress(this.slides.activeIndex);

  }

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

  public slideWillChange() {
    console.log('Slide will change');
  }

  public getProgress(i){
    const val = (i+1) * 0.18;
    console.log(val);
    return val;
  }

  nextPage(){
    console.log(this.slides);
    this.content.scrollToTop(1500);
    this.slides.slideNext();
  }

  prevPage(){
    this.slides.slidePrev();
  }

  async showLoading() {
    this.loadingPresent = true;
    const load = await this.loadingController.create({
      message: 'Please wait....',

    });
    await load.present();
  }

  async dismissLoading() {
    if (this.loadingPresent) {
      await this.loadingController.dismiss();
    }
    this.loadingPresent = false;
  }
}
