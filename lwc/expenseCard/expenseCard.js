import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class ExpenseCard extends NavigationMixin(LightningElement) {
    @api expenseRecord;
    @api currencyCode;

    handleNavigateRecord(e){
        const pageRef = {
            type: 'standard__recordPage',
            attributes: {
                recordId: this.expenseRecord.Id,
                actionName: 'view'
            }
        }

        this[NavigationMixin.Navigate](pageRef);
    }
}