import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, docData, Timestamp, query, getDocs } from '@angular/fire/firestore';
import { onSnapshot, orderBy, updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { WorkoutDesc } from '../class/CreateWorkoutDesc';
import { WorkoutDetails } from '../class/WorkoutDetails';

@Injectable({
  providedIn: 'root'
})
export class WorkoutsService {
  workoutDesc: WorkoutDesc;

  constructor(private firestore: Firestore) {

  }

  async createWorkout(val, uid) {
    let timestamp = Timestamp.fromDate(new Date()).seconds;
    const docData: WorkoutDesc = {
      wName: val.wName,
      wDescription: val.wDescription,
      intensity: val.intensity,
      duration: val.duration,
      location: val.location,
      equipment: val.equipment,
      dateCreated: timestamp,
      workoutStatus: "created"
    };
    await setDoc(doc(this.firestore, "Users", `${uid}`, "Workouts", timestamp.toString()), docData) ;
    return await timestamp;
  }

  getWorkout(wid, uid): Observable <WorkoutDesc>  {
    const noteDocRef = doc(this.firestore, `Users/${uid}/Workouts/${wid}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<WorkoutDesc>;
  }

  async getAllWorkout(uid){
    // let workouts = [];
    // let q = query(collection(this.firestore, `Users/${uid}/Workouts`), orderBy('dateCreated', 'desc'));
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   const workouts = [];
    //   querySnapshot.forEach((doc) => {
    //     console.log("service :", workouts)
    //     workouts.push(doc.data());
    //   });
    //  return workouts;
    // });
    let querySnapshot = await getDocs(query(collection(this.firestore, `Users/${uid}/Workouts`), orderBy('dateCreated', 'desc')));
    return querySnapshot;
  }
}
