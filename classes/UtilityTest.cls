@IsTest
public with sharing class UtilityTest {
    @IsTest
    static void getCurrencyTest(){
        String currencyCode = Utility.getCurrencyCode();

        Assert.isNotNull(currencyCode);
    }
}