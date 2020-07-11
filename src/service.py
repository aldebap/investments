#!  /usr/local/bin/python3

from flask import Flask, send_from_directory
import connexion

from investmentData import InvestmentDataFile

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

        #   settings for the webApp static content
        self.webAppRoot = '../webApp'
        self.flaskApp.add_url_rule('/', 'index', self._goto_index, methods=['GET'])
        self.flaskApp.add_url_rule('/<path:fileName>', 'staticFiles', self._serve_page, methods=['GET'])

        self.flaskApp.run(port=self.portNumber,debug=True)

    def _goto_index(self):
        return self._serve_page('index.html')

    def _serve_page(self, fileName):
        return send_from_directory(self.webAppRoot, fileName)

    #   service to get a list of all banks
    @classmethod
    def staticFile(cls, path):
        return cls._singleInstance.flaskApp.send_static_file(path)

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
    def investments(cls, startDate, endDate, active):
        #   query parameters not informed are defaulted to '_' so, change it to None for the getInvestment() function
        if startDate == '_':
            startDate = None
        if endDate == '_':
            endDate = None

        return {"Investments": cls._singleInstance.investmentDataFile.getInvestments(None, startDate, endDate, active)}

    #   service to get an investment given it's ID
    @classmethod
    def investmentByID(cls, investmentId, startDate, endDate, active):
        #   query parameters not informed are defaulted to '_' so, change it to None for the getInvestment() function
        if startDate == '_':
            startDate = None
        if endDate == '_':
            endDate = None

        return {"Investments": cls._singleInstance.investmentDataFile.getInvestments(investmentId, startDate, endDate, active)}
