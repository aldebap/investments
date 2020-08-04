#!  /usr/local/bin/python3

from flask import Flask, abort, send_from_directory
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
        self.webAppRoot = '../../webApp'
        self.flaskApp.add_url_rule('/', 'index', self._webappIndex, methods=['GET'])
        self.flaskApp.add_url_rule('/<path:fileName>', 'staticFiles', self._serveStaticFile, methods=['GET'])

        self.flaskApp.run(port=self.portNumber,debug=True)

    #   service to serve the webApp index
    def _webappIndex(self):
        return self._serveStaticFile('index.html')

    #   service to serve static files
    def _serveStaticFile(self, fileName):
        return send_from_directory(self.webAppRoot, fileName)

    #   service to insert a new investment
    @classmethod
    def insertNewInvestment(cls, investmentData):

        if 'bank' not in investmentData or 0 == len(investmentData['bank']):
            abort(400, 'bank attribute is required')
        if 'type' not in investmentData or 0 == len(investmentData['type']):
            abort(400, 'type attribute is required')
        if 'name' not in investmentData or 0 == len(investmentData['name']):
            abort(400, 'name attribute is required')

        #   in the payload from POST method, operations and balance objects are not arrays so, a mapping to server's internal representation is required
        investmentAux = {
            'bank': investmentData['bank']
            , 'type':investmentData['type']
            , 'name':investmentData['name']
            , 'operations': [ investmentData['operation'] ]
            , 'balance': [ investmentData['balance'] ]
        }

        return cls._singleInstance.investmentDataFile.insertNewInvestment(investmentAux), 201

    #   service to get a list with the investments
    @classmethod
    def investments(cls, startDate, endDate, active):
        #   query parameters not informed are defaulted to '_' so, change it to None for the getInvestment() function
        if startDate == '_':
            startDate = None
        if endDate == '_':
            endDate = None

        return {'Investments': cls._singleInstance.investmentDataFile.getInvestments(None, startDate, endDate, active)}

    #   service to get an investment given it's ID
    @classmethod
    def investmentByID(cls, investmentId, startDate, endDate, active):
        #   query parameters not informed are defaulted to '_' so, change it to None for the getInvestment() function
        if startDate == '_':
            startDate = None
        if endDate == '_':
            endDate = None

        return {'Investments': cls._singleInstance.investmentDataFile.getInvestments(investmentId, startDate, endDate, active)}

    #   service to patch an investment given it's ID
    @classmethod
    def patchInvestment(cls, investmentId, investmentData):
        return cls._singleInstance.investmentDataFile.patchInvestment(investmentId, investmentData)

    #   service to delete an investment given it's ID
    @classmethod
    def deleteInvestment(cls, investmentId):
        result = cls._singleInstance.investmentDataFile.deleteInvestment(investmentId)

        if 'id' not in result:
            abort(404, 'investmentId not found')

        return result, 204

    #   service to get a list of all banks
    @classmethod
    def banks(cls):
        return {'Banks': cls._singleInstance.investmentDataFile.getAllBanks()}

    #   service to get a list of all funds of a bank
    @classmethod
    def funds(cls, bank):
        return {'Funds': cls._singleInstance.investmentDataFile.getAllFunds(bank)}

    #   service to get a list of all types
    @classmethod
    def types(cls):
        return {'Types': cls._singleInstance.investmentDataFile.getAllTypes()}

    #   service to insert a new operation to an investment
    @classmethod
    def insertNewOperation(cls, investmentId, operationData):

        if 'date' not in operationData or 0 == len(operationData['date']):
            abort(400, 'date attribute is required')

        if 'amount' not in operationData or 0 == operationData['amount']:
            abort(400, 'amount attribute is required')

        result = cls._singleInstance.investmentDataFile.insertNewOperation(investmentId, operationData)

        if 'id' not in result:
            abort(404, 'investmentId not found')

        return result, 201

    #   service to insert a new revenue to an investment
    @classmethod
    def insertNewRevenue(cls, investmentId, revenueData):

        if 'date' not in revenueData or 0 == len(revenueData['date']):
            abort(400, 'date attribute is required')

        if 'amount' not in revenueData or 0 == revenueData['amount']:
            abort(400, 'amount attribute is required')

        result = cls._singleInstance.investmentDataFile.insertNewRevenue(investmentId, revenueData)

        if 'id' not in result:
            abort(404, 'investmentId not found')

        return result, 201

    #   service to insert a new balance to an investment
    @classmethod
    def insertNewBalance(cls, investmentId, balanceData):

        if 'date' not in balanceData or 0 == len(balanceData['date']):
            abort(400, 'date attribute is required')

        if 'amount' not in balanceData or 0 == balanceData['amount']:
            abort(400, 'amount attribute is required')

        result = cls._singleInstance.investmentDataFile.insertNewBalance(investmentId, balanceData)

        if 'id' not in result:
            abort(404, 'investmentId not found')

        return result, 201
