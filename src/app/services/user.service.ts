import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, docData } from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { User, UserDetails } from '../class/user';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
   * Upload user profile
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

}
