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

from service import APIServer

#   Application's entry point


def main():
    #	parse command line interface arguments
    parser = argparse.ArgumentParser(description='Investments Application')

    parser.add_argument('-d', '--dataFileName=', dest='dataFileName', action='store', help='specify the investments data file name')
    parser.add_argument('-p', '--portNumber=', default=8080, dest='portNumber', type=int, action='store', help='specify the web server\'s port number')
    parser.add_argument('--version', dest='version', action='store_true', help='output version information and exit')

    args = parser.parse_args()

    if True == args.version:
        sys.stdout.write('Investments Application V1.0\n')
        sys.stdout.write('This is free software: you are free to change and redistribute it.\n')
        sys.stdout.write('Written by Aldebaran Perseke (github.com/aldebap)\n')
        return

    print(">>>>> Investments Application\n\n")

    # TODO: correctly check for the required data file argument
    if args.dataFileName is not None:
        if not os.path.isfile(args.dataFileName):
            sys.stdout.write('[info] Data file will be created\n')

    if args.portNumber is not None and args.portNumber <= 0:
        sys.stdout.write('[error] argument for --portNumber must be a positive number\n')
        return

    myAPIServer = APIServer.instance()

    myAPIServer.start(args.portNumber, args.dataFileName)


#   Application's entry point
if "__main__" == __name__:
    main()
