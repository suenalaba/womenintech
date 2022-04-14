//choose get fit , lift heavier
export class WorkoutDetails {
    category: string;
    equipment: any[];
    exerciseDesc: string;
    exerciseName: string;
    id: number;
    images: any[];
    sets: ExerciseDetails;
  }
  

export class ExerciseDetails {
    reps: number;
    sets: number;
  }
  