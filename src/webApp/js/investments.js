////////////////////////////////////////////////////////////////////////////////
//  investments.js  -  Jul-11-2020 by aldebap
//
//  Investments web application
////////////////////////////////////////////////////////////////////////////////

//  constants

const LISTING_VIEW = 'listing';
const EVOLUTION_VIEW = 'evolution';
const GRAPHICAL_VIEW = 'graphical';

const CRUD_BUTTONS = 'crud';
const CONFIRMATION_BUTTONS = 'confirmation';

//  globals

let currentView = '';
let investments = [];

/*  *
    * select listing view as the current investments view
    */

function selectListingView() {
    currentView = LISTING_VIEW;
}

/*  *
    * select evolution view as the current investments view
    */

function selectEvolutionView() {
    currentView = EVOLUTION_VIEW;
}

/*  *
    * select graphical view as the current investments view
    */

function selectGraphicalView() {
    currentView = GRAPHICAL_VIEW;
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
    if (LISTING_VIEW == currentView) {
        showInvestmentsListingView();
    } else if (EVOLUTION_VIEW == currentView) {
        showInvestmentsEvolutionView();
    } else if (GRAPHICAL_VIEW == currentView) {
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
    //  TODO: to make the title  columns bank, type and name to work as a filter
    $('tr').append('<th scope="col">#</th>');
    $('tr').append('<th scope="col">Bank</th>');
    $('tr').append('<th scope="col">Type</th>');
    $('tr').append('<th scope="col">Investment</th>');
    $('tr').append('<th scope="col">Date</th>');
    $('tr').append('<th scope="col" style="text-align:right">Balance</th>');
    $('table').append('<tbody id="mainTable">');

    showInvestmentTable();

    $('#container').append('<a class="float" onclick="showNewInvestmentModal();"><img src="img/addButton.svg" /></a>');
}

/*  *
    * show the investments table
    */

function showInvestmentTable() {

    let line = 1;
    let maxDate = '';
    let totalBalance = 0;

    $('#mainTable').empty();

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

        showInvestmentTableDetails(line, investment);

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
        + '<thead><tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">Amount</th></thead>'
        + '<tbody id="operationDetail-' + _line + '"></tbody>'
        + '</table>'
        + '<div class="float-right" id="operationDetailButtons-' + _line + '"><button type="submit" class="btn btn-outline-primary" onclick="showNewOperationInputFields( ' + _line + ' );">New</button> &nbsp;'
        + '<button type="button" class="btn btn-outline-primary">Edit</button> &nbsp;'
        + '<button type="button" class="btn btn-outline-primary">Delete</button></div>'
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

    showOperationTableDetails(_line);
    showOperationDetailsButtons(_line, CRUD_BUTTONS);
}

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
            + '<td>' + to_currency(operation.amount) + '</td></tr>');

        operationIndex++;
    });
}

/*  *
    * show the operation details buttons
    */

function showOperationDetailsButtons(_line, _buttonsType) {

    $('#operationDetailButtons-' + _line).empty();

    if (CRUD_BUTTONS == _buttonsType) {

        $('#operationDetailButtons-' + _line).append('<button type="submit" class="btn btn-outline-primary" onclick="showNewOperationInputFields( ' + _line + ' );">New</button> &nbsp;');
        $('#operationDetailButtons-' + _line).append('<button type="button" class="btn btn-outline-primary">Edit</button> &nbsp;');
        $('#operationDetailButtons-' + _line).append('<button type="button" class="btn btn-outline-primary">Delete</button>');
    } else if (CONFIRMATION_BUTTONS == _buttonsType) {

        $('#operationDetailButtons-' + _line).append('<button type="submit" class="btn btn-outline-primary" onclick="confirmNewOperation( ' + _line + ' );">Confirm</button> &nbsp;');
        $('#operationDetailButtons-' + _line).append('<button type="button" class="btn btn-outline-primary" onclick="cancelNewOperation( ' + _line + ' );">Cancel</button>');
    }
}

/*  *
    * show the input fields to allow adding a new operation
    */

function showNewOperationInputFields(_line) {

    $('#operationDetail-' + _line).append('<tr><td>New</td>'
        + '<td><input type="text" class="form-control" id="inputNewOperationDate-' + _line + '" /></td>'
        + '<td><input type="text" class="form-control" id="inputNewOperationAmount-' + _line + '" /></td></tr>');

    showOperationDetailsButtons(_line, CONFIRMATION_BUTTONS);
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

    showOperationDetailsButtons(_line, CRUD_BUTTONS);
}

/*  *
    * Confirm adding a new operation
    */

function cancelNewOperation(_line) {

    showOperationTableDetails(_line);
    showOperationDetailsButtons(_line, CRUD_BUTTONS);
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
    * show the delete investment modal
    */

function showDeleteInvestmentModal(_line) {

    console.log('[debug] showDeleteInvestmentModal()');

    //  set the investmentId to be deleted
    let investmentId = $('#inputInvestmentId-' + _line).val();

    $('#deleteInvestmentId').val(investmentId);

    //  show the new Investment modal
    $('#deleteInvestment').modal({
        show: true
    });
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

    const distributionByBankID = "distributionByBank";
    const distributionByTypeID = "distributionByType";

    $('#container').empty();
    $('#container').append('<div class="card"><div class="card-header">Distribution by Bank</div><div class="card-body" id="' + distributionByBankID + '" /></div></div>');
    $('#container').append('<div class="card"><div class="card-header">Distribution by Investment Type</div><div class="card-body" id="' + distributionByTypeID + '" /></div></div>');

    let parameters = {};

    parameters = {
        width: $('#' + distributionByBankID).width()
        , height: (400 < 0.6 * $('#' + distributionByBankID).width()) ? 400 : Math.round(0.6 * $('#' + distributionByBankID).width())
        , colourPallete: 'PASTEL'
    };

    //  sum the balance amounts grouped by bank
    let data = {};

    investments.forEach((investment) => {
        if (investment.bank in data) {
            data[investment.bank] += investment.balance[0].amount;
        } else {
            data[investment.bank] = investment.balance[0].amount;
        }
    });

    donutGraphic(distributionByBankID, parameters, data);

    //  sum the balance amounts grouped by type
    data = {};

    investments.forEach((investment) => {
        if (investment.type in data) {
            data[investment.type] += investment.balance[0].amount;
        } else {
            data[investment.type] = investment.balance[0].amount;
        }
    });

    donutGraphic(distributionByTypeID, parameters, data);
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
