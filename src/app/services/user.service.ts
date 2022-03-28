/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, docData } from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { User, UserDetails } from '../class/user';

import { HttpClient } from '@angular/common/http'; //youtube api

//import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
//import {HttpClientModule} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: Firestore,
    private http: HttpClient
  ) { }

  /*get the id to retrieve whatever information you want*/
  getUserById(id): Observable<User> {
    const noteDocRef = doc(this.firestore, `Users/${id}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<User>;
  }

  getData() {
    let url = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=deadlift&key=AIzaSyDH-momG79qABXUQ623_YYZrExXltFPq1k';
    return this.http.get(url);
  }

  /***
   * Update user workout profile
   */
  updateUser(user){
    let userDetails: UserDetails = {
      height: user.height,
      weight: user.weight,
      injury: user.injury,
      areaOfInjury: user.areaOfInjury,
      injuryType: user.injuryType,
      healthCond: user.healthCond,
      healthCondName: user.healthCondName,
      fitnessGoal: user.fitnessGoal,
      menstruationCycle: user.menstruationCycle
    };

    /*store to firebase firestore (firestore, collection, the very long string is the path)*/
    const noteDocRef = doc(this.firestore, `Users`, `${user.id}`);
    
    /* must update doc, cannot add doc */
    return updateDoc(noteDocRef, { userDetails });
  }

  

}
