import { LightningElement, api, track } from 'lwc';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

export default class BoatReviews extends NavigationMixin(LightningElement) {
  // Private
  @api boatId;
  error;
  boatReviews = [];
  isLoading = false;

  // Getter and Setter to allow for logic to run on recordId change
  @api
  get recordId() {
    return this.boatId;
  }

  set recordId(value) {
    //sets boatId attribute
    this.setAttribute('boatId', value);
    //sets boatId assignment
    this.boatId = value;
    //get reviews associated with boatId
    this.getReviews();
  }

  // Getter to determine if there are reviews to display
  get reviewsToShow() {
    return (this.boatReviews && this.boatReviews.length > 0) ? true : false;
  }

  // Public method to force a refresh of the reviews invoking getReviews
  @api
  refresh() {
    refreshApex(this.getReviews());
  }

  // Imperative Apex call to get reviews for given boat
  // returns immediately if boatId is empty or null
  // sets isLoading to true during the process and false when it’s completed
  // Gets all the boatReviews from the result, checking for errors.
  getReviews() {
    if (this.boatId == '' || this.boatId == null) {
      return;
    }
    this.isLoading = true;
    this.error = undefined;
    this.boatReviews = getAllReviews(this.boatId);
    getAllReviews({ boatId: this.recordId })
      .then(result => {
        this.boatReviews = result;
      })
      .catch(error => {
        this.error = error.body.message;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  // Helper method to use NavigationMixin to navigate to a given record on click
  navigateToRecord(event) {
    // Navigate to the detail page
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: event.target.dataset.recordId,
        actionName: "view"
      },
    });
  }
}