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
    //$('tr').append('<th scope="col"><div class="dropdown"><button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Bank</button><div class="dropdown-menu" aria-labelledby="dropdownMenuButton"><a class="dropdown-item" href="#">Banco do Brasil</a><a class="dropdown-item" href="#">Santander</a></div></div></th>');
    $('tr').append('<th scope="col">Type</th>');
    $('tr').append('<th scope="col">Investment</th>');
    $('tr').append('<th scope="col">Date</th>');
    $('tr').append('<th scope="col">Balance</th>');
    $('table').append('<tbody>');

    let line = 1;
    let maxDate = '';
    let totalAmount = 0;

    //  TODO: to make the title  columns bank, type and name to work as a filter
    //  TODO: to make the investment line click to show the investment evolution
    investments.forEach((investment) => {
        $('tbody').append('<tr id="' + investment.id + '">');
        $('#' + investment.id).append('<td>' + line);
        $('#' + investment.id).append('<td>' + investment.bank);
        $('#' + investment.id).append('<td>' + investment.type);
        $('#' + investment.id).append('<td>' + investment.name);
        $('#' + investment.id).append('<td>' + investment.balance[0].date.slice(6) + '/' + investment.balance[0].date.slice(4, 6)
            + '/' + investment.balance[0].date.slice(0, 4));
        $('#' + investment.id).append('<td style="text-align:right">' + investment.balance[0].amount.toFixed(2).replace(/(\d)(\d{3}[.,])/g, '$1,$2'));

        if (maxDate == '' || investment.balance[0].date > maxDate) {
            maxDate = investment.balance[0].date;
        }
        totalAmount += investment.balance[0].amount;
        line++;
    });

    $('tbody').append('<tr id="totalAmount" class="table-active">');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>Total');
    $('#totalAmount').append('<td>' + maxDate.slice(6) + '/' + maxDate.slice(4, 6) + '/' + maxDate.slice(0, 4));
    $('#totalAmount').append('<td style="text-align:right">' + totalAmount.toFixed(2).replace(/(\d)(\d{3}[.,])/g, '$1,$2'));
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
    $('tr').append('<th scope="col">Operations</th>');
    $('tr').append('<th scope="col">Profit</th>');
    $('tr').append('<th scope="col">Interests</th>');
    $('tr').append('<th scope="col">Balance</th>');
    $('table').append('<tbody>');

    let line = 1;
    let maxDate = '';
    let totalAmount = 0;

    //  TODO: to make the title  columns bank, type and name to work as a filter
    //  TODO: to make the investment line click to show the investment evolution
    investments.forEach((investment) => {
        $('tbody').append('<tr id="' + investment.id + '">');
        $('#' + investment.id).append('<td>' + line);
        $('#' + investment.id).append('<td>' + investment.bank);
        $('#' + investment.id).append('<td>' + investment.type);
        $('#' + investment.id).append('<td>' + investment.name);
        $('#' + investment.id).append('<td>' + 'TODO ...');
        $('#' + investment.id).append('<td>' + investment.balance[0].date.slice(6) + '/' + investment.balance[0].date.slice(4, 6)
            + '/' + investment.balance[0].date.slice(0, 4));
        $('#' + investment.id).append('<td>' + 'TODO ...');
        $('#' + investment.id).append('<td>' + 'TODO ...');
        $('#' + investment.id).append('<td>' + 'TODO ...');
        $('#' + investment.id).append('<td style="text-align:right">' + investment.balance[0].amount.toFixed(2).replace(/(\d)(\d{3}[.,])/g, '$1,$2'));

        if (maxDate == '' || investment.balance[0].date > maxDate) {
            maxDate = investment.balance[0].date;
        }
        totalAmount += investment.balance[0].amount;
        line++;
    });

    $('tbody').append('<tr id="totalAmount" class="table-active">');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>Total');
    $('#totalAmount').append('<td>' + '---');
    $('#totalAmount').append('<td>' + maxDate.slice(6) + '/' + maxDate.slice(4, 6) + '/' + maxDate.slice(0, 4));
    $('#totalAmount').append('<td>' + 'TODO ...');
    $('#totalAmount').append('<td>' + 'TODO ...');
    $('#totalAmount').append('<td>' + 'TODO ...');
    $('#totalAmount').append('<td style="text-align:right">' + totalAmount.toFixed(2).replace(/(\d)(\d{3}[.,])/g, '$1,$2'));
}

/*  *
    * show the investments evolution view
    */

function showInvestmentsGraphicalView() {
    $('#container').empty();
    $('#container').append('<p>To be implemented</p>');
}
