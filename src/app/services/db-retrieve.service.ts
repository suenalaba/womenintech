import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, docData } from '@angular/fire/firestore';
import { Query, updateDoc } from 'firebase/firestore';
import { user } from 'rxfire/auth';
import { Observable } from 'rxjs';
import { User, UserDetails } from '../class/user';
import { GymBuddyDetails } from '../class/GymBuddyProfile';
import { query, where, getDocs } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class DbRetrieveService {
  constructor(private firestore: Firestore) { }

  public findBuddiesFromDB(preferredGender){
    const usersDB = collection(this.firestore, "users");
    let q : Query;
    if(preferredGender==="no_preference"){
        q = query(usersDB, where("isSignUp", "==", "true"));
    }
    else{
       q = query(usersDB, where("isSignUp", "==", "true"),where("gender", "==", preferredGender));
    }
    this.pullFromDB(q);
  }

  private async pullFromDB(q) {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    });
  }

}
