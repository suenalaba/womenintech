import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { GymBuddyDetails } from '../class/GymBuddyProfile';
import { Firestore, collection, collectionData, doc, setDoc, docData } from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { User, UserDetails } from '../class/user';
@Injectable({
  providedIn: 'root'
})
export class GymBuddyService {

  private userInfo;
  private userId;
  private isSignUp: boolean;

  constructor(private auth: Auth, private fireStore: Firestore) { }
  /* store user's gym buddy details to firebase and local storage */
  addGymBuddyDetails(details) {
    //console.log(details);
    const gymBuddyDetails: GymBuddyDetails = {
      isSignUp: true,
      briefIntro: details.briefIntro,
      //workoutTimePreference: string; //how to create an array to store an array of workouttimepreferences
      workoutTimePreference: details.timePref,
      buddyGender: details.buddyPref,
      gymBuddyGoals: details.gymBuddyGoals,
      personalTraits: details.personalTraits,
      personalTrainStyle: details.personalStyle,
      locationPreference: details.locationPref,
      buddyTraits: details.buddyTraits,
      buddyTrainStyle: details.buddyTrainStyle
    };

    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.userId = this.userInfo.id;
    console.log(this.userId);

    const noteDocRef = doc(this.fireStore, `Users`,this.userId);
    console.log(this.auth);
    /* store to local storage */
    this.getUserById(this.auth.currentUser.uid).subscribe(res => {
      localStorage.setItem('userInfo', JSON.stringify(res));

    });

    return updateDoc(noteDocRef,{ gymBuddyDetails });
  }

  getUserById(id): Observable<User> {
    const noteDocRef = doc(this.fireStore, `Users/${id}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<User>;
  }
  /* checks if a user is signed up for gym buddy, return true if user has signed up */
  isUserSignedUpGymBuddy(){
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.isSignUp = this.userInfo.gymBuddyDetails.isSignUp;
    console.log(this.isSignUp);
    if(this.isSignUp === true){
      return true;
    } else {
      return false;
    }
  }
}
