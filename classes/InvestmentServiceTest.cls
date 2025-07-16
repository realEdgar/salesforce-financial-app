@IsTest
public with sharing class InvestmentServiceTest {
    @IsTest
    static void insertGoods(){
        Account__c account = new Account__c(
            Amount__c = 5000.50,
            Type__c = 'Bank',
            Why__c = 'Testing account'
        );
        insert account;

        Investment__c inv = new Investment__c(
            Account__c = account.Id,
            Available_to_Invest__c = 1000.50,
            Name = 'Test Investment Record'
        );
        insert inv;

        List<Goods__c> goods = new List<Goods__c>();
        for(Integer i = 0; i < 2; i++){
            Goods__c g = new Goods__c();
            g.Name = 'Test Goods ' + i;
            g.Investment__c = inv.Id;
            g.No_Titles__c = 4;
            g.Unit_Cost__c = 100;
            g.Current_Value__c = 400;
            goods.add(g);
        }

        insert goods;

        Investment__c investmentRecord = [SELECT Id, Available_to_Invest__c FROM Investment__c WHERE Name = 'Test Investment Record' LIMIT 1];

        Assert.areEqual(200.50, investmentRecord.Available_to_Invest__c);
    }
}