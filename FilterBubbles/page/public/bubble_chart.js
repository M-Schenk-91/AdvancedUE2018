/**
 * Purpose:
 * Generate a reusable bubble chart
 *
 * Instantiate the settings before rendering the bubble chart
 * Generate a reusable bubble chart using d3.v4.js on a dataset loaded through D3.
 *
 * Original Author: Deborah Mesquita
 * Source:
 *
 * {@link https://bl.ocks.org/dmesquita/37d8efdb3d854db8469af4679b8f984a Deborah Mesquita's block}
 *
 * {@link https://medium.freecodecamp.org/a-gentle-introduction-to-d3-how-to-build-a-reusable-bubble-chart-9106dc4f6c46 Tutorial and explanation}
 *
 * {@link https://taylorchasewhite.github.io/babyNames/ Live demo}
 * @author Deborah Mesquita
 * @author Taylor White <whitetc2@gmail.com>
 * @since  07.04.17
 * @summary  Generate a reusable bubble chart
 * @requires d3.v4.js
 * @class
 *
 * @example
 * var chart = bubbleChart(); // instantiate the chart
 *
 * // update settings
 * chart.width(850).height(850).minRadius(7).maxRadius(55).forceApart(-170);
 *
 * // example of chaining
 * chart.columnForColors("Sex").columnForRadius("BirthCount");
 * chart.customColors(["M","F"],["#70b7f0","#e76486"]).showTitleOnCircle(true);
 * chart.title('Most popular baby names in 2016').columnForTitle("Name");
 * chart.unitName("babies");
 *
 * // load the data and render the chart
 * d3.select("#divBubbleChart")
 *  .data(newData)
 *  .call(chart);
 *
 * @returns Chart function so that you can render the chart when ready
 */
function bubbleChart() {

    var twitter = twitterUtils();
    twitter.init();



    var width = 960,
        height = 960,
        maxRadius = 6,
        columnForColors = "title",
        columnForRadius = "value";

    function chart(selection) {
        var data = selection.datum();
        var div = selection,
            svg = div.selectAll('svg');
        svg.attr('width', width).attr('height', height);

        var tooltip = selection
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("color", "white")
            .style("padding", "8px")
            .style("background-color", "#626D71")
            .style("border-radius", "6px")
            .style("text-align", "center")
            .style("font-family", "monospace")
            .style("width", "400px")
            .text("");


        var simulation = d3.forceSimulation(data)
            .force("charge", d3.forceManyBody().strength([-50]))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .on("tick", ticked);

        function ticked(e) {
            node.attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });
        }

        var colorCircles = d3.scaleOrdinal(d3.schemeCategory10);
        var scaleRadius = d3.scaleLinear().domain([d3.min(data, function(d) {
            return +d[columnForRadius];
        }), d3.max(data, function(d) {
            return +d[columnForRadius];
        })]).range([5, 18])

        var node = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr('r', function(d) {
                return scaleRadius(d[columnForRadius])
            })
            .style("fill", function(d) {
                return colorCircles(d[columnForColors])
            })
            .attr('transform', 'translate(' + [width / 2, height / 2] + ')')
            .on("mouseover", function(d) {
                tooltip.html(d[columnForColors] + "<br>" + d[columnForRadius] + " Seiten");
                return tooltip.style("visibility", "visible");
            })
            .on("mousedown", function(d) {

                console.log(d);
                var queryString = "";

                for (i = 0; i < d.category.length; i++) { 

                    if(i != 0){
                        queryString += "&";
                    }

                    queryString += d.category[i];

                }               

                twitter.loadTwitter(queryString);

                tooltip.html(d[columnForColors] + "<br>" + d[columnForRadius] + " Seiten");
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function() {
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                return tooltip.style("visibility", "hidden");
            });
    }

    chart.width = function(value) {
        if (!arguments.length) {
            return width;
        }
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) {
            return height;
        }
        height = value;
        return chart;
    };


    chart.columnForColors = function(value) {
        if (!arguments.columnForColors) {
            return columnForColors;
        }
        columnForColors = value;
        return chart;
    };

    chart.columnForRadius = function(value) {
        if (!arguments.columnForRadius) {
            return columnForRadius;
        }
        columnForRadius = value;
        return chart;
    };

    return chart;
}

