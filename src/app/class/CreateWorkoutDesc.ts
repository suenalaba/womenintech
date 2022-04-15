import { Timestamp } from 'firebase/firestore';
import { WorkoutDetails } from './WorkoutDetails';

export class CreateWorkoutDesc {
    color?: string;
    id: number;
    info: string;
    mets?: number;
    name: string;
    text: string;
    value: string;
}

export class WorkoutDesc {
    createdBy: string;
    currExercise?: {
        section: string;
        index: number;
        // set: number
    };
    dateCompleted?: Timestamp;
    dateCreated: Timestamp;
    dateStart?: Timestamp;
    duration: string;
    equipment: string;
    intensity:  string;
    location: string;
    stopwatch?: number;
    tags: string[];
    wDescription: string;
    wName: string;
    workoutRoutine: WorkoutDetails [];
    workoutStatus: string;
}

export class CompletedWorkout {
    caloriesBurnt: number;
    dateCompleted?: Timestamp;
    fitness: number;
    stopwatch: number;
    strength: number;
    totalReps: number;
    totalSets: number;
    workoutId: string;
    workoutName: string;
    workoutNotes: string;
    workoutRoutine: WorkoutDetails [];
}

