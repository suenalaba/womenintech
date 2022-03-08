import { GymBuddyDetails } from './GymBuddyDetails';

export const workoutTimePreference: GymBuddyDetails[] = [
  {
      id: 1,
      text: 'MORNING',
      value: 'morning',
      name: 'workoutTimePreference',
      time: '5AM-11AM',
      isChecked: false
  },
  {
      id: 2,
      text: 'AFTERNOON',
      value: 'afternoon',
      name: 'workoutTimePreference',
      time: '11AM-5pm',
      isChecked: false
  },
  {
      id: 3,
      text: 'EVENING',
      value: 'evening',
      name: 'workoutTimePreference',
      time: '5PM-11PM',
      isChecked: false
  },
  {
      id: 4,
      text: 'LATE NIGHT',
      value: 'late_night',
      name: 'workoutTimePreference',
      time: '11PM-2AM',
      isChecked: false
  },
  {
      id: 5,
      text: 'NO PREFERENCE',
      value: 'no_preference',
      name: 'workoutTimePreference',
      time: 'ANYTIME',
      isChecked: false
  },
];
