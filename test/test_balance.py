#!	/usr/bin/python3

################################################################################
#	test_balance.py  -  Jul-08-2020 by aldebap
#
#	Unit tests for the Balance entity class
################################################################################

from io import StringIO
from unittest.mock import patch
import unittest
import os
import sys
import tempfile

from balance import Balance

#   Unit tests class


class test_balance(unittest.TestCase):

    #   Balance class

    #   test constructor - 01. check the default behavior
    def test_Balance_defaultConstructor(self):

        testBalance = Balance()

        self.assertEqual(testBalance.id, '')
        self.assertEqual(testBalance.date, '')
        self.assertEqual(testBalance.amount, 0)
