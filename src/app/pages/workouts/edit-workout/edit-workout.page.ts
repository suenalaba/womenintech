import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { User, UserDetails } from 'src/app/class/user';
import { NavController, AlertController, LoadingController, Platform } from '@ionic/angular';
import { AuthenticationService } from './../../../services/authentication.service';
import SwiperCore, { Keyboard, Pagination, Scrollbar } from 'swiper';
import { WorkoutDesc } from 'src/app/class/CreateWorkoutDesc';
import { WorkoutsService } from 'src/app/services/workouts/workouts.service';
import { WorkoutDetails } from 'src/app/class/WorkoutDetails';
import { UserService } from 'src/app/services/user.service'
//import { Storage } from '@capacitor/storage'

@Component({
  selector: 'app-edit-workout',
  templateUrl: './edit-workout.page.html',
  styleUrls: ['./edit-workout.page.scss'],
})
export class EditWorkoutPage implements OnInit {
  // credentials: FormGroup;
  @Input() userInfo: User;
  userWorkoutUpdates: FormGroup;

  workoutDetails: WorkoutDesc;
  exerciseList: WorkoutDetails[];

  workoutId: string;
  userId: string;
  exerciseIndex: number;
  // workoutRoutine: WorkoutDetails[];
  currentExercise: WorkoutDetails;

  loadingPresent = true;
  formChange = false;
  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private userService: UserService,
    private navigate: NavController,
    private workoutService: WorkoutsService
  ) { }

  workSets = [];

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.workoutId = params.get('wid');
      this.userId = params.get('uid');
    })

    this.userId = JSON.parse(localStorage.getItem("userID"));
    this.getWorkoutDetails(this.workoutId, this.userId);
  
    // this.userWorkoutUpdates = this.fb.group({
    //   wName: [this.workoutDetails.wName, [Validators.required, Validators.minLength(3)]],
    //   sets: [this.workoutDetails.sets.reps, [Validators.required, Validators.minLength(2)]],
    //   reps: [this.workoutDetails.sets.reps, [Validators.required]],
      
    // })

    // this.credentials = this.fb.group({
      // email: ['', [Validators.required, Validators.email]],
      // password: ['', [Validators.required, Validators.minLength(6)]],
      // firstName: ['', [Validators.required]],
      // lastName: ['', [Validators.required]],
      // birthday: ['', [Validators.required]],
      // gender: ['', [Validators.required]],
      // confirmPassword: ['', [Validators.required, this.equalto('password')]],
      // username: ['', [Validators.required, Validators.minLength(5)]]
    // });
  }

  async updateWorkoutDetails() {
    // console.log(this.userUpdates)
    // if (this.formChange) {
    //   this.userUpdates.value.id = this.userInfo.id;
    //   /*update into firestore */
    //   this.userService.updateUser(this.userUpdates.value);
    // }

    // await this.saveWorkout(wid, uid, userWorkout)
  }

  counter(i: number) {
    return new Array(i);
}

  cancel() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async saveWorkout(wid, uid, userWorkout) {
    this.cancel()
    this.router.navigateByUrl('/tabs/services/workouts', { replaceUrl: true });
  }


  async getWorkoutDetails(wid, uid){
    const loading = await this.loadingController.create();
    await loading.present();

    console.log(wid)

    this.workoutService.getWorkout(wid, uid).subscribe(results=>{
      console.log(results)
      this.workoutDetails = results;
      this.exerciseList = this.workoutDetails.workoutRoutine
      this.displayExercise(this.workoutDetails);
    });

    this.loadingController.dismiss();
    
  }

  displayExercise(wd: WorkoutDesc) {
    
     for(let i=0; i < wd.workoutRoutine.length; i++){
      let ex = []
       for(let j= wd.workoutRoutine[i].sets.sets - 1;j<wd.workoutRoutine[i].sets.sets;j++){
      
        ex.push(wd.workoutRoutine[i].sets.reps)
       }
       this.workSets.push(ex)
      }

      console.log(this.workSets)
    }

  

   // Easy access for form fields
  //  get firstName() {
  //   return this.credentials.get('firstName');
  // }

  /**
   * Navigate to login page
   */
  async login() {
    this.router.navigateByUrl('', { replaceUrl: true });
  }

  /**
   *
   * sign
   */
  // async signUp() {
  //   const loading = await this.loadingController.create();
  //   await loading.present();


  //   const user = await this.authService.register(this.credentials.value);
  //   await loading.dismiss();

  //   if (this.credentials.valid && user) {
  //     this.credentials.value.id = user.user.uid;
  //     localStorage.setItem('userSignUp', JSON.stringify(this.credentials.value));
  //     this.router.navigateByUrl('/user-details', { replaceUrl: true });
  //     // this.router.navigateByUrl('/boarding', { replaceUrl: true });
  //   } else {
  //     this.showAlert('Registration failed', 'Please try again!');
  //   }

  // }

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

