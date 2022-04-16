/* eslint-disable eqeqeq */
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutDetails } from 'src/app/class/WorkoutDetails';
import { WorkoutsService } from 'src/app/services/workouts/workouts.service';
import YoutubeService from 'src/app/services/youtube.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-display-workout',
  templateUrl: './display-workout.component.html',
  styleUrls: ['./display-workout.component.scss'],
})
/**
 * Class to powering the logic to get and display information related to the exercises
 */
export class DisplayWorkoutComponent implements OnInit {
  @Input() public stopwatch: number;
  @Input() public section: string;
  @Input() public workoutDetails: any;
  public buttonText: string;
  public currentExercise: WorkoutDetails;
  public exerciseIndex: number;
  public workoutSection: string;
  public workSets = [];
  public ytVideosCool = [] as any;
  public ytVideosWarm = [] as any;
  public selectedSet: number;
  public setClick = false;
  private exerciseiString: string;
  private userId: string;
  private workoutId: string;
  private workoutIntensity: string;
  private workoutRoutine: WorkoutDetails[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workoutService: WorkoutsService
  ) {}

  /**
   * Find the list of all exercises associated with this user's workout
   */
  async getExercises() {
    this.route.queryParamMap.subscribe((params) => {
      this.workoutSection = params.get('workoutSection');
      this.exerciseiString = params.get('exerciseIndex');
      this.workoutId = params.get('wid');
      this.userId = params.get('uid');
    });

    const receivedData = window.localStorage.getItem('workoutRoutine');
    this.workoutRoutine = JSON.parse(receivedData);
    this.workoutDetails = JSON.parse(this.workoutDetails);
    this.exerciseIndex = parseInt(this.exerciseiString, 10);

    this.displayExercise();
  }

  /**
   * Get a random video on Youtube for the warmup and cooldown, matching video duration with warmup/cooldown duration
   */
  async getVideos() {
    this.workoutService
      .getWorkout(this.workoutId, this.userId)
      .subscribe(async (results) => {
        let durn: number;
        this.workoutIntensity = results.intensity;
        if (this.workoutIntensity == 'low') {
          durn = 2;
        } else if (this.workoutIntensity == 'hard') {
          durn = 10;
        } else {
          durn = 5;
        }

        const ytService = YoutubeService.getInstance();

        this.ytVideosWarm = await ytService.getYoutubeAPI(
          'warm up ' + durn + ' minutes',
          2
        );
        console.log('warm', this.ytVideosWarm);

        this.ytVideosCool = await ytService.getYoutubeAPI(
          'cool down ' + durn + ' minutes',
          3
        );
        console.log('cool', this.ytVideosCool);
      });
  }

  /**
   * Navigate user to workout summary
   */
  async goToSummary() {
    if (this.workoutDetails.workoutStatus == 'completed') {
      this.workoutDetails.currExercise = {
        section: '',
        index: -1,
      };
      this.workoutDetails.stopwatch = this.stopwatch;
      this.workoutDetails.dateCompleted = Timestamp.fromDate(new Date());
      this.workoutService.saveWorkout(
        this.workoutId,
        this.userId,
        this.workoutDetails
      );
      await this.router.navigate(['/workout-summary'], {
        queryParams: { wid: this.workoutId, uid: this.userId },
      });
      console.log(this.workoutDetails);
    } else {
      await this.router.navigateByUrl('/tabs/workouts');
    }
  }

  ngOnInit() {
    this.getExercises();
    this.getVideos();
    this.displayExercise();
  }

  /**
   * If user presses the plus button in html, add more sets to the workout
   */
  public addSet() {
    this.setClick = false;
    this.selectedSet = -1;

    this.workoutRoutine[this.exerciseIndex].sets.sets =
      this.currentExercise.sets.sets + 1;
    this.workSets.push(this.currentExercise.sets.reps);

    this.workoutDetails.workoutRoutine = this.workoutRoutine;
    window.localStorage.setItem(
      'workoutRoutine',
      JSON.stringify(this.workoutRoutine)
    );
  }

  /**
   * Function to toggle delete button in html
   *
   * @param i index of set
   */
  public deleteSet(i) {
    console.log(i, this.setClick);
    if (this.setClick) {
      this.setClick = false;
      this.selectedSet = -1;
    } else if (!this.setClick && this.workSets.length != 1) {
      this.setClick = true;
      this.selectedSet = i;
    }
  }

  /**
   * Triggeed when next button is clicked, will return text for button
   */
  public nextComponent() {
    if (this.workoutSection == 'warmup') {
      return this.workoutRoutine[0].exerciseName;
    } else if (
      this.workoutSection == 'exercise' &&
      this.exerciseIndex < this.workoutRoutine.length - 1
    ) {
      return this.workoutRoutine[this.exerciseIndex + 1].exerciseName;
    } else if (
      this.workoutSection == 'exercise' &&
      this.exerciseIndex == this.workoutRoutine.length - 1
    ) {
      return 'Cool Down';
    } else if (this.workoutSection == 'cooldown') {
      return 'Workout Done';
    }
  }

  /**
   * Exercises to be displayed
   */
  public nextExercise() {
    console.log(
      'next exercise:',
      this.workoutSection,
      this.exerciseIndex,
      this.workoutRoutine.length
    );
    const l = this.workoutRoutine.length;

    this.workoutDetails.currExercise = {
      section: this.workoutSection,
      index: this.workoutSection == 'exercsie' ? this.exerciseIndex : -1,
    };

    if (this.workoutSection == 'warmup') {
      this.buttonText = 'NEXT EXERCISE';
      this.workoutSection = 'exercise';
      this.exerciseIndex = 0;
      this.navToSection();
      this.displayExercise();
    } else if (
      this.exerciseIndex < l - 1 &&
      this.workoutSection == 'exercise'
    ) {
      this.exerciseIndex = this.exerciseIndex + 1;
      this.displayExercise();
      this.buttonText =
        this.exerciseIndex == l - 1 ? 'START COOLDOWN' : 'NEXT EXERCISE';
      this.workoutSection = 'exercise';
      this.navToSection();
    } else if (
      this.exerciseIndex == l - 1 &&
      this.workoutSection == 'exercise'
    ) {
      this.workoutSection = 'cooldown';
      this.buttonText = 'FINISH COOLDOWN';
      this.exerciseIndex = -1;
      this.navToSection();
    } else if (this.workoutSection == 'cooldown') {
      this.buttonText = 'FINISH COOLDOWN';
      this.workoutDetails.workoutStatus = 'completed';
      this.goToSummary();
    }
  }

  /**
   * If user presses the delete button in html, remove sets from the workout
   */
  public removeSet() {
    if (this.workSets.length > 0) {
      this.workSets.splice(this.selectedSet, 1);
      this.workoutRoutine[this.exerciseIndex].sets.sets =
        this.currentExercise.sets.sets - 1;
      this.workoutDetails.workoutRoutine = this.workoutRoutine;
      window.localStorage.setItem(
        'workoutRoutine',
        JSON.stringify(this.workoutRoutine)
      );
    }
  }

  public dismiss() {
    this.setClick = false;
    this.selectedSet = -1;
  }

  /**
   * Display exercise based on the current workout progress of the user
   */
  private displayExercise() {
    this.workSets = [];

    if (this.workoutSection == 'warmup') {
      this.buttonText = 'FINISH WARM UP';
      this.exerciseIndex = 0;
    } else if (
      this.workoutSection == 'exercise' &&
      this.exerciseIndex < this.workoutRoutine.length
    ) {
      this.exerciseIndex = this.exerciseIndex;
      this.currentExercise = this.workoutRoutine[this.exerciseIndex];

      for (let i = 0; i < this.currentExercise.sets.sets; i++) {
        this.workSets.push(this.currentExercise.sets.reps);
      }

      this.buttonText = 'NEXT EXERCISE';
      console.log(this.section, this.exerciseIndex);
    }
  }

  /**
   * Navigate to workout and change its parameters
   */
  private navToSection() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        workoutSection: this.workoutSection,
        exerciseIndex: this.exerciseIndex,
      },
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      skipLocationChange: false,
      // do not trigger navigation
    });
  }
}
