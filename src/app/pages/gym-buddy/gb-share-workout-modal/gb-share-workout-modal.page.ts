import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-gb-share-workout-modal',
  templateUrl: './gb-share-workout-modal.page.html',
  styleUrls: ['./gb-share-workout-modal.page.scss'],
})
/**
 * This class initializes the information to be displayed on the share workout interface and stores any information the user inputs.
 */
export class GbShareWorkoutModalPage implements OnInit {

  private optionList = ['Share workouts', 'Return to chat'];

  /**
   * Getter for the option list to be displayed to the user.
   */
  public get getOptionList() {
    return this.optionList;
  }

  constructor(private modalController: ModalController) { }

  /**
   * Getter for the color of the button to be display on the user interface.
   *
   * @param option the option displayed to the user.
   * @returns color of the button to be display, 'success' color for the share workout button and 'danger' for the cancel button.
   */
  public getColorOfButton(option: string): string {
    if(option === 'Share workouts') {
      return 'success';
    } else {
      return 'danger';
    }
  }

  /**
   * Navigates the user back to the chat interface and dismisses the popup.
   * The user's choice is returned to the chat interface.
   *
   * @param response user's input choice.
   */
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

  ngOnInit() {
  }
}
