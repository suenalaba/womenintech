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
import { UserService } from '../../services/user.service';
import { YoutubeService } from 'src/app/services/youtube.service';

import { HostListener } from '@angular/core';
import { WorkoutsService } from 'src/app/services/workouts/workouts.service';
import { TouchSequence } from 'selenium-webdriver';
import { getHeapCodeStatistics } from 'v8';
import { Router } from '@angular/router';
import { CompletedWorkout } from 'src/app/class/CreateWorkoutDesc';


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
  basedOnWorkout: string = '';

  cals: number = 0;
  durn: string = '0 mins';

  chartOptions: EChartsOption;

  ytVideos: any[];

  workoutTimeSeries: number[];
  workoutTimeIndex: string[]; 

  public static completedWorkouts: any;
  thisWkWorkouts: any;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private ytService: YoutubeService,
    private workoutService: WorkoutsService,
    private router: Router,
  ) { this.onResize(); this.ytVideos = []; this.thisWkWorkouts = []; }

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

  ngOnInit() {
    this.userService.getUserById(JSON.parse(localStorage.getItem('userID'))).subscribe(async (res)=>{
      this.userInfo = res;
      await this.filterWorkouts();
      this.loadText();
      this.getVideos();
      this.loadGraph();
    });
  }

  async filterWorkouts() {
    HomePage.completedWorkouts = await this.workoutService.getCompletedWorkouts(JSON.parse(localStorage.getItem('userID')));
    for (let i = 0; i < HomePage.completedWorkouts.docs.length; i++) {
      var tdy = new Date();
      if(HomePage.completedWorkouts.docs[i].data().dateCompleted.seconds>=tdy.getTime()/1000-7*24*60*60) {
        await this.thisWkWorkouts.push(HomePage.completedWorkouts.docs[i].data());
      }
    }
    console.log('end filterWorkout');
  }

  async loadText(){
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if(HomePage.completedWorkouts.docs.length == 0) {
      this.welcomeText = 'Welcome aboard ' + this.userInfo.firstName + '!';
    } else {
      this.welcomeText = 'Welcome back, ' + this.userInfo.firstName;
    }
    
    var tdy = new Date();
    this.today = String(tdy.getDate()) + ' ' + String(tdy.toLocaleString('default', { month: 'long' })) + ' ' + String(tdy.getFullYear()) + ', ' + String(tdy.toLocaleString('default', { weekday: 'long' }));

    let durnInt = 0;
    for (let i = 0; i < this.thisWkWorkouts.length; i++) {
      durnInt += parseInt(this.thisWkWorkouts[i].stopwatch);
      this.cals += this.thisWkWorkouts[i].caloriesBurnt;
    }
    this.cals = Math.round(this.cals * 100) / 100
    this.durn = `${Math.round(durnInt/60 * 100) / 100} mins`;

    loading.dismiss();
    console.log('end loadtext');
  }

  async getVideos() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.thisWkWorkouts.push();

    // FIRST TIME USERS (NO WORKOUT COMPLETED)
    if(HomePage.completedWorkouts.docs.length == 0) {
      this.basedOnWorkout = `Get started on your first exercise!`;

      let genderr = '';
      if (this.userInfo.gender != "others") {
        genderr += this.userInfo.gender;
      }
      this.ytVideos.push(this.ytService.getYoutubeAPI('exercise for beginners '+genderr));
      this.ytVideos.push(this.ytService.getYoutubeAPI('exercise for '+this.userInfo.userDetails.fitnessGoal+' '+genderr));
      if (this.userInfo.userDetails.areaOfInjury) {
        this.ytVideos.push(this.ytService.getYoutubeAPI('exercise for injury '+this.userInfo.userDetails.areaOfInjury));
      }
    } else {
    // HAS COMPLETED A WORKOUT
      this.basedOnWorkout = `Based on workout: ${HomePage.completedWorkouts.docs[0].data().workoutName}`;
      let latestWorkout = HomePage.completedWorkouts.docs[0].data().workoutRoutine;

      for (let i = 0; i < latestWorkout.length; i++) {
        let searchTerm = '';
        searchTerm += latestWorkout[i].exerciseName;
        if (this.userInfo.gender != "others") {
          searchTerm += this.userInfo.gender;
        }
        let ytVid = this.ytService.getYoutubeAPI(searchTerm);
        this.ytVideos.push(ytVid);
      }
    }

    loading.dismiss();
    console.log('end getvid');
  }

  async loadGraph() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.workoutTimeIndex = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var tdy = new Date();
    console.log(tdy);
    var shift = tdy.getDay()-1;
    while (shift--) {
      var temp = this.workoutTimeIndex.shift()
      this.workoutTimeIndex.push(temp);
    }
    var temp = this.workoutTimeIndex.shift();
    temp += ' (TODAY) '
    this.workoutTimeIndex.push(temp);

    console.log(this.thisWkWorkouts);
    this.workoutTimeSeries = new Array(this.workoutTimeIndex.length).fill(0);
    var ptr = 0;
    let i = 0;
    while (i<this.workoutTimeIndex.length && ptr < this.thisWkWorkouts.length) {
      console.log(ptr);
      var upperBound = tdy.getTime()/1000-i*24*60*60;
      var lowerBound = upperBound-24*60*60;
      var curTime = this.thisWkWorkouts[ptr].dateCompleted.seconds;
      if (lowerBound <= curTime && curTime <= upperBound) {
        this.workoutTimeSeries[this.workoutTimeSeries.length-1-i] += parseInt(this.thisWkWorkouts[ptr].stopwatch);
        ptr++;
      }
      else{
        i++;
      }
    }
    loading.dismiss();
    console.log('end loadgraph');
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
        data: this.workoutTimeIndex,
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
          data: this.workoutTimeSeries,
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

  goStats() {
    this.router.navigate(['/tabs/stats']);
  }

}