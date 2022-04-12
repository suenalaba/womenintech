import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { WorkoutDesc } from 'src/app/class/CreateWorkoutDesc';
import { WorkoutDetails } from 'src/app/class/WorkoutDetails';
import { WorkoutsService } from 'src/app/services/workouts/workouts.service';

@Component({
  selector: 'app-edit-workout',
  templateUrl: './edit-workout.component.html',
  styleUrls: ['./edit-workout.component.scss'],
})
export class EditWorkoutComponent implements OnInit {
  @Input() workoutDetails: WorkoutDesc
  @Input() exerciseIndex: any;
  @Input() sets: any;
  @Input() wid: any;
  @Input() uid: any;

  userWorkoutUpdates: FormGroup;

  set: any;
  rep: any;
  constructor(private fb: FormBuilder, private workoutService: WorkoutsService, private modalController: ModalController) { }

  ngOnInit() {
    this.userWorkoutUpdates = this.fb.group({
      sets: [this.sets.sets, [Validators.required]],
      reps: [this.sets.reps, [Validators.required]],
    })

    this.set = parseInt(this.sets.sets)
    this.rep = parseInt(this.sets.reps)
  }

  getSets(s: number){
    this.set = s
  }

  getReps(r: number){
    this.rep = r
  }

   updateWorkoutDetails() {
    console.log(this.userWorkoutUpdates.controls['sets'].value)
    // console.log(this.userUpdates)
    if (this.userWorkoutUpdates) {
      /*update into firestore */
      console.log(this.workoutDetails.workoutRoutine[this.exerciseIndex])
      this.workoutDetails.workoutRoutine[this.exerciseIndex].sets = {
        sets: parseInt(this.set),
        reps: parseInt(this.rep)
      }

      // this.workoutService.saveWorkout(this.wid,this.uid,this.workoutDetails);
    }

    this.modalController.dismiss({
      'dismissed': true
    });
    
    // await this.saveWorkout(wid, uid, userWorkout)
  }

}
