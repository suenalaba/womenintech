import { Timestamp } from 'firebase/firestore';
import { WorkoutDetails } from './WorkoutDetails';

export class CreateWorkoutDesc {
    id: number;
    text: string;
    info: string;
    value: string;
    name: string;
    color?: string;
    mets?: number;
}

export class WorkoutDesc {
    wName: string;
    wDescription: string;
    intensity:  string;
    duration: string;
    location: string;
    equipment: string;
    tags: string[];
    dateCreated: Timestamp;
    workoutStatus: string;
    dateStart?: Timestamp;
    stopwatch?: number;
    currExercise?: {
        section: string,
        index: number,
        // set: number
    };
    dateCompleted?: Timestamp;
    workoutRoutine: WorkoutDetails [];
    createdBy: string;
}

export class CompletedWorkout {
    workoutName: string;
    workoutId: string;
    stopwatch: number;
    dateCompleted?: Timestamp;
    workoutRoutine: WorkoutDetails [];
    strength: number;
    fitness: number;
    caloriesBurnt: number;
    totalSets: number;
    totalReps: number;
    workoutNotes: string;
}

