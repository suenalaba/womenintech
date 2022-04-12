import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
// import { AvatarService } from '../services/avatar.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {

  firstName: string = '';
  userInfo: any;

  settingstat= [
    {"stat": "GENDER"},
    {"stat": "UNITS OF MEASURE"},
    {"stat": "DATE OF BIRTH"}
  ]

  ngOnInit() {
    this.userService.getUserById(JSON.parse(localStorage.getItem('userID'))).subscribe((res)=>{
      this.userInfo = res;
    });

  }

  settingvalue= ["MALE","KG","BIRTHDAY"]

  constructor(
    //private avatarService: AvatarService,
    private authService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private user: UserService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  

}
