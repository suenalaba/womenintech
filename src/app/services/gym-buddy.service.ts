import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { GymBuddyDetails } from '../class/GymBuddyProfile';
import { Firestore, collection, collectionData, doc, setDoc, docData } from '@angular/fire/firestore';
import { arrayUnion, updateDoc } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';
import { GymBuddyProfileInfo } from '../pages/gym-buddy/gb-findbuddy/GymBuddyInformation';

@Injectable({
  providedIn: 'root'
})
export class GymBuddyService {
  potentialMatchDetails: (GymBuddyProfileInfo)[] = [];

  public setPotentialMatchDetails(potentialMatches: (GymBuddyProfileInfo)[]) {
    this.potentialMatchDetails = potentialMatches;
  }

  public getPotentialMatchDetails() {
    return this.potentialMatchDetails;
  }

  authState = new BehaviorSubject(false);

  constructor(private auth: Auth, private fireStore: Firestore, private userService: UserService, private platform: Platform,) {
    this.platform.ready().then(() => {
      this.isUserSignedUpGymBuddy();
    });
   }
  /* store user's gym buddy details to firebase and local storage */
  addGymBuddyDetails(details, uid) {
    //console.log(details);
    const gymBuddyDetails: GymBuddyDetails = {
      isSignUp: true,
      briefIntro: details.briefIntro,
      profilePicture:details.profilePicture,
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

    return updateDoc(noteDocRef,{ gymBuddyDetails });
  }

  /* checks if a user is signed up for gym buddy, return true if user has signed up */
  isUserSignedUpGymBuddy(){
    console.log("checking.....")
    this.userService.getUserById(JSON.parse(localStorage.getItem('userID'))).subscribe(res=>{
      if(res.gymBuddyDetails.isSignUp) this.authState.next(true);
    })
  }

  isSignedUp(){
    return this.authState.value;
  }

  updateMatches(user : GymBuddyProfileInfo,userID) {
    //console.log(details);
    const noteDocRef = doc(this.fireStore, `Users`, user.getUserId);

    return updateDoc(noteDocRef,{ "gymBuddyDetails.matches" : arrayUnion(userID)});
  }

  updateUnmatches(user : GymBuddyProfileInfo,userID) {
    //console.log(details);
    const noteDocRef = doc(this.fireStore, `Users`, user.getUserId);

    return updateDoc(noteDocRef,{ "gymBuddyDetails.unmatches" : arrayUnion(userID)});
  }



}
