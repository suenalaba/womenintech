import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { CreateWorkoutDesc, WorkoutDesc } from 'src/app/class/CreateWorkoutDesc';
import { Duration, Equipment, Intensity, wLocation } from 'src/app/data/workout-data/CreateWorkout';
import { WorkoutsService } from 'src/app/services/workouts/workouts.service';

@Component({
  selector: 'app-generate-workout',
  templateUrl: './generate-workout.page.html',
  styleUrls: ['./generate-workout.page.scss'],
})
export class GenerateWorkoutPage implements OnInit {
  private coolDownTime: string;
  private exerciseList = []
  private listDuration: CreateWorkoutDesc[] = Duration;
  private listEquipment: CreateWorkoutDesc[] = Equipment;
  private listIntensity: CreateWorkoutDesc[] = Intensity;
  private listLocation: CreateWorkoutDesc[] = wLocation;
  private userId: string;
  private warmUpTime: string;
  private workoutDesc: WorkoutDesc;
  private workoutId: string;
  private workoutTime: string;
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private workoutService: WorkoutsService,
    private loadingCtrl: LoadingController,
    private nav: NavController,
    private alertController: AlertController) { }

 /**
   * triggered when user wants to a delete workout
   */
  private deleteWorkout(){
    this.presentAlertConfirm();
  }

 /**
  * function to retrieve workout details and format the relevant details 
  * 
  * @param wid workout id
  * @param uid user id
  */
  async getWorkoutDetails(wid, uid){
    const loading = await this.loadingCtrl.create();
    await loading.present();

    console.log(wid)

    this.workoutService.getWorkout(wid, uid).subscribe(results=>{
      console.log(results)
      this.workoutDesc = results;
      
      this.workoutDesc.intensity = this.listIntensity.find(x => x.value === this.workoutDesc.intensity).text
      this.workoutDesc.duration = this.listDuration.find(x => x.value === this.workoutDesc.duration).info
      this.workoutDesc.equipment = this.listEquipment.find(x => x.value === this.workoutDesc.equipment).text
      this.workoutDesc.location = this.listLocation.find(x => x.value === this.workoutDesc.location).text
    
      this.exerciseList = this.workoutDesc.workoutRoutine

      if(this.workoutDesc.duration=='15 Mins') { this.warmUpTime = "2.5 mins" ; this.coolDownTime = "2.5 mins"; this.workoutTime = "10 mins"}
      if(this.workoutDesc.duration=='30 Mins') { this.warmUpTime = "5 mins" ; this.coolDownTime = "5 mins"; this.workoutTime = "20 mins" }
      if(this.workoutDesc.duration=='60 Mins') { this.warmUpTime = "5 mins" ; this.coolDownTime = "5 mins"; this.workoutTime = "50 mins" }
      if(this.workoutDesc.duration=='90 Mins >') { this.warmUpTime = "10 mins" ; this.coolDownTime = "10 mins"; this.workoutTime = "70 mins" }
    });

    this.loadingCtrl.dismiss();
  }

  /**
   * navigate user back to workouts
   */
  async goBack(){
    await this.nav.navigateBack(['tabs/workouts'], { animated: true })
  }

  /**
   * navigate user to view location of gyms and parks
   */
  async goGymMap(){
    await this.router.navigateByUrl('tabs/workouts/display-gyms', { replaceUrl: true })
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      let wid = params.get('wid');
      this.workoutId = wid;
   })
    this.userId = JSON.parse(localStorage.getItem("userID"));

    this.getWorkoutDetails(this.workoutId, this.userId);
  }

  /**
   * function to display alert dialog 
   * it has 2 buttons that the user can select,
   * cancel: do not delete workout
   * yes: confirm delete workout
   */
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete Workout',
      message: 'Are you sure you want to delete the workout created for <strong>YOU</strong>?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          id: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
            this.workoutService.deleteWorkout(this.workoutId, this.userId);
            this.goBack();
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * triggered when user wants to start their workout
   * navigate user to start their workout
   */
  async startWorkout(){
    await this.router.navigate(['/start-workout'], { queryParams: { wid: this.workoutId, uid: this.userId } });
  }
}
