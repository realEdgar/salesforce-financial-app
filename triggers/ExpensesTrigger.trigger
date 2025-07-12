trigger ExpensesTrigger on Expense__c (after insert) {
    Map<Id, List<Decimal>> accountAmountMap = new Map<Id, List<Decimal>>();
    for(Expense__c exp : Trigger.new){
        if(accountAmountMap.containsKey(exp.Account__c)){
            accountAmountMap.get(exp.Account__c).add(exp.Amount__c);
        } else{
            accountAmountMap.put(exp.Account__c, new List<Decimal>{ exp.Amount__c });
        }
    }
    UpdateAccountService.updateAccountAmount(accountAmountMap, '-');
}