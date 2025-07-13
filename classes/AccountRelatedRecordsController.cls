public with sharing class AccountRelatedRecordsController {
    @AuraEnabled(cacheable=true)
    public static List<Investment__c> getInvestmentRelated(String accountId){
        return [
            SELECT Id, Name, Available_to_Invest__c, Account__c, Invested_Amount__c, Total_Invested_Value__c, Rate__c, Total_Earned__c
            FROM Investment__c
            WHERE Account__c =: accountId
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Expense__c> getExpensesRelated(String accountId){
        return [
            SELECT Id, Name, Amount__c, Account__c, Why_Expense__c, Category__c, Expense_Date__c
            FROM Expense__c
            WHERE Account__c =: accountId
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Revenue__c> getRevenuesRelated(String accountId){
        return [
            SELECT Id, Name, Amount__c, Account__c, Why_Revenue__c, Revenue_Date__c
            FROM Revenue__c
            WHERE Account__c =: accountId
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Goods__c> getGoodsRelated(String investmentId){
        return [
            SELECT Id, Name, Investment__c, Unit_Cost__c, No_Titles__c, Current_Value__c, Total_Invested__c, Earned_Money__c
            FROM Goods__c
            WHERE Investment__c =: investmentId
        ];
    }
}