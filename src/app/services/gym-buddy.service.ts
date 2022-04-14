import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { GymBuddyDetails } from '../class/GymBuddyProfile';
import { Firestore,doc } from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { GymBuddyProfileInfo } from '../pages/gym-buddy/gb-findbuddy/GymBuddyInformation';

@Injectable({
  providedIn: 'root'
})
/**
 * This service acts as a facade class between the main control class of the application and the database.
 * This class also facilitates the transfer of information between control classes.
 */
export class GymBuddyService {
  private authState = new BehaviorSubject(false);
  private potentialMatchDetails: (GymBuddyProfileInfo)[] = [];
  constructor(private auth: Auth, private fireStore: Firestore, private userService: UserService, private platform: Platform,) {
    this.platform.ready().then(() => {
      this.isUserSignedUpGymBuddy();
    });
   }

  /**
   * Stores user's Gym Buddy Details to firebase.
   *
   * @param details Details from the form filled by the user.
   * @param uid User ID of the current user.
   * @returns an updated document of gym buddy details that was stored to database.
   */
  public addGymBuddyDetails(details, uid) {
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
      buddyTrainStyle: details.buddyTrainStyle,
      chats:details.chats,
      matches:details.matches,
      unmatches:details.unmatches
    };

    const noteDocRef = doc(this.fireStore, `Users`, uid);
    console.log(this.auth);

    return updateDoc(noteDocRef,{ gymBuddyDetails });
  }

  /**
   * Gets an array of potential match details.
   *
   * @returns an array of potential match details.
   */
  public getPotentialMatchDetails() {
    return this.potentialMatchDetails;
  }

  /**
   * Getter to check if user has signed up for gym buddy.
   *
   * @returns true if user has signed up for gym buddy.
   */
  public isSignedUp(){
    return this.authState.value;
  }

  /**
   * Checks if user has already signed up for gym buddy and returns an observable.
   *
   * @returns true if the user has signed up for gym buddy.
   */
  public isUserSignedUpGymBuddy(){
    this.userService.getUserById(JSON.parse(localStorage.getItem('userID'))).subscribe(res=>{
      if(res.gymBuddyDetails.isSignUp) {
        this.authState.next(true);
      }
    });
  }

  /**
   * Setter to set the array of GymBuddyProfile.
   *
   * @param potentialMatches Array of Gym Buddy Profiles
   */
  public setPotentialMatchDetails(potentialMatches: (GymBuddyProfileInfo)[]) {
    this.potentialMatchDetails = potentialMatches;
  }
}
