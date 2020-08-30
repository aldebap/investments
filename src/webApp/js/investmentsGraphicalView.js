////////////////////////////////////////////////////////////////////////////////
//  investmentsGraphicasView.js  -  Aug-29-2020 by aldebap
//
//  Investments graphical view
////////////////////////////////////////////////////////////////////////////////

//  constants

//  globals

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
