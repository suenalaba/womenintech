import { CreateWorkoutDesc } from 'src/app/class/CreateWorkoutDesc'

export const Intensity: CreateWorkoutDesc[] = [
    {
        id: 1,
        text: 'Low',
        info: '< 3.0 METs',
        value: 'low',
        name: 'intensity'
    },
    {
        id: 2,
        text: 'Moderate',
        info: '3.0 - 6.0 METs',
        value: 'moderate',
        name: 'intensity'
    },
    {
        id: 3,
        text: 'Vigorous',
        info: '6.0 - 9.0 METs',
        value: 'vigorous',
        name: 'intensity'
    },
    {
        id: 4,
        text: 'Hard',
        info: '> 9.0 METs',
        value: 'hard',
        name: 'intensity'
    }
]

export const Duration: CreateWorkoutDesc[] = [
    {
        id: 1,
        text: 'Short and Quick',
        info: '15 Mins',
        value: 'short',
        name: 'duration'
    },
    {
        id: 2,
        text: 'Back on Track',
        info: '30 Mins',
        value: 'medium',
        name: 'duration'
    },
    {
        id: 3,
        text: 'Built Different',
        info: '60 Mins',
        value: 'long',
        name: 'duration'
    },
    {
        id: 4,
        text: 'Beast Mode',
        info: '90 Mins >',
        value: 'longer',
        name: 'duration'
    }
]

export const wLocation: CreateWorkoutDesc[] = [
    {
        id: 1,
        text: 'Gym',
        info: '',
        value: 'gym',
        name: 'location'
    },
    {
        id: 2,
        text: 'Home',
        info: '',
        value: 'home',
        name: 'location'
    },
    {
        id: 3,
        text: 'Outdoor',
        info: '',
        value: 'outdoor',
        name: 'location'
    }
]

export const Equipment: CreateWorkoutDesc[] = [
    {
        id: 1,
        text: 'Basic Equipment',
        info: 'Resistance bands, Dumbbells, Barbells, etc',
        value: 'basic',
        name: 'equipment'
    },
    {
        id: 2,
        text: 'Minimal Equipment',
        info: 'Household items with weight',
        value: 'minimal',
        name: 'equipment'
    },
    {
        id: 3,
        text: 'No Equipment',
        info: 'Body weight',
        value: 'no_equipment',
        name: 'equipment'
    },
]