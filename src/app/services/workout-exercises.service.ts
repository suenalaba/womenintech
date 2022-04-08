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
    return this.prepareDataRequest()
  }

  private prepareDataRequest(): Observable<object> {
    // Define the data URL
    const dataUrl = 'https://wger.de/api/v2/exerciseinfo/?limit=500';
    // Prepare the request
    return this.http.get(dataUrl);
  }
}
