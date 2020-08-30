////////////////////////////////////////////////////////////////////////////////
//  investment.js  -  Aug-02-2020 by aldebap
//
//  Investment components
////////////////////////////////////////////////////////////////////////////////

//  constants

const investmentsRoute = '/investment/v1/investments';

//  globals

let investments = [];

/*  *
    * get all investments from API server
    */

function getAllInvestments(startDate, endDate, active, showLoadedInvestmentsFunc) {

    let query = investmentsRoute;
    let queryString = '';

    //  based on the filter options, format the investments service query string
    if (0 < startDate.length) {
        queryString = 'startDate=' + startDate;
    }
    if (0 < endDate.length) {
        if (0 < queryString.length) {
            queryString += '&';
        }
        queryString += 'endDate=' + endDate;
    }
    if (0 == active) {
        if (0 < queryString.length) {
            queryString += '&';
        }
        queryString += 'active=False';
    }

    if (0 < queryString.length) {
        query += '?' + queryString;
    }
    console.log('[debug] get all investments: query string: ' + queryString);

    //  call investment service on the API server
    investments = [];

    $.ajax({
        url: query,
        method: 'GET',
        success: (_result) => {
            investments = _result['Investments'];

            showLoadedInvestmentsFunc();
        }
    });
}

/*  *
    * add a new investment item
    */

function addNewInvestment() {

    //  TODO: this source needs to be the model so, no interface with HTML DOM
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

    //  show the  spinner while loading the data from the API server
    $('#loadingSpinner').empty();
    $('#loadingSpinner').append('<div class="spinner-border text-ligth" role="status"><span class="sr-only">Updating ...</span></div>');

    console.log('[debug] insert payload: ' + JSON.stringify(payload));

    $.ajax({
        url: investmentsRoute,
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(payload),
        processData: false,
        error: function () {

            //  TODO: no toast information is working
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

    let investment = funnelledInvestments[_line - 1];
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

    let investment = funnelledInvestments[_line - 1];
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
