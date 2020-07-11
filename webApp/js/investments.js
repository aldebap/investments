/*  *
    * get investments from API server
    */

function getInvestments() {

    //  call investment service on the API server
    $.ajax({
        url: "/investment/v1/invetments",
        method: "GET",
        success: (_result) => {
            console.log("object program: \"" + _result + "\"");
        }
    });
}
