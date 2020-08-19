////////////////////////////////////////////////////////////////////////////////
//  investmentsApp.js  -  Jul-11-2020 by aldebap
//
//  Investments web application
////////////////////////////////////////////////////////////////////////////////

//  constants

const LISTING_VIEW = 'listing';
const EVOLUTION_VIEW = 'evolution';
const GRAPHICAL_VIEW = 'graphical';

const UNORDERED = 'unordered';
const ORDERBYBANK_UP = 'orderByBank_up';
const ORDERBYBANK_DOWN = 'orderByBank_down';
const ORDERBYTYPE_UP = 'orderByType_up';
const ORDERBYTYPE_DOWN = 'orderByType_down';
const ORDERBYBALANCEAMOUNT_UP = 'orderByBalanceAmount_up';
const ORDERBYBALANCEAMOUNT_DOWN = 'orderByBalanceAmount_down';

//  globals

let currentView = '';
let currentOrder = UNORDERED;
let investments = [];
let bankSelection = [];
let typeSelection = [];

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
    let active = $('#activeOnly').is(':checked');
    let requestURL = '/investment/v1/investments';
    let queryString = '';

    console.log('[debug] load investments: ' + startDate + ' - ' + endDate + ' : ' + active);
    //  based on the filter options, format the investments service query string
    if (0 < startDate.length) {
        if (0 < queryString.length) {
            queryString += '&';
        }
        queryString += 'startDate=' + unformatDate(startDate);
    }
    if (0 < endDate.length) {
        if (0 < queryString.length) {
            queryString += '&';
        }
        queryString += 'endDate=' + unformatDate(endDate);
    }
    if (0 == active) {
        if (0 < queryString.length) {
            queryString += '&';
        }
        queryString += 'active=False';
    }

    if (0 < queryString.length) {
        requestURL += '?' + queryString;
    }
    console.log('[debug] load investments: query string: ' + queryString);

    //  show the  spinner while loading the data from the API server
    $('#loadingSpinner').empty();
    $('#loadingSpinner').append('<div class="spinner-border text-ligth" role="status"><span class="sr-only">Loading...</span></div>');

    //  call investment service on the API server
    investments = [];
    bankSelection = [];
    typeSelection = [];

    $.ajax({
        url: requestURL,
        method: 'GET',
        success: (_result) => {
            investments = _result['Investments'];

            //  save the original order
            let line = 1;

            investments.forEach((investment) => {
                investment.originalOrder = line++;
            });

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
    $('tr').append('<th scope="col">#</th>');
    $('tr').append('<th scope="col"><a class="text-white mr-2" href="#" onclick="switchBankOrder();">Bank</a>'
        + '<a href="#" onclick="selectBankFunnel();"><img src="img/funnel.svg" /></a>'
        + '<div class="float-right" id="bankOrderIcon" /></th>');
    $('tr').append('<th scope="col"><a class="text-white mr-2" href="#" onclick="switchTypeOrder();">Type</a>'
        + '<a href="#" onclick="selectTypeFilter();"><img src="img/funnel.svg" /></a>'
        + '<div class="float-right" id="typeOrderIcon" /></th>');
    $('tr').append('<th scope="col">Investment</th>');
    $('tr').append('<th scope="col">Date</th>');
    $('tr').append('<th scope="col" style="text-align:right"><a class="text-white" href="#" onclick="switchBalanceAmountOrder();">Balance</a><div class="float-right" id="balanceAmountOrderIcon" /></th>');
    $('tr').append('<th scope="col">&nbsp;</th>');
    $('table').append('<tbody id="investmentTable">');

    showOrderIndicator();
    showInvestmentTable();

    $('#container').append('<a class="float" onclick="showNewInvestmentModal();"><img src="img/addButton.svg" /></a>');
}

/*  *
    * switch the Bank order
    */

function switchBankOrder() {

    console.log('[debug] select bank order: ' + currentOrder);

    if (UNORDERED == currentOrder || (ORDERBYBANK_UP != currentOrder && ORDERBYBANK_DOWN != currentOrder)) {

        currentOrder = ORDERBYBANK_UP;

        investments.sort((a, b) => {
            if (a.bank < b.bank) {
                return -1;
            } else if (a.bank === b.bank) {
                return 0;
            } else {
                return 1;
            }
        });
        showInvestmentsView();
    } else if (ORDERBYBANK_UP == currentOrder) {

        currentOrder = ORDERBYBANK_DOWN;

        investments.reverse();
        showInvestmentsView();
    } else if (ORDERBYBANK_DOWN == currentOrder) {

        switchOffOrder();
    }
}

/*  *
    * switch the Type order
    */

function switchTypeOrder() {

    console.log('[debug] select type order: ' + currentOrder);

    if (UNORDERED == currentOrder || (ORDERBYTYPE_UP != currentOrder && ORDERBYTYPE_DOWN != currentOrder)) {

        currentOrder = ORDERBYTYPE_UP;

        investments.sort((a, b) => {
            if (a.type < b.type) {
                return -1;
            } else if (a.type === b.type) {
                return 0;
            } else {
                return 1;
            }
        });

        showInvestmentsView();
    } else if (ORDERBYTYPE_UP == currentOrder) {

        currentOrder = ORDERBYTYPE_DOWN;

        investments.reverse();
        showInvestmentsView();
    } else if (ORDERBYTYPE_DOWN == currentOrder) {

        switchOffOrder();
    }
}

/*  *
    * switch the balanceamount order
    */

function switchBalanceAmountOrder() {

    console.log('[debug] select balance amount order: ' + currentOrder);

    if (UNORDERED == currentOrder || (ORDERBYBALANCEAMOUNT_UP != currentOrder && ORDERBYBALANCEAMOUNT_DOWN != currentOrder)) {

        currentOrder = ORDERBYBALANCEAMOUNT_UP;

        investments.sort((a, b) => {
            if (a.balance[0].amount < b.balance[0].amount) {
                return -1;
            } else if (a.balance[0].amount === b.balance[0].amount) {
                return 0;
            } else {
                return 1;
            }
        });

        showInvestmentsView();
    } else if (ORDERBYBALANCEAMOUNT_UP == currentOrder) {

        currentOrder = ORDERBYBALANCEAMOUNT_DOWN;

        investments.reverse();
        showInvestmentsView();
    } else if (ORDERBYBALANCEAMOUNT_DOWN == currentOrder) {

        switchOffOrder();
    }
}

/*  *
    * switch off the order
    */

function switchOffOrder() {

    currentOrder = UNORDERED;

    investments.sort((a, b) => {
        if (a.originalOrder < b.originalOrder) {
            return -1;
        } else if (a.originalOrder === b.originalOrder) {
            return 0;
        } else {
            return 1;
        }
    });

    showInvestmentsView();
}

/*  *
    * show the order indicator
    */

function showOrderIndicator() {

    $('#bankOrderIcon').empty();
    $('#typeOrderIcon').empty();
    $('#balanceAmountOrderIcon').empty();

    if (ORDERBYBANK_UP == currentOrder) {

        $('#bankOrderIcon').append('<img class="text-white" src="img/sortAlphaUp.svg" />');

    } else if (ORDERBYBANK_DOWN == currentOrder) {

        $('#bankOrderIcon').append('<img class="text-white" src="img/sortAlphaDown.svg" />');
    } else if (ORDERBYTYPE_UP == currentOrder) {

        $('#typeOrderIcon').append('<img class="text-white" src="img/sortAlphaUp.svg" />');
    } else if (ORDERBYTYPE_DOWN == currentOrder) {

        $('#typeOrderIcon').append('<img class="text-white" src="img/sortAlphaDown.svg" />');
    } else if (ORDERBYBALANCEAMOUNT_UP == currentOrder) {

        $('#balanceAmountOrderIcon').append('<img class="text-white" src="img/sortNumericUp.svg" />');
    } else if (ORDERBYBALANCEAMOUNT_DOWN == currentOrder) {

        $('#balanceAmountOrderIcon').append('<img class="text-white" src="img/sortNumericDown.svg" />');
    }
}

/*  *
    * select Bank funnel
    */

function selectBankFunnel() {

    console.log('[debug] select bank funnel');

    //  get the list of all available banks
    let banks = [];

    investments.forEach((investment) => {
        if (!banks.includes(investment.bank)) {
            banks.push(investment.bank);
        }
    });

    //  make a list of checkboxes for each bank
    let index = 0;

    $('#funnelSelectionList').empty();

    banks.forEach((bank) => {

        let checked = "";

        if (0 == bankSelection.length || bankSelection.includes(bank)) {

            checked = "checked";
        }

        index++;

        $('#funnelSelectionList').append('<div class="form-check">'
            + '<input class="form-check-input" type="checkbox" value="" id="selectBank-' + index + '" ' + checked + '>'
            + '<label class="form-check-label" for="selectBank-' + index + '" id="selectBankLabel-' + index + '">' + bank + '</label>'
            + '</div>');
    });

    $('#funnelSelectionTitle').text('Bank Selection');
    $('#confirmFunnelSelection').attr('onclick', 'confirmBankFunnelSelection( ' + index + ' );');

    //  show the new Investment modal
    $('#funnelSelection').modal({
        show: true
    });

}

/*  *
    * Confirm Bank funnel selection
    */

function confirmBankFunnelSelection(maxIndex) {

    console.log('[debug] confirm bank funnel selection');

    bankSelection = [];

    //  get a list of all checked banks
    for (let index = 1; index <= maxIndex; index++) {

        if ($('#selectBank-' + index).is(':checked')) {

            bankSelection.push($('#selectBankLabel-' + index).text());
        }
    }

    $('#funnelSelection').modal('hide');

    showInvestmentTable();
}

/*  *
    * select Type filter
    */

function selectTypeFilter() {

    console.log('[debug] select type filter');
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
    $('tr').append('<th scope="col" style="text-align:right">Rate</th>');
    $('tr').append('<th scope="col" style="text-align:right">Balance</th>');
    $('table').append('<tbody id="investmentEvolutionTable">');

    //  TODO: all this business rules should be made on backend side
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
        let interestRate = 100 * interestsAmount / investment.balance[0].amount;

        $('#investmentEvolutionTable').append('<tr id="' + investment.id + '">');
        $('#' + investment.id).append('<td>' + line);
        $('#' + investment.id).append('<td>' + investment.bank);
        $('#' + investment.id).append('<td>' + investment.type);
        $('#' + investment.id).append('<td>' + investment.name);
        $('#' + investment.id).append('<td>' + formatInvDate(startDate));
        $('#' + investment.id).append('<td>' + formatInvDate(endDate));
        $('#' + investment.id).append('<td style="text-align:right">' + to_currency(operationsAmount));
        $('#' + investment.id).append('<td style="text-align:right">' + to_currency(profitAmount));
        if (0 <= interestsAmount) {
            $('#' + investment.id).append('<td style="text-align:right">' + to_currency(interestsAmount));
            $('#' + investment.id).append('<td style="text-align:right">' + interestRate.toFixed(3) + '%');
        } else {
            $('#' + investment.id).append('<td style="text-align:right" class="text-danger">' + to_currency(interestsAmount));
            $('#' + investment.id).append('<td style="text-align:right" class="text-danger">' + interestRate.toFixed(3) + '%');
        }
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

    let averageInterestRate = 100 * totalInterests / totalBalance;

    $('#investmentEvolutionTable').append('<tr id="totalAmount" class="table-active">');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>Total');
    $('#totalAmount').append('<td>' + formatInvDate(minDate));
    $('#totalAmount').append('<td>' + formatInvDate(maxDate));
    $('#totalAmount').append('<td style="text-align:right">' + to_currency(totalOperations));
    $('#totalAmount').append('<td style="text-align:right">' + to_currency(totalProfit));
    if (0 <= totalInterests) {
        $('#totalAmount').append('<td style="text-align:right">' + to_currency(totalInterests));
        $('#totalAmount').append('<td style="text-align:right">' + averageInterestRate.toFixed(3) + '%');
    } else {
        $('#totalAmount').append('<td style="text-align:right" class="text-danger">' + to_currency(totalInterests));
        $('#totalAmount').append('<td style="text-align:right" class="text-danger">' + averageInterestRate.toFixed(3) + '%');
    }
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
