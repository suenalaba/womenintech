import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, docData } from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { User, UserDetails } from '../class/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: Firestore
  ) { }

   /*get the id to retrieve whatever information you want*/
   getUserById(id): Observable<User> {
    const noteDocRef = doc(this.firestore, `Users/${id}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<User>;
  }


}
