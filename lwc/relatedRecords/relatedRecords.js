import { LightningElement, api, wire } from 'lwc';
import getExpensesRelated from '@salesforce/apex/AccountRelatedRecordsController.getExpensesRelated';
import getInvestmentRelated from '@salesforce/apex/AccountRelatedRecordsController.getInvestmentRelated';
import getRevenuesRelated from '@salesforce/apex/AccountRelatedRecordsController.getRevenuesRelated';
import { refreshApex } from '@salesforce/apex';
import getCurrencyCode from '@salesforce/apex/Utility.getCurrencyCode';

export default class RelatedRecords extends LightningElement {
    @api recordId;

    relatedInvestmentData = [];
    relatedExpensesData = [];
    relatedRevenuesData = [];
    wireInvestments;
    wireExpenses;
    wireRevenues;
    message = '';

    get totalExpenses(){
        let totalExpenses = 0;
        this.relatedExpensesData.forEach(exp => {
            totalExpenses += exp.Amount__c;
        });

        return totalExpenses;
    }

    get totalRevenues(){
        let totalRevenues = 0;
        this.relatedRevenuesData.forEach(rev => {
            totalRevenues += rev.Amount__c;
        });

        return totalRevenues;
    }

    get relatedRecords(){
        return this.relatedExpensesData.length > 0 || this.relatedInvestmentData.length > 0 || this.relatedRevenuesData.length > 0;
    }

    @wire(getCurrencyCode)
    currencyCode;

    @wire(getInvestmentRelated, { accountId: '$recordId' })
    handleInvestRecords(result){
        const { error, data } = result;
        this.wireInvestments = result;

        if(data){
            this.relatedInvestmentData = data;
        } else if(error){
            console.error(error);
        }
    }

    @wire(getExpensesRelated, { accountId: '$recordId' })
    handleExpsRecords(result){
        const { error, data } = result;
        this.wireExpenses = result;

        if(data){
            this.relatedExpensesData = data;
        } else if(error){
            console.error(error);
        }
    }

    @wire(getRevenuesRelated, { accountId: '$recordId' })
    handleRevsRecords(result){
        const { error, data } = result;
        this.wireRevenues = result;
        
        if(data){
            this.relatedRevenuesData = data;
        } else if(error){
            console.error(error);
        }
    }

    refreshInvestments(){
        this.handleRefreshData(this.wireInvestments);
    }

    refreshExpenses(){
        this.handleRefreshData(this.wireExpenses);
    }

    refreshRevenues(){
        this.handleRefreshData(this.wireRevenues);
    }

    async handleRefreshData(data){
        await refreshApex(data);
    }
}