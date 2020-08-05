////////////////////////////////////////////////////////////////////////////////
//  investment.js  -  Aug-02-2020 by aldebap
//
//  Investment components
////////////////////////////////////////////////////////////////////////////////

//  constants

/*  *
    * show the investments table
    */

function showInvestmentTable() {

    let line = 1;
    let maxDate = '';
    let totalBalance = 0;

    $('#investmentTable').empty();

    investments.forEach((investment) => {
        $('#investmentTable').append('<tr id="' + investment.id + '">');
        $('#' + investment.id).append('<td>' + line);
        $('#' + investment.id).append('<td>' + investment.bank);
        $('#' + investment.id).append('<td>' + investment.type);
        $('#' + investment.id).append('<td>' + investment.name);
        $('#' + investment.id).append('<td>' + formatInvDate(investment.balance[0].date));
        $('#' + investment.id).append('<td style="text-align:right">' + to_currency(investment.balance[0].amount)
            + '&nbsp;<a data-toggle="collapse" href="#collapseRow-' + line + '" role="button" aria-expanded="false" aria-controls="collapseRow-' + line + '">'
            + '<img src="img/caretDown.svg" /></a>');
        // TODO: to catch the event of clicking the caret to show it upside down, and to close other collapse rows that may be open

        $('#investmentTable').append('<tr class="collapse" id="collapseRow-' + line + '"><td colspan="6"><div class="container" id="containerRow-' + line + '">');

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
    $('#totalAmount').append('<td style="text-align:right">' + to_currency(totalBalance));
}

/*  *
    * show the investment details
    */

function showInvestmentTableDetails(_line, _investment) {

    let investment = investments[_line - 1];

    //  format the investment details form
    $('#containerRow-' + _line).append('<div class="card"><div class="card-header">Investment details</div><div class="card-body"><form id="formEditInvestment-' + _line + '">'
        + '<input type="hidden" id="inputInvestmentId-' + _line + '" value="' + investment.id + '" />'
        + '<div class="form-group"><label for="inputBank">Bank</label><input type="text" class="form-control" id="inputBank-' + _line + '" value="' + investment.bank + '" /></div>'
        + '<div class="form-group"><label for="inputType">Type</label><input type="text" class="form-control" id="inputType-' + _line + '" value="' + investment.type + '" /></div>'
        + '<div class="form-group"><label for="inputName">Name</label><input type="text" class="form-control" id="inputName-' + _line + '" value="' + investment.name + '" /></div>'
        + '<div class="float-right"><button type="submit" class="btn btn-outline-primary" onclick="updateInvestment( ' + _line + ' );">Update</button> &nbsp;'
        + '<button type="submit" class="btn btn-outline-primary" onclick="showDeleteInvestmentModal( ' + _line + ' );">Delete</button></div>'
        + '</form></div></div>');

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

    let bank = $('#inputBank-' + _line).val();
    let type = $('#inputType-' + _line).val();
    let name = $('#inputName-' + _line).val();
    let payload = {};

    if (bank != investments[_line - 1].bank) {
        payload['bank'] = bank;
    }
    if (type != investments[_line - 1].type) {
        payload['type'] = type;
    }
    if (name != investments[_line - 1].name) {
        payload['name'] = name;
    }

    //  if any field was changed, patch the investment record
    if (0 < Object.keys(payload).length) {

        let requestURL = '/investment/v1/investments';

        //  show the  spinner while loading the data from the API server
        $('#loadingSpinner').empty();
        $('#loadingSpinner').append('<div class="spinner-border text-ligth" role="status"><span class="sr-only">Updating ...</span></div>');

        $.ajax({
            url: requestURL + '/' + investments[_line - 1].id,
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

                investments[_line - 1].bank = bank;
                investments[_line - 1].type = type;
                investments[_line - 1].name = name;

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
}

/*  *
    * delete investment item
    */

function deleteInvestment() {
    let investmentId = $('#deleteInvestmentId').val();
    let requestURL = '/investment/v1/investments';

    //  show the  spinner while loading the data from the API server
    $('#loadingSpinner').empty();
    $('#loadingSpinner').append('<div class="spinner-border text-ligth" role="status"><span class="sr-only">Updating ...</span></div>');

    $.ajax({
        url: requestURL + '/' + investmentId,
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
                + '<strong class="mr-auto">' + investmentId + '</strong>'
                + '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                + '</div>'
                + '<div class="toast-body">Investment succesfully deleted</div>'
                + '</div>');

            showInvestmentTable();
            //  hide the spinner
            $('#loadingSpinner').empty();
        }
    });

    $('#deleteInvestment').modal('hide');
}
