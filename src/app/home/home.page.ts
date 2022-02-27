import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { User } from '../class/user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  firstName: string = '';
  userInfo: any;
  constructor() {}

  ngOnInit() {
    var userInfo_string = localStorage.getItem("userInfo");
    this.userInfo = JSON.parse(userInfo_string);
  }

  ionViewWillEnter(){
    this.firstName = this.userInfo.firstName;
    
  }

  

}
