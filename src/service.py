#!  /usr/local/bin/python3

from flask import Flask
#import connexion
from investment import InvestmentDataFile

################################################################################
# service.py  -  Jun-30-2020 by aldebap
#
# Service APIs class
################################################################################

#	service APIs class


class APIServer:

    def __init__(self, context, portNumber, dataFileName):
        self.investmentDataFile = InvestmentDataFile(dataFileName)
        self.context = context
        self.portNumber = portNumber
        self.flaskApp = None

    def start(self):
        self.investmentDataFile.load()

        self.flaskApp = Flask(__name__)
        #self.flaskApp = connexion.App(__name__, specification_dir='./')
        # self.flaskApp.add_api('swagger.yml')

        self.flaskApp.add_url_rule(
            f'/{self.context}/v1/banks', 'GET banks', self. banks)

        self.flaskApp.run(port=self.portNumber)

    def banks(self):
        bankList = self.investmentDataFile.getAllBanks()

        return '{ "Banks": ' + f'{bankList}' + ' }'
