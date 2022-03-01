export interface Injuries {
    text: string;
    value: string;
    name: string;
    img: string;
}

export interface Injury {
    text: string;
    value: string;
    name: string;
}

export let areaOfInjury: Injuries[] = [
    {
        text: 'Arm',
        value: 'arm',
        img: '',
        name: 'injuries',
    },
    {
        text: 'Leg',
        value: 'leg',
        img:'',
        name: 'injuries',
    },
    {
        text: 'Back',
        value: 'back',
        img:'',
        name: 'injuries',
    },
    {
        text: 'Hand',
        value: 'hand',
        img:'',
        name: 'injuries',
    },
    {
        text: 'Feet',
        value: 'feet',
        img:'',
        name: 'injuries',
    },
    {
        text: 'Others',
        value: 'others',
        img:'',
        name: 'injuries',
    }
  ]

  export let armInjuries: Injuries[] = [
      {
        text: 'Wrist',
        value: 'wrist',
        img: '',
        name: 'armInjuries',
      },
      {
        text: 'Forearm',
        value: 'forearm',
        img: '',
        name: 'armInjuries',
      },
      {
        text: 'Fingers',
        value: 'fingers',
        img: '',
        name: 'armInjuries',
      },
      {
        text: 'Elbow',
        value: 'elbow',
        img: '',
        name: 'armInjuries',
      },
      {
        text: 'Bicep',
        value: 'bicep',
        img: '',
        name: 'armInjuries',
      }
  ]