import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { CreateWorkoutDesc, WorkoutDesc } from 'src/app/class/CreateWorkoutDesc';
import { Duration, Equipment, Intensity, wLocation } from 'src/app/data/workout-data/CreateWorkout';
import { WorkoutsService } from 'src/app/services/workouts.service';

@Component({
  selector: 'app-generate-workout',
  templateUrl: './generate-workout.page.html',
  styleUrls: ['./generate-workout.page.scss'],
})
export class GenerateWorkoutPage implements OnInit {

  workoutId: string;
  userId: string;

  workoutDesc: WorkoutDesc;
  
  listIntensity: CreateWorkoutDesc[] = Intensity;
  listDuration: CreateWorkoutDesc[] = Duration;
  listLocation: CreateWorkoutDesc[] = wLocation;
  listEquipment: CreateWorkoutDesc[] = Equipment;

  exerciseList= [{}, {}, {}, {}, {}]

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private workoutService: WorkoutsService,
    private loadingCtrl: LoadingController,
    private nav: NavController,
    private alertController: AlertController) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      let id = params.get('id');
      this.workoutId = id;
   })
    this.userId = JSON.parse(localStorage.getItem("userID"));

    this.getWorkoutDetails(this.workoutId, this.userId);
  }

  async getWorkoutDetails(wid, uid){
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.workoutService.getWorkout(wid, uid).subscribe(results=>{
      console.log(results)
      this.workoutDesc = results;
      
      this.workoutDesc.intensity = this.listIntensity.find(x => x.value === this.workoutDesc.intensity).text
      this.workoutDesc.duration = this.listDuration.find(x => x.value === this.workoutDesc.duration).info
      this.workoutDesc.equipment = this.listEquipment.find(x => x.value === this.workoutDesc.equipment).text
      this.workoutDesc.location = this.listLocation.find(x => x.value === this.workoutDesc.location).text
    });

    this.loadingCtrl.dismiss();

  }

  goBack(){
    this.nav.navigateBack(['tabs/workouts'], { animated: true })
  }

  deleteWorkout(){
    this.presentAlertConfirm();
  }

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

}
