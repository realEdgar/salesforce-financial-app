@IsTest
public with sharing class AccountRelatedRecordsControllerTest {
    @TestSetup
    static void makeData(){
        Account__c account = new Account__c(
            Amount__c = 5000.50,
            Type__c = 'Bank',
            Why__c = 'Testing account'
        );
        insert account;
        List<Expense__c> newExps = new List<Expense__c>();
        for(Integer i = 0; i < 5; i++){
            Expense__c exp = new Expense__c();
            exp.Name = 'Test'+i;
            exp.Amount__c = 500;
            exp.Account__c = account.Id;

            newExps.add(exp);
        }
        insert newExps;

        List<Revenue__c> newRev = new List<Revenue__c>();
        for(Integer i = 0; i < 5; i++){
            Revenue__c rev = new Revenue__c();
            rev.Name = 'Test'+i;
            rev.Amount__c = 500;
            rev.Account__c = account.Id;

            newRev.add(rev);
        }
        insert newRev;
        
        List<Investment__c> newInves = new List<Investment__c>();
        for(Integer i = 0; i < 5; i++){
            Investment__c rev = new Investment__c();
            rev.Name = 'Test'+i;
            rev.Available_to_Invest__c = 50000;
            rev.Account__c = account.Id;

            newInves.add(rev);
        }
        insert newInves;
    }
    @IsTest
    static void retrieveRelatedRecords(){
        Id accountId = [SELECT Id FROM Account__c LIMIT 1].Id;

        Test.startTest();
        List<Expense__c> exps = AccountRelatedRecordsController.getExpensesRelated(accountId);
        List<Revenue__c> revs = AccountRelatedRecordsController.getRevenuesRelated(accountId);
        List<Investment__c> invs = AccountRelatedRecordsController.getInvestmentRelated(accountId);
        Test.stopTest();

        Assert.areEqual(5, exps.size());
        Assert.areEqual(5, revs.size());
        Assert.areEqual(5, invs.size());
    }
}