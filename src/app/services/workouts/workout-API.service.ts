/**
 * 
 * WORKOUT API
 * 
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkoutAPIService {
  data: [];
  error: string;

  constructor(private http: HttpClient) {
    this.data = [];
    this.error = '';
  }

  loadExercises() {
    // Load the data
    console.log("... loading data ...")
    return this.prepareDataRequest().pipe(map(res => {
      // Does something on response.data
      // modify the response.data as you see fit.
      
      // return the modified data:
      return res['results'].filter(x => x.language.id == 2);
    }),
      catchError(error => {
        return throwError(error); // From 'rxjs'
      })
    ); // end of pipe
  }

  private prepareDataRequest(): Observable<object> {
    // Define the data URL
    const dataUrl = 'https://wger.de/api/v2/exerciseinfo/?limit=500';
    // Prepare the request
    return this.http.get(dataUrl)
  }
}
