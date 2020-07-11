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
    def save(self, configurationRef):
        with open(self.dataFileName, 'w') as fileHandler:
            json.dump(Configuration.serialize(configurationRef), fileHandler)

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

        for investment in self.investment:
            # TODO: if no period is given, should consider operations and revenue from last balance item forth
            operation = []

            for operationItem in investment.operation:
                if startDate is None and endDate is None:
                    if len(operation) == 0:
                        operation.append(operationItem)
                    elif operation[0].date < operationItem.date:
                        operation[0] = operationItem
                else:
                    if startDate is not None and endDate is None and startDate <= operationItem.date:
                        operation.append(operationItem)
                    elif startDate is None and endDate is not None and endDate >= operationItem.date:
                        operation.append(operationItem)
                    elif startDate is not None and endDate is not None and startDate <= operationItem.date and endDate >= operationItem.date:
                        operation.append(operationItem)

            balance = []

            # TODO: this algorithm can be improved
            for balanceItem in investment.balance:
                if startDate is None and endDate is None:
                    if len(balance) == 0:
                        balance.append(balanceItem)
                    elif balance[0].date < balanceItem.date:
                        balance[0] = balanceItem
                else:
                    if startDate is not None and endDate is None and startDate <= balanceItem.date:
                        balance.append(balanceItem)
                    elif startDate is None and endDate is not None and endDate >= balanceItem.date:
                        balance.append(balanceItem)
                    elif startDate is not None and endDate is not None and startDate <= balanceItem.date and endDate >= balanceItem.date:
                        balance.append(balanceItem)

            revenue = []

            for revenueItem in investment.revenue:
                if startDate is None and endDate is None:
                    if len(revenue) == 0:
                        revenue.append(revenueItem)
                    elif revenue[0].date < revenueItem.date:
                        revenue[0] = revenueItem
                else:
                    if startDate is not None and endDate is None and startDate <= revenueItem.date:
                        revenue.append(revenueItem)
                    elif startDate is None and endDate is not None and endDate >= revenueItem.date:
                        revenue.append(revenueItem)
                    elif startDate is not None and endDate is not None and startDate <= revenueItem.date and endDate >= revenueItem.date:
                        revenue.append(revenueItem)

            # TODO: there's a bug in the investmentID filter
            if len(balance) != 0 and (investmentId is None or investmentId == investment.id) and (active == False or balance[0].amount > 0):
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
