import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserDetails } from 'src/app/class/user';
import { areaOfInjury, armInjuries, Injuries } from 'src/app/data/injuries';
import { fitnessGoals } from 'src/app/data/goals';
import { UserService } from 'src/app/services/user.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-workout',
  templateUrl: './create-workout.component.html',
  styleUrls: ['./create-workout.component.scss'],
})
export class CreateWorkoutComponent implements OnInit {
  @Input() userInfo: User;
  
  userDetails: UserDetails;
  public listInjuries = areaOfInjury;
  public listGoals = fitnessGoals;
  userUpdates: FormGroup;
  selectedInjury: Injuries[];
  isShown: boolean = false;

  private injuryArea: any;

  formChange = false;

  constructor(private navParams: NavParams,
    private modalController: ModalController,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router) { }

  ngOnInit() {
    this.userInfo = this.navParams.get('userInfo');
    this.userDetails = this.userInfo.userDetails;
    console.log(this.userInfo, this.userDetails);
    this.userUpdates = this.fb.group({
      height: [this.userDetails.height, [Validators.required, Validators.minLength(3)]],
      weight: [this.userDetails.weight, [Validators.required, Validators.minLength(2)]],
      injury: [this.userDetails.injury, [Validators.required]],
      areaOfInjury: [this.userDetails.areaOfInjury, []],
      injuryType: [this.userDetails.injuryType, []],
      healthCond: [this.userDetails.healthCond],
      healthCondName: [this.userDetails.healthCondName],
      fitnessGoal: [this.userDetails.fitnessGoal, [Validators.required]],
      menstruationCycle: ['', []]
    });

    this.injury.valueChanges.subscribe(val => {
      console.log(val)
      if (val === 'yes') {
        this.userUpdates.controls['areaOfInjury'].setValidators([Validators.required]);
        this.userUpdates.controls['injuryType'].setValidators([Validators.required]);
      } else {
        this.userUpdates.controls['areaOfInjury'].clearValidators();
        this.userUpdates.controls['injuryType'].clearValidators();
        this.userUpdates.controls['areaOfInjury'].setValue("");
        this.userUpdates.controls['injuryType'].setValue("");

      }
      this.userUpdates.controls['areaOfInjury'].updateValueAndValidity();
      this.userUpdates.controls['injuryType'].updateValueAndValidity();

    });

    this.userUpdates.valueChanges.subscribe(selectedValue => {
      this.formChange = true;
    })
  }

  closeModal() {
    this.modalController.dismiss();
  }

  getPeriodDate(pd) {
    let dateTemp = []
    if (pd != ''){
      dateTemp =pd.split('-')
      return dateTemp[2]+"/"+dateTemp[1]+"/"+dateTemp[0]
    }
    else
      return "No Information"
  }

  // Easy access for form fields
  get height() {
    return this.userUpdates.get('height');
  }

  get weight() {
    return this.userUpdates.get('weight');
  }

  get injury() {
    return this.userUpdates.get('injury');
  }

  get healthCond() {
    return this.userUpdates.get('healthCond');
  }

  get healthCondName() {
    return this.userUpdates.get('healthCondName');
  }

  get fitnessGoal() {
    return this.userUpdates.get('fitnessGoal');
  }

  get menstruationCycle() {
    return this.userUpdates.get('menstruationCycle');
  }

  get areaOfInjury() {
    return this.userUpdates.get('areaOfInjury');
  }

  get injuryType() {
    return this.userUpdates.get('injuryType');
  }

  injuryChange(event) {
    this.injuryArea = event.detail;
    if (this.injuryArea.value == 'arm') {
      this.selectedInjury = armInjuries
    } else if (this.injuryArea.value == 'leg') {
      this.selectedInjury = []
    } else if (this.injuryArea.value == 'back') {
      this.selectedInjury = []
    } else if (this.injuryArea.value == 'hand') {
      this.selectedInjury = []
    } else if (this.injuryArea.value == 'feet') {
      this.selectedInjury = []
    } else if (this.injuryArea.value == 'others') {
      this.selectedInjury = []
    }
    else {
      this.selectedInjury = []
    }
  }

  cancel() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async updateDetails() {
    console.log(this.userUpdates)
    if (this.formChange) {
      this.userUpdates.value.id = this.userInfo.id;
      /*update into firestore */
      this.userService.updateUser(this.userUpdates.value);
    }

    await this.createWorkout()
  }

  async createWorkout() {
    this.cancel()
    this.router.navigateByUrl('/tabs/workouts/create-workout', { replaceUrl: true });

  }

  showDateInput() {

    this.isShown = !this.isShown;

  }

}
