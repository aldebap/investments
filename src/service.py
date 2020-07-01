#!  /usr/local/bin/python3

from flask import Flask
from investment import InvestmentDataFile

################################################################################
# service.py  -  Jun-30-2020 by aldebap
#
# Service APIs class
################################################################################

#	service APIs class


class APIServer:

    def __init__(self, context, portNumber):
        self.context = context
        self.portNumber = portNumber
        self.flaskApp = None

    def start(self):
        self.flaskApp = Flask(__name__)

        self.flaskApp.add_url_rule(
            f'/{self.context}/v1/banks', 'GET banks', self. banks)

        self.flaskApp.run()

    def banks(self):
        return '{ "Banks": [] }'
