/* eslint-disable max-len */
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ToastController,
  IonicSwiper,
  LoadingController,
  IonContent,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { workoutTimePreference } from '../../../data/gym-buddy-data/WorkoutTimePreference';
import { buddyGender } from '../../../data/gym-buddy-data/BuddyGender';
import { gymBuddyGoals } from 'src/app/data/gym-buddy-data/GymBuddyGoals';
import {
  personalTraits,
  buddyTraits,
} from 'src/app/data/gym-buddy-data/Traits';
import {
  personalTrainStyle,
  buddyTrainStyle,
} from 'src/app/data/gym-buddy-data/TrainStyle';
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
import { DbRetrieveService } from 'src/app/services/db-retrieve.service';
import { GymBuddyProfileInfo } from '../gb-findbuddy/GymBuddyInformation';
export interface ImgFile {
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

  public buddyStyleList = buddyTrainStyle;
  public buddyTraitsList = buddyTraits;
  public gymBuddyPersonalFormData: FormGroup;
  public timePrefList = workoutTimePreference;
  public genderList = buddyGender;
  public gymBuddyGoalsList = gymBuddyGoals;
  public personalTraitsList = personalTraits;
  public personalStyleList = personalTrainStyle;
  public locationPrefList = locationPreference;
  // Upload progress
  public percentageVal: Observable<number>;
  // Track file uploading with snapshot
  public trackSnapshot: Observable<any>;
  // Uploaded image collection
  public files: Observable<ImgFile[]>;
  // File uploading status
  public isFileUploading: boolean;
  public isFileUploaded: boolean;

  private currentUser: GymBuddyProfileInfo;
  private progress = 0.0;
  private slideIndex = 0;

  private slides: any;
  private loadingPresent = true;

  // File upload task
  private fileUploadTask: AngularFireUploadTask;
  // Uploaded File URL
  private uploadedImageURL: Observable<string>;

  // Image specifications
  private imgName: string;
  private imgSize: number;

  private filesCollection: AngularFirestoreCollection<ImgFile>;
  private imgFilePath: string;
  constructor(
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
    if (this.currentUser.isSignUp) {
      this.router.navigateByUrl('tabs/gym-buddy/gb-home', { replaceUrl: true });
    }
    this.gymBuddyPersonalFormData = new FormGroup({
      briefIntro: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      timePref: new FormArray([], Validators.required),
      imgFile: new FormControl(''),
      buddyPref: new FormControl('', Validators.required),
      gymBuddyGoals: new FormArray(
        [],
        [Validators.required, Validators.maxLength(3)]
      ),
      personalTraits: new FormArray(
        [],
        [Validators.required, Validators.maxLength(3)]
      ),
      personalStyle: new FormArray(
        [],
        [Validators.required, Validators.maxLength(2)]
      ),
      locationPref: new FormArray(
        [],
        [Validators.required, Validators.maxLength(2)]
      ),
      buddyTraits: new FormArray(
        [],
        [Validators.required, Validators.maxLength(3)]
      ),
      buddyTrainStyle: new FormArray(
        [],
        [Validators.required, Validators.maxLength(2)]
      ),
      matches: new FormArray(
        [],
        [Validators.required, Validators.maxLength(2)]
      ),
      unmatches: new FormArray(
        [],
        [Validators.required, Validators.maxLength(2)]
      ),
      chats: new FormArray([], [Validators.required, Validators.maxLength(2)]),
    });
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
      isEnd: this.slides.isEnd,
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
  public getProgress(i) {
    const val = (i + 1) * 0.18;
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
   * Signs up for gym buddy
   */
  async signUpForGymBuddy() {
    this.populateForm();
    console.log(this.currentUser.getUserId);
    console.log(this.gymBuddyPersonalFormData.value);
    if (
      this.gymBuddyService.addGymBuddyDetails(
        this.gymBuddyPersonalFormData.value,
        this.currentUser.getUserId
      )
    ) {
      console.log('Successful Update');
    }
    const toast = await this.toastCtrl.create({
      message: 'User updated!',
      duration: 2000,
    });
    toast.present();
    this.router.navigateByUrl('tabs/gym-buddy/gb-home', { replaceUrl: true });
  }
  /**
   * Tracks the number of WORKOUT TIME PREFERENCES that the user has selected
   */
  public checkTimePref(entry) {
    if (!entry.isChecked) {
      this.gymBuddyTimePref++;
    } else {
      this.gymBuddyTimePref--;
    }
  }

  /**
   * Tracks the number of GYM GOALS that the user has selected
   */
  public checkGymBuddyGoals(entry) {
    if (!entry.isChecked) {
      this.gymBuddyGoalsChecked++;
    } else {
      this.gymBuddyGoalsChecked--;
    }
  }
  /**
   * Tracks the number of PERSONAL TRAITS that the user has selected
   */
  public checkPersonalTraits(entry) {
    if (!entry.isChecked) {
      this.personalTraitsChecked++;
    } else {
      this.personalTraitsChecked--;
    }
  }
  /**
   * Tracks the number of PERSONAL TRAIN STYLES that the user has selected
   */
  public checkPersonalTrainStyle(entry) {
    if (!entry.isChecked) {
      this.personalTrainStyleChecked++;
    } else {
      this.personalTrainStyleChecked--;
    }
  }
  /**
   * Tracks the number of LOCATION PREFERENCES that the user has selected
   */
  public checkLocationPref(entry) {
    if (!entry.isChecked) {
      this.locationPrefChecked++;
    } else {
      this.locationPrefChecked--;
    }
  }
  /**
   * Tracks the number of BUDDY TRAITS that the user has selected
   */
  public checkBuddyTraits(entry) {
    if (!entry.isChecked) {
      this.buddyTraitsChecked++;
    } else {
      this.buddyTraitsChecked--;
    }
  }
  /**
   * Tracks the number of BUDDY TRAIN STYLES that the user has selected
   */
  public checkBuddyTrainStyle(entry) {
    if (!entry.isChecked) {
      this.buddyTrainStyleChecked++;
    } else {
      this.buddyTrainStyleChecked--;
    }
  }
  /**
   * Checks if the user has selected at least 1 option for each field for the first page
   */
  public checkGBFirstPageValidity() {
    if (this.locationPrefChecked === 0) {
      return false;
    }
    if (this.personalTrainStyleChecked === 0) {
      return false;
    }
    if (this.gymBuddyGoalsChecked === 0) {
      return false;
    } /**/
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
  public checkGBSecondPageValidity() {
    if (this.buddyTraitsChecked === 0) {
      return false;
    }
    if (this.buddyTrainStyleChecked === 0) {
      return false;
    }
    return true;
  }
  public setSwiperInstance(swiper: any) {
    this.slides = swiper;
    this.slideIndex = this.slides.activeIndex;
    this.progress = this.getProgress(this.slides.activeIndex);
  }

  public nextPage() {
    console.log(this.slides);
    this.content.scrollToTop(1500);
    this.slides.slideNext();
  }

  public prevPage() {
    this.slides.slidePrev();
  }

  /**
   * Converts the image and uploads it to Firebase
   */
  public uploadImage(event: FileList) {
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
            this.imgFilePath = resp;
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
   * Populates the form with the list of inputs that are selected
   */
  private populateForm() {
    //Workout Time Preference
    this.timePrefList.forEach((element) => {
      if (element.isChecked === true) {
        this.gymBuddyPersonalFormData.value.timePref.push(element.value);
      }
    });

    //Gym Buddy Goals
    this.gymBuddyGoalsList.forEach((element) => {
      if (element.isChecked === true) {
        this.gymBuddyPersonalFormData.value.gymBuddyGoals.push(element.value);
      }
    });

    //Personal traits
    this.personalTraitsList.forEach((element) => {
      if (element.isChecked === true) {
        this.gymBuddyPersonalFormData.value.personalTraits.push(element.value);
      }
    });

    //Personal train style
    this.personalStyleList.forEach((element) => {
      if (element.isChecked === true) {
        this.gymBuddyPersonalFormData.value.personalStyle.push(element.value);
      }
    });

    //Preferred Location
    this.locationPrefList.forEach((element) => {
      if (element.isChecked === true) {
        this.gymBuddyPersonalFormData.value.locationPref.push(element.value);
      }
    });

    //Buddy Traits
    this.buddyTraitsList.forEach((element) => {
      if (element.isChecked === true) {
        this.gymBuddyPersonalFormData.value.buddyTraits.push(element.value);
      }
    });

    //Buddy Train Style
    this.buddyStyleList.forEach((element) => {
      if (element.isChecked === true) {
        this.gymBuddyPersonalFormData.value.buddyTrainStyle.push(element.value);
      }
    });
    if (this.imgFilePath) {
      console.log('imgpath:', this.imgFilePath);
      this.gymBuddyPersonalFormData.value.profilePicture = this.imgFilePath;
    } else {
      if (this.currentUser.getGender === 'male') {
        this.gymBuddyPersonalFormData.value.profilePicture =
          'https://firebasestorage.googleapis.com/v0/b/witfit-cca15.appspot.com/o/filesStorage%2F1649766691840_guy%202.jpg?alt=media&token=e2107bcf-ca5e-413f-8be3-9a5cd5dd25ee';
      } else {
        this.gymBuddyPersonalFormData.value.profilePicture =
          'https://firebasestorage.googleapis.com/v0/b/witfit-cca15.appspot.com/o/filesStorage%2F1649766533671_girl.jpg?alt=media&token=7d81c18e-9a3b-4d5c-bed5-c6ba44c89a0c';
      }
    }
  }
}
