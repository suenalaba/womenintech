/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';
import { User } from '../../class/user';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  firstName: string = '';
  userInfo: any;

  welcomeText: string = '';
  today: string = '';

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private loadingCtrl: LoadingController

  ) {}

  @ViewChild('swiper') swiper: SwiperComponent;
  ngAfterContentChecked(): void{
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  option = {
    slidesPerView: 1,
    centeredSlides: true,
    loop: false,
    spaceBetween: 10,
    autoplay: true
  }

  ngOnInit() {
    this.loadHomePage();

    // var userInfo_string;
    // if(localStorage.getItem('userInfo') === null){
    //   this.authService.logout();
    // }else{
    //   userInfo_string = localStorage.getItem('userInfo');
    //   this.userInfo = JSON.parse(userInfo_string);
    // }
  }

  async loadHomePage(){
    const loading = await this.loadingCtrl.create();
    await loading.present();
    this.userService.getUserById(JSON.parse(localStorage.getItem('userID'))).subscribe((res)=>{
      this.userInfo = res;
      this.firstName = this.userInfo.firstName;

      this.welcomeText = 'Welcome Back ' + this.firstName;
      var tdy = new Date();
      this.today = String(tdy.getDate()) + ' ' + String(tdy.toLocaleString('default', { month: 'long' })) + ' ' + String(tdy.getFullYear()) + ', ' + String(tdy.toLocaleString('default', { weekday: 'long' }));
      loading.dismiss();
    })
  }
}
