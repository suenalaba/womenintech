import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { WorkoutDesc } from 'src/app/class/CreateWorkoutDesc';
import { WorkoutDetails } from 'src/app/class/WorkoutDetails';


@Component({
  selector: 'app-display-workout',
  templateUrl: './display-workout.component.html',
  styleUrls: ['./display-workout.component.scss'],
})
export class DisplayWorkoutComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private alertController: AlertController) { }
  @Input() section: string;
  @Input() workoutDetails: any;
  
  workoutId: string;
  userId: string;

  workoutSection: string;
  exerciseiString: string;
  exerciseIndex: number;

  buttonText: string;
  setClick: boolean = false;
  selectedSet: number;

  workoutRoutine: WorkoutDetails[];
  currentExercise: WorkoutDetails;

  workSets = [];

  ngOnInit() {
    this.getExercises()
    this.displayExercise();
  }

  async getExercises(){
    this.route.queryParamMap.subscribe(params => {
      this.workoutSection = params.get('workoutSection');
      this.exerciseiString = params.get('exerciseIndex');
      this.workoutId = params.get('wid');
      this.userId = params.get('uid');
    })

    let ReceivedData = window.localStorage.getItem("workoutRoutine");
    this.workoutRoutine = JSON.parse(ReceivedData)

    this.workoutDetails = JSON.parse(this.workoutDetails)

    this.exerciseIndex = parseInt(this.exerciseiString)

    this.displayExercise();
  }

  displayExercise() {
    this.workSets = []

    if(this.workoutSection == "warmup"){
      this.buttonText = "FINISH WARM UP"
      this.exerciseIndex = 0;
    }

    else if (this.workoutSection == "exercise" && this.exerciseIndex < this.workoutRoutine.length) {
      this.exerciseIndex = this.exerciseIndex
      this.currentExercise = this.workoutRoutine[this.exerciseIndex]

      for(let i=0; i < this.currentExercise.sets.sets; i++){
        this.workSets.push(this.currentExercise.sets.reps)
      }

      this.buttonText = "NEXT EXERCISE";
      console.log(this.section, this.exerciseIndex)
    }

  }

  addSet(){
    this.setClick = false;
    this.selectedSet = -1;

    this.workoutRoutine[this.exerciseIndex].sets.sets = this.currentExercise.sets.sets+1;
    this.workSets.push(this.currentExercise.sets.reps)
    window.localStorage.setItem("workoutRoutine", JSON.stringify(this.workoutRoutine));
  }

  removeSet(){
    if(this.workSets.length > 0){
      this.workSets.splice(this.selectedSet,1)
      this.workoutRoutine[this.exerciseIndex].sets.sets = this.currentExercise.sets.sets-1;
      window.localStorage.setItem("workoutRoutine", JSON.stringify(this.workoutRoutine));
    }
    
  }

  deleteSet(i){
    console.log(i, this.setClick)
    if(this.setClick){
      this.setClick = false;
      this.selectedSet= -1;
    }else if(!this.setClick && this.workSets.length != 1){
      this.setClick = true; 
      this.selectedSet = i;
    }
  }

  dismiss(){
    this.setClick = false;
    this.selectedSet= -1;
  }

  nextComponent(){
    if(this.workoutSection == "warmup"){
      return this.workoutRoutine[0].exerciseName
    }else if(this.workoutSection =="exercise" && this.exerciseIndex < this.workoutRoutine.length-1){
      return this.workoutRoutine[this.exerciseIndex+1].exerciseName
    }else if(this.workoutSection =="exercise" && this.exerciseIndex == this.workoutRoutine.length-1){
      return "Cool Down"
    }else if(this.workoutSection =="cooldown"){
      return "Workout Done"
    }
  }

  // async presentDeleteConfirm() {
  //   const alert = await this.alertController.create({
  //     cssClass: 'my-custom-class',
  //     header: `Remove set ${this.selectedSet+1}?`,
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         id: 'cancel-button',
  //         handler: (blah) => {
  //           console.log('Confirm Cancel: blah');
  //         }
  //       }, {
  //         text: 'Yes',
  //         id: 'confirm-button',
  //         handler: () => {
  //           console.log('Confirm Okay');
  //           this.removeSet();
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }

  nextExercise() {
    console.log("next exercise:" , this.workoutSection, this.exerciseIndex, this.workoutRoutine.length)
    let l = this.workoutRoutine.length


    if(this.workoutSection=="warmup"){
      this.buttonText = "NEXT EXERCISE" 
      this.workoutSection = "exercise"
      this.exerciseIndex = 0;
      this.navToSection();
      this.displayExercise();
    }else if(this.exerciseIndex < l-1 && this.workoutSection=="exercise"){
      this.exerciseIndex = this.exerciseIndex+1;
      this.displayExercise();
      this.buttonText = this.exerciseIndex == l-1 ? "START COOLDOWN" : "NEXT EXERCISE" ;
      this.workoutSection = "exercise"
      this.navToSection()
    }else if(this.exerciseIndex == l-1 && this.workoutSection=='exercise'){
      this.workoutSection = "cooldown"
      this.buttonText = "FINISH COOLDOWN";
      this.exerciseIndex = -1;
      this.navToSection()
    }else if(this.workoutSection=='cooldown'){
      this.buttonText = "FINISH COOLDOWN"
      this.workoutDetails.workoutStatus = "completed"
      this.goToSummary()
    }
  }

  navToSection() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        workoutSection: this.workoutSection,
        exerciseIndex: this.exerciseIndex
      },
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      skipLocationChange: false
      // do not trigger navigation
    });
  }
 

  async goToSummary(){
    this.router.navigate(['/workout-summary'], { queryParams: { wid: this.workoutId, uid: this.userId}});
  }

}
