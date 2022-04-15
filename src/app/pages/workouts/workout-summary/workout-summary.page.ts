import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { CompletedWorkout, CreateWorkoutDesc, WorkoutDesc } from 'src/app/class/CreateWorkoutDesc';
import { User } from 'src/app/class/user';
import { intensity } from 'src/app/data/workout-data/CreateWorkout';
import { UserService } from 'src/app/services/user.service';
import { WorkoutsService } from 'src/app/services/workouts/workouts.service';

@Component({
  selector: 'app-workout-summary',
  templateUrl: './workout-summary.page.html',
  styleUrls: ['./workout-summary.page.scss'],
})
/**
 * the workout summary page shown when a workout is complete
 */
export class WorkoutSummaryPage implements OnInit {
  private calories: number;
  private fitnessVal: number;
  private listIntensity: CreateWorkoutDesc[] = intensity;
  private strengthVal: number;
  private totalReps: number;
  private totalSets: number;
  private userDetails: User;
  private userId: string;
  private workoutCompleted: CompletedWorkout;
  private workoutDetails: WorkoutDesc;
  private workoutId: string;
  private workoutNotes: FormGroup;
  constructor(
    private workoutService: WorkoutsService,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
    this.workoutNotes = this.fb.group({
      notes: ['']
    });

    this.route.queryParamMap.subscribe(params => {
      this.workoutId = params.get('wid');
      this.userId = params.get('uid');
    });

    this.showWorkoutSummary();
    this.getUserDetails();
  }

  /**
   * format workout and save completed workout
   */
  async workoutDone(){
    this.workoutCompleted = {
      workoutName: this.workoutDetails.wName,
      workoutId: this.workoutId,
      stopwatch: this.workoutDetails.stopwatch,
      dateCompleted: this.workoutDetails.dateCompleted,
      workoutRoutine: this.workoutDetails.workoutRoutine,
      strength: this.strengthVal,
      fitness: this.fitnessVal,
      caloriesBurnt: this.calories,
      totalSets: this.totalSets,
      totalReps: this.totalReps,
      workoutNotes: this.workoutNotes.value.notes
    };

    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.workoutService.storeCompletedWorkout(this.workoutCompleted, this.userId).then((res)=>{
        console.log(res);
        loading.dismiss();
        this.router.navigateByUrl('/tabs/workouts', {replaceUrl: true});
      });

  }

  /**
   * get time from date
   *
   * @param date date object of timestamp
   */
  private formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  /**
   * get age of user
   *
   * @param dateString user's birthday
   */
  private getAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  /**
   * compute total calories burnt
   *
   * @param w workout details
   * @param u user details
   */
  private getCalories(w: WorkoutDesc, u: User){
    const weight = u.userDetails.weight ? u.userDetails.weight : 50;
    const duration = w.stopwatch % 3600 / 60;
    const intensity = this.listIntensity.find(x => x.value === w.intensity).mets;
    this.calories = (duration*(intensity*3.5*weight)/200);
    return (duration*(intensity*3.5*weight)/200).toFixed(3);
    //Total calories burned = Duration (in minutes)*(MET*3.5*weight in kg)/200
  }

  /**
   * format date
   *
   * @param date Timestamp
   */
  private getDate(date) {
    if (date) {
      const newDate = new Date(date.seconds * 1000);
      const mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      const strDate = newDate.getDate() + ' ' + mS[newDate.getMonth()] + ' ' + newDate.getFullYear() + ' ' + this.formatAMPM(newDate);
      return strDate;
    }
    else { return ''; }
  }

  /**
   * getter accessor for the duration of the workout
   */
  private getDuration(time: number) {
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

    return hours + ':' + minutes + ':' + seconds;
  }

  /**
   * compute the statistics for user performance
   *
   * @param wd workout details
   * @param ud user details
   */
  private getStats(wd: WorkoutDesc, ud: User){
    const intensity = this.listIntensity.find(x => x.value === wd.intensity).mets;
    // let duration = wd.stopwatch % 3600 / 60;
    const age = this.getAge(ud.birthday);
    console.log(age);

    //THR = [(MHR - RHR) x %Intensity] + RHR
    this.fitnessVal = (((200-age)*(intensity/10))/(220-age))*100;
    console.log(this.fitnessVal);

    this.strengthVal = this.getTotalSets(wd.workoutRoutine)*this.getTotalReps(wd.workoutRoutine)/10;
    console.log(this.strengthVal);
  }

  /**
   * compute number of reps
   *
   * @param sets workout sets
   */
  private getTotalReps(sets){
    let totalReps = 0;
    for(let i=0; i<sets.length;i++){
      totalReps = (sets[i].sets.reps * sets[i].sets.sets)+totalReps;
    }
    this.totalReps = totalReps;
    return totalReps;
  }

  /**
   * compute number of sets
   *
   * @param sets workout sets
   */
  private getTotalSets(sets){
    let totalSets = 0;
    for(let i=0; i<sets.length;i++){
      totalSets += sets[i].sets.sets;
    }
    this.totalSets = totalSets;
    return totalSets;

  }

  /**
   * get user details
   */
  private getUserDetails(){
    this.userService.getUserById(this.userId).subscribe(res=>{
      this.userDetails = res;

      this.getStats(this.workoutDetails, this.userDetails);
    });
  }

  /**
   * get workout details
   */
  private showWorkoutSummary() {
    this.workoutService.getWorkout(this.workoutId, this.userId).subscribe(res => {
      console.log(res);
      if (res.workoutStatus == 'completed') {
        this.workoutDetails = res;
      }
    });
  }

}
