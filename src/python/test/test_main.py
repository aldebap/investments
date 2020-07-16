#!	/usr/bin/python3

################################################################################
#	test_main.py  -  Jun-29-2020 by aldebap
#
#	Unit tests for the entry point of the Investments Application
################################################################################

from io import StringIO
from unittest.mock import patch
import unittest
import os
import sys
import tempfile

import main

#   Unit tests class


class test_main(unittest.TestCase):

    #   main.main() function tests

    #   test main - 01. check for no required options
    def test_main_withoutOptions(self):

        with patch('sys.stderr', new=StringIO()) as mockStderr:
            with self.assertRaises(SystemExit) as exit:
                sys.argv = ['main']
                main.main()

        self.assertEqual(exit.exception.code, 2)
        self.assertTrue(-1 != mockStderr.getvalue().find(
            'error: the following arguments are required: -d/--dataFileName='))

    #   test main - 02. check for version options
    def test_main_versionOption(self):

        with patch('sys.stdout', new=StringIO()) as mockStdout:
            sys.argv = ['main', '--version']
            main.main()

        self.assertTrue(-1 !=
                        mockStdout.getvalue().find('Written by Aldebaran Perseke'))

    #   test main - 03. check for invalid option only
    def test_main_invalidOptionOnly(self):

        with patch('sys.stderr', new=StringIO()) as mockStderr:
            with self.assertRaises(SystemExit) as exit:
                sys.argv = ['main', '-x']
                main.main()

        self.assertEqual(exit.exception.code, 2)
        self.assertTrue(-1 !=
                        mockStderr.getvalue().find('unrecognized arguments: -x'))

    #   test main - 04. check for invalid option
    def test_main_invalidOption(self):

        with patch('sys.stderr', new=StringIO()) as mockStderr:
            with self.assertRaises(SystemExit) as exit:
                sys.argv = ['main', '--version', '-x']
                main.main()

        self.assertEqual(exit.exception.code, 2)
        self.assertTrue(-1 !=
                        mockStderr.getvalue().find('unrecognized arguments: -x'))

    #   test main - 05. check for file not found
    def test_main_invalidFileName(self):

        #   remember, a temporary file is removed after it's closed
        invalidFile = tempfile.NamedTemporaryFile()
        invalidFileName = invalidFile.name
        invalidFile.write(b'{\n\tinvestments: []\n}')
        invalidFile.close()

        with patch('sys.stdout', new=StringIO()) as mockStdout:
            sys.argv = ['main', f"--dataFileName={invalidFileName}"]
            main.main()

        self.assertTrue(-1 !=
                        mockStdout.getvalue().find('Data file will be created'))

    #   test main - 06. check for single file name
    def test_main_singleFileName(self):

        contentFile = tempfile.NamedTemporaryFile(delete=False)
        contentFile.write(
            b'{\n\t"investments": [ { "name": "Master Renda Fixa", "type": "Renda Fixa", "bank": "Santander", "balance": [ { "date": "20180501", "amount": 3002.16 } ] } ]\n}')
        contentFile.close()

        with patch('sys.stdout', new=StringIO()) as mockStdout:
            sys.argv = ['main', f"-d={contentFile.name}"]
            main.main()

        self.assertTrue('abc;ghi;jkl\nmno;stu;vwx\n' == mockStdout.getvalue())
        os.remove(contentFile.name)


#	entry point


if __name__ == '__main__':
    unittest.main()
