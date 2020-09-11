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

    console.log('[debug] insert payload: ' + JSON.stringify(_payload));

    //  call investment service on the API server
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

    console.log('[debug] patch payload: ' + JSON.stringify(_payload));

    //  call investment service on the API server
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

function deleteInvestment(_investment, deleteInvestmentCallbackFunc) {

    console.log('[debug] deleteInvestment( ' + _investment.name + ' )');

    //  call investment service on the API server
    $.ajax({
        url: investmentsRoute + '/' + _investment.id,
        method: 'DELETE',
        error: function () {

            console.log('[debug] Error attempting to delete investment');
            deleteInvestmentCallbackFunc('Error trying to delete investment data');
        },
        success: (_result) => {

            deleteInvestmentCallbackFunc('');
        }
    });

}
