////////////////////////////////////////////////////////////////////////////////
//  operation.js  -  Aug-02-2020 by aldebap
//
//  Operation components
////////////////////////////////////////////////////////////////////////////////

//  constants

const operationsRoute = '/operations';

/*  *
    * Add a new operation
    */

function addNewOperation(_investmentId, _payload, newOperationCallbackFunc) {

    //  if all field are validated, add the operation record
    let requestURL = investmentsRoute + '/' + _investmentId + operationsRoute;

    console.log('[debug] insert payload: ' + JSON.stringify(_payload));

    $.ajax({
        url: requestURL,
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(_payload),
        processData: false,
        error: function () {

            console.log('[debug] Error attempting to add operation');
            newOperationCallbackFunc('Error trying to add operation data');
        },
        success: (_result) => {

            //  TODO: insert the new investment to investments array
            newOperationCallbackFunc('');
        }
    });
}

/*  *
    * show the input fields to allow editing an operation
    */

function showEditOperationInputFields(_line, _operationLine) {

    console.log('[debug] show edit operation fields: ' + _line + ' --> ' + _operationLine);

    //  set the investmentId and the operationId to be deleted
    let investment = investments[_line - 1];
    let investmentId = $('#inputInvestmentId-' + _line).val();
    let operation = investment.operations[_operationLine - 1];
    let operationId = operation.id;

    $('#operationDetail-' + _line + '-' + _operationLine).empty();
    $('#operationDetail-' + _line + '-' + _operationLine).append('<td>' + _operationLine + '</td>'
        // TODO: need to difine how to format these two fields for edition
        + '<td><input type="text" class="form-control mr-sm-2" data-provide="datepicker" aria-label="operation date" id="inputEditOperationDate-' + _line + '" value="' + formatInvDate(operation.date) + '" /></td>'
        + '<td><input type="text" class="form-control" id="inputEditOperationAmount-' + _line + '" value="' + to_currency(operation.amount) + '"/></td>');

    $('.datepicker').datepicker({ format: 'dd/mm/yyyy' });

    $('#operationDetailButtons-' + _line).empty();
    $('#operationDetailButtons-' + _line).append('<input type="hidden" id="updateInvestmentId" value="' + investmentId + '" />');
    $('#operationDetailButtons-' + _line).append('<input type="hidden" id="updateOperationId" value="' + operationId + '" />');
    $('#operationDetailButtons-' + _line).append('<button type="submit" class="btn btn-outline-primary" onclick="updateOperation(' + _line + ', ' + _operationLine + ');">Confirm</button> &nbsp;');
    $('#operationDetailButtons-' + _line).append('<button type="submit" class="btn btn-outline-secondary" onclick="showOperationTableDetails( ' + _line + ' );">Cancel</button>');
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
    $('#deleteConfimationMessage').append('<p>Delete the $' + to_currency(operation.amount) + ' operation on ' + formatInvDate(operation.date) + ' ?</p>');
    $('#formDeleteInvestment').empty();
    $('#formDeleteInvestment').append('<input type="hidden" id="deleteInvestmentId" value="' + investmentId + '" />');
    $('#formDeleteInvestment').append('<input type="hidden" id="deleteOperationId" value="' + operationId + '" />');
    $('#formDeleteInvestment').append('<button type="button" class="btn btn-outline-primary" onclick="deleteOperation(' + _line + ', ' + _operationLine + ');">Confirm</button> &nbsp;');
    $('#formDeleteInvestment').append('<button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>');

    //  show the new Investment modal
    $('#confirmExclusion').modal({
        show: true
    });
}

/*  *
    * update Operation item
    */

function updateOperation(_line, _operationLine) {

    let date = $('#inputEditOperationDate-' + _line).val();
    let amount = $('#inputEditOperationAmount-' + _line).val();
    let payload = {};

    console.log('[debug] update operation: ' + date + ' / ' + amount);

    if (date != investments[_line - 1].operations[_operationLine - 1].date) {
        payload['date'] = unformatDate(date);
    }
    if (amount != investments[_line - 1].operations[_operationLine - 1].amount) {
        payload['amount'] = Number(amount);
    }

    //  if any field was changed, patch the operation record
    if (0 < Object.keys(payload).length) {

        let investmentId = $('#updateInvestmentId').val();
        let operationId = $('#updateOperationId').val();
        let requestURL = '/investment/v1/investments';

        console.log('[debug] update operation: ' + investmentId + ' --> ' + operationId);

        //  show the  spinner while loading the data from the API server
        $('#loadingSpinner').empty();
        $('#loadingSpinner').append('<div class="spinner-border text-ligth" role="status"><span class="sr-only">Updating ...</span></div>');

        $.ajax({
            url: requestURL + '/' + investmentId + '/operations/' + operationId,
            method: 'PATCH',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(payload),
            processData: false,
            error: function () {

                $('#toastContainer').empty();
                $('#toastContainer').append('<div class="alert alert-danger" role="alert">'
                    + 'Error trying to update investment data'
                    + '<button type="button" class="ml-2 mb-1 close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                    + '</div>');

                console.log('[debug] Error attempting to patch operation');

                showOperationTableDetails(_line);
                //  hide the spinner
                $('#loadingSpinner').empty();
            },
            success: (_result) => {

                investments[_line - 1].operations[_operationLine - 1].date = date;
                investments[_line - 1].operations[_operationLine - 1].amount = Number(amount);

                $('#toastContainer').empty();
                $('#toastContainer').append('<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">'
                    + '<div class="toast-header">'
                    + '<img src="..." class="rounded mr-2" alt="..." />'
                    + '<strong class="mr-auto">' + date + '</strong>'
                    + '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                    + '</div>'
                    + '<div class="toast-body">Operation data updated succesfully</div>'
                    + '</div>');

                showOperationTableDetails(_line);
                //  hide the spinner
                $('#loadingSpinner').empty();
                //  TODO: use Bootstrap toasts to show the result of update operation
            }
        });
    }
}

/*  *
    * delete operation item
    */

function deleteOperation(_line, _operationLine) {

    let investmentId = $('#deleteInvestmentId').val();
    let operationId = $('#deleteOperationId').val();
    let requestURL = '/investment/v1/investments';

    console.log('[debug] delete operation: ' + investmentId + ' --> ' + operationId);

    //  show the  spinner while deleting the data from the API server
    $('#loadingSpinner').empty();
    $('#loadingSpinner').append('<div class="spinner-border text-ligth" role="status"><span class="sr-only">Updating ...</span></div>');

    $.ajax({
        url: requestURL + '/' + investmentId + '/operations/' + operationId,
        method: 'DELETE',
        error: function () {

            $('#toastContainer').empty();
            $('#toastContainer').append('<div class="alert alert-danger" role="alert">'
                + 'Error trying to update investment data'
                + '<button type="button" class="ml-2 mb-1 close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                + '</div>');

            console.log('[debug] Error attempting to delete operation');

            showOperationTableDetails(_line);
            //  hide the spinner
            $('#loadingSpinner').empty();
        },
        success: (_result) => {

            delete investments[_line - 1].operations[_operationLine - 1];

            $('#toastContainer').empty();
            $('#toastContainer').append('<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">'
                + '<div class="toast-header">'
                + '<img src="..." class="rounded mr-2" alt="..." />'
                + '<strong class="mr-auto">' + _line + '</strong>'
                + '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                + '</div>'
                + '<div class="toast-body">Operation data succesfully deleted</div>'
                + '</div>');

            showOperationTableDetails(_line);
            //  hide the spinner
            $('#loadingSpinner').empty();
            //  TODO: use Bootstrap toasts to show the result of update operation
        }
    });

    $('#confirmExclusion').modal('hide');
}
