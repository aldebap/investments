////////////////////////////////////////////////////////////////////////////////
//  helper.js  -  Aug-02-2020 by aldebap
//
//  Helper functions
////////////////////////////////////////////////////////////////////////////////

//  constants

/*  *
    * helper function to format an inverted date
    */

function formatInvDate(_date) {
    return _date.slice(6) + '/' + _date.slice(4, 6) + '/' + _date.slice(0, 4);
}

/*  *
    * helper function to format a number as currency
    */

function to_currency(_number) {
    return _number.toFixed(2).replace(/(\d)(\d{3}[.,])/g, '$1,$2');
}
