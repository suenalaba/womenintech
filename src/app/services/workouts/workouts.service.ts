/**
 * 
 * COMMUNICATES WITH FIREBASE
 * 
 */

import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc, docData, Timestamp, query, getDocs } from '@angular/fire/firestore';
import { onSnapshot, orderBy, updateDoc, deleteDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { CompletedWorkout, WorkoutDesc } from '../../class/CreateWorkoutDesc';
import { WorkoutDetails } from '../../class/WorkoutDetails';
import { WorkoutAPIService } from './workout-API.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutsService {
  workoutDesc: WorkoutDesc;

  exerciseData = [];
  userWorkout = [];

  constructor(private firestore: Firestore, private workoutAPI: WorkoutAPIService) {

  }

  async createWorkout(val, uid) {
    let timestamp = Timestamp.fromDate(new Date());

    return new Promise(resolve => {
      this.workoutAPI.loadExercises().subscribe(r => {
        // Shuffle array 
        console.log(r);
        this.exerciseData = this.shuffle(r);

        //Filter array further 
        //Extract exercises based on time
        this.userWorkout = this.exerciseData.slice(0, 5);
        console.log(this.userWorkout);

        val.routine = this.formatWorkoutRoutine();

        const docData: WorkoutDesc = {
          wName: val.wName,
          wDescription: val.wDescription,
          intensity: val.intensity,
          duration: val.duration,
          location: val.location,
          equipment: val.equipment,
          dateCreated: timestamp,
          workoutStatus: "created",
          tags: [val.intensity, val.duration, val.location, val.equipment],
          workoutRoutine: val.routine
        };

        console.log(docData);
        setDoc(doc(this.firestore, "Users", `${uid}`, "Workouts", timestamp.seconds.toString()), docData);

        resolve(timestamp.seconds)
      });
    });
    
  }

  formatWorkoutRoutine() {
    let routine = [];

    for (let i = 0; i < this.userWorkout.length; ++i) {
      let exercise: WorkoutDetails = {
        category: this.userWorkout[i].category.name,
        equipment: this.extractValue(this.userWorkout[i], 'equipment.name'),
        exerciseDesc: this.userWorkout[i].description,
        id: this.userWorkout[i].id,
        exerciseName: this.userWorkout[i].name,
        images: this.extractValue(this.userWorkout[i], 'images.image'),
        /**
         * change this @gabrieltangs
         * sets for each exercise
         */
        sets: {
          sets: 3,
          reps: 10
        }
      };
      routine.push(exercise);
    }
    return routine;
  }

  async saveWorkout(wid, uid, userWorkout) {
    let workout: WorkoutDesc = userWorkout
    console.log(workout)

     /*store to firebase firestore (firestore, collection, the very long string is the path)*/
     const noteDocRef = doc(this.firestore, `Users/${uid}/Workouts/${wid}`);
    
     /* must update doc, cannot add doc */
    await setDoc(noteDocRef, workout);
  }

  getWorkout(wid, uid): Observable<WorkoutDesc> {
    const noteDocRef = doc(this.firestore, `Users/${uid}/Workouts/${wid}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<WorkoutDesc>;
  }

  async getAllWorkout(uid) {
    let querySnapshot = await getDocs(query(collection(this.firestore, `Users/${uid}/Workouts`), orderBy('dateCreated', 'desc')));
    return querySnapshot;
  }

  async getCompletedWorkouts(uid) {
    let querySnapshot = await getDocs(query(collection(this.firestore, `Users/${uid}/CompletedWorkouts`), orderBy('dateCompleted')));
    return querySnapshot;
  }

  async deleteWorkout(wid, uid) {
    await deleteDoc(doc(this.firestore, `Users/${uid}/Workouts/${wid}`));
  }

  async updateWorkout(wid, uid){

  }

  async storeCompletedWorkout(completeWorkout, uid){
    let workout: CompletedWorkout = completeWorkout
    console.log(workout)
    let timestamp = Timestamp.fromDate(new Date());

     /*store to firebase firestore (firestore, collection, the very long string is the path)*/
     const noteDocRef = doc(this.firestore, `Users/${uid}/CompletedWorkouts/${timestamp.seconds}`);
    
     /* must update doc, cannot add doc */
    await setDoc(noteDocRef, workout);
  }



  /****** HELPFUL FUNCTIONS  ********/

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


  extractValue(arr, prop) {

    let extractedValue = [];

    for (let i = 0; i < arr.length; ++i) {

      // extract value from property
      extractedValue.push(arr[i][prop]);
    }
    return extractedValue;
  }
}
