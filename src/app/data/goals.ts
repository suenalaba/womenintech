export interface Goals {
    id: number;
    text: string;
    value: string;
    name: string;
}

export let fitnessGoals : Goals[] = [
    {
        id: 1,
        text: 'Gain Muscles',
        value: 'gain_muscles',
        name: 'fitnessGoals'
    },
    {
        id: 2,
        text: 'Lose Weight',
        value: 'lose_weight',
        name: 'fitnessGoals'
    },
    {
        id: 3,
        text: 'Build Strength',
        value: 'build_strength',
        name: 'fitnessGoals'
    },
    {
        id: 4,
        text: 'Body Conditioning',
        value: 'body_conditioning',
        name: 'fitnessGoals'
    },
    {
        id: 5,
        text: 'Increase Athleticism',
        value: 'increase_athleticism',
        name: 'fitnessGoals'
    },
];
