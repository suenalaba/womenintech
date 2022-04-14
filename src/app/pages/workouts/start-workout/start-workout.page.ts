import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Timestamp } from 'firebase/firestore';
import { timer } from 'rxjs';
import { WorkoutDesc } from 'src/app/class/CreateWorkoutDesc';
import { WorkoutDetails } from 'src/app/class/WorkoutDetails';
import { WorkoutsService } from 'src/app/services/workouts/workouts.service';

@Component({
  selector: 'app-start-workout',
  templateUrl: './start-workout.page.html',
  styleUrls: ['./start-workout.page.scss'],
})
export class StartWorkoutPage implements OnInit {

  workoutId: string;
  userId: string;

  workoutRoutine: WorkoutDetails[];
  workoutDetails: WorkoutDesc;
  workoutJSON: string;
  exerciseIndex: number = 0;

  buttonText: string;
  workoutSection: string;
  loadDisplay: boolean = true;

  isRunning: boolean = false;
  timerButton: string = 'pause';
  timerDuration: number;
  displayTimer: string;

  constructor(
    private route: ActivatedRoute, private router: Router,
    private workoutService: WorkoutsService, private alertController: AlertController, private toastController: ToastController) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.workoutId = params.get('wid');
      this.userId = params.get('uid');
    });

    this.timerDuration = 0;
    this.toggleTimer();

    this.getWorkoutDetails(this.workoutId, this.userId);
  }

  /**
   * function to get user's workout
   *
   * @param wid workout id
   * @param uid user id
   */
  async getWorkoutDetails(wid: string, uid: string) {
    console.log(wid);

    this.workoutService.getWorkout(wid, uid).subscribe(results => {

      this.workoutRoutine = results.workoutRoutine;
      this.workoutDetails = results;
      this.workoutJSON = JSON.stringify(this.workoutDetails);
      this.getMoreWorkoutDetails(results);

      console.log(this.workoutRoutine);

      window.localStorage.setItem('workoutRoutine',JSON.stringify(this.workoutRoutine));
      window.localStorage.setItem('workoutDetails',JSON.stringify(this.workoutDetails));

    },
    error=>{
      console.log(error);
      this.router.navigateByUrl('/tabs/workouts', {replaceUrl: true});
    }
    );
  }

  /**
   * Fired when the component routing from is about to animate.
   */
  ionViewWillLeave() {
    this.isRunning = false;
    console.log(this.timerDuration);
  }

  /**
   * function to retrieve workout information
   * declare variables based on the workout status
   *
   * @param res workout information
   */
  getMoreWorkoutDetails(res: WorkoutDesc) {
    console.log(res.workoutStatus);
    if (res.workoutStatus == 'created' || res.workoutStatus == 'completed') {
      this.buttonText = 'FINISH WARM UP';
      this.workoutSection = 'warmup';
      this.workoutDetails.workoutStatus = 'in_progress';
      this.workoutDetails.dateStart = Timestamp.fromDate((new Date()));

    } else if (res.workoutStatus == 'in_progress') {
      this.getDisplayTimer(this.workoutDetails.stopwatch);
      this.timerDuration =  this.workoutDetails.stopwatch;
      this.workoutSection = this.workoutDetails.currExercise.section;
      this.exerciseIndex = this.workoutDetails.currExercise.index;
    }
    this.navToSection();
  }

  /**
   * change params of route
   */
  navToSection() {
    console.log('Current page:' + this.workoutSection + ' ' + this.exerciseIndex);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        workoutSection: this.workoutSection,
        exerciseIndex: this.exerciseIndex
      },
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      skipLocationChange: false
      // do not trigger navigation
    });
  }

  nextComponent(){
    if(this.workoutSection == 'warmup'){
      return this.workoutRoutine[0].exerciseName;
    }else if(this.workoutSection =='exercise' && this.exerciseIndex < this.workoutRoutine.length-1){
      return this.workoutRoutine[this.exerciseIndex].exerciseName;
    }else if(this.workoutSection =='exercise' && this.exerciseIndex == this.workoutRoutine.length-1){
      return 'Cool Down';
    }
  }

  async goToSummary(){
    this.saveWorkout();
    this.router.navigate(['/workout-summary'], { queryParams: { wid: this.workoutId, uid: this.userId}});
  }

  async stopWorkout(){
    await this.presentAlertConfirm();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Stop Workout',
      message: 'Stop and save workout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            this.toggleTimer();
          }
        }, {
          text: 'Okay',
          id: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
            this.saveWorkout();
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * fucntion to format data and save workout to firebase
   */
  async saveWorkout(){
    const receivedData = window.localStorage.getItem('workoutRoutine');
    this.workoutRoutine = JSON.parse(receivedData);

    let msg;

    this.route.queryParamMap.subscribe(params => {
      this.workoutSection = params.get('workoutSection');
      this.exerciseIndex = parseInt(params.get('exerciseIndex'), 10);
    });

    this.workoutDetails.workoutRoutine = this.workoutRoutine;

    if(this.workoutDetails.workoutStatus == 'in_progress'){
      this.workoutDetails.stopwatch = this.timerDuration;
      this.workoutDetails.workoutRoutine = this.workoutRoutine;
      this.workoutDetails.currExercise = {
        section: this.workoutSection,
        index: this.workoutSection=='exercise'?this.exerciseIndex:-1,
      };
      msg = 'Workout is saved!';
      this.workoutService.saveWorkout(this.workoutId, this.userId, this.workoutDetails).then(()=>this.presentToast(msg));

      await this.router.navigateByUrl('/tabs/workouts', {replaceUrl: true});
    }else if(this.workoutDetails.workoutStatus == 'completed'){
      this.workoutDetails.currExercise = {
        section: '',
        index: -1,
      };
      this.workoutDetails.dateCompleted = Timestamp.fromDate((new Date()));

      console.log(this.workoutDetails);
      msg = 'Workout completed!';
      this.workoutService.saveWorkout(this.workoutId, this.userId, this.workoutDetails).then(()=>this.presentToast(msg));
    }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Your Workout is Paused',
      backdropDismiss: false,
      message: 'Do you want to continue?',
      buttons: [{
        text: 'Yes',
        handler: (blah) => {
          this.toggleTimer();
        }
      },{
        text: 'No',
        role: 'cancel',
        id: 'cancel-button',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
          this.stopWorkout();
        }
      }],

    });

    await alert.present();
  }

  /***
   * TIMER
   */
  toggleTimer() {
    this.isRunning = !this.isRunning;
    this.stopwatch();

    if(!this.isRunning){
      this.presentAlert();
    }
  }

  /**
   * Stopwatch functions to control the timer
   */
  stopwatch() {
    timer(0, 1000).subscribe(ellapsedCycles => {
      if (this.isRunning) {
        this.timerDuration++;
        this.getDisplayTimer(this.timerDuration);
        this.timerButton = 'pause';
      } else {
        this.timerButton = 'play';
      }
    });
  }

  /**
   * Display the time
   * @param time current time to show
   */
  getDisplayTimer(time: number) {
    let hours = '' + Math.floor(time / 3600);
    let minutes = '' + Math.floor(time % 3600 / 60);
    let seconds = '' + Math.floor(time % 3600 % 60);

    if (Number(hours) < 10) {
      hours = '0' + hours;
    } else {
      hours = '' + hours;
    }
    if (Number(minutes) < 10) {
      minutes = '0' + minutes;
    } else {
      minutes = '' + minutes;
    }
    if (Number(seconds) < 10) {
      seconds = '0' + seconds;
    } else {
      seconds = '' + seconds;
    }

    this.displayTimer = hours + ':' + minutes + ':' + seconds;
  }

}
