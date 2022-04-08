import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, docData, Timestamp, query, getDocs } from '@angular/fire/firestore';
import { onSnapshot, orderBy, updateDoc, deleteDoc } from 'firebase/firestore';
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
    let timestamp = Timestamp.fromDate(new Date());
    const docData: WorkoutDesc = {
      wName: val.wName,
      wDescription: val.wDescription,
      intensity: val.intensity,
      duration: val.duration,
      location: val.location,
      equipment: val.equipment,
      dateCreated: timestamp,
      workoutStatus: "created",
      tags:[val.intensity,val.duration,val.location,val.equipment]
    };
    await setDoc(doc(this.firestore, "Users", `${uid}`, "Workouts", timestamp.seconds.toString()), docData) ;
    return await timestamp.seconds;
  }

  getWorkout(wid, uid): Observable <WorkoutDesc>  {
    const noteDocRef = doc(this.firestore, `Users/${uid}/Workouts/${wid}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<WorkoutDesc>;
  }

  async getAllWorkout(uid){
    let querySnapshot = await getDocs(query(collection(this.firestore, `Users/${uid}/Workouts`), orderBy('dateCreated', 'desc')));
    return querySnapshot;
  }

  async deleteWorkout(wid, uid){
    await deleteDoc(doc(this.firestore, `Users/${uid}/Workouts/${wid}`));
  }
}
