#!  ../flask/bin/python3
# #!  /usr/local/bin/python3

################################################################################
# main.py  -  Jun-25-2020 by aldebap
#
# Investments Application entry point
################################################################################

import argparse
import os.path
import sys

from investment import InvestmentDataFile
from service import APIServer

#   Application's class


class InvestmentServer:

    def __init__(self, dataFileName):
        self.dataFileName = dataFileName
        self.APIServer = APIServer('investment', 8080)
        # TODO: use a constant to set the context name
        # TODO: use an argument to set the port number

    def start(self):
        myInvestmentDataFile = InvestmentDataFile(self.dataFileName)
        myInvestmentDataFile.load()

        self.APIServer.start()

#   Application's entry point


def main():
    #	parse command line interface arguments
    parser = argparse.ArgumentParser(description='Investments Application')

    parser.add_argument('-d', '--dataFileName=', dest='dataFileName',
                        action='store', help='specify the investments data file name')
    parser.add_argument('--version', dest='version', action='store_true',
                        help='output version information and exit')

    args = parser.parse_args()

    if True == args.version:
        sys.stdout.write('Investments Application V1.0')
        sys.stdout.write(
            'This is free software: you are free to change and redistribute it.')
        sys.stdout.write('Written by Aldebaran Perseke (github.com/aldebap)')
        return

    print(">>>>> Investments Application\n\n")

    if args.dataFileName is not None:
        if not os.path.isfile(args.dataFileName):
            sys.stdout.write('[info] Data file will be created\n')

    myInvestmentServer = InvestmentServer(args.dataFileName)
    myInvestmentServer.start()


#   Application's entry point
if "__main__" == __name__:
    main()
