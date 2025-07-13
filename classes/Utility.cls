public with sharing class Utility {
    @AuraEnabled
    public static String getCurrencyCode(){
        return UserInfo.getDefaultCurrency();
    }
}