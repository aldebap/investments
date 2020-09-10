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

function getAllInvestments(_startDate, _endDate, _active, showLoadedInvestmentsFunc) {

    let query = investmentsRoute;
    let queryString = '';

    //  based on the filter options, format the investments service query string
    if (0 < _startDate.length) {
        queryString = 'startDate=' + _startDate;
    }
    if (0 < _endDate.length) {
        if (0 < queryString.length) {
            queryString += '&';
        }
        queryString += 'endDate=' + _endDate;
    }
    if (0 == _active) {
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

function addNewInvestment(_payload, newInvestmentCallbackFunc) {

    //  call investment service on the API server
    console.log('[debug] insert payload: ' + JSON.stringify(_payload));

    $.ajax({
        url: investmentsRoute,
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(_payload),
        processData: false,
        error: () => {

            console.log('[debug] Error attempting to add investment');
            newInvestmentCallbackFunc('Error trying to add investment data');
        },
        success: (_result) => {

            newInvestmentCallbackFunc('');
        }
    });
}

/*  *
    * update investment item
    */

function updateInvestment(_payload, _investment, updateInvestmentCallbackFunc) {

    //  call investment service on the API server
    console.log('[debug] patch payload: ' + JSON.stringify(_payload));

    $.ajax({
        url: investmentsRoute + '/' + _investment.id,
        method: 'PATCH',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(_payload),
        processData: false,
        error: function () {

            console.log('[debug] Error attempting to patch investment');
            updateInvestmentCallbackFunc('Error trying to update investment data');
        },
        success: (_result) => {

            if ('bank' in _payload) {
                _investment.bank = _payload.bank;
            }
            if ('type' in _payload) {
                _investment.type = _payload.type;
            }
            if ('name' in _payload) {
                _investment.name = _payload.name;
            }

            updateInvestmentCallbackFunc('');
        }
    });
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
