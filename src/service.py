#!  /usr/local/bin/python3

from flask import Flask
import connexion
from investment import InvestmentDataFile

################################################################################
# service.py  -  Jun-30-2020 by aldebap
#
# Service APIs class
################################################################################

#	service APIs class


class APIServer:

    _singleInstance = None

    def __init__(self):
        self.investmentDataFile = None
        self.portNumber = None
        self.flaskApp = None

    #   class method that implements the singleton pattern
    @classmethod
    def instance(cls):
        if cls._singleInstance is None:
            cls._singleInstance = cls()

        return cls._singleInstance

    #   start the web server for the API services
    def start(self, portNumber, dataFileName):
        self.investmentDataFile = InvestmentDataFile(dataFileName)
        self.portNumber = portNumber

        self.investmentDataFile.load()

        self.flaskApp = Flask(__name__)
        self.flaskApp = connexion.App(__name__, specification_dir='./')
        self.flaskApp.add_api('swagger.yml')

        self.flaskApp.run(port=self.portNumber)

    #   service to get a list of all banks
    @classmethod
    def banks(cls):
        return {"Banks": cls._singleInstance.investmentDataFile.getAllBanks()}

    #   service to get a list of all funds of a bank
    @classmethod
    def funds(cls, bank):
        return {"Funds": cls._singleInstance.investmentDataFile.getAllFunds(bank)}

    #   service to get a list of all types
    @classmethod
    def types(cls):
        return {"Types": cls._singleInstance.investmentDataFile.getAllTypes()}

    #   service to get a list with the investments
    @classmethod
    def investments(cls, startDate, endDate):
        if startDate == '_':
            startDate = None
        if endDate == '_':
            endDate = None

        return {"Investments": cls._singleInstance.investmentDataFile.getInvestments(startDate, endDate)}
