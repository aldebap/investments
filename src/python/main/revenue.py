#!  /usr/local/bin/python3

################################################################################
# revenue.py  -  Jul-08-2020 by aldebap
#
# revenue entity class
################################################################################

import json
import sys
import uuid

#   Investment Revenue entity class


class Revenue:

    def __init__(self):
        self.id = ''
        self.date = ''
        self.description = ''
        self.amount = 0

    def __eq__(self, ref):
        return self.date == ref.date

    def __lt__(self, ref):
        return self.date < ref.date

    def to_json(self):
        return {
            "id": self.id, "date": self.date, "description": self.description, "amount": self.amount
        }

    # serialize a JSon as an Balance object
    @classmethod
    def serialize(cls, ref):
        return {
            #"id": self.id, "date": self.date, "amount": self.amount
            "date": ref.date, "description": ref.description, "amount": ref.amount
        }

    # unserialize a JSon as a Revenue object
    @classmethod
    def unserialize(cls, ref):
        if isinstance(ref, dict):
            attributes = ref
        else:
            attributes = json.loads(ref)

        if 'id' not in attributes:
            revenueID = uuid.uuid4()
        else:
            revenueID = attributes['id']
        date = attributes['date']
        if 'description' not in attributes:
            description = ''
        else:
            description = attributes['description']
        amount = attributes['amount']

        revenueAux = Revenue()
        revenueAux.id = revenueID
        revenueAux.date = date
        revenueAux.description = description
        revenueAux.amount = amount

        return revenueAux
