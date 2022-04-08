import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkoutExercisesService {
  data: [];
  error: string;

  constructor(private http: HttpClient) {
    this.data = [];
    this.error = '';
  }

  loadExercises() {
    // Load the data
    console.log("... loading data ...")
    this.prepareDataRequest()
      .subscribe(
        data => {
          // Set the data to display in the template
          // this.data = JSON.stringify(data);
          console.log(data['results'])
          data['results'].forEach(element => {
            console.log(element)
            
          });
          console.log(this.data)
        },
        err => {
          // Set the error information to display in the template
          this.error = `An error occurred, the data could not be retrieved: Status: ${err.status}, Message: ${err.statusText}`;
        }
      );;
  }

  private prepareDataRequest(): Observable<object> {
    // Define the data URL
    const dataUrl = 'https://wger.de/api/v2/exerciseinfo/?limit=500';
    // Prepare the request
    return this.http.get(dataUrl);
  }
}
