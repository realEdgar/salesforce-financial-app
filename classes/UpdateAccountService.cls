public with sharing class UpdateAccountService {
    public static void updateAccountAmount(Map<Id, List<Decimal>> accountAmountMap, String operation){
        List<Account__c> accounts = [
            SELECT Id, Amount__c
            FROM Account__c
            WHERE Id IN : accountAmountMap.keySet()
        ];

        for(Account__c account : accounts){
            for(Decimal amount : accountAmountMap.get(account.Id)){
                if(operation == '+'){
                    account.Amount__c += amount;
                } else if(operation == '-'){
                    account.Amount__c -= amount;
                }
            }
        }

        update accounts;
    }
}