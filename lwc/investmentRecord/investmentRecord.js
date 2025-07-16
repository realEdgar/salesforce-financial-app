import { LightningElement, api, wire } from 'lwc';
import getGoodsRelated from '@salesforce/apex/AccountRelatedRecordsController.getGoodsRelated';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from "@salesforce/apex";
import { encodeDefaultFieldValues } from "lightning/pageReferenceUtils";

const ACTIONS = [
    { label: 'Show Record', name: 'view' },
    { label: 'Edit Asset', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const GOODS_COLS = [
    { label: 'Goods Name/Code', fieldName: 'Name' },
    { label: 'Total Invested', fieldName: 'Total_Invested__c', type: 'currency' },
    { label: 'Current Value', fieldName: 'Current_Value__c', type: 'currency', editable: true },
    { label: 'Earned', fieldName: 'Earned_Money__c', type: 'currency' },
    { type: 'action', typeAttributes: { rowActions: ACTIONS } }
];

export default class InvestmentRecord extends NavigationMixin(LightningElement) {
    @api record;

    goodsData = [];
    goodsCols = GOODS_COLS;
    draftValues = [];
    wireGoodsData;

    get newLabel(){
        return `New Goods for ${this.record.Name}`;
    }

    get noGoodsRecord(){
        return this.goodsData.length === 0;
    }

    @wire(getGoodsRelated, { investmentId: '$record.Id'})
    handleRelatedGoods(result){
        const { error, data } = result;
        this.wireGoodsData = result;

        if(data){
            this.goodsData = data;
            console.log(data);
        } else if(error){
            console.error(error);
        }
    }

    async handleSave(e){
        this.draftValues = e.detail.draftValues;
        const records = this.draftValues.slice().map((draftValue) => {
            const fields = draftValue;
            return { fields };
        });

        this.draftValues = [];

        try {
            const allUpdates = records.map(record => updateRecord(record));
            await Promise.all(allUpdates);
            await this.handleRefreshGoods();
            setTimeout(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                    title: "Success",
                    message: "Assets Updated...",
                    variant: "success",
                    }),
                );
            }, 1000);
            
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                title: "Error updating or reloading contacts",
                message: error.body.message,
                variant: "error",
                }),
            );
        }
    }
    
    async handleRefreshGoods(){
        await refreshApex(this.wireGoodsData);
    }

    handleRowAction(e){
        const actionName = e.detail.action.name;
        const recordId = e.detail.row.Id;

        this.navigateToRecord(actionName, recordId);
    }

    navigateToRecord(actionName, recordId){
        const pageRef = {
            type: 'standard__recordPage',
            attributes: {
                recordId,
                actionName
            }
        }
        this[NavigationMixin.Navigate](pageRef);
    }

    handleNewGoods(){
        const defValues = encodeDefaultFieldValues({
            Investment__c: this.record.Id
        });
        const pageRef = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Goods__c',
                actionName: 'new'
            },
            state: {
                defaultFieldValues: defValues
            }
        }
        this[NavigationMixin.Navigate](pageRef);
    }
}