var values = [];
function buildChartData(data) {
    values = [];
    var items_count = Object.keys(data).length;
    var colors = generateColor("#E1514B", "#4D9DB4", items_count);
    var chart_data = [];
    Object.keys(data).forEach(function (item, idx) {
        var json_item = {
            "label": item,
            "value": 0,
            "weight": 0,
            "color": "#" + colors[idx]
        };

        var avg_value = 0;
        for (var i = 0; i < data[item].length; i++) {
            avg_value += data[item][i];
        }
        avg_value = avg_value / data[item].length;
        if (avg_value < 50) {
            json_item["weight"] = 0.5;
        } else {
            json_item["weight"] = 0.7;
        }
        json_item["value"] = Math.ceil(avg_value);
        values.push(Math.ceil(avg_value));
        chart_data.push(json_item);
    });
    return chart_data;
}

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

// get random color hex
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// function drawAsterChart(data, suffix) {
function drawAsterChart(chart_data, suffix) {
    $(".aster-chart-container").empty();
    var data = buildChartData(chart_data);
    data.forEach(function (d) {
        d.color = d.color;
        d.weight = +d.weight;
        d.value = +d.value;
        d.width = +d.weight;
        d.label = d.label;
    });

    var width = 500,
        height = 410,
        radius = Math.min(width, height) / 2,
        innerRadius = 0.33 * radius;

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return d.width;
        });

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([0, 0])
        .html(function (d) {
            return d.data.label + ": <b><span style='color:orangered;'>" + d.data.value + " " + suffix + "</span></b>";
        });

    // getting the maximum value for
    var max = Math.max.apply(null, values) + 2;
    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(function (d) {
            return (radius - innerRadius) * (d.data.value / max) + innerRadius;
        });

    var outlineArc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

    var svg = d3.select(".aster-chart-container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.call(tip);

    var outerPath = svg.selectAll(".outlineArc")
        .data(pie(data))
        .enter().append("path")
        .attr("fill", d3.rgb("#3D4237"))
        .attr("stroke", "black")
        .attr("class", "outlineArc")
        .transition().delay(function (d, i) {
            return i * 100;
        })
        .attr("d", outlineArc);

    var path = svg.selectAll(".solidArc")
        .data(pie(data))
        .enter().append("path")
        .attr("fill", function (d) {
            return d.data.color;
        })
        .attr("class", "solidArc")
        .attr("stroke", "black")
        .attr("d", arc)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    // calculate the weighted mean score
    var score = data.reduce(function (a, b) {
            //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
            return a + (b.value * b.weight);
        }, 0) / data.reduce(function (a, b) {
            return a + b.weight;
        }, 0);

    var fulltext = "Kosovo Tax Administration";
	addDescriptionToAsterChart(fulltext, svg);
}

// Adds description in the middle of the aster chart and regulates the size of text.
function addDescriptionToAsterChart(fulltext, svg){
	var json_position = {
		0: -38,
		1: -18,
		2: 2,
		3: 22,
		4: 42,
		5: 62,
	}
	var a = "";
	if (fulltext.length > 11){
		a = fulltext.match(/.{6}\S*|.*/g);
	} else if (fulltext.length == 8) {
		a = fulltext.match(/.{4}\S*|.*/g);
	} else if (fulltext.length == 9) {
		a = fulltext.match(/.{3}\S*|.*/g);
	} else if (fulltext.length == 10) {
		a = fulltext.match(/.{4}\S*|.*/g);
	} else {
		a = fulltext.match(/.{5}\S*|.*/g);
	}
	var index = 0;
	if (a.length <= 2) {
		index = 2;
	} else if (a.length == 3) {
		index = 1;
	} else if (a.length >= 4 && a.length <= 5) {
		index = 1;
	} else {
		index = 0;
	}

	var r = /\d+/;
	// alert (s.match(r));
	a.forEach(function(entry) {
		if (entry.match(r)){
			var text = svg.append("svg:text")
			.attr("class", "aster-score")
			.attr("dy", json_position[index])
			.attr("text-anchor", "middle")
			.style("font-size", "14px")
			// .style("fill", "red")
			.style("font-weight", "bold")
			.text(entry);
		} else {
			svg.append("svg:text")
			.style("font-size", "14px")
			.attr("class", "aster-score")
			.attr("dy", json_position[index])
			.attr("text-anchor", "middle")
			.text(entry);
		}
		index = index + 1;
	});
	// $(".aster-score-percentage").css("color", "red")
}