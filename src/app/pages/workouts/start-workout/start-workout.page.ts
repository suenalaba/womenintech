import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { WorkoutExercisesService } from 'src/app/services/workout-exercises.service';

@Component({
  selector: 'app-start-workout',
  templateUrl: './start-workout.page.html',
  styleUrls: ['./start-workout.page.scss'],
})
export class StartWorkoutPage implements OnInit {

  isRunning: boolean = true;
  timerButton: string = 'pause';
  timerDuration;
  displayTimer;

  constructor(private workoutExercise: WorkoutExercisesService) { }

  ngOnInit() {
    this.timerDuration = 0;
    this.toggleTimer();
    this.workoutExercise.loadExercises();
  }

  ionViewWillLeave(){
    this.isRunning = false;
    console.log(this.timerDuration)
  }

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
