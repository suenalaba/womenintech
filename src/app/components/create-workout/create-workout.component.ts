import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDetails } from 'src/app/class/user';

@Component({
  selector: 'app-create-workout',
  templateUrl: './create-workout.component.html',
  styleUrls: ['./create-workout.component.scss'],
})
export class CreateWorkoutComponent implements OnInit {
  @Input() userDetails: UserDetails;
  
  userUpdates: FormGroup;
  constructor(private navParams: NavParams, private modalController: ModalController, private fb: FormBuilder) { }

  ngOnInit() {
    let userInfo = this.navParams.get('userInfo');
    this.userDetails = userInfo.userDetails;
    console.log(this.userDetails);
    this.userUpdates = this.fb.group({
      height: [this.userDetails.height, [Validators.required, Validators.minLength(3)]],
      weight: [this.userDetails.weight, [Validators.required, Validators.minLength(2)]],
      injury: [this.userDetails.injury, [Validators.required]],
      fitnessGoal: [this.userDetails.fitnessGoal, [Validators.required]],
      menstruationCycle: ['', []]
    });
  }

  closeModal() { 
    this.modalController.dismiss(); 
  }

}
