import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { WorkoutDesc } from 'src/app/class/CreateWorkoutDesc';

@Component({
  selector: 'app-edit-workout',
  templateUrl: './edit-workout.component.html',
  styleUrls: ['./edit-workout.component.scss'],
})
/**
 * Class to let users edit their workouts after creation
 */
export class EditWorkoutComponent implements OnInit {

  @Input() workoutDetails: WorkoutDesc;
  @Input() exerciseIndex: any;
  @Input() sets: any;
  @Input() wid: any;
  @Input() uid: any;

  userWorkoutUpdates: FormGroup;

  set: any;
  rep: any;

  constructor(private fb: FormBuilder, private modalController: ModalController) { }

  ngOnInit() {
    this.userWorkoutUpdates = this.fb.group({
      sets: [this.sets.sets, [Validators.required]],
      reps: [this.sets.reps, [Validators.required]],
    });

    this.set = parseInt(this.sets.sets, 10);
    this.rep = parseInt(this.sets.reps, 10);
  }

  /**
   * get accessor for sets
   *
   * @param s sets
   */
  getSets(s: number){
    this.set = s;
  }

  /**
   * get accessor for reps
   *
   * @param r reps
   */
  getReps(r: number){
    this.rep = r;
  }

  /**
   * update user sets and reps, will return value back to main edit page
   */
   updateWorkoutDetails() {
    console.log(this.userWorkoutUpdates.controls.sets.value);
    if (this.userWorkoutUpdates) {
      console.log(this.workoutDetails.workoutRoutine[this.exerciseIndex]);
      this.workoutDetails.workoutRoutine[this.exerciseIndex].sets = {
        sets: parseInt(this.set, 10),
        reps: parseInt(this.rep, 10)
      };
    }

    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
