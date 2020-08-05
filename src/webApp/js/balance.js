////////////////////////////////////////////////////////////////////////////////
//  balance.js  -  Aug-02-2020 by aldebap
//
//  Balance components
////////////////////////////////////////////////////////////////////////////////

//  constants

/*  *
    * show the balance details
    */

function showBalanceTableDetails(_line) {

    let investment = investments[_line - 1];

    $('#balanceDetail-' + _line).empty();

    //  format the  balance details table
    let balanceIndex = 1;

    investment.balance.forEach((balance) => {
        $('#balanceDetail-' + _line).append('<tr><td>' + balanceIndex + '</td>'
            + '<td>' + formatInvDate(balance.date) + '</td>'
            + '<td>' + to_currency(balance.amount)
            + '<a class="float-right dropdown-toggle" href="#" role="button" id="balanceThreeDotsButton-' + _line + '" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
            + '<img class="text-primary" src="img/threeDotsVertical.svg" /></a>'
            + '<div class="dropdown-menu" id="balanceOptionsMenu-' + _line + '" aria-labelledby="balanceThreeDotsButton-' + _line + '">'
            + '<button class="dropdown-item" type="button" onclick="showEditBalanceInputFields( ' + _line + ', ' + balanceIndex + ' );">Edit</button>'
            + '<button class="dropdown-item" type="button" onclick="deleteBalance( ' + _line + ', ' + balanceIndex + ' );">Delete</button></div>'
            + '</td></tr>');
        balanceIndex++;
    });

    $('#balanceDetailButtons-' + _line).empty();
    $('#balanceDetailButtons-' + _line).append('<a onclick="showNewBalanceInputFields( ' + _line + ' );"><img src="img/addButton.svg" /></a>');
}

/*  *
    * show the input fields to allow adding a new balance
    */

function showNewBalanceInputFields(_line) {

    $('#balanceDetail-' + _line).append('<tr><td>New</td>'
        + '<td><input type="text" class="form-control" id="inputNewBalanceDate-' + _line + '" /></td>'
        + '<td><input type="text" class="form-control" id="inputNewBalanceAmount-' + _line + '" /></td></tr>');

    $('#balanceDetailButtons-' + _line).empty();
    $('#balanceDetailButtons-' + _line).append('<button type="submit" class="btn btn-outline-primary" onclick="confirmNewBalance( ' + _line + ' );">Confirm</button> &nbsp;');
    $('#balanceDetailButtons-' + _line).append('<button type="button" class="btn btn-outline-secondary" onclick="showBalanceTableDetails( ' + _line + ' );">Cancel</button>');
}

/*  *
    * show the input fields to allow editing a balance
    */

function showEditBalanceInputFields(_line, _balanceLine) {
    console.log('[debug] edit balance options menu: ' + _line + ' --> ' + _balanceLine);
}

function deleteBalance(_line, _balanceLine) {
    console.log('[debug] delete balance options menu: ' + _line + ' --> ' + _balanceLine);
}

/*  *
    * Confirm adding a new balance
    */

function confirmNewBalance(_line) {

    let investment = investments[_line - 1];
    let balanceDate = $('#inputNewBalanceDate-' + _line).val();
    let balanceAmount = Number($('#inputNewBalanceAmount-' + _line).val());
    let payload = {};

    if (0 < balanceDate.length) {
        payload['date'] = balanceDate;
    }
    if (balanceAmount != NaN) {
        payload['amount'] = balanceAmount;
    }

    //  if all field are validated, add the balance record
    let requestURL = '/investment/v1/investments/' + investment.id + '/balance';

    //  show the  spinner while loading the data from the API server
    $('#loadingSpinner').empty();
    $('#loadingSpinner').append('<div class="spinner-border text-ligth" role="status"><span class="sr-only">Updating ...</span></div>');

    console.log('[debug] insert balance payload: ' + JSON.stringify(payload));

    $.ajax({
        url: requestURL,
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(payload),
        processData: false,
        error: function () {

            $('#toastContainer').empty();
            $('#toastContainer').append('<div class="alert alert-danger" role="alert">'
                + 'Error trying to add balance to investment data'
                + '<button type="button" class="ml-2 mb-1 close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                + '</div>');

            console.log('[debug] Error attempting to add balance');

            showBalanceTableDetails(_line);
            //  hide the spinner and the modal
            $('#loadingSpinner').empty();
        },
        success: (_result) => {

            //  TODO: the same period filter needs to be aplied to the result investment
            investments[_line - 1] = _result;
            showBalanceTableDetails(_line);
            //  hide the spinner and the modal
            $('#loadingSpinner').empty();
        }
    });

    $('#balanceDetailButtons-' + _line).empty();
}
