// imports
// import BOAT_REVIEW_OBJECT from schema - BoatReview__c
// import NAME_FIELD from schema - BoatReview__c.Name
// import COMMENT_FIELD from schema - BoatReview__c.Comment__c
import { LightningElement, api } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import BOAT_REVIEW_OBJECT from '@salesforce/schema/BoatReview__c';
import NAME_FIELD from '@salesforce/schema/BoatReview__c.Name';
import COMMENT_FIELD from '@salesforce/schema/BoatReview__c.Comment__c';
import BOAT_FIELD from '@salesforce/schema/BoatReview__c.Boat__c';
import RATING_FIELD from '@salesforce/schema/BoatReview__c.Rating__c';
import BOATREVIEW_OBJECT from '@salesforce/schema/BoatReview__c';

const SUCCESS_TITLE = 'Review Created!';
const SUCCESS_VARIANT = 'success';

export default class BoatAddReviewForm extends LightningElement {
    // Private
    boatId;
    rating = 0;
    comment;
    boatReviewObject = BOAT_REVIEW_OBJECT;
    nameField = NAME_FIELD;
    commentField = COMMENT_FIELD;
    ratingField = RATING_FIELD;
    boatField = BOAT_FIELD;
    labelSubject = 'Review Subject';
    labelRating = 'Rating';
    labelComment = 'Comment';

    // Public Getter and Setter to allow for logic to run on recordId change
    @api
    get recordId() {
        return this.boatId;
    }
    set recordId(value) {
        //sets boatId attribute
        this.setAttribute('boatId', value);
        //sets boatId assignment
        this.boatId = value;
    }

    // Gets user rating input from stars component
    handleRatingChanged(event) {
        this.rating = JSON.parse(JSON.stringify(event.detail)).rating;
    }

    // Custom submission handler to properly set Rating
    // This function must prevent the anchor element from navigating to a URL.
    // form to be submitted: lightning-record-edit-form
    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Rating__c = this.rating;
        fields.Boat__c = this.boatId;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    // Shows a toast message once form is submitted successfully
    // Dispatches event when a review is created
    handleSuccess() {
        // TODO: dispatch the custom event and show the success message
        const evt = new ShowToastEvent({
            title: SUCCESS_TITLE,
            message: "Review created!",
            variant: SUCCESS_VARIANT,
        });
        this.dispatchEvent(evt);
        this.dispatchEvent(new CustomEvent('createreview'));

        this.handleReset();
    }

    // Clears form data upon submission
    // TODO: it must reset each lightning-input-field
    handleReset() {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
}