////////////////////////////////////////////////////////////////////////////////
//  investmentsEvolutionView.js  -  Aug-29-2020 by aldebap
//
//  Investments evolution view
////////////////////////////////////////////////////////////////////////////////

//  constants

//  globals

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

    showOrderIndicator();
    showEvolutionTable();
}

/*  *
    * show the investments evolution table
    */

function showEvolutionTable() {

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
