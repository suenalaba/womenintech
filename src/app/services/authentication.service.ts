import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';
import { User, UserDetails } from '../class/user';
import { GymBuddyDetails } from '../class/GymBuddyProfile';
import {UserService} from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Service to authenticate user login details with the firestore server
 */
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!

  constructor(private auth: Auth, private firestore: Firestore, private userService: UserService) { }

  /**
   * register new user
   *
   * @param info user login information
   */
  async register(info) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        info.email,
        info.password
      );

      this.createUser(info, user.user.uid);
      return user;

    } catch (e) {
      return null;
    }
  }

  /**
   * login user, upon successful login, user will be signed in to the app
   * return user info
   * else return error
   *
   * @param param0 user login email and password
   */
  async login({ email, password }) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      localStorage.setItem('userID', JSON.stringify(user.user.uid));

      return user;
    } catch (e) {
      return null;
    }
  }

  /**
   * log user out of app
   */
  logout() {
    localStorage.removeItem('userID');
    return signOut(this.auth);
  }

  /**
   * save more user attribute details
   *
   * @param user user details
   */
  addUserDetails(user) {
    const userDetails: UserDetails = {
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

    /* must update doc, cannot add doc */
    return updateDoc(noteDocRef, { userDetails, gymBuddyDetails });
  }

  /**
   * save new user personal details
   *
   * @param value user information
   * @param uid user id
   */
     private createUser(value, uid) {
      console.log(uid);
      const create: User = {
        id: uid,
        email: value.email,
        username: value.username,
        birthday: value.birthday,
        gender: value.gender,
        firstName: value.firstName,
        lastName: value.lastName
      };

      console.log(create);
      const noteDocRef = doc(this.firestore, `Users`, `${uid}`);
      return setDoc(noteDocRef, create);
    }
}

