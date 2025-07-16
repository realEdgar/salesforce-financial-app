public with sharing class InvestmentService {
    public static void updateAvailableToInvest(Map<Id,List<Decimal>> investmentAmountMap, String operation) {
        List<Investment__c> invs = [
            SELECT Id, Available_to_Invest__c
            FROM Investment__c
            WHERE Id IN : investmentAmountMap.keySet()
        ];

        for(Investment__c investment : invs){
            for(Decimal amount : investmentAmountMap.get(investment.Id)){
                if(operation == '+'){
                    investment.Available_to_Invest__c += amount;
                } else if(operation == '-'){
                    investment.Available_to_Invest__c -= amount;
                }
            }
        }

        update invs;
    }
}