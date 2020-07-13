/*  *
    * get investments from API server
    */

function getInvestments() {

    $('#container').empty();
    $('#container').append('<table class="table table-hover">');
    $('table').append('<thead class="thead-dark">');
    $('thead').append('<tr>');
    $('tr').append('<th scope="col">#</th>');
    $('tr').append('<th scope="col">Bank</th>');
    $('tr').append('<th scope="col">Type</th>');
    $('tr').append('<th scope="col">Investment</th>');
    $('tr').append('<th scope="col">Date</th>');
    $('tr').append('<th scope="col">Balance</th>');
    $('table').append('<tbody>');

    //  call investment service on the API server
    $.ajax({
        url: "/investment/v1/invetments",
        method: "GET",
        success: (_result) => {
            let line = 1;
            let maxDate = '';
            let totalAmount = 0;

            _result['Investments'].forEach((investment) => {
                $('tbody').append('<tr id="' + investment.id + '">');
                $('#' + investment.id).append('<td>' + line);
                $('#' + investment.id).append('<td>' + investment.bank);
                $('#' + investment.id).append('<td>' + investment.type);
                $('#' + investment.id).append('<td>' + investment.name);
                $('#' + investment.id).append('<td>' + investment.balance[0].date.slice(6) + '/' + investment.balance[0].date.slice(4, 6)
                    + '/' + investment.balance[0].date.slice(0, 4));
                $('#' + investment.id).append('<td style="text-align:right">' + investment.balance[0].amount.toFixed(2));

                if (maxDate == '' || investment.balance[0].date > maxDate) {
                    maxDate = investment.balance[0].date;
                }
                totalAmount += investment.balance[0].amount;
                line++;
            });

            $('tbody').append('<tr id="totalAmount" class="table-active">');
            $('#totalAmount').append('<td>Total');
            $('#totalAmount').append('<td>&nbsp;');
            $('#totalAmount').append('<td>&nbsp;');
            $('#totalAmount').append('<td>&nbsp;');
            $('#totalAmount').append('<td>' + maxDate.slice(6) + '/' + maxDate.slice(4, 6) + '/' + maxDate.slice(0, 4));
            $('#totalAmount').append('<td style="text-align:right">' + totalAmount.toFixed(2));
        }
    });
}
