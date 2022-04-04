import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import { Firestore, collection, collectionData, doc, setDoc, docData } from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';
import { user } from 'rxfire/auth';
import { Observable } from 'rxjs';
import { User, UserDetails } from '../class/user';
import { GymBuddyDetails } from '../class/GymBuddyProfile';
import {UserService} from '../services/user.service';

@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {
  // Init with null to filter out the first value in a guard!

  constructor(private auth: Auth, private firestore: Firestore, private userService: UserService) { }

  async register(info) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        info.email,
        info.password
      );

      this.createUser(info, user.user.uid)
      return user;

    } catch (e) {
      return null;
    }
  }

  async login({ email, password }) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      localStorage.setItem('userID', JSON.stringify(user.user.uid));
      // this.userService.getUserById(user.user.uid).subscribe(res => {
      //   localStorage.setItem('userInfo', JSON.stringify(res));
      // });

      return user;
    } catch (e) {
      return null;
    }
  }

  logout() {
    localStorage.removeItem('userID');
    return signOut(this.auth);
  }

  createUser(value, uid) {
    console.log(uid);
    let create: User = {
      id: uid,
      email: value.email,
      username: value.username,
      birthday: value.birthday,
      gender: value.gender,
      firstName: value.firstName,
      lastName: value.lastName
    }

    console.log(create);
    const noteDocRef = doc(this.firestore, `Users`, `${uid}`);
    return setDoc(noteDocRef, create);
  }

  addUserDetails(user) {
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


    const gymBuddyDetails: GymBuddyDetails = {
      isSignUp: false
    };


    localStorage.removeItem('userSignUp');

    /*store to firebase firestore (firestore, collection, the very long string is the path)*/
    const noteDocRef = doc(this.firestore, `Users`, `${user.id}`);
    console.log(this.auth);
    /* store to local storage */
    localStorage.setItem('userID', JSON.stringify(this.auth.currentUser.uid));
    // this.userService.getUserById(this.auth.currentUser.uid).subscribe(res => {
    //   localStorage.setItem('userInfo', JSON.stringify(res));

    // });
    /* must update doc, cannot add doc */
    return updateDoc(noteDocRef, { userDetails, gymBuddyDetails });
  }
}
