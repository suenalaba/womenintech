import { Injectable, TemplateRef } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, docData } from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { User, UserDetails } from '../class/user';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';


//import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
//import {HttpClientModule} from '@angular/common/http';

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

  /**
   * Function to allow users to upload an image as their profile pic
   * @param i i
   * @param file the image users choose to upload
   * @param id the id of the registered user
   */
    uploadProfilePicture(i, file, id) {
      const storage = getStorage();
      const storageRef = ref(storage, `Users/${id}-${i}`);

      // 'file' comes from the Blob or File API
      uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });

      // Get the download URL
      getDownloadURL(storageRef)
        .then((url) => {
          // Insert url into an <img> tag to "download"
          /**
           * Can choose to store image URL in firestore
           */
        })
        .catch((error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/object-not-found':
              // File doesn't exist
              break;
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect the server response
              break;
          }
        });
    }

    /**
     * Get user profile pics from storage
     */
    getProfilePictures(){
      //1. list all images in user profile folder

      //2. get all of its the download url into an array
    }

  /***
   * Update user workout profile
   */
  updateUser(user){
    console.log(user)
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

    /*store to firebase firestore (firestore, collection, the very long string is the path)*/
    const noteDocRef = doc(this.firestore, `Users`, `${user.id}`);
    
    /* must update doc, cannot add doc */
    return updateDoc(noteDocRef, { userDetails });
  }

}
