#!  /usr/local/bin/python3

################################################################################
# investmentData.py  -  Jul-08-2020 by aldebap
#
# InvestmentData class
################################################################################

import json
import uuid

from investment import Investment

#   InvestmentDataFile class


class InvestmentDataFile:

    def __init__(self, dataFileName):
        self.dataFileName = dataFileName
        self.investment = []

    # load and unserialize the content from the investment data file
    def load(self):
        with open(self.dataFileName, 'r') as fileHandler:
            fileData = json.load(fileHandler)

        for investmentAttributes in fileData['investments']:
            self.investment.append(Investment.unserialize(investmentAttributes))

    # serialize the investments content onto the investment data file
    def save(self):
        investmentList = []

        for investment in self.investment:
            investmentList.append( Investment.serialize(investment))

        with open('__' + self.dataFileName, 'w') as fileHandler:
            json.dump({ 'investments': investmentList}, fileHandler)

    # fetch all banks from the invetments content
    def getAllBanks(self):
        bankList = []

        for investment in self.investment:
            if investment.bank not in bankList:
                bankList.append(investment.bank)

        return bankList

    # fetch all bank's funds from the invetments content
    def getAllFunds(self, bank):
        fundList = []

        for investment in self.investment:
            if investment.bank == bank and investment.name not in fundList:
                fundList.append(investment.name)

        return fundList

    # fetch all investment types from the invetments content
    def getAllTypes(self):
        typeList = []

        for investment in self.investment:
            if investment.type not in typeList:
                typeList.append(investment.type)

        return typeList

    # fetch all investments from the invetments content
    def getInvestments(self, investmentId, startDate, endDate, active):
        investmentList = []

        #   if no period is informed, find the second max date in such a way to allow evaluate the evolution
        #   TODO: figure out a better way to do this
        if startDate is None and endDate is None:
            for investment in self.investment:
                if active == True and investment.balance[0].amount == 0:
                    continue

                if len(investment.balance) > 1 and (startDate is None or investment.balance[ 1 ].date < startDate):
                    startDate = investment.balance[ 1 ].date

                if endDate is None or investment.balance[ 0 ].date > endDate:
                    endDate = investment.balance[ 0 ].date

        #   trasverse the investments list to fetch those that satisfy all search criteria
        for investment in self.investment:
            if active == True and investment.balance[0].amount == 0:
                continue

            if investmentId is not None and investmentId != str(investment.id):
                continue

            balance = []

            for balanceItem in investment.balance:
                if startDate <= balanceItem.date and endDate >= balanceItem.date:
                    balance.append(balanceItem)

            operation = []

            for operationItem in investment.operation:
                if startDate <= operationItem.date and endDate >= operationItem.date:
                    operation.append(operationItem)


            revenue = []

            for revenueItem in investment.revenue:
                if startDate <= revenueItem.date and endDate >= revenueItem.date:
                    revenue.append(revenueItem)

            if len(balance) > 0:
                investmentAux = Investment()
                investmentAux.id = investment.id
                investmentAux.name = investment.name
                investmentAux.type = investment.type
                investmentAux.bank = investment.bank
                investmentAux.operation = operation
                investmentAux.balance = balance
                investmentAux.revenue = revenue

                investmentList.append(investmentAux.to_json())

        return investmentList

    # patch an investment in the invetments content
    def patchInvestment(self, investmentId, investmentData):

        #   trasverse the investments list to fetch the given investment Id
        for investment in self.investment:
            if investmentId == str(investment.id):
                if investmentData.get('bank') is not None:
                    investment.bank = investmentData.get( 'bank' )
                if investmentData.get('type') is not None:
                    investment.type = investmentData.get( 'type' )
                if investmentData.get('name') is not None:
                    investment.name = investmentData.get( 'name' )

                self.save()

                return investment.to_json()

        return {}
