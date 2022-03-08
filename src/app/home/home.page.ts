import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { User } from '../class/user';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  firstName: string = '';
  userInfo: any;
  constructor(
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    var userInfo_string;
    if(localStorage.getItem('userInfo') === null){
      this.authService.logout();
    }else{
      userInfo_string = localStorage.getItem('userInfo');
      this.userInfo = JSON.parse(userInfo_string);
    }
  }

  ionViewWillEnter(){
    this.firstName = this.userInfo.firstName;
  }
}
