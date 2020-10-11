#!  /usr/local/bin/python3

################################################################################
# investment.py  -  Jun-25-2020 by aldebap
#
# Investment class
################################################################################

import json
import uuid

from operation import Operation
from revenue import Revenue
from balance import Balance

#   Investment class


class Investment:

    def __init__(self):
        self.id = ''
        self.name = ''
        self.type = ''
        self.bank = ''
        self.operation = []
        self.revenue = []
        self.balance = []

    def __str__(self):
        return f'{self.id}: {self.name} / {self.type} @ {self.bank} - balance: {self.balance}'

    # TODO: fix the redundancy of having two methods to do the exact same thing
    def to_json(self):
        operationList = []
        revenueList = []
        balanceList = []

        for operation in self.operation:
            operationList.append(operation.to_json())

        for revenue in self.revenue:
            revenueList.append(revenue.to_json())

        for balance in self.balance:
            balanceList.append(balance.to_json())

        return {
            "id": self.id, "name": self.name, "type": self.type, "bank": self.bank, "operations": operationList, "revenue": revenueList, "balance": balanceList
        }

    # serialize an Investment object into a JSon

    @classmethod
    def serialize(cls, ref):
        operationList = []
        revenueList = []
        balanceList = []

        for operation in ref.operation:
            operationList.append(Operation.serialize(operation))

        for revenue in ref.revenue:
            revenueList.append(Revenue.serialize(revenue))

        for balance in ref.balance:
            balanceList.append(Balance.serialize(balance))

        # TODO: use constants for the names of all JSon fields
        #return json.dumps(attributes)
        return  {
            #"id": ref.id, "name": ref.name, "type": ref.type, "bank": ref.bank, "operations": ref.operation, "balance": ref.balance, "revenue": ref.revenue
            "name": ref.name, "type": ref.type, "bank": ref.bank, "operations": operationList, "revenue": revenueList, "balance": balanceList
        }

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

        operationAux = []

        if 'operations' in attributes:
            for operationItemAttributes in attributes['operations']:
                operationAux.append(Operation.unserialize(operationItemAttributes))

        investmentAux.operation = sorted(operationAux, reverse=True)

        revenueAux = []

        if 'revenue' in attributes:
            for revenueItemAttributes in attributes['revenue']:
                revenueAux.append(Operation.unserialize(revenueItemAttributes))

        investmentAux.revenue = sorted(revenueAux, reverse=True)

        balanceAux = []

        if 'balance' in attributes:
            for balanceItemAttributes in attributes['balance']:
                balanceAux.append(Balance.unserialize(balanceItemAttributes))

        investmentAux.balance = sorted(balanceAux, reverse=True)

        return investmentAux

    # add a new operation to the investment data
    def addOperation(self, newOperation):
        operationAux = Operation.unserialize(newOperation)

        self.operation.append(operationAux)
        self.operation = sorted(self.operation, reverse=True)

        return operationAux

    # add a new revenue to the investment data
    def addRevenue(self, newRevenue):
        self.revenue.append(Revenue.unserialize(newRevenue))

        self.revenue = sorted(self.revenue, reverse=True)

    # add a new balance to the investment data
    def addBalance(self, newBalance):
        self.balance.append(Balance.unserialize(newBalance))

        self.balance = sorted(self.balance, reverse=True)
