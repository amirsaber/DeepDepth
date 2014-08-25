'use strict';

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
var consolidateToState = function(data) {
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
};

var svgDiv = document.querySelector('#svgDiv');
var resultData = angular.element(svgDiv).scope().query.result;
var result = consolidateToState(resultData);

var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
        return d.value;
    });

var svg = d3.select('#svgDiv').append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'center-block')
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

var g = svg.selectAll('.arc')
    .data(pie(result.entries()))
    .enter().append('g');

g.append('path')
    .attr('d', arc)
    .style('fill', function(d) {
        return color(d.data.value);
    })
    .style('stroke', '#fff');

g.append('text')
    .attr('transform', function(d) {
        return 'translate(' + arc.centroid(d) + ')';
    })
    .attr('dy', '.35em')
    .style('text-anchor', 'middle')
    .text(function(d) {
        return d.data.key;
    });