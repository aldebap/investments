////////////////////////////////////////////////////////////////////////////////
//  operation.js  -  Aug-02-2020 by aldebap
//
//  Operation components
////////////////////////////////////////////////////////////////////////////////

//  constants

/*  *
    * show the operation details
    */

function showOperationTableDetails(_line) {

    let investment = investments[_line - 1];

    $('#operationDetail-' + _line).empty();

    //  format the  operations details table
    let operationIndex = 1;

    investment.operations.forEach((operation) => {
        $('#operationDetail-' + _line).append('<tr><td>' + operationIndex + '</td>'
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
        + '<td><input type="text" class="form-control" id="inputNewOperationDate-' + _line + '" /></td>'
        + '<td><input type="text" class="form-control" id="inputNewOperationAmount-' + _line + '" /></td></tr>');

    $('#operationDetailButtons-' + _line).empty();
    $('#operationDetailButtons-' + _line).append('<button type="submit" class="btn btn-outline-primary" onclick="confirmNewOperation( ' + _line + ' );">Confirm</button> &nbsp;');
    $('#operationDetailButtons-' + _line).append('<button type="submit" class="btn btn-outline-secondary" onclick="showOperationTableDetails( ' + _line + ' );">Cancel</button>');
}

/*  *
    * show the input fields to allow editing an operation
    */

function showEditOperationInputFields(_line, _operationLine) {
    console.log('[debug] edit operation options menu: ' + _line + ' --> ' + _operationLine);
}

/*  *
    * show the delete operation modal
    */

function showDeleteOperationModal(_line, _operationLine) {

    console.log('[debug] showDeleteOperationModal(): ' + _line + ' --> ' + _operationLine);

    //  set the investmentId and the operationId to be deleted
    let investment = investments[_line - 1];
    let investmentId = $('#inputInvestmentId-' + _line).val();
    let operation = investment.operations[_operationLine - 1];
    let operationId = operation.id;

    $('#deleteConfimationMessage').empty();
    $('#deleteConfimationMessage').append('<p>Delete the operation on ' + formatInvDate(operation.date) + ' of $' + to_currency(operation.amount) + '</p>');
    $('#formDeleteInvestment').empty();
    $('#formDeleteInvestment').append('<input type="hidden" id="deleteInvestmentId" value="' + investmentId + '" />');
    $('#formDeleteInvestment').append('<input type="hidden" id="deleteOperationId" value="' + operationId + '" />');
    $('#formDeleteInvestment').append('<button type="button" class="btn btn-outline-primary" onclick="deleteOperation();">Confirm</button> &nbsp;');
    $('#formDeleteInvestment').append('<button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>');

    //  show the new Investment modal
    $('#confirmExclusion').modal({
        show: true
    });
}

/*  *
    * Confirm adding a new operation
    */

function confirmNewOperation(_line) {

    let investment = investments[_line - 1];
    let operationDate = $('#inputNewOperationDate-' + _line).val();
    let operationAmount = Number($('#inputNewOperationAmount-' + _line).val());
    let payload = {};

    if (0 < operationDate.length) {
        payload['date'] = operationDate;
    }
    if (operationAmount != NaN) {
        payload['amount'] = operationAmount;
    }

    //  if all field are validated, add the operation record
    let requestURL = '/investment/v1/investments/' + investment.id + '/operations';

    //  show the  spinner while loading the data from the API server
    $('#loadingSpinner').empty();
    $('#loadingSpinner').append('<div class="spinner-border text-ligth" role="status"><span class="sr-only">Updating ...</span></div>');

    console.log('[debug] insert payload: ' + JSON.stringify(payload));

    $.ajax({
        url: requestURL,
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(payload),
        processData: false,
        error: function () {

            $('#toastContainer').empty();
            $('#toastContainer').append('<div class="alert alert-danger" role="alert">'
                + 'Error trying to add operation to investment data'
                + '<button type="button" class="ml-2 mb-1 close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                + '</div>');

            console.log('[debug] Error attempting to add operation');

            showOperationTableDetails(_line);
            //  hide the spinner and the modal
            $('#loadingSpinner').empty();
        },
        success: (_result) => {

            //  TODO: the same period filter needs to be aplied to the result investment
            investments[_line - 1] = _result;
            showOperationTableDetails(_line);
            //  hide the spinner and the modal
            $('#loadingSpinner').empty();
        }
    });

    $('#operationDetailButtons-' + _line).empty();
}

/*  *
    * delete operation item
    */

function deleteOperation() {

    let investmentId = $('#deleteInvestmentId').val();
    let operationId = $('#deleteOperationId').val();
    let requestURL = '/investment/v1/investments';

    console.log('[debug] delete operation: ' + investmentId + ' --> ' + operationId);
}
