import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from './../../../services/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
/**
 * Class for the app's central sign up page
 */
export class SignUpPage implements OnInit {
  private credentials: FormGroup;

  private loadingPresent = true;

  constructor(
  private fb: FormBuilder,
  private authService: AuthenticationService,
  private alertController: AlertController,
  private router: Router,
  private loadingController: LoadingController,
  ) { }

  get birthday() {
    return this.credentials.get('birthday');
  }

  get confirmPassword() {
    return this.credentials.get('confirmPassword');
  }

  get email() {
    return this.credentials.get('email');
  }

  get firstName() {
    return this.credentials.get('firstName');
  }

  get lastName() {
    return this.credentials.get('lastName');
  }

  get password() {
    return this.credentials.get('password');
  }

  get username() {
    return this.credentials.get('username');
  }

  get gender() {
    return this.credentials.get('gender');
  }

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

  /**
   * Navigate to login page
   */
   async login() {
    this.router.navigateByUrl('', { replaceUrl: true });
  }

  /**
   * funcion to register a new user
   *
   * if the user is new and has not made an account, they will be navigated to enter more details for their profile
   * if the user has registerd before, they will be prompted a failed message
   *
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
    } else {
      this.showAlert('Registration failed', 'Please try again!');
    }
  }

  /**
   * function to display alert with customized headers and messages
   *
   * @param header header of alert
   * @param message message of alert
   */
  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  /**
   * function to display loading component
   */
  async showLoading() {
    this.loadingPresent = true;
    const load = await this.loadingController.create({
      message: 'Please wait....',

    });
    await load.present();
  }

  /**
   * fucntion to dismiss loading component
   */
  async dismissLoading() {
    if (this.loadingPresent) {
      await this.loadingController.dismiss();
    }
    this.loadingPresent = false;
  }

  /**
   * checks if confirm password matches with password, it will return validation error is it does not match,
   * else it will reutrn null as there is not error
   *
   * @param password user password
   */
  private equalto(fieldName): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

      const input = control.value;
      const isValid = control.root.value[fieldName] === input;
      if (!isValid) {
        return { equalTo: { isValid } };
      } else {
        return null;
      }
    };
  }

}
