#!  /usr/local/bin/python3

################################################################################
# balance.py  -  Jul-08-2020 by aldebap
#
# balance entity class
################################################################################

import json
import uuid

#   Investment Balance class


class Balance:

    def __init__(self):
        self.id = ''
        self.date = ''
        self.amount = 0

    def to_json(self):
        return {
            "id": self.id, "date": self.date, "amount": self.amount
        }

    # unserialize a JSon as an Balance object
    @classmethod
    def unserialize(cls, ref):
        if isinstance(ref, dict):
            attributes = ref
        else:
            attributes = json.loads(ref)

        if 'id' not in attributes:
            balanceID = uuid.uuid4()
        else:
            balanceID = attributes['id']
        date = attributes['date']
        amount = attributes['amount']

        balanceAux = Balance()
        balanceAux.id = balanceID
        balanceAux.date = date
        balanceAux.amount = amount

        return balanceAux
