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

import { HostListener } from '@angular/core';

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

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

  ytVideos: any;

  dataSeries: number[];

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private user: UserService,
  ) { this.onResize(); }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    console.log('screen change size');
    if (typeof this.ytVideos !== 'undefined') {
      this.swiperYt.slidesPerView = Math.max(1,Math.floor(window.innerWidth / this.ytVideos[0].ThumbnailWidth));
    }

    if (typeof this.ytVideos !== 'undefined') {
      console.log(this.swiperYt.slidesPerView);
      this.swiperYt.initSwiper();
    }
  }

  @ViewChild('swiperStats') swiperStats: SwiperComponent;
  configStats: SwiperOptions = {
    slidesPerView: 1,
    loop: true,
    spaceBetween: 50,
    autoplay: {
      delay: 5000,
    },
    pagination: true
  };

  @ViewChild('swiperYt') swiperYt: SwiperComponent;
  configYt: SwiperOptions = {
    slidesPerView: 1.5,
    loop: true,
    spaceBetween: 10,
    pagination: true,
  };

  // ngAfterContentChecked(): void{
  //   if (this.swiper) {
  //     this.swiper.updateSwiper({});
  //   }
  // }

  ngOnInit() {
    this.userService.getUserById(JSON.parse(localStorage.getItem('userID'))).subscribe((res)=>{
      this.userInfo = res;
      this.loadText();
      this.getVideos();
      this.loadGraph();
    });

  }

  async loadText(){
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.welcomeText = 'Welcome back, ' + this.userInfo.firstName;
    var tdy = new Date();
    this.today = String(tdy.getDate()) + ' ' + String(tdy.toLocaleString('default', { month: 'long' })) + ' ' + String(tdy.getFullYear()) + ', ' + String(tdy.toLocaleString('default', { weekday: 'long' }));

    this.cals = 69;
    this.durn = `${14} mins`;

    loading.dismiss();
  }

  async getVideos() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    let searchTerm = '';

    if (this.userInfo.gender == "others") {
      searchTerm = "deadlift"
    }
    else {
      searchTerm = "deadlift " + this.userInfo.gender;
    }
    this.ytVideos = this.user.getYoutubeAPI(searchTerm);

    loading.dismiss();
  }

  async loadGraph() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.dataSeries = [10, 18, 3, 15, 3, 3, 1]

    loading.dismiss();
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
          data: this.dataSeries,
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

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}