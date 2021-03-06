////////////////////////////////////////////////////////////////////////////////
//  investmentsDetails.js  -  Sep-28-2020 by aldebap
//
//  Investments details
////////////////////////////////////////////////////////////////////////////////

//  constants

//  globals

let fullDetailsInvestments = [];
let shownInvestment;
let editingOperationLine = 0;
let deletingOperationLine = 0;

/*  *
    * load the full details investment data
    */

function loadFullDetailsInvestment(_investment) {

    //  check if the investment was loaded already
    fullDetailsInvestments.forEach((investment) => {
        if (investment.id == _investment.id) {
            showInvestmentTableDetails(investment);
            return;
        }
    });

    //  load the full details investment data
    showSpinner();
    getInvestmentByID(_investment.id, showInvestmentTableDetails);
}

/*  *
    * show the investment details
    */

function showInvestmentTableDetails(_investment) {

    //  add the full details to the array if it was just loaded
    var found = false;

    fullDetailsInvestments.forEach((investment) => {
        if (investment.id == _investment.id) {
            found = true;
        }
    });

    if (!found) {
        fullDetailsInvestments.push(_investment);
    }

    //  get the line of investment in funneld array
    let line = 1;
    let lineAux = NaN;

    funnelledInvestments.forEach((investment) => {
        if (investment.id == _investment.id) {
            lineAux = line;
        }
        line++;
    });

    if (lineAux == NaN) {

        console.log('[debug] showInvestmentTableDetails: something went wrong here');
        return;
    }

    shownInvestment = _investment;

    //  format the investment details form
    $('#containerRow-' + lineAux).empty();
    $('#containerRow-' + lineAux).append('<div class="card"><div class="card-header">Investment details</div><div class="card-body">'
        + '<table class="table"><tbody>'
        + '<tr><th>Bank:</th><td>' + _investment.bank + '</td></tr>'
        + '<tr><th>Type:</th><td>' + _investment.type + '</td></tr>'
        + '<tr><th>Name:</th><td>' + _investment.name + '</td></tr>'
        + '</tbody></table>'
        + '</div></div>');

    $('#containerRow-' + lineAux).append('<div class="card"><div class="card-header">Operations</div><div class="card-body"><form id="formManageOperations-' + lineAux + '">'
        + '<table class="table">'
        + '<thead><tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">Amount</th></tr></thead>'
        + '<tbody id="operationDetail-' + lineAux + '"></tbody>'
        + '</table>'
        + '<div class="float-right" id="operationDetailButtons-' + lineAux + '"></div>'
        + '</form></div></div>');

    $('#containerRow-' + lineAux).append('<div class="card"><div class="card-header">Revenue</div><div class="card-body"><form id="formManageRevenue-' + lineAux + '">'
        + '<table class="table">'
        + '<thead><tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">Amount</th></tr></thead>'
        + '<tbody id="revenueDetail-' + lineAux + '"></tbody>'
        + '</table>'
        + '<div class="float-right" id="revenueDetailButtons-' + lineAux + '"></div>'
        + '</form></div></div>');

    $('#containerRow-' + lineAux).append('<div class="card"><div class="card-header">Balance</div><div class="card-body"><form id="formManageBalance-' + lineAux + '">'
        + '<table class="table">'
        + '<thead><tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">Amount</th></tr></thead>'
        + '<tbody id="balanceDetail-' + lineAux + '"></tbody>'
        + '</table>'
        + '<div class="float-right" id="balanceDetailButtons-' + lineAux + '"></div>'
        + '</form></div></div>');

    showOperationTableDetails(lineAux);
    //    showRevenueTableDetails(_line, _investment);
    //   showBalanceTableDetails(_line, _investment);

    hideSpinner();
}

/*  *
    * show the operation details
    */

function showOperationTableDetails(_line) {

    $('#operationDetail-' + _line).empty();

    //  format the  operations details table
    let operationIndex = 1;

    shownInvestment.operations.forEach((operation) => {
        $('#operationDetail-' + _line).append('<tr id="operationDetail-' + _line + '-' + operationIndex + '"><td>' + operationIndex + '</td>'
            + '<td>' + formatInvDate(operation.date) + '</td>'
            + '<td>' + to_currency(operation.amount)
            + '<a class="float-right dropdown-toggle" href="#" role="button" id="operationThreeDotsButton-' + _line + '" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
            + '<img class="text-primary" src="img/threeDotsVertical.svg" /></a>'
            + '<div class="dropdown-menu" id="operationOptionsMenu-' + _line + '" aria-labelledby="operationThreeDotsButton-' + _line + '">'
            + '<button class="dropdown-item" type="button" onclick="showEditOperationInputFields( ' + _line + ', ' + operationIndex + ' );">Edit</button>'
            + '<button class="dropdown-item" type="button" onclick="showDeleteOperationModal( ' + _line + ', ' + operationIndex + ' );">Delete</button></div>'
            + '</td></tr>');

        operationIndex++;
    });

    $('#operationDetailButtons-' + _line).empty();
    $('#operationDetailButtons-' + _line).append('<a onclick="showNewOperationInputFields( ' + _line + ' );"><img src="img/addButton.svg" /></a>');
}

/*  *
    * show the input fields to allow adding a new operation
    */

function showNewOperationInputFields(_line) {

    $('#operationDetail-' + _line).append('<tr><td>New</td>'
        + '<td><input type="text" class="form-control mr-sm-2" data-provide="datepicker" aria-label="operation date" id="inputNewOperationDate-' + _line + '" /></td>'
        + '<td><input type="text" class="form-control" id="inputNewOperationAmount-' + _line + '" /></td></tr>');

    //$('.datepicker').datepicker({ format: 'dd/mm/yyyy' });

    $('#operationDetailButtons-' + _line).empty();
    $('#operationDetailButtons-' + _line).append('<button type="submit" class="btn btn-outline-primary" onclick="confirmNewOperation( ' + _line + ' );">Confirm</button> &nbsp;');
    $('#operationDetailButtons-' + _line).append('<button type="submit" class="btn btn-outline-secondary" onclick="showOperationTableDetails( ' + _line + ' );">Cancel</button>');
}

/*  *
    * Confirm adding a new operation
    */

function confirmNewOperation(_line) {

    let operationDate = $('#inputNewOperationDate-' + _line).val();
    let operationAmount = Number($('#inputNewOperationAmount-' + _line).val());

    //  check  if all required fields were filled
    if (0 == operationDate.length) {
        showAlertMessage(ALERT_ERROR, 'operation date is a required field');
        return;
    }
    if (NaN == operationAmount || 0 >= operationAmount) {
        showAlertMessage(ALERT_ERROR, 'operation amount is a required number bigger than zero');
        return;
    }

    //  set the payload data
    let payload = {};

    if (0 < operationDate.length) {
        payload['date'] = unformatDate(operationDate);
    }
    if (operationAmount != NaN) {
        payload['amount'] = operationAmount;
    }

    //  if all field are validated, add the operation record
    $('#operationDetailButtons-' + _line).empty();

    showSpinner();
    addNewOperation(shownInvestment.id, payload, newOperationCallback);
}

/*  *
    * New operation callback function
    */

function newOperationCallback(_message, _resultOperation) {

    if (0 == _message.length) {

        showAlertMessage(ALERT_INFO, 'New operation sucessfully added');

        console.log('[debug] operation successfully inserted : ' + JSON.stringify(_resultOperation));
        //  add the new operation to the shown investment and to the full details array
        shownInvestment.operations.push(_resultOperation);

        let index = 0;
        fullDetailsInvestments.forEach((investment) => {
            if (investment.id == shownInvestment.id) {
                console.log('[debug] full details updated : ' + index + ' --> ' + shownInvestment.id);
                fullDetailsInvestments[index] = shownInvestment;
            }
            index++;
        });

        showInvestmentTableDetails(shownInvestment);
    } else {

        showAlertMessage(ALERT_ERROR, _message);
    }
    hideSpinner();
}

/*  *
    * show the input fields to allow editing an operation
    */

function showEditOperationInputFields(_line, _operationLine) {

    console.log('[debug] show edit operation fields: ' + _line + ' --> ' + _operationLine);

    //  get the investmentId and the operationId to be edited
    //let investment = investments[_line - 1];
    //let investmentId = $('#inputInvestmentId-' + _line).val();
    let investmentId = shownInvestment.id;
    let operation = shownInvestment.operations[_operationLine - 1];
    let operationId = operation.id;

    //  TODO: operation amount should not be formatted, because of the comma separator
    $('#operationDetail-' + _line + '-' + _operationLine).empty();
    $('#operationDetail-' + _line + '-' + _operationLine).append('<td>' + _operationLine + '</td>'
        // TODO: need to difine how to format these two fields for edition
        + '<td><input type="text" class="form-control mr-sm-2" data-provide="datepicker" aria-label="operation date" id="inputEditOperationDate-' + _line + '" value="' + formatInvDate(operation.date) + '" /></td>'
        + '<td><input type="text" class="form-control" id="inputEditOperationAmount-' + _line + '" value="' + to_currency(operation.amount) + '"/></td>');

    //$('.datepicker').datepicker({ format: 'dd/mm/yyyy' });

    //  TODO: wonder about a better place to put these buttons
    $('#operationDetailButtons-' + _line).empty();
    $('#operationDetailButtons-' + _line).append('<input type="hidden" id="updateInvestmentId" value="' + investmentId + '" />');
    $('#operationDetailButtons-' + _line).append('<input type="hidden" id="updateOperationId" value="' + operationId + '" />');
    $('#operationDetailButtons-' + _line).append('<button type="submit" class="btn btn-outline-primary" onclick="confirmEditOperation(' + _line + ', ' + _operationLine + ');">Confirm</button> &nbsp;');
    $('#operationDetailButtons-' + _line).append('<button type="submit" class="btn btn-outline-secondary" onclick="showOperationTableDetails( ' + _line + ' );">Cancel</button>');
}

/*  *
    * Confirm editing an operation
    */

function confirmEditOperation(_line, _operationLine) {

    let operationDate = $('#inputEditOperationDate-' + _line).val();
    let operationAmount = Number($('#inputEditOperationAmount-' + _line).val());

    //  TODO: check the bug where day and month are being swapped during edit operation !

    //  check  if all required fields were filled
    if (0 == operationDate.length) {
        showAlertMessage(ALERT_ERROR, 'operation date is a required field');
        return;
    }
    if (NaN == operationAmount || 0 >= operationAmount) {
        showAlertMessage(ALERT_ERROR, 'operation amount is a required number bigger than zero');
        return;
    }

    //  get the investmentId and the operationId to be edited
    let investmentId = shownInvestment.id;
    let operation = shownInvestment.operations[_operationLine - 1];
    let operationId = operation.id;

    //  set the payload data with the fields that were changed
    let payload = {};

    if (operationDate != operation.date) {
        payload['date'] = unformatDate(operationDate);
    }
    if (operationAmount != operation.amount) {
        payload['amount'] = operationAmount;
    }

    //  if any field was changed, patch the operation record
    if (0 < Object.keys(payload).length) {
        showSpinner();
        patchOperation(investmentId, operationId, payload, patchOperationCallback);
    }
}

/*  *
    * Patch operation callback function
    */

function patchOperationCallback(message) {

    if (0 == message.length) {

        showAlertMessage(ALERT_INFO, 'Operation sucessfully patched');

        //  TODO: need to edit the operation to the  full details array
        showInvestmentTableDetails(shownInvestment);
    } else {

        showAlertMessage(ALERT_ERROR, message);
    }
    hideSpinner();
}

/*  *
    * show the delete operation modal
    */

function showDeleteOperationModal(_line, _operationLine) {

    console.log('[debug] showDeleteOperationModal(): ' + _line + ' --> ' + _operationLine);

    //  set the investmentId and the operationId to be deleted
    //let investment = investments[_line - 1];
    //let investmentId = $('#inputInvestmentId-' + _line).val();
    //let operation = investment.operations[_operationLine - 1];
    //let operationId = operation.id;
    let investmentId = shownInvestment.id;
    let operation = shownInvestment.operations[_operationLine - 1];
    let operationId = operation.id;

    $('#deleteConfimationMessage').empty();
    $('#deleteConfimationMessage').append('<p>Delete the $' + to_currency(operation.amount) + ' operation on ' + formatInvDate(operation.date) + ' ?</p>');
    $('#formDeleteInvestment').empty();
    $('#formDeleteInvestment').append('<input type="hidden" id="deleteInvestmentId" value="' + investmentId + '" />');
    $('#formDeleteInvestment').append('<input type="hidden" id="deleteOperationId" value="' + operationId + '" />');
    $('#formDeleteInvestment').append('<button type="button" class="btn btn-outline-primary" onclick="confirmDeleteOperation(' + _line + ', ' + _operationLine + ');">Confirm</button> &nbsp;');
    $('#formDeleteInvestment').append('<button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>');

    //  show the new Investment modal
    $('#confirmExclusion').modal({
        show: true
    });
}

/*  *
    * Confirm delete an operation
    */

function confirmDeleteOperation(_line, _operationLine) {

    let investmentId = shownInvestment.id;
    let operation = shownInvestment.operations[_operationLine - 1];
    let operationId = operation.id;

    deletingOperationLine = _operationLine;

    showSpinner();
    deleteOperation(investmentId, operationId, deleteOperationCallback);

    $('#confirmExclusion').modal('hide');
}

/*  *
    * Delete operation callback function
    */

function deleteOperationCallback(message) {

    if (0 == message.length) {

        showAlertMessage(ALERT_INFO, 'Operation sucessfully deleted');

        //  TODO: need to delete the operation to from full details array
        showInvestmentTableDetails(shownInvestment);
    } else {

        showAlertMessage(ALERT_ERROR, message);
    }
    hideSpinner();
}
