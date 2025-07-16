import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { CloseActionScreenEvent } from "lightning/actions";
import getInvestmentRelated from '@salesforce/apex/AccountRelatedRecordsController.getInvestmentRelated';
import { NavigationMixin } from 'lightning/navigation';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

const COLS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Available to Invest', fieldName: 'Available_to_Invest__c', type: 'currency' },
    { label: 'Total Invested Value', fieldName: 'Total_Invested_Value__c', type: 'currency' },
    { label: 'Invested Amount', fieldName: 'Invested_Amount__c', type: 'currency' },
    { label: 'Total Earned', fieldName: 'Total_Earned__c', type: 'currency' },
    { label: 'Rate', fieldName: 'Rate', type: 'percent' },
];

export default class InvestMoney extends NavigationMixin(LightningElement) {
    @api recordId;

    existingInvestmentData = [];
    columns = COLS;
    selectedRecord;
    amountToInvest;
    wireRecords;

    step1 = true;
    step2 = false;
    step3 = false;

    get disableNext(){
        return !this.selectedRecord;
    }

    get inputLabel(){
        return `Amount to Invest on ${this.selectedRecord.Name}`;
    }

    get nextActionLabel(){
        return this.step1 ? 'Next' : 'Invest Money'
    }

    get showFooter(){
        return (this.step1 || this.step3) && !this.step2;
    }

    get noExistingInvestments(){
        return this.existingInvestmentData.length === 0;
    }

    @wire(getInvestmentRelated, { accountId: '$recordId' })
    handleRelatedInvestment(result){
        this.wireRecords = result;
        const { error, data } = result;
        if(data){
            this.existingInvestmentData = data.map(record => {
                const newRecord = { ...record };
                newRecord.Rate = newRecord.Rate__c / 100;

                return newRecord;
            });
        } else if(error){
            console.error(error);
        }
    }

    handleRowSelection(e){
        this.selectedRecord = e.detail.selectedRows[0];
    }

    handleChange(e){
        console.log(e.target.value);
        this.amountToInvest = e.target.value;
    }

    handleNewInvestment(e){
        this.step1 = false;
        this.step2 = true;
        this.selectedRecord = true;
    }

    handleCancel(){
        this.selectedRecord = undefined;
        this.step1 = true;
        this.step2 = false;
        this.step3 = false;
        this.dispatchEvent(new CloseActionScreenEvent());
    }

    handleNext(){
        this.step1 = false;
        this.step2 = false;
        this.step3 = true;
    }

    handleSuccess(e){
        this.dispatchEvent(new CloseActionScreenEvent());
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success!',
                message: 'Investment Created...',
                variant: 'success'
            })
        );
    }

    handleInvestUpdate(e){
        const fields = {
            Id: this.selectedRecord.Id,
            Available_to_Invest__c: parseFloat(this.selectedRecord.Available_to_Invest__c || 0) + parseFloat(this.amountToInvest)
        }
        updateRecord({ fields })
        .then(_result => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!',
                    message: this.selectedRecord.Name + ' record updated...',
                    variant: 'success'
                })
            );
        }).catch(error => {
            console.error(error);
        }).finally(async () => {
            this.dispatchEvent(new CloseActionScreenEvent());
            await refreshApex(this.wireRecords);
        })
    }
}