'use strict';

$('head').append('<link rel="stylesheet" href="lib/jqrangeslider/dest/css/iThing-min.css" type="text/css" />');
$('#svgDiv').append('<div id="slider"></div>');

var stateTitle = [{
    'name': 'Alabama',
    'abbreviation': 'AL'
}, {
    'name': 'Alaska',
    'abbreviation': 'AK'
}, {
    'name': 'American Samoa',
    'abbreviation': 'AS'
}, {
    'name': 'Arizona',
    'abbreviation': 'AZ'
}, {
    'name': 'Arkansas',
    'abbreviation': 'AR'
}, {
    'name': 'California',
    'abbreviation': 'CA'
}, {
    'name': 'Colorado',
    'abbreviation': 'CO'
}, {
    'name': 'Connecticut',
    'abbreviation': 'CT'
}, {
    'name': 'Delaware',
    'abbreviation': 'DE'
}, {
    'name': 'District Of Columbia',
    'abbreviation': 'DC'
}, {
    'name': 'Federated States Of Micronesia',
    'abbreviation': 'FM'
}, {
    'name': 'Florida',
    'abbreviation': 'FL'
}, {
    'name': 'Georgia',
    'abbreviation': 'GA'
}, {
    'name': 'Guam',
    'abbreviation': 'GU'
}, {
    'name': 'Hawaii',
    'abbreviation': 'HI'
}, {
    'name': 'Idaho',
    'abbreviation': 'ID'
}, {
    'name': 'Illinois',
    'abbreviation': 'IL'
}, {
    'name': 'Indiana',
    'abbreviation': 'IN'
}, {
    'name': 'Iowa',
    'abbreviation': 'IA'
}, {
    'name': 'Kansas',
    'abbreviation': 'KS'
}, {
    'name': 'Kentucky',
    'abbreviation': 'KY'
}, {
    'name': 'Louisiana',
    'abbreviation': 'LA'
}, {
    'name': 'Maine',
    'abbreviation': 'ME'
}, {
    'name': 'Marshall Islands',
    'abbreviation': 'MH'
}, {
    'name': 'Maryland',
    'abbreviation': 'MD'
}, {
    'name': 'Massachusetts',
    'abbreviation': 'MA'
}, {
    'name': 'Michigan',
    'abbreviation': 'MI'
}, {
    'name': 'Minnesota',
    'abbreviation': 'MN'
}, {
    'name': 'Mississippi',
    'abbreviation': 'MS'
}, {
    'name': 'Missouri',
    'abbreviation': 'MO'
}, {
    'name': 'Montana',
    'abbreviation': 'MT'
}, {
    'name': 'Nebraska',
    'abbreviation': 'NE'
}, {
    'name': 'Nevada',
    'abbreviation': 'NV'
}, {
    'name': 'New Hampshire',
    'abbreviation': 'NH'
}, {
    'name': 'New Jersey',
    'abbreviation': 'NJ'
}, {
    'name': 'New Mexico',
    'abbreviation': 'NM'
}, {
    'name': 'New York',
    'abbreviation': 'NY'
}, {
    'name': 'North Carolina',
    'abbreviation': 'NC'
}, {
    'name': 'North Dakota',
    'abbreviation': 'ND'
}, {
    'name': 'Northern Mariana Islands',
    'abbreviation': 'MP'
}, {
    'name': 'Ohio',
    'abbreviation': 'OH'
}, {
    'name': 'Oklahoma',
    'abbreviation': 'OK'
}, {
    'name': 'Oregon',
    'abbreviation': 'OR'
}, {
    'name': 'Palau',
    'abbreviation': 'PW'
}, {
    'name': 'Pennsylvania',
    'abbreviation': 'PA'
}, {
    'name': 'Puerto Rico',
    'abbreviation': 'PR'
}, {
    'name': 'Rhode Island',
    'abbreviation': 'RI'
}, {
    'name': 'South Carolina',
    'abbreviation': 'SC'
}, {
    'name': 'South Dakota',
    'abbreviation': 'SD'
}, {
    'name': 'Tennessee',
    'abbreviation': 'TN'
}, {
    'name': 'Texas',
    'abbreviation': 'TX'
}, {
    'name': 'Utah',
    'abbreviation': 'UT'
}, {
    'name': 'Vermont',
    'abbreviation': 'VT'
}, {
    'name': 'Virgin Islands',
    'abbreviation': 'VI'
}, {
    'name': 'Virginia',
    'abbreviation': 'VA'
}, {
    'name': 'Washington',
    'abbreviation': 'WA'
}, {
    'name': 'West Virginia',
    'abbreviation': 'WV'
}, {
    'name': 'Wisconsin',
    'abbreviation': 'WI'
}, {
    'name': 'Wyoming',
    'abbreviation': 'WY'
}];
/*var consolidateToState = function(data) {
    var result = d3.map();
    data.forEach(function(element) {
        stateTitle.forEach(function(state) {
            if (element[0].indexOf(state.name + ', USA') > -1 || element[0].indexOf(', ' + state.abbreviation) > -1) {
                if (result.has(state.abbreviation)) {
                    var cnt = result.get(state.abbreviation);
                    cnt = cnt + element[2];
                    result.set(state.abbreviation, cnt);
                }
                else {
                    result.set(state.abbreviation, element[2]);
                }
            }
        });
    });
    return result;
};*/

var consolidateToDate = function(data) {
    var result = d3.map();
    data.forEach(function(element) {
        var stateAbrivation = '';
        stateTitle.forEach(function(state) {
            if (element[0].indexOf(state.name + ', USA') > -1 || element[0].indexOf(', ' + state.abbreviation) > -1) {
                stateAbrivation = state.abbreviation;
            }
        });
        if (stateAbrivation !== '') {
            if (result.has(new Date(element[1]))) {
                var mapDate = result.get(new Date(element[1]));
                if (mapDate.has(stateAbrivation)) {
                    var cnt = mapDate.get(stateAbrivation);
                    cnt = cnt + element[2];
                    mapDate.set(stateAbrivation, cnt);
                }
                else {
                    mapDate.set(stateAbrivation, element[2]);
                }
                result.set(new Date(element[1]), mapDate);
            }
            else {
                var mapDate2 = d3.map();
                mapDate2.set(stateAbrivation, element[2]);
                result.set(new Date(element[1]), mapDate2);
            }
        }
    });
    return result;
};

var svgDiv = document.querySelector('#svgDiv');
var resultData = angular.element(svgDiv).scope().query.result;
var result = consolidateToDate(resultData);

var minDate = d3.min(result.entries(), function(d) {
    var date = new Date(d.key);
    return date;
});
var maxDate = d3.max(result.entries(), function(d) {
    var date = new Date(d.key);
    return date;
});

var width = 969,
    height = 593;

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
$('#slider').dateRangeSlider({
    bounds: {
        min: new Date(minDate),
        max: new Date(maxDate)
    },
    defaultValues: {
        min: new Date(minDate),
        max: new Date(maxDate)
    },
    scales: [{
        first: function(value) {
            return value;
        },
        end: function(value) {
            return value;
        },
        next: function(value) {
            var next = new Date(value);
            return new Date(next.setMonth(value.getMonth() + 1));
        },
        label: function(value) {
            return months[value.getMonth()];
        },
        format: function(tickContainer, tickStart, tickEnd) {
            tickContainer.addClass('myCustomClass');
        }
    }]
});


var draw = function(firstDate, lastDate, data) {
    var resultData = d3.map();
    data.entries().forEach(function(element) {
        var date2 = new Date(element.key);
        firstDate.setDate(firstDate.getDate() - 1);

        if (firstDate < date2 && date2 < lastDate) {
            element.value.entries().forEach(function(element) {
                if (resultData.has(element.key)) {
                    var cnt = resultData.get(element.key);
                    cnt = cnt + element.value;
                    resultData.set(element.key, cnt);
                }
                else {
                    resultData.set(element.key, element.value);
                }
            });
        }
    });


    var max = d3.max(resultData.entries(), function(d) {
        return d.value;
    });
    var min = d3.min(resultData.entries(), function(d) {
        return d.value;
    });
    
    console.log(max + ' ' + min);

    var color = d3.scale.linear()
        .domain([min, max])
        .range(['lightblue', 'darkblue']);

    d3.xml('http://upload.wikimedia.org/wikipedia/commons/3/32/Blank_US_Map.svg', 'image/svg+xml', function(xml) {
        var svg = d3.select('#svgDiv').append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'center-block')
            .attr('id', 'usSvg')
            .attr('viewBox', '0 0 969 593')
            .attr('perserveAspectRatio', 'xMinYMid');

        var chart = $('#usSvg'),
            aspect = chart.width() / chart.height(),
            container = chart.parent().parent().parent();

        angular.element(window).on('resize', function() {
            var targetWidth = container.width();
            chart.attr('width', targetWidth);
            chart.attr('height', Math.round(targetWidth / aspect));
        }).trigger('resize');

        var usSvg = document.querySelector('#usSvg');
        usSvg.appendChild(xml.documentElement);

        d3.select('#AK').remove();
        d3.select('#path57').remove();
        d3.select('#HI').remove();

        resultData.entries().forEach(function(element) {
            d3.select('#' + element.key)
                .style('fill', function() {
                    return color(element.value);
                });
        });
    });
};


draw(new Date(minDate), new Date(maxDate), result);

$('#slider').on('valuesChanged', function(e, data) {
    $('#usSvg').remove();
    //console.log('Something moved. min: ' + data.values.min + ' max: ' + data.values.max);
    draw(new Date(data.values.min), new Date(data.values.max), result);
});
/*



*/