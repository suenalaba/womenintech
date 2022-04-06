import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, docData } from '@angular/fire/firestore';
import { arrayUnion, getDoc, Query, updateDoc } from 'firebase/firestore';
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

  /**
   *
   * @param preferredGender
   * @param gender
   * @returns dictionary of gym buddy profiles that have matched that criteria
   */
  public async findBuddiesFromDB(preferredGender:string,gender:string){
    const usersDB = collection(this.firestore, "Users");
    let q : Query;
    if(preferredGender==="no_preference"){
        q = query(usersDB, where("gymBuddyDetails.isSignUp", "==", true),where("gymBuddyDetails.buddyGender", "in", ['no_preference', gender]));
    }
    else{
      q = query(usersDB, where("gymBuddyDetails.isSignUp", "==", true),where("gymBuddyDetails.buddyGender", "in", ['no_preference', gender])); //For testing purposes if not enough samples
      q = query(usersDB, where("gymBuddyDetails.isSignUp", "==", true),where("gender", "==", preferredGender),where("gymBuddyDetails.buddyGender", "in", ['no_preference', gender]));
    }
    const querySnapshot =await this.pullFromDB(q);

    let dictOfProfiles= new Map<string, GymBuddyProfileInfo>();
    console.log("Matched users:")
    querySnapshot.forEach((doc) => {
      let person = new GymBuddyProfileInfo(doc.data());
      console.log("user id:",person.getUserId);
      dictOfProfiles[doc.id]=person;
      console.log(dictOfProfiles[doc.id])
    });
    return dictOfProfiles;
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

  updateMatches(user : GymBuddyProfileInfo,userID) {
    //console.log(details);
    const noteDocRef = doc(this.firestore, `Users`, user.getUserId);

    return updateDoc(noteDocRef,{ "gymBuddyDetails.matches" : arrayUnion(userID)});
  }

  updateUnmatches(user : GymBuddyProfileInfo,userID) {
    //console.log(details);
    const noteDocRef = doc(this.firestore, `Users`, user.getUserId);

    return updateDoc(noteDocRef,{ "gymBuddyDetails.unmatches" : arrayUnion(userID)});
  }


}
