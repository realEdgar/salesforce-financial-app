trigger InvestmentTrigger on Investment__c (after insert, after update) {
	Map<Id, List<Decimal>> accountAmountMap = new Map<Id, List<Decimal>>();
    for(Investment__c inv : Trigger.new){
        Decimal priorValue = 0;
        if(Trigger.isUpdate){
            priorValue = Trigger.oldMap.get(inv.Id).Available_to_Invest__c;
        }
        Decimal diff = inv.Available_to_Invest__c - priorValue;
        if(accountAmountMap.containsKey(inv.Account__c)){
            accountAmountMap.get(inv.Account__c).add(diff);
        } else{
            accountAmountMap.put(inv.Account__c, new List<Decimal>{ diff });
        }
    }
    UpdateAccountService.updateAccountAmount(accountAmountMap, '-');
}