import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutDetails } from 'src/app/class/WorkoutDetails';

@Component({
  selector: 'app-display-workout',
  templateUrl: './display-workout.component.html',
  styleUrls: ['./display-workout.component.scss'],
})
export class DisplayWorkoutComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  workoutSection: string;
  exerciseiString: string;
  exerciseIndex: number;

  workoutRoutine: any;
  currentExercise: WorkoutDetails;

  workSets = [];

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.workoutSection = params.get('workoutSection');
      this.exerciseiString = params.get('exerciseIndex');
    })

    let ReceivedData = window.localStorage.getItem("workoutRoutine");
    this.workoutRoutine = JSON.parse(ReceivedData);
    this.displayExercise();
  
  }

  displayExercise() {
    this.workSets = []
    this.exerciseIndex = parseInt(this.exerciseiString)
    console.log(this.workoutRoutine)
    if (this.workoutSection == "exercise" && this.exerciseIndex < this.workoutRoutine.length) {
      this.currentExercise = this.workoutRoutine[this.exerciseIndex]
      
      for(let i=0; i < this.currentExercise.sets.sets; i++){
        console.log(this.currentExercise.sets.reps)
        this.workSets.push(this.currentExercise.sets.reps)
      }

      console.log(this.currentExercise)
    }

  }

  addSet(){
    this.workoutRoutine[this.exerciseIndex].sets.sets = this.currentExercise.sets.sets+1;
    this.workSets.push(this.currentExercise.sets.reps)
    window.localStorage.setItem("workoutRoutine", JSON.stringify(this.workoutRoutine));
  }

}
