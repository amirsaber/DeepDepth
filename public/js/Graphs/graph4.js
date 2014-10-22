'use strict';

$('head').append('<link rel="stylesheet" href="lib/jqrangeslider/dest/css/iThing-min.css" type="text/css" />');
$('#svgDiv').append('<div id="slider"></div>');
$('#svgDiv').append('<div id="playDiv" style="float:left"><button type="button" id="play" class="btn btn-default btn-primary" onClick="start()"><span class="glyphicon glyphicon-play"></span>Play</button></div>');
$('#svgDiv').append('<div id="playDiv"><button type="button" id="reset" class="btn btn-default btn-primary" onClick="reset()"><span class="glyphicon glyphicon-stop"></span>Stop</button></div>');
$('#svgDiv').append('<style>.loading {	margin-top: 10em; text-align: center; color: gray; }</style>');
$('#svgDiv').append('<div id="mapcontainer" style="height: 500px; max-width: 600px; margin: 0 auto; "></div>');


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


var intervalDay = 7;
var minDate = d3.min(result.entries(), function(d) {
    var date = new Date(d.key);
    return date;
});
var maxDate = d3.max(result.entries(), function(d) {
    var date = new Date(d.key);
    return date;
});
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];



$('#slider').dateRangeSlider({
    bounds: {
        min: new Date(minDate),
        max: new Date(maxDate)
    },
    defaultValues: {
        min: new Date(minDate),
        max: new Date(minDate.valueOf() + (1000 * 3600 * 24) * intervalDay)
    },
    enabled: false,
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
    stateTitle.forEach(function(element) {
        resultData.set('us-' + element.abbreviation.toLowerCase(), 0);
    });
    data.entries().forEach(function(element) {
        var date2 = new Date(element.key);
        firstDate.setDate(firstDate.getDate() - 1);

        if (firstDate < date2 && date2 < lastDate) {
            element.value.entries().forEach(function(element) {
                if (resultData.has('us-' + element.key.toLowerCase())) {
                    var cnt = resultData.get('us-' + element.key.toLowerCase());
                    cnt = cnt + element.value;
                    resultData.set('us-' + element.key.toLowerCase(), cnt);
                }
                else {
                    resultData.set('us-' + element.key.toLowerCase(), element.value);
                }
            });
        }
    });

    var r1 = [];
    resultData.forEach(function(key, value) {
        r1.push({
            'hc-key': key,
            'value': value
        });
    });

    var chart = $('#mapcontainer').highcharts();
    console.log(chart);
    if (chart) {
        chart.series[0].setData(r1);
    }
    else {
        $('#mapcontainer').highcharts('Map', {

            title: {
                text: 'Number of Tweets per state'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },
            credits: {
                enabled: false
            },

            colorAxis: {
                min: 0
            },
            
            legend: {
                title: {
                    text: 'Number of Tweets in state'
                }
            },

            series: [{
                data: r1,
                mapData: Highcharts.maps['countries/us/custom/us-all-mainland'],
                joinBy: 'hc-key',
                name: 'Number of Tweets',
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }]
        });
    }
};

draw(new Date(minDate), new Date(minDate.valueOf() + (1000 * 3600 * 24) * intervalDay), result);

$('#slider').on('valuesChanged', function(e, data) {
    //$('#usSvg').remove();
    //console.log('Something moved. min: ' + data.values.min + ' max: ' + data.values.max);
    draw(new Date(data.values.min), new Date(data.values.max), result);
});

var isplay = true;
var play = function() {
    $('#play').prop('disabled', true);
    var dateValues = $('#slider').dateRangeSlider('values');
    setTimeout(function() {
            if (isplay) {
                $('#slider').dateRangeSlider('values', dateValues.max, new Date(dateValues.max.valueOf() + (1000 * 3600 * 24) * intervalDay));
                if (dateValues.max.valueOf() + (1000 * 3600 * 24) * intervalDay < maxDate.valueOf()) {
                    play();
                }
                else {
                    $('#slider').dateRangeSlider('values', dateValues.max, maxDate);
                    $('#play').prop('disabled', false);
                }
            }
        },
        1000);
};
var start = function() {
    isplay = true;
    $('#slider').dateRangeSlider('values', minDate, new Date(minDate.valueOf() + (1000 * 3600 * 24) * intervalDay));
    play();
};
var reset = function() {
    isplay = false;
    $('#play').prop('disabled', false);
    $('#slider').dateRangeSlider('values', minDate, new Date(minDate.valueOf() + (1000 * 3600 * 24) * intervalDay));
};

setTimeout(function(){
    $(window).resize();
},500);