import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { GymBuddyDetails } from '../class/GymBuddyProfile';
import { Firestore, collection, collectionData, doc, setDoc, docData } from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { User, UserDetails } from '../class/user';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class GymBuddyService {

  private userInfo;
  private isSignUp: boolean;

  constructor(private auth: Auth, private fireStore: Firestore, private userService: UserService) { }
  /* store user's gym buddy details to firebase and local storage */
  addGymBuddyDetails(details, uid) {
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

    const noteDocRef = doc(this.fireStore, `Users`, uid);
    console.log(this.auth);

    /* store to local storage --scratched */
    // this.userService.getUserById(this.auth.currentUser.uid).subscribe(res => {
    //   localStorage.setItem('userInfo', JSON.stringify(res));
    // });

    return updateDoc(noteDocRef,{ gymBuddyDetails });
  }
  
  /* checks if a user is signed up for gym buddy, return true if user has signed up */
  isUserSignedUpGymBuddy() : Observable<boolean>{
    //this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return this.userService.getUserById(JSON.parse(localStorage.getItem('userID'))).pipe(
        map(res =>{
          return res.gymBuddyDetails.isSignUp ? true : false;
    }))
  }

}
