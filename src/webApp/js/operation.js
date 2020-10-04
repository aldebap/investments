////////////////////////////////////////////////////////////////////////////////
//  operation.js  -  Aug-02-2020 by aldebap
//
//  Operation components
////////////////////////////////////////////////////////////////////////////////

//  constants

const operationsRoute = '/operations';

/*  *
    * Add a new operation
    */

function addNewOperation(_investmentId, _payload, newOperationCallbackFunc) {

    //  assemble the request URL
    let requestURL = investmentsRoute + '/' + _investmentId + operationsRoute;

    console.log('[debug] insert payload: ' + JSON.stringify(_payload));

    $.ajax({
        url: requestURL,
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(_payload),
        processData: false,
        error: () => {

            console.log('[debug] Error attempting to add operation');
            newOperationCallbackFunc('Error trying to add operation data');
        },
        success: (_result) => {

            //  TODO: insert the new investment to investments array
            newOperationCallbackFunc('');
        }
    });
}

/*  *
    * update Operation item
    */

function patchOperation(_investmentId, _operationId, _payload, patchOperationCallbackFunc) {

    //  assemble the request URL
    let requestURL = investmentsRoute + '/' + _investmentId + operationsRoute + '/' + _operationId;

    console.log('[debug] update operation: ' + _investmentId + ' --> ' + _operationId);

    $.ajax({
        url: requestURL,
        method: 'PATCH',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(_payload),
        processData: false,
        error: () => {

            console.log('[debug] Error attempting to patch operation');
            patchOperationCallbackFunc('Error trying to patch operation data');
        },
        success: (_result) => {

            patchOperationCallbackFunc('');
        }
    });
}

/*  *
    * delete operation item
    */

function deleteOperation(_investmentId, _operationId, deleteOperationCallbackFunc) {

    //  assemble the request URL
    let requestURL = investmentsRoute + '/' + _investmentId + operationsRoute + '/' + _operationId;

    console.log('[debug] delete operation: ' + _investmentId + ' --> ' + _operationId);

    $.ajax({
        url: requestURL,
        method: 'DELETE',
        error: () => {

            console.log('[debug] Error attempting to delete operation');
            deleteOperationCallbackFunc('Error trying to delete operation data');
        },
        success: (_result) => {

            deleteOperationCallbackFunc('');
        }
    });
}
