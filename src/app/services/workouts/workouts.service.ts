/**
 *
 * COMMUNICATES WITH FIREBASE
 *
 */

import { Injectable } from '@angular/core';
import { User, user } from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc, docData, Timestamp, query, getDocs } from '@angular/fire/firestore';
import { onSnapshot, orderBy, updateDoc, deleteDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { UserDetails } from 'src/app/class/user';
import { CompletedWorkout, WorkoutDesc } from '../../class/CreateWorkoutDesc';
import { WorkoutDetails } from '../../class/WorkoutDetails';
import { WorkoutAPIService } from './workout-API.service';
import { areaOfInjury } from 'src/app/data/injuries';

@Injectable({
  providedIn: 'root'
})
export class WorkoutsService {
  workoutDesc: WorkoutDesc;

  exerciseData = [];
  userWorkout = [];

  injuries = areaOfInjury;

  constructor(private firestore: Firestore, private workoutAPI: WorkoutAPIService) {

  }

  async createWorkout(workoutInfo, uid, userDetails) {
    let timestamp = Timestamp.fromDate(new Date());

    return new Promise(resolve => {
      this.workoutAPI.loadExercises().subscribe(r => {
        // Shuffle array
        console.log(r);
        this.exerciseData = this.shuffle(r);
        let injury =""
        if(userDetails.areaOfInjury!=''){

          injury = this.injuries.find(x => x.value === userDetails.areaOfInjury).text
        }


        this.exerciseData  = this.exerciseData.filter(x => x.category.name != injury);

        if(workoutInfo.equipment == "no_equipment"){
          this.exerciseData = this.exerciseData.filter(y=>y.equipment.length == 0);
        }else{
          this.exerciseData = this.exerciseData.filter(y=>y.equipment.length != 0);
        }

        //Filter array further
        //Extract exercises based on time
        this.userWorkout = this.exerciseData.slice(0, 5);
        console.log(this.userWorkout);

        workoutInfo.routine = this.formatWorkoutRoutine(workoutInfo, userDetails);

        const docData: WorkoutDesc = {
          wName: workoutInfo.wName,
          wDescription: workoutInfo.wDescription,
          intensity: workoutInfo.intensity,
          duration: workoutInfo.duration,
          location: workoutInfo.location,
          equipment: workoutInfo.equipment,
          dateCreated: timestamp,
          workoutStatus: "created",
          createdBy: uid,
          tags: [workoutInfo.intensity, workoutInfo.duration, workoutInfo.location, workoutInfo.equipment],
          workoutRoutine: workoutInfo.routine
        };

        console.log(docData);
        setDoc(doc(this.firestore, "Users", `${uid}`, "Workouts", timestamp.seconds.toString()), docData);

        resolve(timestamp.seconds)
      });
    });

  }

  formatWorkoutRoutine(workoutDesc: WorkoutDesc, userDetails: UserDetails) {
    let routine = [];
    
    for (let i = 0; i < this.userWorkout.length; ++i) {
      let exercise: WorkoutDetails = {
        category: this.userWorkout[i].category.name,
        equipment: this.extractValue(this.userWorkout[i], 'equipment.name'),
        exerciseDesc: this.userWorkout[i].description,
        id: this.userWorkout[i].id,
        exerciseName: this.userWorkout[i].name,
        images: this.extractValue(this.userWorkout[i], 'images.image'),
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
    let querySnapshot = await getDocs(query(collection(this.firestore, `Users/${uid}/CompletedWorkouts`), orderBy('dateCompleted', 'desc')));
    return querySnapshot;
  }

  async deleteWorkout(wid, uid) {
    await deleteDoc(doc(this.firestore, `Users/${uid}/Workouts/${wid}`));
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
