import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutDesc } from 'src/app/class/CreateWorkoutDesc';
import { WorkoutDetails } from 'src/app/class/WorkoutDetails';
import { WorkoutsService } from 'src/app/services/workouts/workouts.service';

@Component({
  selector: 'app-workout-summary',
  templateUrl: './workout-summary.page.html',
  styleUrls: ['./workout-summary.page.scss'],
})
export class WorkoutSummaryPage implements OnInit {
  workoutId: string;
  userId: string;
  
  workoutDetails: WorkoutDesc
  constructor(private workoutService: WorkoutsService,
    private route: ActivatedRoute, private router: Router, ) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.workoutId = params.get('wid');
      this.userId = params.get('uid');
    })

    this.showWorkoutSummary()
  }

  showWorkoutSummary(){
    this.workoutService.getWorkout(this.workoutId, this.userId).subscribe(res=>{
      console.log(res)
      if(res.workoutStatus=='completed'){
        this.workoutDetails = res

      }
    })
  }

}
