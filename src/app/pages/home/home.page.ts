/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/prefer-for-of */
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

  //wholeWidth = window.innerWidth;
  //vidWidth = this.parseVideos();

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private user: UserService,
    //private youtubeVideoPlayer: YoutubeVideoPlayer
  ) {}

  //invokeVideoPlayer(){
  //  this.youtubeVideoPlayer.openVideo('pass-video-id');
  //}

  @ViewChild('swiper') swiper: SwiperComponent;

  configStats: SwiperOptions = {
    slidesPerView: 1,
    loop: true,
    spaceBetween: 50,
    autoplay: {
      delay: 5000,
    },
    pagination: true
  };

  configYt: SwiperOptions = {
    slidesPerView: 1.5,
    loop: true,
    spaceBetween: 10,
    autoplay: {
      delay: 3000,
    },
    pagination: false
  };

  ngAfterContentChecked(): void{
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  ngOnInit() {
    this.loadHomePage();
    this.parseVideos();

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

      this.cals = 69;
      var dur = 14;
      this.durn = `${dur} mins`;
    });
    loading.dismiss();
  }

  async parseVideos() {
    // this.user.getData().subscribe(data=>{
    //   console.log('1');
    //   console.log(data);
    //   this.ytPayload = data;
    //   this.loadVideos();
    // });
    this.ytPayload = require('../../../assets/placeholders/ytPayload_Sample.json');
    var videoRes = this.ytPayload.items;
    for (var i = 0; i < videoRes.length; i++) {
      videoRes[i].image = videoRes[i].snippet.thumbnails.high.url;
      console.log(videoRes[i].image);

      videoRes[i].name = videoRes[i].snippet.title;
      console.log(videoRes[i].name);

      videoRes[i].videoUrl = 'https://www.youtube.com/embed/' + videoRes[i].id.videoId;
      console.log(videoRes[i].videoUrl);

    }
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
          data: [10, 18, 3, 15, 3, 3, 1],
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

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
