import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';

import { NavController, AlertController, LoadingController, Platform } from '@ionic/angular';
import { AuthenticationService } from './../../../services/authentication.service';
import SwiperCore, { Keyboard, Pagination, Scrollbar } from 'swiper';
//import { Storage } from '@capacitor/storage'

@Component({
  selector: 'app-edit-workout',
  templateUrl: './edit-workout.page.html',
  styleUrls: ['./edit-workout.page.scss'],
})
export class EditWorkoutPage implements OnInit {
  credentials: FormGroup;

  exercises= [{"no": 1, "reps": 12}, {"no": 2, "reps": 12}, {"no": 3, "reps": 12}, {"no": 4, "reps": 12}]
  workout= [
    {"exercise": "Shoulder Press"},
    {"exercise": "Chest Press"},
    {"exercise": "Leg Press"}
  ]


  loadingPresent = true;
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private navigate: NavController,
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required, this.equalto('password')]],
      username: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

   // Easy access for form fields
   get firstName() {
    return this.credentials.get('firstName');
  }

  get lastName() {
    return this.credentials.get('lastName');
  }

  get confirmPassword() {
    return this.credentials.get('confirmPassword');
  }

  get password() {
    return this.credentials.get('password');
  }

  get username() {
    return this.credentials.get('username');
  }

  get email() {
    return this.credentials.get('email');
  }

  get gender() {
    return this.credentials.get('gender');
  }

  get birthday() {
    return this.credentials.get('birthday');
  }

  /**
   *
   * @param password
   */
  equalto(field_name): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

      let input = control.value;
      let isValid = control.root.value[field_name] == input
      if (!isValid)
        return { 'equalTo': { isValid } }
      else
        return null;
    };
  }

  /**
   * Navigate to login page
   */
  async login() {
    this.router.navigateByUrl('', { replaceUrl: true });
  }

  /**
   *
   * sign
   */
  async signUp() {
    const loading = await this.loadingController.create();
    await loading.present();


    const user = await this.authService.register(this.credentials.value);
    await loading.dismiss();

    if (this.credentials.valid && user) {
      this.credentials.value.id = user.user.uid;
      localStorage.setItem('userSignUp', JSON.stringify(this.credentials.value));
      this.router.navigateByUrl('/user-details', { replaceUrl: true });
      // this.router.navigateByUrl('/boarding', { replaceUrl: true });
    } else {
      this.showAlert('Registration failed', 'Please try again!');
    }

  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async showLoading() {
    this.loadingPresent = true
    let load = await this.loadingController.create({
      message: "Please wait....",

    })
    await load.present();
  }

  async dismissLoading() {
    if (this.loadingPresent) {
      await this.loadingController.dismiss();
    }
    this.loadingPresent = false;
  }

}

