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
    let requestURL = "/investment/v1/investments";
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
        method: "GET",
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

        //  format the investment details form
        $('#mainTable').append('<tr class="collapse" id="collapseRow-' + line + '"><td colspan="6"><div class="container" id="containerRow-' + line + '">');
        $('#containerRow-' + line).append('<div class="card"><div class="card-header">Investment details</div><div class="card-body"><form id="formEditInvestment-' + line + '">'
            + '<input type="hidden" value="' + investment.id + '" />'
            + '<div class="form-group"><label for="inputBank">Bank</label><input type="text" class="form-control" id="inputBank-' + line + '" value="' + investment.bank + '" /></div>'
            + '<div class="form-group"><label for="inputType">Type</label><input type="text" class="form-control" id="inputType-' + line + '" value="' + investment.type + '" /></div>'
            + '<div class="form-group"><label for="inputName">Name</label><input type="text" class="form-control" id="inputName-' + line + '" value="' + investment.name + '" /></div>'
            + '<div class="float-right"><button type="submit" class="btn btn-outline-primary">Update</button> &nbsp;'
            + '<button type="submit" class="btn btn-outline-primary">Delete</button></div>'
            + '</form></div></div>');

        //  format the  operations details table
        let operationTable = '';
        let operationIndex = 1;

        investment.operations.forEach((operation) => {
            operationTable += '<tr><td>' + operationIndex + '</td><td>' + formatInvDate(operation.date) + '</td><td>' + to_currency(operation.amount) + '</td></tr>';

            operationIndex++;
        });

        $('#containerRow-' + line).append('<div class="card"><div class="card-header">Operations</div><div class="card-body"><form id="formManageOperations-' + line + '">'
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

        investment.revenue.forEach((revenue) => {
            revenueTable += '<tr><td>' + revenueIndex + '</td><td>' + formatInvDate(revenue.date) + '</td><td>' + to_currency(revenue.amount) + '</td></tr>';

            revenueIndex++;
        });

        $('#containerRow-' + line).append('<div class="card"><div class="card-header">Revenue</div><div class="card-body"><form id="formManageRevenue-' + line + '">'
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

        investment.balance.forEach((balance) => {
            balanceTable += '<tr><td>' + balanceIndex + '</td><td>' + formatInvDate(balance.date) + '</td><td>' + to_currency(balance.amount) + '</td></tr>';

            balanceIndex++;
        });

        $('#containerRow-' + line).append('<div class="card"><div class="card-header">Balance</div><div class="card-body"><form id="formManageBalance-' + line + '">'
            + '<table class="table">'
            + '<thead><tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">Amount</th></thead>'
            + '<tbody>' + balanceTable + '</tbody>'
            + '</table>'
            + '<div class="float-right"><button type="submit" class="btn btn-outline-primary">New</button> &nbsp;'
            + '<button type="submit" class="btn btn-outline-primary">Edit</button> &nbsp;'
            + '<button type="submit" class="btn btn-outline-primary">Delete</button></div>'
            + '</form></div></div>');

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

    $('#container').append('<a href="#" class="float"><img src="img/addButton.svg" /></a>');
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
    $('#container').append('<p>To be implemented</p>');
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
