import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { loadingController, IonicSwiper } from '@ionic/core';
import { workoutTimePreference } from '../../data/gym-buddy-data/WorkoutTimePreference';
import { buddyGender } from '../../data/gym-buddy-data/BuddyGender';
import { gymBuddyGoals } from 'src/app/data/gym-buddy-data/GymBuddyGoals';
import { personalTraits } from 'src/app/data/gym-buddy-data/PersonalTraits';
import { personalTrainStyle } from 'src/app/data/gym-buddy-data/PersonalTrainStyle';
import { locationPreference } from 'src/app/data/gym-buddy-data/LocationPreference';
import SwiperCore, { Keyboard, Pagination, Scrollbar } from 'swiper';

SwiperCore.use([Keyboard, Pagination, Scrollbar, IonicSwiper]);
@Component({
  selector: 'app-gb-sign-up',
  templateUrl: './gb-sign-up.page.html',
  styleUrls: ['./gb-sign-up.page.scss'],
})
export class GbSignUpPage implements OnInit {

  gymBuddyPersonalFormData: FormGroup;
  timePrefList = workoutTimePreference;
  genderList = buddyGender;
  gymBuddyGoalsList = gymBuddyGoals;
  personalTraitsList = personalTraits;
  personalStyleList = personalTrainStyle;
  locationPrefList = locationPreference;

  progress = 0.0;
  slideIndex = 0;

  public gymBuddyGoalsChecked = 0;
  public gymBuddyGoalslimit = 3;
  public personalTraitsChecked = 0;
  public personalTraitsLimit = 3;
  public personalTrainStyleChecked = 0;
  public personalTrainStyleLimit = 2;
  public locationPrefChecked = 0;
  public locationPrefLimit = 2;

  private selectedGymBuddyGoals = [];
  private selectedWorkoutTimes = [];
  private selectedPersonalTraits = [];
  private selectedPersonalStyles = [];
  private selectedLocations = [];

  private slides: any;

  constructor() { }

  ngOnInit() {
    //loadingController
    //create service to check if person sign up already
    //if person havent sign up stay
    //else redirect
    this.gymBuddyPersonalFormData = new FormGroup({
      //title: new FormControl(),
      briefIntro: new FormControl(),
      timePref: new FormControl(),
      buddyPref: new FormControl(),
      gymBuddyGoals: new FormControl(),
      personalTraits: new FormControl(),
      personalStyle: new FormControl(),
      locationPref: new FormControl()
    });
  }
  /* store gymBuddyGoals data
  * if entry is not checked, check it and store the data
  * else find its index and remove it from the array. (uncheck)
  */
  storeGBGoalsData(entry) {
    if (!entry.isChecked) {
      this.selectedGymBuddyGoals.push(entry.value);
    } else {
      const index = this.selectedGymBuddyGoals.indexOf(entry.value);
      if (index > -1) {
      this.selectedGymBuddyGoals.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    this.selectedGymBuddyGoals.forEach((element) => {
      console.log(element);
    });
  }
  /* stores gym buddy preferred workout time data
  * if entry is not checked, check it and store the data
  * else find its index and remove it from the array. (uncheck)
  */
  storeGBTimePrefData(entry) {
    if (!entry.isChecked) {
      this.selectedWorkoutTimes.push(entry.value);
    } else {
      const index = this.selectedWorkoutTimes.indexOf(entry.value);
      if (index > -1) {
      this.selectedWorkoutTimes.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    this.selectedWorkoutTimes.forEach((element) => {
      console.log(element);
    });
  }
  /* stores gym buddy personal traits data
  * if entry is not checked, check it and store the data
  * else find its index and remove it from the array. (uncheck)
  */
  storeGBPersonalTraitsData(entry) {
    if (!entry.isChecked) {
      this.selectedPersonalTraits.push(entry.value);
    } else {
      const index = this.selectedPersonalTraits.indexOf(entry.value);
      if (index > -1) {
      this.selectedPersonalTraits.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    this.selectedPersonalTraits.forEach((element) => {
      console.log(element);
    });
  }
  /* stores gym buddy personal training style data
  * if entry is not checked, check it and store the data
  * else find its index and remove it from the array. (uncheck)
  */
  storeGBPersonalStylesData(entry) {
    if (!entry.isChecked) {
      this.selectedPersonalStyles.push(entry.value);
    } else {
      const index = this.selectedPersonalStyles.indexOf(entry.value);
      if (index > -1) {
      this.selectedPersonalStyles.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    this.selectedPersonalStyles.forEach((element) => {
      console.log(element);
    });
  }
  /* stores gym buddy preferred locations data
  * if entry is not checked, check it and store the data
  * else find its index and remove it from the array. (uncheck)
  */
  storeGBPrefLocationsData(entry) {
    if (!entry.isChecked) {
      this.selectedLocations.push(entry.value);
    } else {
      const index = this.selectedLocations.indexOf(entry.value);
      if (index > -1) {
      this.selectedLocations.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
    this.selectedLocations.forEach((element) => {
      console.log(element);
    });
  }
  /* limit number of checks for gymBuddyGoals */
  checkGymBuddyGoals(entry) {
    if (!entry.isChecked){
      this.gymBuddyGoalsChecked++;
      console.log(this.gymBuddyGoalsChecked);
    } else {
      this.gymBuddyGoalsChecked--;
      console.log(this.gymBuddyGoalsChecked);
    }
  }
  /*limit number of checks for personal traits */
  checkPersonalTraits(entry) {
    if (!entry.isChecked){
      this.personalTraitsChecked++;
      console.log(this.personalTraitsChecked);
    } else {
      this.personalTraitsChecked--;
      console.log(this.personalTraitsChecked);
    }
  }
  /*limit number of checks for personal traits */
  checkPersonalTrainStyle(entry) {
    if (!entry.isChecked){
      this.personalTrainStyleChecked++;
      console.log(this.personalTrainStyleChecked);
    } else {
      this.personalTrainStyleChecked--;
      console.log(this.personalTrainStyleChecked);
    }
  }
  /*limit number of checks for location preference */
  checkLocationPref(entry) {
    if (!entry.isChecked){
      this.locationPrefChecked++;
      console.log(this.locationPrefChecked);
    } else {
      this.locationPrefChecked--;
      console.log(this.locationPrefChecked);
    }
  }
  onSubmit() {
    console.log(this.gymBuddyPersonalFormData.value);
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

    this.slides.slideNext();
  }

  prevPage(){
    this.slides.slidePrev();
  }
}
