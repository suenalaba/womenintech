import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-gb-delete-buddy-modal',
  templateUrl: './gb-delete-buddy-modal.page.html',
  styleUrls: ['./gb-delete-buddy-modal.page.scss'],
})
/**
 * This page initializes the content for the modal pop up when user selects to delete buddy and tracks the user input.
 */
export class GbDeleteBuddyModalPage implements OnInit {

  private optionList = ['Return to chat', 'Proceed to delete'];

  /**
   * Getter for the option list to be display to the user.
   */
  public get getOptionList() {
    return this.optionList;
  }

  constructor(private modalController: ModalController) { }

  /**
   * Gets the color of button to display depending on the text to display.
   *
   * @param option text to display
   * @returns danger is the option to display is proceed to delete and success if the option to display is not proceed to delete.
   */
  public getColorOfButton(option: string): string {
    if(option === 'Proceed to delete') {
      return 'danger';
    } else {
      return 'success';
    }
  }

  /**
   * Navigates the user back to the chat page and dismisses the modal, while passing the user choice selected to the modal controller.
   *
   * @param response the response based on the user input.
   */
  public async navigateBack(response: string) {
    let isChoiceDelete: boolean;
    if (response === 'Proceed to delete') {
      isChoiceDelete = true;
    } else {
      isChoiceDelete = false;
    }
    await this.modalController.dismiss(isChoiceDelete);
  }

  ngOnInit() {
  }
}
