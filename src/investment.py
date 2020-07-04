#!  /usr/local/bin/python3

################################################################################
# investment.py  -  Jun-25-2020 by aldebap
#
# Investment class
################################################################################

import json
import sys
import uuid

#   Investment Operation class


class Operation:

    def __init__(self):
        self.id = ''
        self.date = ''
        self.description = ''
        self.amount = 0

#   Investment Balance class


class Balance:

    def __init__(self):
        self.id = ''
        self.date = ''
        self.amount = 0

    def to_json(self):
        return {
            "id": self.id, "date": self.date, "amount": self.amount
        }

    # unserialize a JSon as an Balance object
    @classmethod
    def unserialize(cls, ref):
        if isinstance(ref, dict):
            attributes = ref
        else:
            attributes = json.loads(ref)

        if 'id' not in attributes:
            balanceID = uuid.uuid4()
        else:
            balanceID = attributes['id']
        date = attributes['date']
        amount = attributes['amount']

        balanceAux = Balance()
        balanceAux.id = balanceID
        balanceAux.date = date
        balanceAux.amount = amount

        return balanceAux

#   Investment Revenue class


class Revenue:

    def __init__(self):
        self.id = ''
        self.date = ''
        self.description = ''
        self.amount = 0

#   Investment class


class Investment:

    def __init__(self):
        self.id = ''
        self.name = ''
        self.type = ''
        self.bank = ''
        self.operation = []
        self.balance = []
        self.revenue = []

    def __str__(self):
        return f'{self.id}: {self.name} / {self.type} @ {self.bank}'

    def to_json(self):
        balanceList = []

        for balance in self.balance:
            balanceList.append(balance.to_json())

        return {
            "id": self.id, "name": self.name, "type": self.type, "bank": self.bank, "balance": balanceList
        }

    # serialize an Investment object into a JSon

    @classmethod
    def serialize(cls, ref):
        # TODO: use constants for the names of all JSon fields
        attributes = {
            "id": ref.id, "name": ref.name, "type": ref.type, "bank": ref.bank, "operations": ref.operation, "balance": ref.balance, "revenue": ref.revenue
        }

        return json.dumps(attributes)

    # unserialize a JSon as an Investment object
    @classmethod
    def unserialize(cls, ref):
        if isinstance(ref, dict):
            attributes = ref
        else:
            attributes = json.loads(ref)

        if 'id' not in attributes:
            investmentID = uuid.uuid4()
        else:
            investmentID = attributes['id']
        name = attributes['name']
        investmentType = attributes['type']
        bank = attributes['bank']

        investmentAux = Investment()
        investmentAux.id = investmentID
        investmentAux.name = name
        investmentAux.type = investmentType
        investmentAux.bank = bank

        investmentAux.balance = []

        if 'balance' in attributes:
            for balanceItemAttributes in attributes['balance']:
                investmentAux.balance.append(
                    Balance.unserialize(balanceItemAttributes))

        return investmentAux

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
            self.investment.append(
                Investment.unserialize(investmentAttributes))

    # serialize the investments content onto the investment data file
    def save(self, configurationRef):
        with open(self.dataFileName, 'w') as fileHandler:
            json.dump(Configuration.serialize(
                configurationRef), fileHandler)

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

    # fetch the balance from all investment from the invetments content
    def getBalances(self):
        balanceList = []

        for investment in self.investment:
            currentBalance = None

            for balanceItem in investment.balance:
                if currentBalance is None or currentBalance.date < balanceItem.date:
                    currentBalance = balanceItem

            if currentBalance is not None and currentBalance.amount > 0:
                investmentAux = Investment()
                investmentAux.id = investment.id
                investmentAux.name = investment.name
                investmentAux.type = investment.type
                investmentAux.bank = investment.bank
                investmentAux.balance = [currentBalance]

                balanceList.append(investmentAux)

        return balanceList
