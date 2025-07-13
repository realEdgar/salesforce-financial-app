import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class RevenueCard extends NavigationMixin(LightningElement) {
    @api revenueRecord;
    @api currencyCode;

    handleNavigateRecord(e){
        const pageRef = {
            type: 'standard__recordPage',
            attributes: {
                recordId: this.revenueRecord.Id,
                actionName: 'view'
            }
        }

        this[NavigationMixin.Navigate](pageRef);
    }
}