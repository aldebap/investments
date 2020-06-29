#!  /usr/local/bin/python3

################################################################################
# main.py  -  Jul-25-2020 by aldebap
#
# Investments Application entry point
################################################################################

import argparse
import os.path
import sys

from investment import InvestmentDataFile

#   Application's class


class InvestmentServer:

    def __init__(self, dataFileName):
        self.dataFileName = dataFileName

    def start(self):
        myInvestmentDataFile = InvestmentDataFile(self.dataFileName)
        myInvestmentDataFile.load()

#   Application's entry point


def main():
    #	parse command line interface arguments
    parser = argparse.ArgumentParser(description='Investments Application')

    parser.add_argument('-d', '--dataFileName=', dest='dataFileName',
                        action='store', required=True, help='specify the investments data file name')
    parser.add_argument('--version', dest='version', action='store_true',
                        help='output version information and exit')

    args = parser.parse_args()

    if True == args.version:
        sys.stdout.write('Investment Application V1.0')
        sys.stdout.write(
            'This is free software: you are free to change and redistribute it.')
        sys.stdout.write('Written by Aldebaran Perseke (github.com/aldebap)')
        return

    print(">>>>> Investments Application\n\n")

    if args.dataFileName is not None:
        if os.path.isfile(args.dataFileName):
            print("[info] Data file will be created\n")

    myInvestmentServer = InvestmentServer(args.dataFileName)
    myInvestmentServer.start()


#   Application's entry point
if "__main__" == __name__:
    main()
