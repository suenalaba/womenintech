import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-stats',
  templateUrl: './completedworkouts.page.html',
  styleUrls: ['./completedworkouts.page.scss'],
})

/**
 * Statistics page when people click See More
 */
export class CompletedWorkoutsPage implements OnInit {
  public workouts: any[];

  constructor(private router: Router) { this.workouts = []; }

  ngOnInit() {
    this.loadWorkouts();
  }


  /**
   * Navigate back home
   */
   public goHome() {
    this.router.navigate(['/tabs/home']);
  }

  /**
   * Navigate to workout page
   */
  public goWorkout() {
    this.router.navigate(['/tabs/workouts']);
  }

  /**
   * Get the list of workouts and parse statistics for display
   */
   private loadWorkouts() {
    for (let i = 0; i < HomePage.completedWorkouts.docs.length; i++) {
      this.workouts.push(HomePage.completedWorkouts.docs[i].data());
      this.workouts[i].caloriesBurnt = Math.round(this.workouts[i].caloriesBurnt * 100) / 100;
      const datee = new Date(this.workouts[i].dateCompleted.seconds * 1000);
      this.workouts[i].dateCompleted = datee.toString().split(' GMT')[0];
      this.workouts[i].SetsReps = this.workouts[i].totalSets + ' / ' + this.workouts[i].totalReps;
    };
    console.log(this.workouts);
  }
}
