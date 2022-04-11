import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-gb-share-workout-modal',
  templateUrl: './gb-share-workout-modal.page.html',
  styleUrls: ['./gb-share-workout-modal.page.scss'],
})
export class GbShareWorkoutModalPage implements OnInit {

  private optionList = ['Share workouts', 'Return to chat'];

  constructor(private modalController: ModalController) { }


  public get getOptionList() {
    return this.optionList;
  }

  ngOnInit() {
  }


  public async navigateBack(response: string) {
    //navigate back to chat.
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    let isChoiceDelete: boolean;
    if (response === 'Share workouts') {
      isChoiceDelete = true;
    } else {
      isChoiceDelete = false;
    }
    await this.modalController.dismiss(isChoiceDelete);
  }

  public getColorOfButton(option: string): string {
    if(option === 'Share workouts') {
      return 'success';
    } else {
      return 'danger';
    }
  }
}
