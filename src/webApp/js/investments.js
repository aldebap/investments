///////////////#//////////#////////////#/////#///////////////#/////////#////////
//  investments.js  -  Jul-11-2020 by aldebap
//
//  Investments web application
///////////////#//////////#////////////#/////#///////////////#/////////#////////

//  globals

let currentView = '';
let investments = [];

/*  *
    * select listing view as the current investments view
    */

//  TODO: use some constants for the view names
function selectListingView() {
    currentView = 'listing';
}

/*  *
    * select evolution view as the current investments view
    */

function selectEvolutionView() {
    currentView = 'evolution';
}

/*  *
    * select graphical view as the current investments view
    */

function selectGraphicalView() {
    currentView = 'graphical';
}

/*  *
    * load investments from API server
    */

function loadInvestments() {

    let startDate = $('#filterStartDate').val();
    let endDate = $('#filterEndDate').val();
    //  TODO: this needs to be an option in the navbar
    let active = true;
    let requestURL = '/investment/v1/investments';
    let queryString = '';

    //  based on the filter options, format the investments service query string
    if (startDate.length > 0) {
        queryString += (queryString.length == 0) ? '' : '&' + 'startDate=' + startDate;
    }
    if (endDate.length > 0) {
        queryString += (queryString.length == 0) ? '' : '&' + 'endDate=' + endDate;
    }
    if (active == false) {
        queryString += (queryString.length == 0) ? '' : '&' + 'active=False';
    }

    if (queryString.length > 0) {
        requestURL += queryString;
    }

    //  show the  spinner while loading the data from the API server
    $('#loadingSpinner').empty();
    $('#loadingSpinner').append('<div class="spinner-border text-ligth" role="status"><span class="sr-only">Loading...</span></div>');

    //  call investment service on the API server
    investments = [];

    $.ajax({
        url: requestURL,
        method: 'GET',
        success: (_result) => {
            investments = _result['Investments'];

            showInvestmentsView();

            //  hide the spinner
            $('#loadingSpinner').empty();
        }
    });
}

/*  *
    * show current investments view
    */

function showInvestmentsView() {
    if (currentView == 'listing') {
        showInvestmentsListingView();
    } else if (currentView == 'evolution') {
        showInvestmentsEvolutionView();
    } else if (currentView == 'graphical') {
        showInvestmentsGraphicalView();
    }
}

/*  *
    * show the investments listing view
    */

function showInvestmentsListingView() {

    $('#container').empty();
    $('#container').append('<table class="table table-hover">');
    $('table').append('<thead class="thead-dark">');
    $('thead').append('<tr>');
    $('tr').append('<th scope="col">#</th>');
    $('tr').append('<th scope="col">Bank</th>');
    $('tr').append('<th scope="col">Type</th>');
    $('tr').append('<th scope="col">Investment</th>');
    $('tr').append('<th scope="col">Date</th>');
    $('tr').append('<th scope="col" style="text-align:right">Balance</th>');
    $('table').append('<tbody id="mainTable">');

    let line = 1;
    let maxDate = '';
    let totalBalance = 0;

    //  TODO: to make the title  columns bank, type and name to work as a filter
    investments.forEach((investment) => {
        $('#mainTable').append('<tr id="' + investment.id + '">');
        $('#' + investment.id).append('<td>' + line);
        $('#' + investment.id).append('<td>' + investment.bank);
        $('#' + investment.id).append('<td>' + investment.type);
        $('#' + investment.id).append('<td>' + investment.name);
        $('#' + investment.id).append('<td>' + formatInvDate(investment.balance[0].date));
        $('#' + investment.id).append('<td style="text-align:right">' + to_currency(investment.balance[0].amount)
            + '&nbsp;<a data-toggle="collapse" href="#collapseRow-' + line + '" role="button" aria-expanded="false" aria-controls="collapseRow-' + line + '">'
            + '<img src="img/caretDown.svg" /></a>');
        // TODO: to catch the event of clicking the caret to show it upside down, and to close other collapse rows that may be open

        $('#mainTable').append('<tr class="collapse" id="collapseRow-' + line + '"><td colspan="6"><div class="container" id="containerRow-' + line + '">');

        addInvestmentDetails(line, investment);

        $('#containerRow-' + line).append('</div></td></tr>');

        //  summarize the investment to the grand total
        if (maxDate == '' || investment.balance[0].date > maxDate) {
            maxDate = investment.balance[0].date;
        }
        totalBalance += investment.balance[0].amount;
        line++;
    });

    $('#mainTable').append('<tr id="totalAmount" class="table-active">');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>Total');
    $('#totalAmount').append('<td>' + formatInvDate(maxDate));
    $('#totalAmount').append('<td style="text-align:right">' + to_currency(totalBalance));

    $('#container').append('<a class="float" data-toggle="modal" data-target="#newInvestment"><img src="img/addButton.svg" /></a>');
}

/*  *
    * show the investments listing view
    */

function addInvestmentDetails(_line, _investment) {

    //  format the investment details form
    $('#containerRow-' + _line).append('<div class="card"><div class="card-header">Investment details</div><div class="card-body"><form id="formEditInvestment-' + _line + '">'
        + '<input type="hidden" value="' + _investment.id + '" />'
        + '<div class="form-group"><label for="inputBank">Bank</label><input type="text" class="form-control" id="inputBank-' + _line + '" value="' + _investment.bank + '" /></div>'
        + '<div class="form-group"><label for="inputType">Type</label><input type="text" class="form-control" id="inputType-' + _line + '" value="' + _investment.type + '" /></div>'
        + '<div class="form-group"><label for="inputName">Name</label><input type="text" class="form-control" id="inputName-' + _line + '" value="' + _investment.name + '" /></div>'
        + '<div class="float-right"><button type="submit" class="btn btn-outline-primary" onclick="updateInvestment( ' + _line + ' );">Update</button> &nbsp;'
        + '<button type="submit" class="btn btn-outline-primary">Delete</button></div>'
        + '</form></div></div>');

    //  format the  operations details table
    let operationTable = '';
    let operationIndex = 1;

    _investment.operations.forEach((operation) => {
        operationTable += '<tr><td>' + operationIndex + '</td><td>' + formatInvDate(operation.date) + '</td><td>' + to_currency(operation.amount) + '</td></tr>';

        operationIndex++;
    });

    $('#containerRow-' + _line).append('<div class="card"><div class="card-header">Operations</div><div class="card-body"><form id="formManageOperations-' + _line + '">'
        + '<table class="table">'
        + '<thead><tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">Amount</th></thead>'
        + '<tbody>' + operationTable + '</tbody>'
        + '</table>'
        + '<div class="float-right"><button type="submit" class="btn btn-outline-primary">New</button> &nbsp;'
        + '<button type="submit" class="btn btn-outline-primary">Edit</button> &nbsp;'
        + '<button type="submit" class="btn btn-outline-primary">Delete</button></div>'
        + '</form></div></div>');

    //  format the revenue details table
    let revenueTable = '';
    let revenueIndex = 1;

    _investment.revenue.forEach((revenue) => {
        revenueTable += '<tr><td>' + revenueIndex + '</td><td>' + formatInvDate(revenue.date) + '</td><td>' + to_currency(revenue.amount) + '</td></tr>';

        revenueIndex++;
    });

    $('#containerRow-' + _line).append('<div class="card"><div class="card-header">Revenue</div><div class="card-body"><form id="formManageRevenue-' + _line + '">'
        + '<table class="table">'
        + '<thead><tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">Amount</th></thead>'
        + '<tbody>' + revenueTable + '</tbody>'
        + '</table>'
        + '<div class="float-right"><button type="submit" class="btn btn-outline-primary">New</button> &nbsp;'
        + '<button type="submit" class="btn btn-outline-primary">Edit</button> &nbsp;'
        + '<button type="submit" class="btn btn-outline-primary">Delete</button></div>'
        + '</form></div></div>');

    //  format the  balance details table
    let balanceTable = '';
    let balanceIndex = 1;

    _investment.balance.forEach((balance) => {
        balanceTable += '<tr><td>' + balanceIndex + '</td><td>' + formatInvDate(balance.date) + '</td><td>' + to_currency(balance.amount) + '</td></tr>';

        balanceIndex++;
    });

    $('#containerRow-' + _line).append('<div class="card"><div class="card-header">Balance</div><div class="card-body"><form id="formManageBalance-' + _line + '">'
        + '<table class="table">'
        + '<thead><tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">Amount</th></thead>'
        + '<tbody>' + balanceTable + '</tbody>'
        + '</table>'
        + '<div class="float-right"><button type="submit" class="btn btn-outline-primary">New</button> &nbsp;'
        + '<button type="submit" class="btn btn-outline-primary">Edit</button> &nbsp;'
        + '<button type="submit" class="btn btn-outline-primary">Delete</button></div>'
        + '</form></div></div>');
}

/*  *
    * add a new investment item
    */

function addNewInvestment() {

    let bank = $('#inputBank-new').val();
    let type = $('#inputType-new').val();
    let name = $('#inputName-new').val();
    let operationDate = $('#inputOperationDate-new').val();
    let operationAmount = $('#inputOperationAmount-new').val();
    let balanceDate = $('#inputBalanceDate-new').val();
    let balanceAmount = $('#inputBalanceAmount-new').val();
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
    if (0 < operationDate.length && 0 < operationAmount.length) {
        payload['operation'] = { date: operationDate, amount: operationAmount };
    }

    if (0 < balanceDate.length && 0 < balanceAmount.length) {
        payload['balance'] = { date: balanceDate, amount: balanceAmount };
    }

    //  if all field are validated, add the investment record
    let requestURL = '/investment/v1/investments';

    //  show the  spinner while loading the data from the API server
    $('#loadingSpinner').empty();
    $('#loadingSpinner').append('<div class="spinner-border text-ligth" role="status"><span class="sr-only">Updating ...</span></div>');

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
            $('#newInvestment').modal('hide');
        },
        success: (_result) => {

            //  hide the spinner and the modal
            $('#loadingSpinner').empty();
            $('#newInvestment').modal('hide');
        }
    });
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
    * show the investments evolution view
    */

function showInvestmentsEvolutionView() {

    $('#container').empty();
    $('#container').append('<table class="table table-hover">');
    $('table').append('<thead class="thead-dark">');
    $('thead').append('<tr>');
    $('tr').append('<th scope="col">#</th>');
    $('tr').append('<th scope="col">Bank</th>');
    $('tr').append('<th scope="col">Type</th>');
    $('tr').append('<th scope="col">Investment</th>');
    $('tr').append('<th scope="col">Start Date</th>');
    $('tr').append('<th scope="col">End Date</th>');
    $('tr').append('<th scope="col" style="text-align:right">Operations</th>');
    $('tr').append('<th scope="col" style="text-align:right">Profit</th>');
    $('tr').append('<th scope="col" style="text-align:right">Interests</th>');
    $('tr').append('<th scope="col" style="text-align:right">Balance</th>');
    $('table').append('<tbody>');

    let line = 1;
    let minDate = '';
    let maxDate = '';
    let totalOperations = 0;
    let totalProfit = 0;
    let totalInterests = 0;
    let totalBalance = 0;

    //  TODO: to make the title  columns bank, type and name to work as a filter
    investments.forEach((investment) => {
        let startDate = investment.balance[investment.balance.length - 1].date;
        let endDate = investment.balance[0].date;
        let operationsAmount = 0;
        let profitAmount = 0;

        //  summarize all operations
        investment.operations.forEach((operation) => {
            operationsAmount += operation.amount;
        });

        //  summarize all profit
        investment.revenue.forEach((revenue) => {
            profitAmount += revenue.amount;
        });

        //  evaluate the total interests
        let interestsAmount = investment.balance[0].amount - investment.balance[investment.balance.length - 1].amount;

        //  there were a previous balance before the current operations
        if (investment.balance[investment.balance.length - 1].amount != operationsAmount) {
            interestsAmount -= operationsAmount;
        }

        $('tbody').append('<tr id="' + investment.id + '">');
        $('#' + investment.id).append('<td>' + line);
        $('#' + investment.id).append('<td>' + investment.bank);
        $('#' + investment.id).append('<td>' + investment.type);
        $('#' + investment.id).append('<td>' + investment.name);
        $('#' + investment.id).append('<td>' + formatInvDate(startDate));
        $('#' + investment.id).append('<td>' + formatInvDate(endDate));
        $('#' + investment.id).append('<td style="text-align:right">' + to_currency(operationsAmount));
        $('#' + investment.id).append('<td style="text-align:right">' + to_currency(profitAmount));
        $('#' + investment.id).append('<td style="text-align:right">' + to_currency(interestsAmount));
        $('#' + investment.id).append('<td style="text-align:right">' + to_currency(investment.balance[0].amount));

        //  summarize the investment to the grand total
        if (minDate == '' || startDate < minDate) {
            minDate = startDate;
        }
        if (maxDate == '' || endDate > maxDate) {
            maxDate = endDate;
        }
        totalOperations += operationsAmount;
        totalProfit += profitAmount;
        totalInterests += interestsAmount;
        totalBalance += investment.balance[0].amount;

        line++;
    });

    $('tbody').append('<tr id="totalAmount" class="table-active">');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>Total');
    $('#totalAmount').append('<td>' + formatInvDate(minDate));
    $('#totalAmount').append('<td>' + formatInvDate(maxDate));
    $('#totalAmount').append('<td style="text-align:right">' + to_currency(totalOperations));
    $('#totalAmount').append('<td style="text-align:right">' + to_currency(totalProfit));
    $('#totalAmount').append('<td style="text-align:right">' + to_currency(totalInterests));
    $('#totalAmount').append('<td style="text-align:right">' + to_currency(totalBalance));
}

/*  *
* show the investments evolution view
*/

function showInvestmentsGraphicalView() {

    $('#container').empty();
    $('#container').append('<svg id="bankDistribution-pizza" width="1000" height="1000">'
        + '<path d="M 950,500 a 450,450 0 0,0 -675,-389 l -25,-44 a 500,500 0 0,1 750,433 z" fill="red" />'
        + '<path d="M 275,111 a 450,450 0 0,0 225,839 l 0,50 a 500,500 0 0,1 -250,-933 z" fill="yellow" />'
        + '<path d="M 500,950 a 450,450 0 0,0 450,-450 l 50,0 a 500,500 0 0,1 -500,500 z" fill="green" />'
        + '</svg>');
}

/*  *
    * auxiliary function to format an inverted date
    */

function formatInvDate(_date) {
    return _date.slice(6) + '/' + _date.slice(4, 6) + '/' + _date.slice(0, 4);
}

/*  *
    * auxiliary function to format a number as currency
    */

function to_currency(_number) {
    return _number.toFixed(2).replace(/(\d)(\d{3}[.,])/g, '$1,$2');
}