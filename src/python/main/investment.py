#!  /usr/local/bin/python3

################################################################################
# investment.py  -  Jun-25-2020 by aldebap
#
# Investment class
################################################################################

import json
import uuid

from operation import Operation
from balance import Balance
from revenue import Revenue

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
        operationList = []
        balanceList = []
        revenueList = []

        for operation in self.operation:
            operationList.append(operation.to_json())

        for balance in self.balance:
            balanceList.append(balance.to_json())

        for revenue in self.revenue:
            revenueList.append(revenue.to_json())

        return {
            "id": self.id, "name": self.name, "type": self.type, "bank": self.bank, "operations": operationList, "balance": balanceList, "revenue": revenueList
        }

    # serialize an Investment object into a JSon

    @classmethod
    def serialize(cls, ref):
        # TODO: use constants for the names of all JSon fields
        attributes = {
            #"id": ref.id, "name": ref.name, "type": ref.type, "bank": ref.bank, "operations": ref.operation, "balance": ref.balance, "revenue": ref.revenue
            "name": ref.name, "type": ref.type, "bank": ref.bank, "operations": ref.operation, "balance": ref.balance, "revenue": ref.revenue
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

        operationAux = []

        if 'operations' in attributes:
            for operationItemAttributes in attributes['operations']:
                operationAux.append(Operation.unserialize(operationItemAttributes))

        investmentAux.operation = sorted(operationAux, reverse=True)

        balanceAux = []

        if 'balance' in attributes:
            for balanceItemAttributes in attributes['balance']:
                balanceAux.append(Balance.unserialize(balanceItemAttributes))

        investmentAux.balance = sorted(balanceAux, reverse=True)

        revenueAux = []

        if 'revenue' in attributes:
            for revenueItemAttributes in attributes['revenue']:
                revenueAux.append(Operation.unserialize(revenueItemAttributes))

        investmentAux.revenue = sorted(revenueAux, reverse=True)

        return investmentAux
