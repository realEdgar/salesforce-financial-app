@IsTest
public with sharing class UpdateAccountServiceTest {
    @TestSetup
    static void makeData(){
        Account__c account = new Account__c(
            Amount__c = 5000.50,
            Type__c = 'Bank',
            Why__c = 'Testing account'
        );
        insert account;
    }

    @IsTest
    static void createExpenses(){
        Account__c account = [SELECT ID, Amount__c FROM Account__c LIMIT 1];

        List<Expense__c> newExps = new List<Expense__c>();
        for(Integer i = 0; i < 5; i++){
            Expense__c exp = new Expense__c();
            exp.Name = 'Test'+i;
            exp.Amount__c = 500;
            exp.Account__c = account.Id;

            newExps.add(exp);
        }
        Test.startTest();
        insert newExps;
        Test.stopTest();

        Account__c updatedAccount = [SELECT ID, Amount__c FROM Account__c LIMIT 1];

        Assert.areEqual(2500.50, updatedAccount.Amount__c);
    }

    @IsTest
    static void createRevenues(){
        Account__c account = [SELECT ID, Amount__c FROM Account__c LIMIT 1];

        List<Revenue__c> newRev = new List<Revenue__c>();
        for(Integer i = 0; i < 5; i++){
            Revenue__c rev = new Revenue__c();
            rev.Name = 'Test'+i;
            rev.Amount__c = 500;
            rev.Account__c = account.Id;

            newRev.add(rev);
        }
        Test.startTest();
        insert newRev;
        Test.stopTest();

        Account__c updatedAccount = [SELECT ID, Amount__c FROM Account__c LIMIT 1];

        Assert.areEqual(7500.50, updatedAccount.Amount__c);
    }
}