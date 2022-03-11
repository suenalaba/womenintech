import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { NavController, AlertController, LoadingController, Platform } from '@ionic/angular';
import { AuthenticationService } from './../../../services/authentication.service';
//import { Storage } from '@capacitor/storage'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  errorgroup: [];

  loadingPresent = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private navigate: NavController,
    private platform: Platform
  ) { }

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  async register() {
    this.router.navigateByUrl('/accounts/sign-up', { replaceUrl: true });
    // const user = await this.authService.register(this.credentials.value);
    // await loading.dismiss();

    // if (user) {
    //   this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
    // } else {
    //   this.showAlert('Registration failed', 'Please try again!');
    // }
  }

  async login(value) {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();

    if (user) {
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } else {
      this.showAlert('Login failed', 'Please try again!');
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
    this.loadingPresent = true;
    let load = await this.loadingController.create({
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

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

}
