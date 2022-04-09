/**
 * 
 * WORKOUT ALGORITHM
 * 
 */

import { Injectable } from '@angular/core';
import { catchError, map, take, tap } from 'rxjs/operators';
import { WorkoutAPIService } from 'src/app/services/workouts/workout-API.service'

@Injectable({
  providedIn: 'root'
})
export class WorkoutAlgoService {

  exerciseData = []
  apiError = ''

  userWorkout = [];

  constructor(private workoutAPI: WorkoutAPIService) { }

  async generateWorkout(ex) {

    return ex.subscribe(r => {
      // Shuffle array 
      console.log(r);
      this.exerciseData = this.shuffle(r);

      //Filter array further 
      //Extract exercises based on time
      this.userWorkout = this.exerciseData.slice(0, 5);
      console.log(this.userWorkout);
      return this.userWorkout;
    });
  }


  async getExercises() {
    this.workoutAPI.loadExercises().subscribe(r=>{
      console.log(r)

    })
      // .pipe(map(data => {
      //   // Filter array to only get English 
      // this.exerciseData = data['results'].filter(x => x.language.id == 2)

      // // Shuffle array 
      // this.exerciseData = this.shuffle(this.exerciseData)
      // console.log(this.exerciseData)

      // //Filter array further 

      // //Extract exercises based on time
      // this.userWorkout = this.exerciseData.slice(0, 5)
      // console.log(this.userWorkout)

      // return this.userWorkout

      // },
      //   err => {
      //     // Set the error information to display in the template
      //     this.apiError = `An error occurred, the data could not be retrieved: Status: ${err.status}, Message: ${err.statusText}`;
      //   }
      // ),
      // catchError(async (error) => console.log('ERROR: ', error)));

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
