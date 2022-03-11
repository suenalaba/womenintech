import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicSwiper, LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { areaOfInjury, armInjuries } from '../../../data/injuries';
import { fitnessGoals } from '../../../data/goals';

import SwiperCore, { Keyboard, Pagination, Scrollbar } from 'swiper';

SwiperCore.use([Keyboard, Pagination, Scrollbar, IonicSwiper]);

@Component({
  selector: 'app-user-details',//how come its just app-user-details. isn't user details nested in the app->accounts->user-details
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserDetailsPage implements OnInit {
  progress = 0.0;
  slideIndex = 0;

  public listInjuries = areaOfInjury;
  private selectedInjury = [];

  public listGoals = fitnessGoals;

  private gender: any;
  private slides: any;

  userDetails: FormGroup;
  private userSignUp: any;

  //Get value on ionChange on IonRadioGroup
  private selectedRadioGroup: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private toastCtrl: ToastController

  ) { }
  ngOnInit(){
    let userSignUp_string  = localStorage.getItem('userSignUp');
    this.userSignUp =  JSON.parse(userSignUp_string);
    this.gender = this.userSignUp.gender;

    this.userDetails = this.fb.group({
      height: ['', [Validators.required, Validators.minLength(3)]],
      weight: ['', [Validators.required, Validators.minLength(2)]],
      injury: ['', [Validators.required]],
      areaOfInjury: ['', []],
      injuryType: ['', []],
      healthCond: ['', [Validators.required]],
      healthCondName: ['', []],
      fitnessGoal: ['', [Validators.required]],
      menstruationCycle: ['', []]
    });

    this.injury.valueChanges.subscribe(val => {
      console.log(val)
      if (val === 'yes') {
        this.userDetails.controls['areaOfInjury'].setValidators([Validators.required]);
        this.userDetails.controls['injuryType'].setValidators([Validators.required]);
      } else {
        this.userDetails.controls['areaOfInjury'].clearValidators();
        this.userDetails.controls['injuryType'].clearValidators();

      }
      this.userDetails.controls['areaOfInjury'].updateValueAndValidity();
      this.userDetails.controls['injuryType'].updateValueAndValidity();

    });

    this.healthCond.valueChanges.subscribe(val => {
      console.log(val);
      if (val === 'yes') {
        this.userDetails.controls['healthCondName'].setValidators([Validators.required]);
      } else {
        this.userDetails.controls['healthCondName'].clearValidators();
      }
      this.userDetails.controls['healthCondName'].updateValueAndValidity();
    });

    if (this.gender === 'female') {
        this.userDetails.controls['menstruationCycle'].setValidators([Validators.required]);
      } else {
        this.userDetails.controls['menstruationCycle'].clearValidators();
      }
      this.userDetails.controls['menstruationCycle'].updateValueAndValidity();

  }

  // Easy access for form fields
  get height() {
    return this.userDetails.get('height');
  }

  get weight() {
    return this.userDetails.get('weight');
  }

  get injury() {
    return this.userDetails.get('injury');
  }

  get healthCond() {
    return this.userDetails.get('healthCond');
  }

  get healthCondName() {
    return this.userDetails.get('healthCondName');
  }

  get fitnessGoal() {
    return this.userDetails.get('fitnessGoal');
  }

  get menstruationCycle() {
    return this.userDetails.get('menstruationCycle');
  }

  get areaOfInjury(){
    return this.userDetails.get('areaOfInjury');
  }

  get injuryType(){
    return this.userDetails.get('injuryType');
  }



  setSwiperInstance(swiper: any) {
    this.slides = swiper;
    this.slideIndex = this.slides.activeIndex;
    this.progress = this.getProgress(this.slides.activeIndex);

  }

  public slideDidChange() {
    console.log('Slide did change');
    if (!this.slides) return;

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
    let val = (i+1) * 0.18;
    console.log(val);
    return val;
  }

  nextPage(){
    console.log(this.slides);
    console.log(this.userDetails);

    this.slides.slideNext();
  }

  prevPage(){
    this.slides.slidePrev();
  }

  radioInjuryChange(event) {
    this.selectedRadioGroup = event.detail;
    console.log(event)
    if (this.selectedRadioGroup.value == 'arm') {
      this.selectedInjury = armInjuries
    } else if (this.selectedRadioGroup.value == 'leg') {
      this.selectedInjury = []
    } else if (this.selectedRadioGroup.value == 'back') {
      this.selectedInjury = []
    } else if (this.selectedRadioGroup.value == 'hand') {
      this.selectedInjury = []
    } else if (this.selectedRadioGroup.value == 'feet') {
      this.selectedInjury = []
    } else if (this.selectedRadioGroup.value == 'others') {
      this.selectedInjury = []
    }
    else {
      this.selectedInjury = []
    }
  }

  async completeSignUp(){
    console.log(this.userSignUp.id);
    /*stuff stored in userdetails object */
    /*.value is to access form details */
    /*.id new variable name in the object */
    this.userDetails.value.id = this.userSignUp.id;
    /*store into firestore */
    this.authService.addUserDetails(this.userDetails.value);

    const toast = await this.toastCtrl.create({
      message: 'User updated!',
      duration: 2000
    });

    toast.present();
    this.router.navigateByUrl('/accounts/boarding', { replaceUrl: true });
  }

}
