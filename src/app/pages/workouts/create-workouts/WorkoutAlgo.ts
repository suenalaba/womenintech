
import { WorkoutExercisesService } from 'src/app/services/workout-exercises.service';


export class WorkoutAlgo {

    constructor(private workoutAPI: WorkoutExercisesService){

    }

    makeWorkout(){
        this.workoutAPI.loadExercises()
    }
}