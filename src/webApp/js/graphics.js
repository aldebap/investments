////////////////////////////////////////////////////////////////////////////////
//  graphics.js  -  Jul-22-2020 by aldebap
//
//  Functions to genarete graphics
////////////////////////////////////////////////////////////////////////////////

//  constants

const DEFAULT_PALLETE = ['red', 'yellow', 'green', 'blue', 'gray'];
const PASTEL_PALLETE = ['#38908F', '#B2E8E0', '#CA7E8D', '#909090', '#F3DDB3', '#C1CD97', '#E18D96', '#C884BA', '#D2A3A9', '#E6DCE5'
    , '#EBC3C1', '#ECAD8F', '#AF6E4E', '#9DABDD', '#70AE98', '#ECBE7A', '#BC85A3', '#E6B655', '#5E96AE', '#CA7E8D', '#D3C0f9'];

/*  *
    * Genarete a donut graphic
    */

function donutGraphic(_elementId, _parameters, _data) {

    let width = 400;
    let height = 400;
    let colourPallete = DEFAULT_PALLETE;

    //  get the parameters
    if ('width' in _parameters) {
        width = _parameters['width'];
    }
    if ('height' in _parameters) {
        height = _parameters['height'];
    }
    if ('colourPallete' in _parameters) {
        if ('PASTEL' == _parameters['colourPallete']) {
            colourPallete = PASTEL_PALLETE;
        }
    }
    //  TODO: there must be a property to select the reference in the bottom, left, top, right
    //  TODO: there must be a property to show the % of each element  in the reference
    //  TODO: there must be a property to show the value of each element in the reference
    //  TODO: there must be a property to show a box around the reference

    //  evaluate the sum of all data elements
    var sum = 0;

    for (var fieldName in _data) {
        sum += _data[fieldName];
    }

    //  genarete the donut slices
    var outerRadix = height / 2;
    var innerRadix = 0.6 * outerRadix;
    var startAngle = 0;
    var sliceNumber = 0;
    var donutSlices = '';

    for (var fieldName in _data) {

        var endAngle = startAngle + 2 * Math.PI * _data[fieldName] / sum;
        var innerArcFlag = ' 0 0,0 ';
        var outterArcFlag = ' 0 0,1 ';

        if (Math.PI < endAngle - startAngle) {
            innerArcFlag = ' 0 1,0 ';
            outterArcFlag = ' 0 1,1 ';
        }
        donutSlices += '<path d="M ' + Math.round(height / 2 + innerRadix * Math.cos(startAngle)) + ',' + Math.round(height / 2 - innerRadix * Math.sin(startAngle))
            + ' A ' + Math.round(innerRadix) + ',' + Math.round(innerRadix) + innerArcFlag + Math.round(height / 2 + innerRadix * Math.cos(endAngle)) + ',' + Math.round(height / 2 - innerRadix * Math.sin(endAngle))
            + ' L ' + Math.round(height / 2 + outerRadix * Math.cos(endAngle)) + ',' + Math.round(height / 2 - outerRadix * Math.sin(endAngle))
            + ' A ' + Math.round(outerRadix) + ',' + Math.round(outerRadix) + outterArcFlag + Math.round(height / 2 + outerRadix * Math.cos(startAngle)) + ',' + Math.round(height / 2 - outerRadix * Math.sin(startAngle))
            + ' z" stroke="black" stroke-width="2" fill="' + colourPallete[sliceNumber] + '" />';

        startAngle = endAngle;
        sliceNumber++;
    }

    //  genarete the slices reference
    var donutSlicesReferences = '';
    //  TODO: how to calculate this height ?
    var referenceHeigth = 20;
    const referenceMargin = 0.05 * width

    sliceNumber = 0;

    for (var fieldName in _data) {

        donutSlicesReferences += '<rect x="' + Math.round(height + referenceMargin) + '" y="' + Math.round(height - (sliceNumber + 1) * referenceHeigth)
            + '" width="' + Math.round(referenceHeigth) + '" height="' + Math.round(referenceHeigth) + '" stroke="black" stroke-width="2" fill="' + colourPallete[sliceNumber] + '" />'
            + '<text x="' + Math.round(height + referenceMargin + 2 * referenceHeigth) + '" y="' + Math.round(height - sliceNumber * referenceHeigth)
            + '"  stroke="black">' + fieldName + ' (' + Math.round(100 * _data[fieldName] / sum) + '%)</text>'

        sliceNumber++;
    }

    $('#' + _elementId).empty();
    $('#' + _elementId).append('<svg width="' + width + '" height="' + height + '">' + donutSlices + donutSlicesReferences + '</svg>');
}
