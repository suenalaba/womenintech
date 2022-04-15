import { CreateWorkoutDesc } from 'src/app/class/CreateWorkoutDesc';

export const intensity: CreateWorkoutDesc[] = [
    {
        id: 1,
        text: 'Low',
        info: '< 3.0 METs',
        value: 'low',
        name: 'intensity',
        color: 'warning',
        mets: 3.0,
    },
    {
        id: 2,
        text: 'Moderate',
        info: '3.0 - 6.0 METs',
        value: 'moderate',
        name: 'intensity',
        color: 'warning',
        mets: 4.5,
    },
    {
        id: 3,
        text: 'Vigorous',
        info: '6.0 - 9.0 METs',
        value: 'vigorous',
        name: 'intensity',
        color: 'warning',
        mets: 7.0,
    },
    {
        id: 4,
        text: 'Hard',
        info: '> 9.0 METs',
        value: 'hard',
        name: 'intensity',
        color: 'warning',
        mets: 9.0,
    }
];

export const duration: CreateWorkoutDesc[] = [
    {
        id: 1,
        text: 'Short and Quick',
        info: '15 Mins',
        value: 'short',
        name: 'duration',
        color: 'success'
    },
    {
        id: 2,
        text: 'Back on Track',
        info: '30 Mins',
        value: 'medium',
        name: 'duration',
        color: 'success'
    },
    {
        id: 3,
        text: 'Built Different',
        info: '60 Mins',
        value: 'long',
        name: 'duration',
        color: 'success'
    },
    {
        id: 4,
        text: 'Beast Mode',
        info: '90 Mins >',
        value: 'longer',
        name: 'duration',
        color: 'success'
    }
];

export const wLocation: CreateWorkoutDesc[] = [
    {
        id: 1,
        text: 'Gym',
        info: '',
        value: 'gym',
        name: 'location',
        color: 'tertiary'
    },
    {
        id: 2,
        text: 'Home',
        info: '',
        value: 'home',
        name: 'location',
        color: 'tertiary'
    },
    {
        id: 3,
        text: 'Outdoor',
        info: '',
        value: 'outdoor',
        name: 'location',
        color: 'tertiary'
    }
];

export const equipment: CreateWorkoutDesc[] = [
    {
        id: 1,
        text: 'Basic Equipment',
        info: 'Resistance bands, Dumbbells, Barbells, etc',
        value: 'basic',
        name: 'equipment',
        color: 'secondary'
    },
    {
        id: 2,
        text: 'Minimal Equipment',
        info: 'Household items with weight',
        value: 'minimal',
        name: 'equipment',
        color: 'secondary'
    },
    {
        id: 3,
        text: 'No Equipment',
        info: 'Body weight',
        value: 'no_equipment',
        name: 'equipment',
        color: 'secondary'
    },
];

export const tag: CreateWorkoutDesc[] = [];
export const tags = tag.concat(intensity,equipment,wLocation,duration);
