import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  firstName: string;

  constructor() {}

  ngOnInit() {
    var userInfo_string = localStorage.getItem("userInfo");
    var userInfo = JSON.parse(userInfo_string);
    this.firstName = userInfo.firstName;
    console.log(this.firstName)
  }

  

}
