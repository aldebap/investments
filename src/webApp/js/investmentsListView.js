////////////////////////////////////////////////////////////////////////////////
//  investmentsListView.js  -  Aug-26-2020 by aldebap
//
//  Investments view
////////////////////////////////////////////////////////////////////////////////

//  constants

//  globals

let editingInvestmentLine = 0;

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
        + '<a href="#" onclick="selectTypeFunnel();"><img src="img/funnel.svg" /></a>'
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
    * show the investments table
    */

function showInvestmentTable() {

    let line = 1;
    let maxDate = '';
    let totalBalance = 0;

    $('#investmentTable').empty();

    funnelledInvestments.forEach((investment) => {
        $('#investmentTable').append('<tr id="investmentRow-' + line + '">');
        $('#investmentTable').append('<tr class="collapse" id="collapseInvestmentButtons-' + line + '"><td colspan="7" id="investmentButtons-' + line + '">');
        $('#investmentTable').append('<tr class="collapse" id="collapseRow-' + line + '"><td colspan="7"><div class="container" id="containerRow-' + line + '">');

        showInvestmentLine(line);
        showInvestmentTableDetails(line, investment);

        $('#containerRow-' + line).append('</div></td></tr>');

        //  summarize the investment to the grand total
        if (maxDate == '' || investment.balance[0].date > maxDate) {
            maxDate = investment.balance[0].date;
        }
        totalBalance += investment.balance[0].amount;
        line++;
    });

    $('#investmentTable').append('<tr id="totalAmount" class="table-active">');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>&nbsp;');
    $('#totalAmount').append('<td>Total');
    $('#totalAmount').append('<td>' + formatInvDate(maxDate));
    $('#totalAmount').append('<td style="text-align:right">' + to_currency(totalBalance));
    $('#totalAmount').append('<td>&nbsp;');

    editingInvestmentLine = 0;
}

/*  *
    * show an investment table line
    */

function showInvestmentLine(_line) {

    console.log('[debug] show edit investment fields: ' + _line);

    //  set the investmentId and the operationId to be deleted
    let investment = funnelledInvestments[_line - 1];

    $('#investmentRow-' + _line).empty();
    $('#investmentRow-' + _line).append('<th>' + _line);
    $('#investmentRow-' + _line).append('<td>' + investment.bank);
    $('#investmentRow-' + _line).append('<td>' + investment.type);
    $('#investmentRow-' + _line).append('<td>' + investment.name);
    $('#investmentRow-' + _line).append('<td>' + formatInvDate(investment.balance[0].date));
    $('#investmentRow-' + _line).append('<td style="text-align:right">' + to_currency(investment.balance[0].amount));
    $('#investmentRow-' + _line).append('<td class="mx-0 px-0"><a class="dropdown-toggle" href="#" role="button" id="investmentThreeDotsButton-' + _line + '" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
        + '<img class="text-primary" src="img/threeDotsVertical.svg" /></a>'
        + '<div class="dropdown-menu" id="investmentOptionsMenu-' + _line + '" aria-labelledby="investmentThreeDotsButton-' + _line + '">'
        + '<button class="dropdown-item" type="button" onclick="showEditInvestmentInputFields( ' + _line + ' );">Edit</button>'
        + '<button class="dropdown-item" type="button" onclick="showDeleteInvestmentModal( ' + _line + ' );">Delete</button></div>'

        + '&nbsp; <a data-toggle="collapse" href="#collapseRow-' + _line + '" role="button" aria-expanded="false" aria-controls="collapseRow-' + _line + '">'
        + '<img id="caret-' + _line + '" src="img/caretDown.svg" /></a></td>');

    // events the change the caret up and down according to the condition of the collapse row
    $('#collapseRow-' + _line).on('shown.bs.collapse', () => {
        $('#caret-' + _line).attr('src', 'img/caretUp.svg');
    });

    $('#collapseRow-' + _line).on('hidden.bs.collapse', () => {
        $('#caret-' + _line).attr('src', 'img/caretDown.svg');
    });

    $('#investmentButtons-' + _line).empty();
    $('#collapseInvestmentButtons-' + _line).collapse('hide');

    editingInvestmentLine = 0;
}

/*  *
    * show the investment details
    */

function showInvestmentTableDetails(_line, _investment) {

    //  TODO: only one details open at a time

    let investment = funnelledInvestments[_line - 1];

    //  format the investment details form
    $('#containerRow-' + _line).append('<div class="card"><div class="card-header">Investment details</div><div class="card-body">'
        + '<table class="table"><tbody>'
        + '<tr><th>Bank</th><td>' + investment.bank + '</td></tr>'
        + '<tr><th>Type</th><td>' + investment.type + '</td></tr>'
        + '<tr><th>Name</th><td>' + investment.name + '</td></tr>'
        + '</tbody></table>'
        + '</div></div>');

    $('#containerRow-' + _line).append('<div class="card"><div class="card-header">Operations</div><div class="card-body"><form id="formManageOperations-' + _line + '">'
        + '<table class="table">'
        + '<thead><tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">Amount</th></tr></thead>'
        + '<tbody id="operationDetail-' + _line + '"></tbody>'
        + '</table>'
        + '<div class="float-right" id="operationDetailButtons-' + _line + '"></div>'
        + '</form></div></div>');

    $('#containerRow-' + _line).append('<div class="card"><div class="card-header">Revenue</div><div class="card-body"><form id="formManageRevenue-' + _line + '">'
        + '<table class="table">'
        + '<thead><tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">Amount</th></tr></thead>'
        + '<tbody id="revenueDetail-' + _line + '"></tbody>'
        + '</table>'
        + '<div class="float-right" id="revenueDetailButtons-' + _line + '"></div>'
        + '</form></div></div>');

    $('#containerRow-' + _line).append('<div class="card"><div class="card-header">Balance</div><div class="card-body"><form id="formManageBalance-' + _line + '">'
        + '<table class="table">'
        + '<thead><tr><th scope="col">#</th><th scope="col">Date</th><th scope="col">Amount</th></tr></thead>'
        + '<tbody id="balanceDetail-' + _line + '"></tbody>'
        + '</table>'
        + '<div class="float-right" id="balanceDetailButtons-' + _line + '"></div>'
        + '</form></div></div>');

    showOperationTableDetails(_line);
    showRevenueTableDetails(_line);
    showBalanceTableDetails(_line);
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
    * Confirm adding a new investment
    */

function confirmNewInvestment() {

    let bank = $('#inputBank-new').val();
    let type = $('#inputType-new').val();
    let name = $('#inputName-new').val();
    let operationDate = $('#inputOperationDate-new').val();
    let operationAmount = Number($('#inputOperationAmount-new').val());
    let balanceDate = $('#inputBalanceDate-new').val();
    let balanceAmount = Number($('#inputBalanceAmount-new').val());
    let payload = {};

    //  TODO: need to make consistencies of required fileds
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
    showSpinner();
    addNewInvestment(payload, newInvestmentCallback);

    $('#newInvestment').modal('hide');
}

/*  *
    * New investment callback function
    */

function newInvestmentCallback(message) {

    if ('' == message) {

        showAlertMessage(ALERT_INFO, 'New investment sucessfully added');
        showInvestmentsView();
    } else {

        showAlertMessage(ALERT_ERROR, message);
    }
    hideSpinner();
}

/*  *
    * show the input fields to allow editing an investment
    */

function showEditInvestmentInputFields(_line) {

    console.log('[debug] show edit investment fields: ' + _line);

    //  if edit fields are shown for another line, hide them in order to have only one editing line at a time
    if (0 != editingInvestmentLine) {

        showInvestmentLine(editingInvestmentLine);
    }

    //  set the investmentId and the operationId to be deleted
    let investment = funnelledInvestments[_line - 1];

    $('#investmentRow-' + _line).empty();
    $('#investmentRow-' + _line).append('<td>' + _line);
    $('#investmentRow-' + _line).append('<td><input type="text" class="form-control" id="inputEditInvestmentBank-' + _line + '" value="' + investment.bank + '"></td>');
    $('#investmentRow-' + _line).append('<td><input type="text" class="form-control" id="inputEditInvestmentType-' + _line + '" value="' + investment.type + '"></td>');
    $('#investmentRow-' + _line).append('<td><input type="text" class="form-control" id="inputEditInvestmentName-' + _line + '" value="' + investment.name + '"></td>');
    $('#investmentRow-' + _line).append('<td>' + formatInvDate(investment.balance[0].date) + '</td>');
    $('#investmentRow-' + _line).append('<td style="text-align:right">' + to_currency(investment.balance[0].amount) + '</td>');
    $('#investmentRow-' + _line).append('<td>&nbsp;</td>');

    $('#investmentButtons-' + _line).empty();
    $('#investmentButtons-' + _line).append('<button type="submit" class="btn btn-outline-secondary float-right" onclick="showInvestmentLine(' + _line + ');">Cancel</button>');
    $('#investmentButtons-' + _line).append('<button type="submit" class="btn btn-outline-primary float-right mr-2" onclick="updateInvestment(' + _line + ');">Confirm</button>');
    $('#collapseInvestmentButtons-' + _line).collapse('show');

    editingInvestmentLine = _line;
}

/*  *
    * show the delete investment modal
    */

function showDeleteInvestmentModal(_line) {

    console.log('[debug] showDeleteInvestmentModal()');

    //  set the investmentId to be deleted
    let investment = funnelledInvestments[_line - 1];

    $('#deleteConfimationMessage').empty();
    $('#deleteConfimationMessage').append('<p>Delete the investment "' + investment.name + '" at ' + investment.bank + '</p>');
    $('#formDeleteInvestment').empty();
    $('#formDeleteInvestment').append('<button type="button" class="btn btn-outline-primary" onclick="deleteInvestment(' + _line + ');">Confirm</button> &nbsp;');
    $('#formDeleteInvestment').append('<button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>');

    //  show the new Investment modal
    $('#confirmExclusion').modal({ show: true });
}