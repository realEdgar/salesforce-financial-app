trigger GoodsTrigger on Goods__c (after insert) {
    Map<Id,List<Decimal>> investmentAmountMap = new Map<Id,List<Decimal>>();
    for(Goods__c g : Trigger.new){
        if(investmentAmountMap.containsKey(g.Investment__c)){
            investmentAmountMap.get(g.Investment__c).add(g.Total_Invested__c);
        } else {
            investmentAmountMap.put(g.Investment__c, new List<Decimal>{ g.Total_Invested__c });
        }
    }
    InvestmentService.updateAvailableToInvest(investmentAmountMap, '-');
}