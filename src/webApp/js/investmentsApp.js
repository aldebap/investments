////////////////////////////////////////////////////////////////////////////////
//  investmentsApp.js  -  Jul-11-2020 by aldebap
//
//  Investments web application
////////////////////////////////////////////////////////////////////////////////

//  constants

const LISTING_VIEW = 'listing';
const EVOLUTION_VIEW = 'evolution';
const GRAPHICAL_VIEW = 'graphical';

const ALERT_DEBUG = 'debug';
const ALERT_INFO = 'info';
const ALERT_WARNING = 'warning';
const ALERT_ERROR = 'error';

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
    * show alert message
    */

function showAlertMessage(_alertType, _message) {

    let colorClass = '';

    if (ALERT_DEBUG == _alertType) {
        colorClass = 'alert-secondary';
    } else if (ALERT_INFO == _alertType) {
        colorClass = 'alert-info';
    } else if (ALERT_WARNING == _alertType) {
        colorClass = 'alert-warning';
    } else if (ALERT_ERROR == _alertType) {
        colorClass = 'alert-danger';
    } else {
        colorClass = 'alert-primary';
    }

    $('#alertsContainer').empty();
    /*
    $('#toastContainer').append('<div id="infoToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-autohide="false">'
        + '<div class="toast-header">'
        + '<img src="..." class="rounded mr-2" alt="..." />'
        + '<strong class="mr-auto">Info</strong>'
        + '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
        + '</div>'
        + '<div class="toast-body">' + message + '</div>'
        + '</div>');
    
    $('#infoToast').toast('show');
    */
    $('#alertsContainer').append('<div class="alert ' + colorClass + '" role="alert">'
        + _message
        + '<button type="button" class="ml-2 mb-1 close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
        + '</div>');
}

/*  *
    * load investments from server
    */

function loadInvestments() {

    let startDate = $('#filterStartDate').val();
    let endDate = $('#filterEndDate').val();
    let active = $('#activeOnly').is(':checked');

    if (0 < startDate.length) {
        startDate = unformatDate(startDate);
    }
    if (0 < endDate.length) {
        endDate = unformatDate(endDate);
    }

    console.log('[debug] load investments: ' + startDate + ' - ' + endDate + ' : ' + active);
    showAlertMessage(ALERT_DEBUG, '[debug] load investments: ' + startDate + ' - ' + endDate + ' : ' + active);

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

function confirmBankFunnelSelection(_maxIndex) {

    bankSelection = [];

    //  get a list of all checked banks
    for (let index = 1; index <= _maxIndex; index++) {
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

function confirmTypeFunnelSelection(_maxIndex) {

    typeSelection = [];

    //  get a list of all checked types
    for (let index = 1; index <= _maxIndex; index++) {
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
