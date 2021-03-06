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
/**
 * Page that allows users to edit their workouts
 */
export class EditWorkoutPage implements OnInit {
  public userWorkoutUpdates: FormGroup;
  public workoutDetails: WorkoutDesc;
  private currentExercise: WorkoutDetails;
  private exerciseIndex: number;
  private exerciseList: WorkoutDetails[];
  private formChange = false;
  private loadingPresent = true;
  private userId: string;
  private workoutId: string;
  private workSets = [];

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

  /**
   * The loading indicator is dismissed
   */
  async dismissLoading() {
    if (this.loadingPresent) {
      await this.loadingController.dismiss();
    }
    this.loadingPresent = false;
  }

  /**
   * edit workout component is displayed for user to edit a specifc exercise's sets and reps
   *
   * @param i exercise index
   */
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

  /**
   * Function to get workout information from user
   *
   * @param wid workout ID
   * @param uid user ID
   */
  async getWorkoutDetails(wid: string, uid: string) {
    const loading = await this.loadingController.create();
    await loading.present();

    this.workoutService.getWorkout(wid, uid).subscribe(results => {
      this.workoutDetails = results;
      this.exerciseList = this.workoutDetails.workoutRoutine;
      this.buildEditForm();
    });

    this.loadingController.dismiss();

  }

  /**
   * Navigate to workout page
   */
  async goToWorkout() {
    this.router.navigateByUrl('/tabs/workouts', { replaceUrl: true });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.workoutId = params.get('wid');
      this.userId = params.get('uid');
    });

    this.getWorkoutDetails(this.workoutId, this.userId);
  }


  counter(i: number) {
    return new Array(i);
  }

  /**
   * display toast message
   *
   * @param msg toast messsage to be shown
   */
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  /**
   * A dialog that presents users with information
   *
   * @param header alert header
   * @param message alert message
   */
  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  /**
   * An overlay that can be used to indicate activity while blocking user interaction.
   */
  async showLoading() {
    this.loadingPresent = true;
    const load = await this.loadingController.create({
      message: 'Please wait....',

    });
    await load.present();
  }

  /**
   * update workout information when save workout is clicked
   */
  async updateWorkoutDetails() {
    this.workoutDetails.wDescription = this.userWorkoutUpdates.value.wDesc;
    this.workoutDetails.wName = this.userWorkoutUpdates.value.wName;
    console.log(this.workoutDetails);
    await this.workoutService.saveWorkout(this.workoutId, this.userId, this.workoutDetails).then(() => {
      this.presentToast('Workout is saved!');
      this.goToWorkout();
    });
  }

  /**
   * Generate a form to edit workout details
   */
   private buildEditForm() {
    this.userWorkoutUpdates = this.fb.group({
      wName: [this.workoutDetails.wName],
      wDesc: [this.workoutDetails.wDescription]
    });
  }

  /**
   * function to dismiss modal
   */
   private cancel() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}

