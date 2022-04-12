import { Timestamp } from 'firebase/firestore';
import { WorkoutDetails } from './WorkoutDetails';

export class CreateWorkoutDesc {
    id: number;
    text: string;
    info: string;
    value: string;
    name: string;
    color?: string;
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
