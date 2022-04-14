import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicSwiper, LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { areaOfInjury, armInjuries, legInjuries, backInjuries, handInjuries, feetInjuries, otherInjuries } from '../../../data/injuries';
import { fitnessGoals } from '../../../data/goals';

import SwiperCore, { Keyboard, Pagination, Scrollbar } from 'swiper';

SwiperCore.use([Keyboard, Pagination, Scrollbar, IonicSwiper]);

@Component({
  selector: 'app-user-details',
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

  userDetailsForm: FormGroup;
  private userSignUp: any;

  //Get value on ionChange on IonRadioGroup
  private selectedRadioGroup: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private toastCtrl: ToastController

  ) { }

  ngOnInit() {
    let userSignUp_string = localStorage.getItem('userSignUp');
    this.userSignUp = JSON.parse(userSignUp_string);
    this.gender = this.userSignUp.gender;
    this.buildForm();

    this.injury.valueChanges.subscribe(val => {
      console.log(val)
      if (val === 'yes') {
        this.userDetailsForm.controls['areaOfInjury'].setValidators([Validators.required]);
        this.userDetailsForm.controls['injuryType'].setValidators([Validators.required]);
      } else {
        this.userDetailsForm.controls['areaOfInjury'].clearValidators();
        this.userDetailsForm.controls['injuryType'].clearValidators();

      }
      this.userDetailsForm.controls['areaOfInjury'].updateValueAndValidity();
      this.userDetailsForm.controls['injuryType'].updateValueAndValidity();

    });

    this.healthCond.valueChanges.subscribe(val => {
      console.log(val);
      if (val === 'yes') {
        this.userDetailsForm.controls['healthCondName'].setValidators([Validators.required]);
      } else {
        this.userDetailsForm.controls['healthCondName'].clearValidators();
      }
      this.userDetailsForm.controls['healthCondName'].updateValueAndValidity();
    });

    if (this.gender === 'female') {
      this.userDetailsForm.controls['menstruationCycle'].setValidators([Validators.required]);
    } else {
      this.userDetailsForm.controls['menstruationCycle'].clearValidators();
    }
    this.userDetailsForm.controls['menstruationCycle'].updateValueAndValidity();
  }


  /**
   * Function to create user details form
   */
  buildForm() {
    this.userDetailsForm = this.fb.group({
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
  }

  // Easy access for form fields
  get height() {
    return this.userDetailsForm.get('height');
  }

  get weight() {
    return this.userDetailsForm.get('weight');
  }

  get injury() {
    return this.userDetailsForm.get('injury');
  }

  get healthCond() {
    return this.userDetailsForm.get('healthCond');
  }

  get healthCondName() {
    return this.userDetailsForm.get('healthCondName');
  }

  get fitnessGoal() {
    return this.userDetailsForm.get('fitnessGoal');
  }

  get menstruationCycle() {
    return this.userDetailsForm.get('menstruationCycle');
  }

  get areaOfInjury() {
    return this.userDetailsForm.get('areaOfInjury');
  }

  get injuryType() {
    return this.userDetailsForm.get('injuryType');
  }

  /**
   * set values for swiper progress
   * 
   * @param swiper swiper page
   */

  setSwiperInstance(swiper: any) {
    this.slides = swiper;
    this.slideIndex = this.slides.activeIndex;
    this.progress = this.getProgress(this.slides.activeIndex);

  }

  /**
   * Triggered when swiper goes to next page and progress bar will be updated
   */
  public slideDidChange() {
    console.log('Slide did change');
    if (!this.slides) return;

    console.table({
      isBeginning: this.slides.isBeginning,
      isEnd: this.slides.isEnd
    });

    this.progress = this.getProgress(this.slides.activeIndex);
  }


  /**
   * calculate progress of swiper component
   * 
   * @param i slide index
   */
  public getProgress(i) {
    let val = (i + 1) * 0.18;
    console.log(val);
    return val;
  }


  /**
   * triggered when next button is clicked and will move slide to the next page
   */
  nextPage() {
    console.log(this.slides);
    console.log(this.userDetailsForm);

    this.slides.slideNext();
  }

  /**
   * triggered when the back button is clicked and will return user to previous slide
   */
  prevPage() {
    this.slides.slidePrev();
  }

  /**
   * this function is to initialize the list of injures based on the area of injury selcted by the user 
   *  
   * @param event radio event when value is changed
   */
  radioInjuryChange(event) {
    this.selectedRadioGroup = event.detail;
    console.log(event)
    if (this.selectedRadioGroup.value == 'arm') {
      this.selectedInjury = armInjuries
    } else if (this.selectedRadioGroup.value == 'leg') {
      this.selectedInjury = legInjuries
    } else if (this.selectedRadioGroup.value == 'back') {
      this.selectedInjury = backInjuries
    } else if (this.selectedRadioGroup.value == 'hand') {
      this.selectedInjury = handInjuries
    } else if (this.selectedRadioGroup.value == 'feet') {
      this.selectedInjury = feetInjuries
    } else if (this.selectedRadioGroup.value == 'others') {
      this.selectedInjury = otherInjuries
    }
    else {
      this.selectedInjury = []
    }
  }

  /**
   * update user details and store into firebase
   */
  async completeSignUp() {
    console.log(this.userSignUp.id);
    /*stuff stored in userDetailsForm object */
    /*.value is to access form details */
    /*.id new variable name in the object */
    this.userDetailsForm.value.id = this.userSignUp.id;
    /*store into firestore */
    this.authService.addUserDetails(this.userDetailsForm.value);

    const toast = await this.toastCtrl.create({
      message: 'User updated!',
      duration: 2000
    });

    toast.present();
    this.router.navigateByUrl('/accounts/boarding', { replaceUrl: true });
  }

}
