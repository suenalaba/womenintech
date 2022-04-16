/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/member-ordering */
import { OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import Swiper, { Autoplay } from 'swiper';
import SwiperCore, { Pagination } from 'swiper';
import { EChartsOption } from 'echarts';
import { UserService } from '../../services/user.service';
import YoutubeService from 'src/app/services/youtube.service';

import { HostListener } from '@angular/core';
import { WorkoutsService } from 'src/app/services/workouts/workouts.service';
import { Router } from '@angular/router';

Swiper.use([Autoplay]);
SwiperCore.use([Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

/**
 * Homepage that the user lands on
 */
export class HomePage implements OnInit {
  public static completedWorkouts = [] as any;
  public basedOnWorkout = '';
  public cals = 0;
  public chartOptions: EChartsOption;
  public configStats: SwiperOptions = {
    slidesPerView: 1,
    loop: true,
    spaceBetween: 50,
    autoplay: {
      delay: 5000,
    },
    pagination: true,
  };
  public configYt: SwiperOptions = {
    slidesPerView: 1.5,
    loop: true,
    spaceBetween: 10,
    pagination: true,
  };
  public durn = '0 mins';
  public firstName = '';
  public today = '';
  public welcomeText = '';
  public ytVideos: any[];
  /**
   * Configuration for the swiper slide for the stats
   */
  @ViewChild('swiperStats') public swiperStats: SwiperComponent;
  /**
   * Configuration for the swiper slide for the youtube video recommendations
   */
  @ViewChild('swiperYt') private swiperYt: SwiperComponent;
  private thisWkWorkouts = [] as any;
  private userInfo: any;
  private workoutTimeIndex: string[];
  private workoutTimeSeries: number[];

  constructor(
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private workoutService: WorkoutsService,
    private router: Router
  ) {
    this.onResize();
    this.ytVideos = [];
    this.thisWkWorkouts = [];
  }

  /**
   * Navigate to the statistics page
   */
  public goCompletedWorkouts() {
    this.router.navigate(['/tabs/stats']);
  }

  /**
   * Dynamically change the number of videos shown on the screen based on screen size
   *
   * @param event when the screen changes
   */
  @HostListener('window:resize', ['$event'])
  private onResize(event?) {
    console.log('screen change size');
    if (typeof this.ytVideos !== 'undefined') {
      this.swiperYt.slidesPerView = Math.max(
        1,
        Math.floor(window.innerWidth / this.ytVideos[0].ThumbnailWidth)
      );
    }

    if (typeof this.ytVideos !== 'undefined') {
      console.log(this.swiperYt.slidesPerView);
      this.swiperYt.initSwiper();
    }
  }

  /**
   * Perform a synchronous-type refresh upon clicking refresh button
   */
  async doRefresh() {
    await this.filterWorkouts();
    this.loadText();
    this.getVideos();
    this.loadGraph();
  }

  /**
   * Perform an asynchronous-type refresh upon pull to refresh
   *
   * @param event pull up to refresh occurred
   */
  async doRefresh2(event) {
    await this.filterWorkouts();
    setTimeout(() => {
      console.log('Async operation has ended');
      this.loadText();
      this.getVideos();
      this.loadGraph();
      event.target.complete();
    }, 1000);
  }

  /**
   * Get all the workouts and filter down to those done this week
   */
  async filterWorkouts() {
    this.thisWkWorkouts = [];
    HomePage.completedWorkouts = await this.workoutService.getCompletedWorkouts(
      JSON.parse(localStorage.getItem('userID'))
    );
    for (let i = 0; i < HomePage.completedWorkouts.docs.length; i++) {
      const tdy = new Date();
      if (
        HomePage.completedWorkouts.docs[i].data().dateCompleted.seconds >=
        tdy.getTime() / 1000 - 7 * 24 * 60 * 60
      ) {
        await this.thisWkWorkouts.push(
          HomePage.completedWorkouts.docs[i].data()
        );
      }
    }
    console.log('end filterWorkout');
  }

  /**
   * Connect to the Youtube API endpoint to get recommneded videos
   */
  async getVideos() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    this.ytVideos = [];

    // FIRST TIME USERS (NO WORKOUT COMPLETED)
    if (HomePage.completedWorkouts.docs.length == 0) {
      this.basedOnWorkout = `Get started on your first exercise!`;

      let genderr = '';
      if (this.userInfo.gender != 'others') {
        genderr += this.userInfo.gender;
      }

      const ytService = YoutubeService.getInstance();
      ytService
        .getYoutubeAPI('exercise for beginners ' + genderr, 1)
        .then((res) => this.ytVideos.push(res));
      ytService
        .getYoutubeAPI(
          'exercise for ' +
            this.userInfo.userDetails.fitnessGoal +
            ' ' +
            genderr,
          1
        )
        .then((res) => this.ytVideos.push(res));
      if (this.userInfo.userDetails.areaOfInjury) {
        ytService
          .getYoutubeAPI(
            'exercise for injury ' + this.userInfo.userDetails.areaOfInjury,
            1
          )
          .then((res) => this.ytVideos.push(res));
      }
    } else {
      // HAS COMPLETED A WORKOUT
      this.basedOnWorkout = `Based on workout: ${
        HomePage.completedWorkouts.docs[0].data().workoutName
      }`;
      const latestWorkout =
        HomePage.completedWorkouts.docs[0].data().workoutRoutine;

      for (let i = 0; i < latestWorkout.length; i++) {
        let searchTerm = '';
        searchTerm += latestWorkout[i].exerciseName;
        if (this.userInfo.gender != 'others') {
          searchTerm += ' ' + this.userInfo.gender;
        }
        const ytService = YoutubeService.getInstance();
        ytService
          .getYoutubeAPI(searchTerm, 1)
          .then((res) => this.ytVideos.push(res));
      }
    }
    console.log(this.ytVideos);

    loading.dismiss();
    console.log('end getvid');
  }

  /**
   * Calculate the stats to show on the graph
   */
  async loadGraph() {
    //const loading = await this.loadingCtrl.create();
    //await loading.present();
    this.workoutTimeIndex = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const tdy = new Date();
    const shift = tdy.getDay();
    for (let loop = 0; loop < shift; loop++) {
      const temp1 = this.workoutTimeIndex.shift();
      this.workoutTimeIndex.push(temp1);
    }
    let temp = this.workoutTimeIndex.pop();
    temp += ' (TODAY) ';
    this.workoutTimeIndex.push(temp);

    console.log(this.thisWkWorkouts);
    this.workoutTimeSeries = new Array(this.workoutTimeIndex.length).fill(0);
    let ptr = 0;
    let i = 0;
    while (
      i < this.workoutTimeIndex.length &&
      ptr < this.thisWkWorkouts.length
    ) {
      console.log(ptr);
      const upperBound = tdy.getTime() / 1000 - i * 24 * 60 * 60;
      const lowerBound = upperBound - 24 * 60 * 60;
      const curTime = this.thisWkWorkouts[ptr].dateCompleted.seconds;
      if (lowerBound <= curTime && curTime <= upperBound) {
        this.workoutTimeSeries[this.workoutTimeSeries.length - 1 - i] +=
          parseInt(this.thisWkWorkouts[ptr].stopwatch, 10) / 60;
        ptr++;
      } else {
        i++;
      }
    }
    for (let j = 0; j < this.workoutTimeSeries.length; j++) {
      this.workoutTimeSeries[j] =
        Math.round(this.workoutTimeSeries[j] * 100) / 100;
    }

    //loading.dismiss();
    console.log('end loadgraph');
  }

  /**
   * Process the data and generate the relevant text to show on the screen
   */
  async loadText() {
    const loading = await this.loadingCtrl.create();
    // await loading.present();

    if (HomePage.completedWorkouts.docs.length == 0) {
      this.welcomeText = 'Welcome aboard ' + this.userInfo.firstName + '!';
    } else {
      this.welcomeText = 'Welcome back, ' + this.userInfo.firstName;
    }

    const tdy = new Date();
    this.today =
      String(tdy.getDate()) +
      ' ' +
      String(tdy.toLocaleString('default', { month: 'long' })) +
      ' ' +
      String(tdy.getFullYear()) +
      ', ' +
      String(tdy.toLocaleString('default', { weekday: 'long' }));

    this.cals = 0;
    let durnInt = 0;
    for (let i = 0; i < this.thisWkWorkouts.length; i++) {
      durnInt += parseInt(this.thisWkWorkouts[i].stopwatch, 10);
      this.cals += this.thisWkWorkouts[i].caloriesBurnt;
    }
    this.cals = Math.round(this.cals * 100) / 100;
    this.durn = `${Math.round((durnInt / 60) * 100) / 100} mins`;

    loading.dismiss();
    console.log('end loadtext');
  }

  ngOnInit() {
    this.userService
      .getUserById(JSON.parse(localStorage.getItem('userID')))
      .subscribe(async (res) => {
        this.userInfo = res;
        await this.filterWorkouts();
        this.loadText();
        this.getVideos();
        this.loadGraph();
      });
  }

  /**
   * Lazily draw the chart only when the user swipes to the graph page
   *
   * @param e event for when the user swipes to the graph
   */
  async swiperSlideChanged(e) {
    console.log('changed slide: ', e);
    this.chartOptions = {
      title: {},
      tooltip: {
        trigger: 'axis',
      },
      legend: {},
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.workoutTimeIndex,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}',
        },
      },
      series: [
        {
          name: 'Exercise Minutes',
          type: 'line',
          data: this.workoutTimeSeries,
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' },
            ],
          },
          markLine: {
            data: [{ type: 'average', name: 'Avg' }],
          },
          smooth: true,
          label: {
            show: true,
            position: 'top',
            color: 'black',
            fontSize: 12,
          },
        },
      ],
    };
  }
}
