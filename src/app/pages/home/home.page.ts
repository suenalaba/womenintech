/* eslint-disable no-var */
/* eslint-disable max-len */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import Swiper, {Autoplay} from 'swiper';
import SwiperCore, {Pagination} from 'swiper';
import { User } from '../../class/user';
import { AuthenticationService } from '../../services/authentication.service';
import { EChartsOption } from 'echarts';
import { waitForAsync } from '@angular/core/testing';
import { UserService } from '../../services/user.service'; //youtube api

Swiper.use([Autoplay]);
SwiperCore.use([Pagination]);

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

  cals: number = 0;
  durn: string = '0 mins';

  chartOptions: EChartsOption;

  ytPayload: any;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private user: UserService
  ) {}

  @ViewChild('swiper') swiper: SwiperComponent;

  config: SwiperOptions = {
    slidesPerView: 1,
    loop: true,
    spaceBetween: 50,
    autoplay: {
      delay: 3000,
    },
    pagination: true
  };

  ngAfterContentChecked(): void{
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
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
      //console.log(res);
      this.userInfo = res;
      this.firstName = this.userInfo.firstName;

      this.welcomeText = 'Welcome back, ' + this.firstName;
      var tdy = new Date();
      this.today = String(tdy.getDate()) + ' ' + String(tdy.toLocaleString('default', { month: 'long' })) + ' ' + String(tdy.getFullYear()) + ', ' + String(tdy.toLocaleString('default', { weekday: 'long' }));

      this.cals = 45;
      var dur = 14;
      this.durn = `${dur} mins`;
      loading.dismiss();
    });

    // this.user.getData().subscribe(data=>{
    //   console.log('1');
    //   console.log(data);
    //   this.ytPayload = data;
    //   this.loadVideos();
    // });
    this.ytPayload = require('../../../assets/placeholders/ytPayload_Sample.json');
    this.loadVideos();

  }

  async loadVideos() {
    console.log('2');
    console.log(this.ytPayload);
  }

  async swiperSlideChanged(e) {
    console.log('changed slide: ' ,e);
    this.chartOptions = {
      title: {
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {},
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [
        {
          name: 'Time Recorded',
          type: 'line',
          data: [10, 11, 13, 11, 12, 12, 9],
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' }
            ]
          },
          markLine: {
            data: [{ type: 'average', name: 'Avg' }]
          },
          smooth: true,
          label: {
              show: true,
              position: 'top',
              color: 'black',
              fontSize: 12,
          },
        },
      ]
    };
  }

}
