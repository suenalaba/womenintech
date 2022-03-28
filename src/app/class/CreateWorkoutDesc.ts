import { Timestamp } from 'firebase/firestore';

export class CreateWorkoutDesc {
    id: number;
    text: string;
    info: string;
    value: string;
    name: string;
}

export class WorkoutDesc {
    wName: string;
    wDescription: string;
    intensity:  string;
    duration: string;
    location: string;
    equipment: string;
    dateCreated: Timestamp;
    workoutStatus: string;
    dateStart?: Timestamp;
    datePaused?: Timestamp;
    dateCompleted?: Timestamp;
}