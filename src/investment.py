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

    @classmethod
    def serialize(cls, ref):
        attributes = {
            "id": ref.id, "name": ref.name, "type": ref.type, "bank": ref.bank, "operations": ref.operation, "balance": ref.balance, "revenue": ref.revenue
        }

        return json.dumps(attributes)

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

        return investmentAux

#   InvestmentDataFile class


class InvestmentDataFile:

    def __init__(self, dataFileName):
        self.dataFileName = dataFileName
        self.investment = []

    def load(self):
        with open(self.dataFileName, 'r') as fileHandler:
            fileData = json.load(fileHandler)

        for investmentAttributes in fileData['investments']:
            self.investment.append(
                Investment.unserialize(investmentAttributes))

        for investment in self.investment:
            sys.stdout.write(f'[debug] Investment loaded: {investment}\n')

    def save(self, configurationRef):
        with open(self.dataFileName, 'w') as fileHandler:
            json.dump(Configuration.serialize(
                configurationRef), fileHandler)
