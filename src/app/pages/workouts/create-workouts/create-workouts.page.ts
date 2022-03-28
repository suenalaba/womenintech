import { Component, OnInit } from '@angular/core';
import { CreateWorkoutDesc, WorkoutDesc } from 'src/app/class/CreateWorkoutDesc';
import { Duration, Equipment, Intensity, wLocation} from 'src/app/data/workout-data/CreateWorkout';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { WorkoutsService } from 'src/app/services/workouts.service';
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

  errors= [];

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private router: Router,
    private workoutService: WorkoutsService,
    private loadingCtrl: LoadingController,
    private nav: NavController

  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(){
    this.createWorkoutForm = this.fb.group({
      wName: ['', [Validators.required]],
      wDescription: ['', [Validators.required]],
      intensity: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      location: ['', [Validators.required]],
      equipment: ['', [Validators.required]]
    });
  }

  submitWorkoutDesc(){
    if(this.createWorkoutForm.status == "INVALID"){
      this.presentAlert()
    }else{
      this.generateWorkout(this.createWorkoutForm.value)
    }
  }

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

  async generateWorkout(val){
    this.workoutDesc = val;
    let id = 0;
    let uid = JSON.parse(localStorage.getItem('userID'));
    const loading = await this.loadingCtrl.create();
    await loading.present();
    let workoutId = this.workoutService.createWorkout(this.workoutDesc, uid);
    workoutId.then(function(result) {
      id = result;
    }).then(()=>this.goToStartWorkout(id));
  }

  async goToStartWorkout(id){
    console.log(id);
    this.loadingCtrl.dismiss();
    await this.router.navigate(['/tabs/workouts/generate-workout'], { queryParams: { id: id }});
  }

  goBack(){
    this.nav.navigateBack(['tabs/workouts'], { animated: true })
  }

}
