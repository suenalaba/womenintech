//choose get fit , lift heavier
export class WorkoutDetails {
    exerciseName: string;
    id: number;
    equipment: any[];
    category: string;
    exerciseDesc: string;
    images: any[];
    sets: ExerciseDetails;
  }
  

export class ExerciseDetails {
    sets: number;
    reps: number;
  }
  