import { Component, OnInit } from '@angular/core';
import { CreateWorkoutDesc, WorkoutDesc } from 'src/app/class/CreateWorkoutDesc';
import { Duration, Equipment, Intensity, wLocation } from 'src/app/data/workout-data/CreateWorkout';
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
export class CreateWorkoutsPage implements OnInit {
  listIntensity: CreateWorkoutDesc[] = Intensity;
  listDuration: CreateWorkoutDesc[] = Duration;
  listLocation: CreateWorkoutDesc[] = wLocation;
  listEquipment: CreateWorkoutDesc[] = Equipment;

  createWorkoutForm: FormGroup;

  workoutDesc: WorkoutDesc;
  userDetails: UserDetails;

  errors = [];
  exerciseData = [];
  userWorkout = [];

  userId: string;

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

  public get workoutAPI(): WorkoutAPIService {
    return this._workoutAPI;
  }
  public set workoutAPI(value: WorkoutAPIService) {
    this._workoutAPI = value;
  }

  ngOnInit() {
    this.buildForm();
    this.userId = JSON.parse(localStorage.getItem('userID'));
    this.getUserDetails();
  }

  /**
   * build workout form
   */
  buildForm() {
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
  getUserDetails(){
    this.userService.getUserById(this.userId).subscribe(res=>{
      this.userDetails = res.userDetails
    })
  }


  submitWorkoutDesc() {
    if (this.createWorkoutForm.status == "INVALID") {
      this.presentAlert()
    } else {
      this.generateWorkout(this.createWorkoutForm.value)
    }
  }

  /**
   * alert display triggered when form is incomplete
   */
  async presentAlert() {
    this.validateAllFormFields(this.createWorkoutForm)

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
   * fucntion for form validation 
   * 
   * @param formGroup createWorkoutForm
   */
  validateAllFormFields(formGroup: FormGroup) {
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
        console.log(res)

        this.goToStartWorkout(res)
      })
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

  /**
   * fucntion to navigate user back to all workouts 
   */
  goBack() {
    this.nav.navigateBack(['tabs/workouts'], { animated: true })
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

  /**
  * Shuffles array in place.
  * @param {Array} a items An array containing the items.
  */
  shuffle(arr) {
    let j, x, index;
    for (index = arr.length - 1; index > 0; index--) {
      j = Math.floor(Math.random() * (index + 1));
      x = arr[index];
      arr[index] = arr[j];
      arr[j] = x;
    }
    return arr;
  }


}
