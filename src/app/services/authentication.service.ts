import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';


const TOKEN_KEY = 'my-token';

export interface User {
  id: string,
  email: string,
  username: string,
  dob: Date,
  gender: string,
  skinType: string,
  marketing: boolean,
  first_name: string,
  last_name: string,
  intro: boolean
}

export interface UserDetail {
  id: string
}


@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  constructor(private auth: Auth) {}
 
  async register({ email, password }) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    } catch (e) {
      return null;
    }
  }
 
  async login({ email, password }) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (e) {
      return null;
    }
  }
 
  logout() {
    return signOut(this.auth);
  }

}

