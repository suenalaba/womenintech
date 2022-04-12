import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {
  workouts: any[];

  constructor(private router: Router) { this.workouts = []; }

  goHome() {
    this.router.navigate(['home']);
  }
  
  ngOnInit() {
    this.loadWorkouts();
  }

  loadWorkouts() {
    for (let i = 0; i < HomePage.completedWorkouts.docs.length; i++) {
      this.workouts.push(HomePage.completedWorkouts.docs[i].data());
      this.workouts[i].caloriesBurnt = Math.round(this.workouts[i].caloriesBurnt * 100) / 100
    }
    console.log(this.workouts);
  }

}
