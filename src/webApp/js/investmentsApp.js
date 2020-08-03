////////////////////////////////////////////////////////////////////////////////
//  investmentsApp.js  -  Jul-11-2020 by aldebap
//
//  Investments web application
////////////////////////////////////////////////////////////////////////////////

//  constants

const LISTING_VIEW = 'listing';
const EVOLUTION_VIEW = 'evolution';
const GRAPHICAL_VIEW = 'graphical';

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
    $('table').append('<tbody id="investmentTable">');

    showInvestmentTable();

    $('#container').append('<a class="float" onclick="showNewInvestmentModal();"><img src="img/addButton.svg" /></a>');
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
    $('table').append('<tbody id="investmentEvolutionTable">');

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

        $('#investmentEvolutionTable').append('<tr id="' + investment.id + '">');
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

    $('#investmentEvolutionTable').append('<tr id="totalAmount" class="table-active">');
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
