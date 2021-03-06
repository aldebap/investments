////////////////////////////////////////////////////////////////////////////////
//  revenue.js  -  Aug-02-2020 by aldebap
//
//  Revenue components
////////////////////////////////////////////////////////////////////////////////

//  constants

/*  *
    * show the revenue details
    */

function showRevenueTableDetails(_line) {

    let investment = investments[_line - 1];

    $('#revenueDetail-' + _line).empty();

    //  format the revenue details table
    let revenueIndex = 1;

    investment.revenue.forEach((revenue) => {
        $('#revenueDetail-' + _line).append('<tr><td>' + revenueIndex + '</td>'
            + '<td>' + formatInvDate(revenue.date) + '</td>'
            + '<td>' + to_currency(revenue.amount)
            + '<a class="float-right dropdown-toggle" href="#" role="button" id="revenueThreeDotsButton-' + _line + '" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
            + '<img class="text-primary" src="img/threeDotsVertical.svg" /></a>'
            + '<div class="dropdown-menu" id="revenueOptionsMenu-' + _line + '" aria-labelledby="revenueThreeDotsButton-' + _line + '">'
            + '<button class="dropdown-item" type="button" onclick="showEditRevenueInputFields( ' + _line + ', ' + revenueIndex + ' );">Edit</button>'
            + '<button class="dropdown-item" type="button" onclick="deleteRevenue( ' + _line + ', ' + revenueIndex + ' );">Delete</button></div>'
            + '</td></tr>');

        revenueIndex++;
    });

    $('#revenueDetailButtons-' + _line).empty();
    $('#revenueDetailButtons-' + _line).append('<a onclick="showNewRevenueInputFields( ' + _line + ' );"><img src="img/addButton.svg" /></a>');
}

/*  *
    * show the input fields to allow adding a new revenue
    */

function showNewRevenueInputFields(_line) {

    $('#revenueDetail-' + _line).append('<tr><td>New</td>'
        + '<td><input type="text" class="form-control mr-sm-2" data-provide="datepicker" aria-label="operation date" id="inputNewRevenueDate-' + _line + '" /></td>'
        + '<td><input type="text" class="form-control" id="inputNewRevenueAmount-' + _line + '" /></td></tr>');

    $('.datepicker').datepicker({ format: 'dd/mm/yyyy' });

    $('#revenueDetailButtons-' + _line).empty();
    $('#revenueDetailButtons-' + _line).append('<button type="submit" class="btn btn-outline-primary" onclick="confirmNewRevenue( ' + _line + ' );">Confirm</button> &nbsp;');
    $('#revenueDetailButtons-' + _line).append('<button type="button" class="btn btn-outline-secondary" onclick="showRevenueTableDetails( ' + _line + ' );">Cancel</button>');
}

/*  *
    * show the input fields to allow editing a revenue
    */

function showEditRevenueInputFields(_line, _revenueLine) {
    console.log('[debug] edit revenue options menu: ' + _line + ' --> ' + _revenueLine);
}

function deleteRevenue(_line, _revenueLine) {
    console.log('[debug] delete revenue options menu: ' + _line + ' --> ' + _revenueLine);
}

/*  *
    * Confirm adding a new revenue
    */

function confirmNewRevenue(_line) {

    let investment = investments[_line - 1];
    let revenueDate = $('#inputNewRevenueDate-' + _line).val();
    let revenueAmount = Number($('#inputNewRevenueAmount-' + _line).val());
    let payload = {};

    if (0 < revenueDate.length) {
        payload['date'] = unformatDate(revenueDate);
    }
    if (revenueAmount != NaN) {
        payload['amount'] = revenueAmount;
    }

    //  if all field are validated, add the revenue record
    let requestURL = '/investment/v1/investments/' + investment.id + '/revenue';

    //  show the  spinner while loading the data from the API server
    $('#loadingSpinner').empty();
    $('#loadingSpinner').append('<div class="spinner-border text-ligth" role="status"><span class="sr-only">Updating ...</span></div>');

    console.log('[debug] insert revenue payload: ' + JSON.stringify(payload));

    $.ajax({
        url: requestURL,
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(payload),
        processData: false,
        error: function () {

            $('#toastContainer').empty();
            $('#toastContainer').append('<div class="alert alert-danger" role="alert">'
                + 'Error trying to add revenue to investment data'
                + '<button type="button" class="ml-2 mb-1 close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                + '</div>');

            console.log('[debug] Error attempting to add revenue');

            showRevenueTableDetails(_line);
            //  hide the spinner and the modal
            $('#loadingSpinner').empty();
        },
        success: (_result) => {

            //  TODO: the same period filter needs to be aplied to the result investment
            investments[_line - 1] = _result;
            showRevenueTableDetails(_line);
            //  hide the spinner and the modal
            $('#loadingSpinner').empty();
        }
    });

    $('#revenueDetailButtons-' + _line).empty();
}
