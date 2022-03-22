import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, docData } from '@angular/fire/firestore';
import { getDoc, Query, updateDoc } from 'firebase/firestore';
import { user } from 'rxfire/auth';
import { Observable } from 'rxjs';
import { User, UserDetails } from '../class/user';
import { GymBuddyDetails } from '../class/GymBuddyProfile';
import { query, where, getDocs,collectionGroup } from "firebase/firestore";
import { GymBuddyProfileInfo } from '../pages/gym-buddy/gb-findbuddy/GymBuddyInformation';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DbRetrieveService {
  constructor(
    private firestore: Firestore,
    private loadingController: LoadingController
    ) { }

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
    const querySnapshot =await this.pullFromDB(q);

    let arrayOfProfiles= []
    console.log("Matched users:")
    querySnapshot.forEach((doc) => {
      console.log(doc.id);
      arrayOfProfiles.push(new GymBuddyProfileInfo(doc.data()));
    });
    return arrayOfProfiles;
  }


  public async retrieveCurrentUser() : Promise<GymBuddyProfileInfo>{
    const loading = await this.loadingController.create();
    const id=JSON.parse(localStorage.getItem('userID'));
    const ref = doc(this.firestore, "Users", id);
    const user=await this.singlePullFromDB(ref);
    const userInfo=new GymBuddyProfileInfo(user.data());
    return userInfo
  }
  private async singlePullFromDB(q) {
    const querySnapshot = await getDoc(q);
   return querySnapshot;
  }

  private async pullFromDB(q) {
    const querySnapshot = await getDocs(q);
   return querySnapshot;
  }

}
