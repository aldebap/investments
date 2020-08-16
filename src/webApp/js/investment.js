////////////////////////////////////////////////////////////////////////////////
//  investment.js  -  Aug-02-2020 by aldebap
//
//  Investment components
////////////////////////////////////////////////////////////////////////////////

//  constants

//  globals

let editingInvestmentLine = 0;

/*  *
    * show the investments table
    */

function showInvestmentTable() {

    let line = 1;
    let maxDate = '';
    let totalBalance = 0;

    $('#investmentTable').empty();

    investments.forEach((investment) => {
        $('#investmentTable').append('<tr id="investmentRow-' + line + '">');
        $('#investmentTable').append('<tr class="collapse" id="collapseInvestmentButtons-' + line + '"><td colspan="6" id="investmentButtons-' + line + '">');
        $('#investmentTable').append('<tr class="collapse" id="collapseRow-' + line + '"><td colspan="6"><div class="container" id="containerRow-' + line + '">');

        showInvestmentLine(line);
        showInvestmentTableDetails(line, investment);

        $('#containerRow-' + line).append('</div></td></tr>');

        //  summarize the investment to the grand total
        if (maxDate == '' || investment.balance[0].date > maxDate) {
            maxDate = investment.balance[0].date;
        }
        totalBalance += investment.balance[0].amount;
        line++;
    });

    $('#investmentTable').append('<tr id="totalAmount" class="table-active">');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>Total');
    $('#totalAmount').append('<td>' + formatInvDate(maxDate));
    $('#totalAmount').append('<td style="text-align:right">' + to_currency(totalBalance)
        + '&nbsp; <img class="invisible" src="img/threeDotsVertical.svg" />'
        + '&nbsp; <img class="invisible" src="img/caretDown.svg" />');

    editingInvestmentLine = 0;
}

/*  *
    * show an investment table line
    */

function showInvestmentLine(_line) {

    console.log('[debug] show edit investment fields: ' + _line);

    //  set the investmentId and the operationId to be deleted
    let investment = investments[_line - 1];

    $('#investmentRow-' + _line).empty();
    $('#investmentRow-' + _line).append('<th>' + _line);
    $('#investmentRow-' + _line).append('<td>' + investment.bank);
    $('#investmentRow-' + _line).append('<td>' + investment.type);
    $('#investmentRow-' + _line).append('<td>' + investment.name);
    $('#investmentRow-' + _line).append('<td>' + formatInvDate(investment.balance[0].date));
    $('#investmentRow-' + _line).append('<td style="text-align:right">' + to_currency(investment.balance[0].amount)
        + '&nbsp; <a class="dropdown-toggle" href="#" role="button" id="investmentThreeDotsButton-' + _line + '" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
        + '<img class="text-primary" src="img/threeDotsVertical.svg" /></a>'
        + '<div class="dropdown-menu" id="investmentOptionsMenu-' + _line + '" aria-labelledby="investmentThreeDotsButton-' + _line + '">'
        + '<button class="dropdown-item" type="button" onclick="showEditInvestmentInputFields( ' + _line + ' );">Edit</button>'
        + '<button class="dropdown-item" type="button" onclick="showDeleteInvestmentModal( ' + _line + ' );">Delete</button></div>'

        + '&nbsp; <a class="float-right" data-toggle="collapse" href="#collapseRow-' + _line + '" role="button" aria-expanded="false" aria-controls="collapseRow-' + _line + '">'
        + '<img id="caret-' + _line + '" src="img/caretDown.svg" /></a>');

    // events the change the caret up and down according to the condition of the collapse row
    $('#collapseRow-' + _line).on('shown.bs.collapse', () => {
        $('#caret-' + _line).attr('src', 'img/caretUp.svg');
    });

    $('#collapseRow-' + _line).on('hidden.bs.collapse', () => {
        $('#caret-' + _line).attr('src', 'img/caretDown.svg');
    });

    $('#investmentButtons-' + _line).empty();
    $('#collapseInvestmentButtons-' + _line).collapse('hide');

    editingInvestmentLine = 0;
}

/*  *
    * show the investment details
    */

function showInvestmentTableDetails(_line, _investment) {

    let investment = investments[_line - 1];

    //  format the investment details form
    $('#containerRow-' + _line).append('<div class="card"><div class="card-header">Investment details</div><div class="card-body">'
        + '<table class="table"><tbody>'
        + '<tr><th>Bank</th><td>' + investment.bank + '</td></tr>'
        + '<tr><th>Type</th><td>' + investment.type + '</td></tr>'
        + '<tr><th>Name</th><td>' + investment.name + '</td></tr>'
        + '</tbody></table>'
        + '</div></div>');

    $('#containerRow-' + _line).append('<div class="card"><div class="card-header">Operations</div><div class="card-body"><form id="formManageOperations-' + _line + '">'
        + '<table class="table">'
        + '<thead><tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">Amount</th></tr></thead>'
        + '<tbody id="operationDetail-' + _line + '"></tbody>'
        + '</table>'
        + '<div class="float-right" id="operationDetailButtons-' + _line + '"></div>'
        + '</form></div></div>');

    $('#containerRow-' + _line).append('<div class="card"><div class="card-header">Revenue</div><div class="card-body"><form id="formManageRevenue-' + _line + '">'
        + '<table class="table">'
        + '<thead><tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">Amount</th></tr></thead>'
        + '<tbody id="revenueDetail-' + _line + '"></tbody>'
        + '</table>'
        + '<div class="float-right" id="revenueDetailButtons-' + _line + '"></div>'
        + '</form></div></div>');

    $('#containerRow-' + _line).append('<div class="card"><div class="card-header">Balance</div><div class="card-body"><form id="formManageBalance-' + _line + '">'
        + '<table class="table">'
        + '<thead><tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">Amount</th></tr></thead>'
        + '<tbody id="balanceDetail-' + _line + '"></tbody>'
        + '</table>'
        + '<div class="float-right" id="balanceDetailButtons-' + _line + '"></div>'
        + '</form></div></div>');

    showOperationTableDetails(_line);
    showRevenueTableDetails(_line);
    showBalanceTableDetails(_line);
}

/*  *
    * show the add new investment modal
    */

function showNewInvestmentModal() {

    //  clean previous values from the form
    $('#inputBank-new').val('');
    $('#inputType-new').val('');
    $('#inputName-new').val('');
    $('#inputOperationDate-new').val('');
    $('#inputOperationAmount-new').val('');
    $('#inputBalanceDate-new').val('');
    $('#inputBalanceAmount-new').val('');

    //  show the new Investment modal
    $('#newInvestment').modal({
        show: true
    });
}

/*  *
    * show the input fields to allow editing an investment
    */

function showEditInvestmentInputFields(_line) {

    console.log('[debug] show edit investment fields: ' + _line);

    //  if edit fields are shown for another line, hide them in order to have only one editing line at a time
    if (0 != editingInvestmentLine) {

        showInvestmentLine(editingInvestmentLine);
    }

    //  set the investmentId and the operationId to be deleted
    let investment = investments[_line - 1];

    $('#investmentRow-' + _line).empty();
    $('#investmentRow-' + _line).append('<td>' + _line);
    $('#investmentRow-' + _line).append('<td><input type="text" class="form-control" id="inputEditInvestmentBank-' + _line + '" value="' + investment.bank + '"></td>');
    $('#investmentRow-' + _line).append('<td><input type="text" class="form-control" id="inputEditInvestmentType-' + _line + '" value="' + investment.type + '"></td>');
    $('#investmentRow-' + _line).append('<td><input type="text" class="form-control" id="inputEditInvestmentName-' + _line + '" value="' + investment.name + '"></td>');
    $('#investmentRow-' + _line).append('<td>' + formatInvDate(investment.balance[0].date) + '</td>');
    $('#investmentRow-' + _line).append('<td style="text-align:right">' + to_currency(investment.balance[0].amount) + '</td>');

    $('#investmentButtons-' + _line).empty();
    $('#investmentButtons-' + _line).append('<button type="submit" class="btn btn-outline-secondary float-right" onclick="showInvestmentLine(' + _line + ');">Cancel</button>');
    $('#investmentButtons-' + _line).append('<button type="submit" class="btn btn-outline-primary float-right mr-2" onclick="updateInvestment(' + _line + ');">Confirm</button>');
    $('#collapseInvestmentButtons-' + _line).collapse('show');

    editingInvestmentLine = _line;
}

/*  *
    * show the delete investment modal
    */

function showDeleteInvestmentModal(_line) {

    console.log('[debug] showDeleteInvestmentModal()');

    //  set the investmentId to be deleted
    let investment = investments[_line - 1];

    $('#deleteConfimationMessage').empty();
    $('#deleteConfimationMessage').append('<p>Delete the investment "' + investment.name + '" at ' + investment.bank + '</p>');
    $('#formDeleteInvestment').empty();
    $('#formDeleteInvestment').append('<button type="button" class="btn btn-outline-primary" onclick="deleteInvestment(' + _line + ');">Confirm</button> &nbsp;');
    $('#formDeleteInvestment').append('<button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>');

    //  show the new Investment modal
    $('#confirmExclusion').modal({ show: true });
}

/*  *
    * add a new investment item
    */

function addNewInvestment() {

    let bank = $('#inputBank-new').val();
    let type = $('#inputType-new').val();
    let name = $('#inputName-new').val();
    let operationDate = $('#inputOperationDate-new').val();
    let operationAmount = Number($('#inputOperationAmount-new').val());
    let balanceDate = $('#inputBalanceDate-new').val();
    let balanceAmount = Number($('#inputBalanceAmount-new').val());
    let payload = {};

    if (0 < bank.length) {
        payload['bank'] = bank;
    }
    if (0 < type.length) {
        payload['type'] = type;
    }
    if (0 < name.length) {
        payload['name'] = name;
    }
    if (0 < operationDate.length && operationAmount != NaN) {
        payload['operation'] = { date: operationDate, amount: operationAmount };
    }

    if (0 < balanceDate.length && balanceAmount != NaN) {
        payload['balance'] = { date: balanceDate, amount: balanceAmount };
    }

    //  TODO: use global constants  for these endpoints
    //  if all field are validated, add the investment record
    let requestURL = '/investment/v1/investments';

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
                + 'Error trying to add investment data'
                + '<button type="button" class="ml-2 mb-1 close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                + '</div>');

            console.log('[debug] Error attempting to add investment');

            //  hide the spinner and the modal
            $('#loadingSpinner').empty();
        },
        success: (_result) => {

            showInvestmentTable();
            //  hide the spinner and the modal
            $('#loadingSpinner').empty();
        }
    });

    $('#newInvestment').modal('hide');
}

/*  *
    * update investment item
    */

function updateInvestment(_line) {

    let investment = investments[_line - 1];
    let bank = $('#inputEditInvestmentBank-' + _line).val();
    let type = $('#inputEditInvestmentType-' + _line).val();
    let name = $('#inputEditInvestmentName-' + _line).val();
    let payload = {};

    if (bank != investment.bank) {
        payload['bank'] = bank;
    }
    if (type != investment.type) {
        payload['type'] = type;
    }
    if (name != investment.name) {
        payload['name'] = name;
    }

    //  if any field was changed, patch the investment record
    if (0 < Object.keys(payload).length) {

        let requestURL = '/investment/v1/investments';

        //  show the  spinner while loading the data from the API server
        $('#loadingSpinner').empty();
        $('#loadingSpinner').append('<div class="spinner-border text-ligth" role="status"><span class="sr-only">Updating ...</span></div>');

        $.ajax({
            url: requestURL + '/' + investment.id,
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

                console.log('[debug] Error attempting to patch investment');

                //  hide the spinner
                $('#loadingSpinner').empty();
            },
            success: (_result) => {

                investment.bank = bank;
                investment.type = type;
                investment.name = name;

                showInvestmentLine(_line);

                $('#toastContainer').empty();
                $('#toastContainer').append('<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">'
                    + '<div class="toast-header">'
                    + '<img src="..." class="rounded mr-2" alt="..." />'
                    + '<strong class="mr-auto">' + name + '</strong>'
                    + '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                    + '</div>'
                    + '<div class="toast-body">Investment data updated succesfully</div>'
                    + '</div>');

                //  hide the spinner
                $('#loadingSpinner').empty();
                //  TODO: use Bootstrap toasts to show the result of update operation
            }
        });
    }

    showInvestmentLine(_line);
}

/*  *
    * delete investment item
    */

function deleteInvestment(_line) {

    console.log('[debug] deleteInvestment( ' + _line + ' )');

    let investment = investments[_line - 1];
    let requestURL = '/investment/v1/investments';

    //  show the  spinner while loading the data from the API server
    $('#loadingSpinner').empty();
    $('#loadingSpinner').append('<div class="spinner-border text-ligth" role="status"><span class="sr-only">Updating ...</span></div>');

    $.ajax({
        url: requestURL + '/' + investment.id,
        method: 'DELETE',
        error: function () {

            $('#toastContainer').empty();
            $('#toastContainer').append('<div class="alert alert-danger" role="alert">'
                + 'Error trying to delete investment data'
                + '<button type="button" class="ml-2 mb-1 close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                + '</div>');

            console.log('[debug] Error attempting to delete investment');

            //  hide the spinner
            $('#loadingSpinner').empty();
        },
        success: (_result) => {

            $('#toastContainer').empty();
            $('#toastContainer').append('<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">'
                + '<div class="toast-header">'
                + '<img src="..." class="rounded mr-2" alt="..." />'
                + '<strong class="mr-auto">' + investment.id + '</strong>'
                + '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                + '</div>'
                + '<div class="toast-body">Investment succesfully deleted</div>'
                + '</div>');

            //  TODO: remove the line from the investment array, or to reload it from API
            showInvestmentTable();
            //  hide the spinner
            $('#loadingSpinner').empty();
        }
    });

    $('#confirmExclusion').modal('hide');
}
