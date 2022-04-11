import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Timestamp } from 'firebase/firestore';
import { timer } from 'rxjs';
import { WorkoutDesc } from 'src/app/class/CreateWorkoutDesc';
import { WorkoutDetails } from 'src/app/class/WorkoutDetails';
import { WorkoutAPIService } from 'src/app/services/workouts/workout-API.service';
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
  exerciseIndex: number = 0;

  buttonText: string;
  workoutSection: string;

  isRunning: boolean = true;
  timerButton: string = 'pause';
  timerDuration: number;
  displayTimer: string;



  constructor(private workoutExercise: WorkoutAPIService, 
    private route: ActivatedRoute, private router: Router, 
    private workoutService: WorkoutsService, private alertController: AlertController, private toastController: ToastController) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.workoutId = params.get('wid');
      this.userId = params.get('uid');
    })

    this.timerDuration = 0;
    this.toggleTimer();

    this.getWorkoutDetails(this.workoutId, this.userId);
  }

  async getWorkoutDetails(wid: string, uid: string) {
    console.log(wid)

    this.workoutService.getWorkout(wid, uid).subscribe(results => {

      this.workoutRoutine = results.workoutRoutine;
      this.workoutDetails = results;

      this.getMoreWorkoutDetails(results)

      console.log(this.workoutRoutine)
      window.localStorage.setItem("workoutRoutine",JSON.stringify(this.workoutRoutine));

    });
  }

  ionViewWillLeave() {
    this.isRunning = false;
    console.log(this.timerDuration)
  }

  getMoreWorkoutDetails(res: WorkoutDesc) {
    if (res.workoutStatus == "created") {
      this.buttonText = "FINISH WARM UP"
      this.workoutSection = "warmup"
      this.workoutDetails.workoutStatus = "in_progress"
      this.workoutDetails.dateStart = Timestamp.fromDate((new Date()));
    } else if (res.workoutStatus == "in_progress") {

      this.getDisplayTimer(this.workoutDetails.stopwatch);
      this.timerDuration =  this.workoutDetails.stopwatch;

      this.buttonText = "NEXT EXERCISE"
      this.workoutSection = this.workoutDetails.currExercise.section;
      this.exerciseIndex = this.workoutDetails.currExercise.index;
      
    } else if (res.workoutStatus == "completed") {
      this.buttonText = "FINISH WARM UP"
      this.workoutSection = "warmup"
    }

    this.navToSection()
  }

  nextExercise(e: any) {
    console.log(this.exerciseIndex, this.workoutRoutine.length)
    if(this.exerciseIndex < this.workoutRoutine.length-1){
      this.buttonText = "NEXT EXERCISE"
      this.workoutSection = "exercise"
    }else if(this.exerciseIndex == this.workoutRoutine.length-1){
      this.buttonText = "START COOLDOWN"
      this.workoutSection = "exercise"
    }else{
      this.buttonText = "FINISH COOLDOWN"
      this.workoutSection = "cooldown"
      this.exerciseIndex = -1;
    }
    this.navToSection()
    this.exerciseIndex++;
  }

  navToSection() {
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
          }
        }, {
          text: 'Okay',
          id: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
            this.saveWorkout()
          }
        }
      ]
    });

    await alert.present();
  }

  async saveWorkout(){
    let ReceivedData = window.localStorage.getItem("workoutRoutine");
    this.workoutRoutine = JSON.parse(ReceivedData);

    if(this.workoutDetails.workoutStatus == "in_progress"){
      this.workoutDetails.stopwatch = this.timerDuration;
      this.workoutDetails.workoutRoutine = this.workoutRoutine;
      this.workoutDetails.currExercise = {
        section: this.workoutSection,
        index: this.workoutSection=="exercise"?this.exerciseIndex:-1,
      }
    }

    this.workoutService.saveWorkout(this.workoutId, this.userId, this.workoutDetails).then(()=>this.presentToast())
    await this.router.navigateByUrl('/tabs/workouts', {replaceUrl: true});
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Workout has been saved.',
      duration: 2000
    });
    toast.present();
  }

  /***
   * TIMER
   */

  toggleTimer() {
    this.isRunning = !this.isRunning;
    this.stopwatch();
  }

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

  getDisplayTimer(time: number) {
    var hours = '' + Math.floor(time / 3600);
    var minutes = '' + Math.floor(time % 3600 / 60);
    var seconds = '' + Math.floor(time % 3600 % 60);

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
