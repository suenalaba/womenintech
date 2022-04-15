/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { CreateWorkoutDesc, WorkoutDesc } from 'src/app/class/CreateWorkoutDesc';
import { duration, equipment, intensity, wLocation } from 'src/app/data/workout-data/CreateWorkout';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { WorkoutsService } from 'src/app/services/workouts/workouts.service';
import { WorkoutAPIService } from 'src/app/services/workouts/workout-API.service';
import { UserDetails } from 'src/app/class/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-workouts',
  templateUrl: './create-workouts.page.html',
  styleUrls: ['./create-workouts.page.scss'],
})
/**
 * Page to create new workout
 */
export class CreateWorkoutsPage implements OnInit {
  private createWorkoutForm: FormGroup;
  private errors = [];
  private exerciseData = [];
  private listDuration: CreateWorkoutDesc[] = duration;
  private listEquipment: CreateWorkoutDesc[] = equipment;
  private listIntensity: CreateWorkoutDesc[] = intensity;
  private listLocation: CreateWorkoutDesc[] = wLocation;
  private userDetails: UserDetails;
  private userId: string;
  private userWorkout = [];
  private workoutDesc: WorkoutDesc;

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private router: Router,
    private workoutService: WorkoutsService,
    private loadingCtrl: LoadingController,
    private nav: NavController,
    private _workoutAPI: WorkoutAPIService,
    private userService: UserService
  ) { }

  /**
   * getter method for the workout API
   */
  public get workoutAPI(): WorkoutAPIService {
    return this._workoutAPI;
  }
  /**
   * setter method for the workout API
   */
  public set workoutAPI(value: WorkoutAPIService) {
    this._workoutAPI = value;
  }

  /**
   * build workout form
   */
  private buildForm() {
    this.createWorkoutForm = this.fb.group({
      wName: ['', [Validators.required]],
      wDescription: ['', [Validators.required]],
      intensity: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      location: ['', [Validators.required]],
      equipment: ['', [Validators.required]]
    });
  }

  /**
   * get user details from firebase
   */
  private getUserDetails(){
    this.userService.getUserById(this.userId).subscribe(res=>{
      this.userDetails = res.userDetails;
    });
  }

  /**
   * fucntion to navigate user back to all workouts
   */
  private goBack() {
    this.nav.navigateBack(['tabs/workouts'], { animated: true });
  }

 /**
  * Shuffle array in place
  *
  * @param arr array of items
  * @return shuffled array
  */
  private shuffle(arr) {
    let j;
    let x;
    let index;
    for (index = arr.length - 1; index > 0; index--) {
      j = Math.floor(Math.random() * (index + 1));
      x = arr[index];
      arr[index] = arr[j];
      arr[j] = x;
    }
    return arr;
  }

  private submitWorkoutDesc() {
    if (this.createWorkoutForm.status == 'INVALID') {
      this.presentAlert();
    } else {
      this.generateWorkout(this.createWorkoutForm.value);
    }
  }

  /**
   * fucntion for form validation
   *
   * @param formGroup createWorkoutForm
   */
  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  /**
   * function to generate workout for user based on their selections
   *
   * @param val : form values
   */
  async generateWorkout(val) {
    this.workoutDesc = val;

    this.presentLoadingWithOptions().then(() => {
      this.workoutService.createWorkout(this.workoutDesc, this.userId, this.userDetails).then((res)=>{
        console.log(res);

        this.goToStartWorkout(res);
      });
    });
  }

  /**
   * navigate user to view their generated workout
   *
   * @param id workout id
   */
  async goToStartWorkout(id: any) {
    console.log(id);
    this.loadingCtrl.dismiss();
    await this.router.navigate(['/tabs/workouts/generate-workout'], { queryParams: { wid: id } });
  }

  ngOnInit() {
    this.buildForm();
    this.userId = JSON.parse(localStorage.getItem('userID'));
    this.getUserDetails();
  }

  /**
   * alert display triggered when form is incomplete
   */
  async presentAlert() {
    this.validateAllFormFields(this.createWorkoutForm);

    const alert = await this.alertController.create({
      cssClass: '',
      header: 'Invalid',
      message: 'Please complete the form',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  /**
   * loading component presented when workout is being generated
   */
  async presentLoadingWithOptions() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait... </br> We are creating a workout for you!',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

}
