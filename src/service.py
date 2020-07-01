#!  /usr/local/bin/python3

from investment import InvestmentDataFile

################################################################################
# service.py  -  Jun-30-2020 by aldebap
#
# Service APIs class
################################################################################

#	service APIs class


class APIServer:

    def __init__(self, portNumber):
        self.portNumber = portNumber

    def start(self):
        myListener = Listener(myConfiguration)
        myListener.start()
