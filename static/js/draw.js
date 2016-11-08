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
        innerRadius = 0.3 * radius;

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

    svg.append("svg:text")
        .attr("class", "aster-score")
        .attr("dy", ".35em")
        .style("font-size", "42px")
        .style("font-weight", "bold")
        .attr("text-anchor", "middle") // text-align: right
        .text("100");
}