import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
// import { AvatarService } from '../services/avatar.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})

/**
 * Settings page display
 */
export class SettingsPage implements OnInit {

  public settingstat= [
    {stat: 'GENDER'},
    {stat: 'UNITS OF MEASURE'},
    {stat: 'DATE OF BIRTH'}
  ];
  public settingvalue = ['MALE','KG','BIRTHDAY'];
  public userInfo: any;
  constructor(
    //private avatarService: AvatarService,
    private authService: AuthenticationService,
    private userService: UserService,
    private router: Router  ) {}

  ngOnInit() {
    this.userService.getUserById(JSON.parse(localStorage.getItem('userID'))).subscribe((res)=>{
      this.userInfo = res;
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }



}
