import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, docData, Timestamp, query, getDocs } from '@angular/fire/firestore';
import { orderBy, deleteDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { UserDetails } from 'src/app/class/user';
import { CompletedWorkout, WorkoutDesc } from '../../class/CreateWorkoutDesc';
import { WorkoutDetails } from '../../class/WorkoutDetails';
import { WorkoutAPIService } from './workout-API.service';
import { areaOfInjury } from 'src/app/data/injuries';

@Injectable({
  providedIn: 'root'
})
/**
 * Communicates with firebase
 */
export class WorkoutsService {
  private exerciseData = [];
  private injuries = areaOfInjury;
  private userWorkout = [];
  private workoutDesc: WorkoutDesc;
  constructor(private firestore: Firestore, private workoutAPI: WorkoutAPIService) { }

  /**
   * creates new workout for user based on their goals, and selections
   *
   * @param workoutInfo workout information
   * @param uid user id
   * @param userDetails user detials
   */
  async createWorkout(workoutInfo, uid, userDetails) {
    const timestamp = Timestamp.fromDate(new Date());

    return new Promise(resolve => {
      this.workoutAPI.loadExercises().subscribe(r => {
        // Shuffle array
        console.log(r);
        this.exerciseData = this.shuffle(r);

        let injury ='';
        if(userDetails.areaOfInjury!==''){
          injury = this.injuries.find(x => x.value === userDetails.areaOfInjury).text;
        }


        this.exerciseData  = this.exerciseData.filter(x => x.category.name !== injury);

        if(workoutInfo.equipment === 'no_equipment'){
          this.exerciseData = this.exerciseData.filter(y=>y.equipment.length === 0);
        }else{
          this.exerciseData = this.exerciseData.filter(y=>y.equipment.length !== 0);
        }

        //Filter array further
        //Extract exercises based on time
        this.userWorkout = this.exerciseData.slice(0, 5);
        console.log(this.userWorkout);

        workoutInfo.routine = this.formatWorkoutRoutine(workoutInfo, userDetails);

        const workoutDocData: WorkoutDesc = {
          wName: workoutInfo.wName,
          wDescription: workoutInfo.wDescription,
          intensity: workoutInfo.intensity,
          duration: workoutInfo.duration,
          location: workoutInfo.location,
          equipment: workoutInfo.equipment,
          dateCreated: timestamp,
          workoutStatus: 'created',
          createdBy: uid,
          tags: [workoutInfo.intensity, workoutInfo.duration, workoutInfo.location, workoutInfo.equipment],
          workoutRoutine: workoutInfo.routine
        };

        console.log(workoutDocData);
        setDoc(doc(this.firestore, 'Users', `${uid}`, 'Workouts', timestamp.seconds.toString()), workoutDocData);

        resolve(timestamp.seconds);
      });
    });

  }

  /**
   * delete specific workout from user
   *
   * @param wid workout id
   * @param uid user id
   */
  async deleteWorkout(wid, uid) {
    await deleteDoc(doc(this.firestore, `Users/${uid}/Workouts/${wid}`));
  }

  /**
   * get all workouts from user
   *
   * @param uid user id
   */
  async getAllWorkout(uid) {
    const querySnapshot = await getDocs(query(collection(this.firestore, `Users/${uid}/Workouts`), orderBy('dateCreated', 'desc')));
    return querySnapshot;
  }

  /**
   * get all completed workouts from user
   *
   * @param uid user id
   */
  async getCompletedWorkouts(uid) {
    const querySnapshot = await getDocs(query(collection(
      this.firestore, `Users/${uid}/CompletedWorkouts`), orderBy('dateCompleted', 'desc')));
    return querySnapshot;
  }

  /**
   * get specific workout from user
   *
   * @param wid workout id
   * @param uid user id
   */
  getWorkout(wid, uid): Observable<WorkoutDesc> {
    const noteDocRef = doc(this.firestore, `Users/${uid}/Workouts/${wid}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<WorkoutDesc>;
  }

  /**
   * save and store workout
   *
   * @param wid workout id
   * @param uid user id
   * @param userWorkout workout details
   */
  async saveWorkout(wid, uid, userWorkout) {
    const workout: WorkoutDesc = userWorkout;
    console.log(workout);

     /*store to firebase firestore (firestore, collection, the very long string is the path)*/
     const noteDocRef = doc(this.firestore, `Users/${uid}/Workouts/${wid}`);

     /* must update doc, cannot add doc */
    await setDoc(noteDocRef, workout);
  }

  /**
   * save completed workout by user
   *
   * @param completeWorkout completed workout details
   * @param uid user id
   */
  async storeCompletedWorkout(completeWorkout, uid){
    const workout: CompletedWorkout = completeWorkout;
    console.log(workout);
    const timestamp = Timestamp.fromDate(new Date());

     /*store to firebase firestore (firestore, collection, the very long string is the path)*/
     const noteDocRef = doc(this.firestore, `Users/${uid}/CompletedWorkouts/${timestamp.seconds}`);

     /* must update doc, cannot add doc */
    await setDoc(noteDocRef, workout);
  }

  private extractValue(arr, prop) {
    const extractedValue = [];
    for (const eachValue of arr) {
      //extract value from property
      extractedValue.push(eachValue[prop]);
    }
    return extractedValue;
  }

  /**
   * format workout routine
   *
   * @param workoutDesc workout details
   * @param userDetails user details
   */
  private formatWorkoutRoutine(workoutDesc: WorkoutDesc, userDetails: UserDetails) {
    const routine = [];
    for (const eachWorkout of this.userWorkout) {
      const exercise: WorkoutDetails = {
        category: eachWorkout.category.name,
        equipment: this.extractValue(eachWorkout, 'equipment.name'),
        exerciseDesc: eachWorkout.description,
        id: eachWorkout.id,
        exerciseName: eachWorkout.name,
        images: this.extractValue(eachWorkout, 'images.image'),
        sets: {
          sets: 3,
          reps: 10
        }
      };
      routine.push(exercise);
    }
    return routine;
  }

  /****** HELPFUL FUNCTIONS  ********/

 /**
  * Shuffle array in-place
  *
  * @param arr array to sort
  * @returns shuffled array
  */
  private shuffle(arr) {
    let j;
    let x;
    let index;
    for (index = arr.length - 1; index > 0; index--) {
      j = Math.floor(Math.random() * (index + 1));
      x = arr[index];
      arr[index] = arr[j];
      arr[j] = x;
    }
    return arr;
  }

}
