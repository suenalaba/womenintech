import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, docData } from '@angular/fire/firestore';
import { Query, updateDoc } from 'firebase/firestore';
import { user } from 'rxfire/auth';
import { Observable } from 'rxjs';
import { User, UserDetails } from '../class/user';
import { GymBuddyDetails } from '../class/GymBuddyProfile';
import { query, where, getDocs,collectionGroup } from "firebase/firestore";
import { GymBuddyProfileInfo } from '../gym-buddy/gb-findbuddy/GymBuddyInformation';


@Injectable({
  providedIn: 'root'
})
export class DbRetrieveService {

  constructor(private firestore: Firestore) { }

  public async findBuddiesFromDB(preferredGender,gender){
    const usersDB = collection(this.firestore, "Users");
    let q : Query;
    if(preferredGender==="no_preference"){
        q = query(usersDB, where("gymBuddyDetails.isSignUp", "==", true),where("gymBuddyDetails.buddyGender", "in", ['no_preference', gender]));
    }
    else{
      q = query(usersDB, where("gymBuddyDetails.isSignUp", "==", true),where("gymBuddyDetails.buddyGender", "in", ['no_preference', gender]));
       //q = query(usersDB, where("gymBuddyDetails.isSignUp", "==", true),where("gender", "==", preferredGender),where("gymBuddyDetails.buddyGender", "in", ['no_preference', gender]));
    }
    console.log("Reach here");
    const querySnapshot =await this.pullFromDB(q);

    let arrayOfProfiles= []
    querySnapshot.forEach((doc) => {
      console.log(doc.id);
      arrayOfProfiles.push(new GymBuddyProfileInfo(doc.data()));
    });
    console.log("finish creating profiles");

    return arrayOfProfiles;
  }
  public async getCurrentUser(){
    console.log("Hello")
    const usersDB = collection(this.firestore, "Users");
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const userID=userInfo.userID;
    const q = query(usersDB, where("userID", "==", userID));
    const querySnapshot =await this.pullFromDB(q);

    let data;
    querySnapshot.forEach((doc) => {
      console.log("Hello")
      data=doc.data();
      console.log(doc.id);
    });
    return data;
  }

  private async pullFromDB(q) {
    const querySnapshot = await getDocs(q);
   return querySnapshot;
  }

}
