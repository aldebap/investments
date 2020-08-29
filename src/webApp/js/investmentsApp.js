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
let funnelledInvestments = [];
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
    * show the spinner that indicates data being loading from the server
    */

function showSpinner() {

    $('#loadingSpinner').empty();
    $('#loadingSpinner').append('<div class="spinner-border text-ligth" role="status"><span class="sr-only">Loading...</span></div>');
}

/*  *
    * hide the spinner
    */

function hideSpinner() {

    $('#loadingSpinner').empty();
}

/*  *
    * load investments from server
    */

function loadInvestments() {

    let startDate = $('#filterStartDate').val();
    let endDate = $('#filterEndDate').val();
    let active = $('#activeOnly').is(':checked');

    console.log('[debug] load investments: ' + startDate + ' - ' + endDate + ' : ' + active);

    showSpinner();

    bankSelection = [];
    typeSelection = [];

    getAllInvestments(startDate, endDate, active, showLoadedInvestments);
}

/*  *
    * callback function to show investments loaded
    */

function showLoadedInvestments() {

    //  save the original order
    let line = 1;

    investments.forEach((investment) => {
        investment.originalOrder = line++;
    });

    funnelledInvestments = investments;

    showInvestmentsView();
    hideSpinner();
}

/*  *
    * switch the Bank order
    */

function switchBankOrder() {

    if (UNORDERED == currentOrder || (ORDERBYBANK_UP != currentOrder && ORDERBYBANK_DOWN != currentOrder)) {

        currentOrder = ORDERBYBANK_UP;
    } else if (ORDERBYBANK_UP == currentOrder) {

        currentOrder = ORDERBYBANK_DOWN;
    } else if (ORDERBYBANK_DOWN == currentOrder) {

        currentOrder = UNORDERED;
    }

    applyCurrentOrder();
    showInvestmentsView();
}

/*  *
    * switch the Type order
    */

function switchTypeOrder() {

    if (UNORDERED == currentOrder || (ORDERBYTYPE_UP != currentOrder && ORDERBYTYPE_DOWN != currentOrder)) {

        currentOrder = ORDERBYTYPE_UP;
    } else if (ORDERBYTYPE_UP == currentOrder) {

        currentOrder = ORDERBYTYPE_DOWN;
    } else if (ORDERBYTYPE_DOWN == currentOrder) {

        currentOrder = UNORDERED;
    }

    applyCurrentOrder();
    showInvestmentsView();
}

/*  *
    * switch the balanceamount order
    */

function switchBalanceAmountOrder() {

    if (UNORDERED == currentOrder || (ORDERBYBALANCEAMOUNT_UP != currentOrder && ORDERBYBALANCEAMOUNT_DOWN != currentOrder)) {

        currentOrder = ORDERBYBALANCEAMOUNT_UP;
    } else if (ORDERBYBALANCEAMOUNT_UP == currentOrder) {

        currentOrder = ORDERBYBALANCEAMOUNT_DOWN;
    } else if (ORDERBYBALANCEAMOUNT_DOWN == currentOrder) {

        currentOrder = UNORDERED;
    }

    applyCurrentOrder();
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
    * apply the current order
    */

function applyCurrentOrder() {

    //  order by bank
    if (ORDERBYBANK_UP == currentOrder || ORDERBYBANK_DOWN == currentOrder) {

        funnelledInvestments.sort((a, b) => {
            if (a.bank < b.bank) {
                return -1;
            } else if (a.bank === b.bank) {
                return 0;
            } else {
                return 1;
            }
        });
    }
    if (ORDERBYBANK_DOWN == currentOrder) {

        funnelledInvestments.reverse();
        return;
    }

    //  order by type
    if (ORDERBYTYPE_UP == currentOrder || ORDERBYTYPE_DOWN == currentOrder) {

        funnelledInvestments.sort((a, b) => {
            if (a.type < b.type) {
                return -1;
            } else if (a.type === b.type) {
                return 0;
            } else {
                return 1;
            }
        });
    }
    if (ORDERBYTYPE_DOWN == currentOrder) {

        funnelledInvestments.reverse();
        return;
    }

    //  order by balance amount
    if (ORDERBYBALANCEAMOUNT_UP == currentOrder || ORDERBYBALANCEAMOUNT_DOWN == currentOrder) {

        funnelledInvestments.sort((a, b) => {
            if (a.balance[0].amount < b.balance[0].amount) {
                return -1;
            } else if (a.balance[0].amount === b.balance[0].amount) {
                return 0;
            } else {
                return 1;
            }
        });
    }
    if (ORDERBYBALANCEAMOUNT_DOWN == currentOrder) {

        funnelledInvestments.reverse();
        return;
    }

    //  unordered means original order
    if (UNORDERED == currentOrder) {
        funnelledInvestments.sort((a, b) => {
            if (a.originalOrder < b.originalOrder) {
                return -1;
            } else if (a.originalOrder === b.originalOrder) {
                return 0;
            } else {
                return 1;
            }
        });
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

    //  show the funnel selection modal
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

    if (0 == bankSelection.length) {
        $('#funnelSelectionList').append('<p /><div class="alert alert-warning" role="alert">Need to select at least one bank</div>');
        return;
    }

    //  set a list with all funnelled investments
    funnelledInvestments = [];

    investments.forEach((investment) => {
        if (bankSelection.includes(investment.bank)
            && (0 == typeSelection.length || typeSelection.includes(investment.type))) {
            funnelledInvestments.push(investment);
        }
    });

    $('#funnelSelection').modal('hide');

    applyCurrentOrder();
    showInvestmentsView();
}

/*  *
    * select Type filter
    */

function selectTypeFunnel() {

    console.log('[debug] select type funnel');

    //  get the list of all available banks
    let types = [];

    investments.forEach((investment) => {
        if (!types.includes(investment.type)) {
            types.push(investment.type);
        }
    });

    //  make a list of checkboxes for each type
    let index = 0;

    $('#funnelSelectionList').empty();

    types.forEach((type) => {

        let checked = "";

        if (0 == typeSelection.length || typeSelection.includes(type)) {
            checked = "checked";
        }

        index++;

        $('#funnelSelectionList').append('<div class="form-check">'
            + '<input class="form-check-input" type="checkbox" value="" id="selectType-' + index + '" ' + checked + '>'
            + '<label class="form-check-label" for="selectType-' + index + '" id="selectTypeLabel-' + index + '">' + type + '</label>'
            + '</div>');
    });

    $('#funnelSelectionTitle').text('Type Selection');
    $('#confirmFunnelSelection').attr('onclick', 'confirmTypeFunnelSelection( ' + index + ' );');

    //  show the funnel selection modal
    $('#funnelSelection').modal({
        show: true
    });
}

/*  *
    * Confirm type funnel selection
    */

function confirmTypeFunnelSelection(maxIndex) {

    console.log('[debug] confirm type funnel selection');

    typeSelection = [];

    //  get a list of all checked types
    for (let index = 1; index <= maxIndex; index++) {
        if ($('#selectType-' + index).is(':checked')) {
            typeSelection.push($('#selectTypeLabel-' + index).text());
        }
    }
    //  TODO: think of a better way to show this alert warning
    if (0 == typeSelection.length) {
        $('#funnelSelectionList').append('<p /><div class="alert alert-warning" role="alert">Need to select at least one type</div>');
        return;
    }

    //  set a list with all funnelled investments
    funnelledInvestments = [];

    investments.forEach((investment) => {
        if ((0 == bankSelection.length || bankSelection.includes(investment.bank))
            && typeSelection.includes(investment.type)) {
            funnelledInvestments.push(investment);
        }
    });

    $('#funnelSelection').modal('hide');

    applyCurrentOrder();
    showInvestmentsView();
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
    $('tr').append('<th scope="col"><a class="text-white mr-2" href="#" onclick="switchBankOrder();">Bank</a>'
        + '<a href="#" onclick="selectBankFunnel();"><img src="img/funnel.svg" /></a>'
        + '<div class="float-right" id="bankOrderIcon" /></th>');
    $('tr').append('<th scope="col"><a class="text-white mr-2" href="#" onclick="switchTypeOrder();">Type</a>'
        + '<a href="#" onclick="selectTypeFunnel();"><img src="img/funnel.svg" /></a>'
        + '<div class="float-right" id="typeOrderIcon" /></th>');
    $('tr').append('<th scope="col">Investment</th>');
    $('tr').append('<th scope="col">Start Date</th>');
    $('tr').append('<th scope="col">End Date</th>');
    $('tr').append('<th scope="col" style="text-align:right">Operations</th>');
    $('tr').append('<th scope="col" style="text-align:right">Profit</th>');
    $('tr').append('<th scope="col" style="text-align:right">Interests</th>');
    $('tr').append('<th scope="col" style="text-align:right">Rate</th>');
    $('tr').append('<th scope="col" style="text-align:right"><a class="text-white" href="#" onclick="switchBalanceAmountOrder();">Balance</a><div class="float-right" id="balanceAmountOrderIcon" /></th>');
    $('table').append('<tbody id="investmentEvolutionTable">');

    //  TODO: need to show order indicator for this view
    //  TODO: all this business rules should be made on backend side
    let line = 1;
    let minDate = '';
    let maxDate = '';
    let totalOperations = 0;
    let totalProfit = 0;
    let totalInterests = 0;
    let totalBalance = 0;

    funnelledInvestments.forEach((investment) => {
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

    funnelledInvestments.forEach((investment) => {
        if (investment.bank in data) {
            data[investment.bank] += investment.balance[0].amount;
        } else {
            data[investment.bank] = investment.balance[0].amount;
        }
    });

    donutGraphic(distributionByBankID, parameters, data);

    //  sum the balance amounts grouped by type
    data = {};

    funnelledInvestments.forEach((investment) => {
        if (investment.type in data) {
            data[investment.type] += investment.balance[0].amount;
        } else {
            data[investment.type] = investment.balance[0].amount;
        }
    });

    donutGraphic(distributionByTypeID, parameters, data);
}
