import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { AlertController, LoadingController } from '@ionic/angular';
import { WorkoutDesc } from 'src/app/class/CreateWorkoutDesc';
import { WorkoutsService } from 'src/app/services/workouts/workouts.service';
import { WorkoutDetails } from 'src/app/class/WorkoutDetails';
import { EditWorkoutComponent } from 'src/app/components/edit-workout/edit-workout.component';

@Component({
  selector: 'app-edit-workout',
  templateUrl: './edit-workout.page.html',
  styleUrls: ['./edit-workout.page.scss'],
})
export class EditWorkoutPage implements OnInit {
  userWorkoutUpdates: FormGroup;

  workoutDetails: WorkoutDesc;
  exerciseList: WorkoutDetails[];

  workoutId: string;
  userId: string;
  exerciseIndex: number;

  currentExercise: WorkoutDetails;

  loadingPresent = true;
  formChange = false;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private workoutService: WorkoutsService,
    private toastController: ToastController
  ) { }

  workSets = [];

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.workoutId = params.get('wid');
      this.userId = params.get('uid');
    })

    this.getWorkoutDetails(this.workoutId, this.userId);
  }

  async updateWorkoutDetails() {
    this.workoutDetails.wDescription = this.userWorkoutUpdates.value.wDesc
    this.workoutDetails.wName = this.userWorkoutUpdates.value.wName
    console.log(this.workoutDetails)
    await this.workoutService.saveWorkout(this.workoutId, this.userId, this.workoutDetails).then(() => {
      this.presentToast("Workout is saved!")
      this.goToWorkout()
    })
  }

  async editExercise(i) {
    const modal = await this.modalController.create({
      component: EditWorkoutComponent,
      cssClass: 'editWO',
      componentProps: {
        sets: this.workoutDetails.workoutRoutine[i].sets,
        workoutDetails: this.workoutDetails,
        uid: this.userId,
        wid: this.workoutId,
        exerciseIndex: i
      },
      backdropDismiss: true,
    });
    return await modal.present();
  }

  counter(i: number) {
    return new Array(i);
  }

  cancel() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }


  async getWorkoutDetails(wid: string, uid: string) {
    const loading = await this.loadingController.create();
    await loading.present();

    console.log(wid)

    this.workoutService.getWorkout(wid, uid).subscribe(results => {
      console.log(results)
      this.workoutDetails = results;
      this.exerciseList = this.workoutDetails.workoutRoutine
      this.userWorkoutUpdates = this.fb.group({
        wName: [this.workoutDetails.wName],
        wDesc: [this.workoutDetails.wDescription]
      })

      console.log(this.userWorkoutUpdates)
    });

    this.loadingController.dismiss();

  }

  /**
   * Navigate to wrokout page
   */
  async goToWorkout() {
    this.router.navigateByUrl('/tabs/workouts', { replaceUrl: true });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }


  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async showLoading() {
    this.loadingPresent = true
    let load = await this.loadingController.create({
      message: "Please wait....",

    })
    await load.present();
  }

  async dismissLoading() {
    if (this.loadingPresent) {
      await this.loadingController.dismiss();
    }
    this.loadingPresent = false;
  }

}

