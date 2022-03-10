import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, docData } from '@angular/fire/firestore';
import { Query, updateDoc } from 'firebase/firestore';
import { user } from 'rxfire/auth';
import { Observable } from 'rxjs';
import { User, UserDetails } from '../class/user';
import { GymBuddyDetails } from '../class/GymBuddyProfile';
import { query, where, getDocs,collectionGroup } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class DbRetrieveService {
  constructor(private firestore: Firestore) { }

  public async findBuddiesFromDB(preferredGender,gender){
    const usersDB = collection(this.firestore, "Users");
    let q : Query;
    preferredGender="female"; //for testing purposes
    if(preferredGender==="no_preference"){
        q = query(usersDB, where("gymBuddyDetails.isSignUp", "==", true),where("gymBuddyDetails.buddyGender", "in", ['no_preference', gender]));
    }
    else{
       q = query(usersDB, where("gymBuddyDetails.isSignUp", "==", true),where("gender", "==", preferredGender),where("gymBuddyDetails.buddyGender", "in", ['no_preference', gender]));
    }
    await this.pullFromDB(q);
  }

  private async pullFromDB(q) {
    const querySnapshot = await getDocs(q);
    /*
    querySnapshot.forEach((doc) => {
      console.log("test123");
    console.log(doc.id, " => ", doc.data());
    });
    console.log("test1234");
    */
  }

}
