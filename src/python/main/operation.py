#!  /usr/local/bin/python3

################################################################################
# operation.py  -  Jul-08-2020 by aldebap
#
# Operation entity class
################################################################################

import json
import uuid

#   Investment Operation entity class


class Operation:

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

    # unserialize a JSon as an Operation object
    @classmethod
    def unserialize(cls, ref):
        if isinstance(ref, dict):
            attributes = ref
        else:
            attributes = json.loads(ref)

        if 'id' not in attributes:
            operationID = uuid.uuid4()
        else:
            operationID = attributes['id']
        date = attributes['date']
        if 'description' not in attributes:
            description = ''
        else:
            description = attributes['description']
        amount = attributes['amount']

        operationAux = Operation()
        operationAux.id = operationID
        operationAux.date = date
        operationAux.description = description
        operationAux.amount = amount

        return operationAux
