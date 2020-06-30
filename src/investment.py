#!  /usr/local/bin/python3

################################################################################
# investment.py  -  Jul-25-2020 by aldebap
#
# Investment class
################################################################################

import json
import sys

#   Investment Operation class


class Operation:

    def __init__(self):
        self.date = ''
        self.description = ''
        self.amount = 0

#   Investment Balance class


class Balance:

    def __init__(self):
        self.date = ''
        self.amount = 0

#   Investment Revenue class


class Revenue:

    def __init__(self):
        self.date = ''
        self.description = ''
        self.amount = 0

#   Investment class


class Investment:

    def __init__(self):
        self.name = ''
        self.type = ''
        self.bank = ''
        self.operation = []
        self.balance = []
        self.revenue = []

    def start(self):
        myConfigurationFile = ConfigurationFile(self.fileName)
        myConfiguration = myConfigurationFile.load()

        myListener = Listener(myConfiguration)
        myListener.start()

#   InvestmentDataFile class


class InvestmentDataFile:

    def __init__(self, dataFileName):
        self.dataFileName = dataFileName
        self.investment = []

    def load(self):
        with open(self.dataFileName, 'r') as fileHandler:
            fileData = json.load(fileHandler)

        for investment in fileData['investments']:
            self.investment.append(investment)

        sys.stdout.write(f'[debug] Data file loaded: {self.investment}\n')

    def save(self, configurationRef):
        with open(self.dataFileName, 'w') as fileHandler:
            json.dump(Configuration.serialize(
                configurationRef), fileHandler)
