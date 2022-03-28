import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { CreateWorkoutDesc, WorkoutDesc } from 'src/app/class/CreateWorkoutDesc';
import { Duration, Equipment, Intensity, wLocation } from 'src/app/data/workout-data/CreateWorkout';
import { WorkoutsService } from 'src/app/services/workouts.service';

@Component({
  selector: 'app-edit-workout',
  templateUrl: './edit-workout.page.html',
  styleUrls: ['./edit-workout.page.scss'],
})
export class EditWorkoutPage implements OnInit {

  workoutId: string;
  userId: string;

  workoutDesc: WorkoutDesc;

  listIntensity: CreateWorkoutDesc[] = Intensity;
  listDuration: CreateWorkoutDesc[] = Duration;
  listLocation: CreateWorkoutDesc[] = wLocation;
  listEquipment: CreateWorkoutDesc[] = Equipment;

  constructor(private route: ActivatedRoute, private loadingCtrl: LoadingController, private workoutService: WorkoutsService) { }

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
    });

    this.loadingCtrl.dismiss();

  }
}
