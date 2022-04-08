import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, docData } from '@angular/fire/firestore';
import { addDoc, arrayUnion, DocumentReference, getDoc, Query, updateDoc } from 'firebase/firestore';
import { query, where, getDocs,collectionGroup } from 'firebase/firestore';
import { GymBuddyProfileInfo } from '../pages/gym-buddy/gb-findbuddy/GymBuddyInformation';
import { AlertController, LoadingController } from '@ionic/angular';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GbFindbuddyPage } from '../pages/gym-buddy/gb-findbuddy/gb-findbuddy.page';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private currentUser: GymBuddyProfileInfo = null;
  constructor(private fireStore: Firestore, private loadingController: LoadingController) {
    /*this.afAuth.onAuthStateChanged((user) => {
      this.currentUser = user;
    });*/
  }

  //currentUser: User = null;

  /**
   * Fetches User ID from local storage, then gets the user info and store in a Gym Buddy Profile Object.
   *
   * @returns Gym Buddy Profile Object
   */
   public async retrieveCurrentUser(): Promise<GymBuddyProfileInfo> {
    const loading = await this.loadingController.create();
    const id = JSON.parse(localStorage.getItem('userID')); //get id string from localStorage
    const ref = doc(this.fireStore, 'Users', id); //object ref refers to information in the firebase
    const user = await this.singlePullFromDB(ref); //pull ref, and store in user object.
    const userInfo = new GymBuddyProfileInfo(user.data()); //create userInfo object which stores user data.
    return userInfo;
  }

  /**
   * Reads the document to be fetched and get the document snapshot with document contents.
   *
   * @param q reference of the document to fetch
   * @returns querySnapshot A Promise resolved with a querySnapshot containing the current document contents.
   */
   private async singlePullFromDB(q) {
    const querySnapshot = await getDoc(q);
    return querySnapshot;
  }


  /*public async retrieveAllChats()


export interface Message {
  //createdDate: Firestore.FieldValue;
  //createdAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}

// Chat functionality

addChatMessage(msg) {
  const chatDocRef = await updateDoc(this.firestore, 'Chat',)
  return this.afs.collection('messages').add({
    msg: msg,
    from: this.currentUser.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

getChatMessages() {
  let users = [];
  return this.getUsers().pipe(
    switchMap(res => {
      users = res;
      return this.afs.collection('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField: 'id' }) as Observable<Message[]>;
    }),
    map(messages => {
      // Get the real name for each user
      for (let m of messages) {
        m.fromName = this.getUserForMsg(m.from, users);
        m.myMsg = this.currentUser.uid === m.from;
      }
      return messages
    })
  )
}

private getUsers() {
  return this.afs.collection('users').valueChanges({ idField: 'uid' }) as Observable<User[]>;
}

private getUserForMsg(msgFromId, users: User[]): string {
  for (let usr of users) {
    if (usr.uid == msgFromId) {
      return usr.email;
    }
  }
  return 'Deleted';*/
}
