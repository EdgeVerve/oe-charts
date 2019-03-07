/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import * as d3 from "d3";
import XChartArea from "./area";
import XChartBubble from "./bubble";
import XChartGroupedBar from "./grouped-bar";
import XChartGroupedColumn from './grouped-column';
import XChartLine from "./line";
import XChartMap from "./map";
import XChartNormalizedStackedColumn from "./normalized-stacked-column";
import XChartPareto from "./pareto";
import XChartPieOrDonut from "./pie-or-donut";
import XChartStackedBar from "./stacked-bar";
import XChartStackedColumn from "./stacked-column";

export class XChartUtility {

    constructor(chartOptions) {
        this.chartOptions = chartOptions;
    }

    d3ShadowSelect(selector) {
        if (typeof selector === "string" && this.chartOptions.chartHost !== null) {
            var ele = this.chartOptions.chartHost.querySelector(selector);
            return d3.select(ele);
        } else {
            return d3.select(selector);
        }
    }

    //Adds filter defination to the svg -- 3D illusion
    addLinearFilter(svg, renderContainerId) {
        var defs = svg.append('defs');

        // append filter element
        var filter = defs.append('filter')
            .attr('id', renderContainerId + 'dropshadow'); /// !!! important - define id to reference it later

        // append gaussian blur to filter
        filter.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 1) // !!! important parameter - blur
            .attr('result', 'blur');

        // append offset filter to result of gaussion blur filter
        filter.append('feOffset')
            .attr('in', 'blur')
            .attr('dx', 0) // !!! important parameter - x-offset
            .attr('dy', 1) // !!! important parameter - y-offset
            .attr('result', 'offsetBlur');

        // merge result with original image
        var feMerge = filter.append('feMerge');

        // first layer result of blur and offset
        feMerge.append('feMergeNode')
            .attr('in", "offsetBlur');

        // original image on top
        feMerge.append('feMergeNode')
            .attr('in', 'SourceGraphic');
    }

    addRadialFilter(svg, renderContainerId) {
        var defs = svg.append('defs');

        // append filter element
        var filter = defs.append('filter')
            .attr('id', renderContainerId + 'dropshadow'); /// !!! important - define id to reference it later

        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 3)
            .attr("result", "blur");
        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 3)
            .attr("dy", 3)
            .attr("result", "offsetBlur");
        filter.append("feOffset")
            .attr("in", "SourceGraphic")
            .attr("dx", 3)
            .attr("dy", 3)
            .attr("result", "plainOffset");
        filter.append("feComposite")
            .attr("operator", "out")
            .attr("in", "SourceGraphic")
            .attr("in2", "plainOffset")
            .attr("result", "preHighlight");
        filter.append("feColorMatrix")
            .attr("type", "matrix")
            .attr("values", "0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0")
            .attr("result", "preHighlightWhite");
        filter.append("feGaussianBlur")
            .attr("stdDeviation", 3)
            .attr("result", "preHighlightBlur");
        filter.append("feComposite")
            .attr("operator", "in")
            .attr("in2", "SourceGraphic")
            .attr("result", "Highlight");
        filter.append("feComposite")
            .attr("operator", "over")
            .attr("in2", "SourceGraphic")
            .attr("result", "final");
        filter.append("feComposite")
            .attr("operator", "over")
            .attr("in2", "offsetBlur")
            .attr("result", "finalWithDrop");

    }
    //Check if chart exists - Helper used by render function of xChart.chart
    checkChart(chart, color, renderContainerId, chartOptions) {

        if (chartOptions.chartType === 'line') {
            if (chart instanceof XChartLine)
                return chart;
            else
                return new XChartLine(renderContainerId, color, chartOptions);
        } else if (chartOptions.chartType === 'area') {
            if (chart instanceof XChartArea)
                return chart;
            else
                return new XChartArea(renderContainerId, color, chartOptions);
        } else if (chartOptions.chartType === 'barKpi') {
            if (chart instanceof XChartGroupedColumn)
                return chart;
            else
                return new XChartGroupedColumn(renderContainerId, color, chartOptions);
        } else if (chartOptions.chartType === 'groupedColumn') {
            if (chart instanceof XChartGroupedColumn)
                return chart;
            else
                return new XChartGroupedColumn(renderContainerId, color, chartOptions);
        } else if (chartOptions.chartType === 'segmentedGroupedColumn') {
            if (chart instanceof xChart.segmentedGroupedColumn)
                return chart;
            else
                return new xChart.segmentedGroupedColumn(renderContainerId, color, chartOptions);
        } else if (chartOptions.chartType === 'stackedColumn') {
            if (chart instanceof XChartStackedColumn)
                return chart;
            else
                return new XChartStackedColumn(renderContainerId, color, chartOptions);
        } else if (chartOptions.chartType === 'groupedBar') {
            if (chart instanceof XChartGroupedBar)
                return chart;
            else
                return new XChartGroupedBar(renderContainerId, color, chartOptions);
        } else if (chartOptions.chartType === 'stackedBar') {
            if (chart instanceof XChartStackedBar)
                return chart;
            else
                return new XChartStackedBar(renderContainerId, color, chartOptions);
        } else if (chartOptions.chartType === 'pie') {
            if (chart instanceof XChartPieOrDonut && chart.chartType === 'pie')
                return chart;
            else
                return new XChartPieOrDonut(renderContainerId, chartOptions);
        } else if (chartOptions.chartType === 'donut') {
            if (chart instanceof XChartPieOrDonut && chart.chartType === 'donut')
                return chart;
            else
                return new XChartPieOrDonut(renderContainerId, chartOptions);
        } else if (chartOptions.chartType === 'bubble') {
            if (chart instanceof XChartBubble)
                return chart;
            else
                return new XChartBubble(renderContainerId, color, chartOptions);
        } else if (chartOptions.chartType === 'mapview') {
            if (chart instanceof XChartMap)
                return chart;
            else
                return new XChartMap(renderContainerId, color, chartOptions);
        } else if (chartOptions.chartType === 'kpi') {
            if (chart instanceof xChart.kpi)
                return chart;
            else
                return new xChart.kpi(renderContainerId, color, chartOptions);
        } else if (chartOptions.chartType === 'tablekpi') {
            if (chart instanceof xChart.tableKpi)
                return chart;
            else
                return new xChart.tableKpi(renderContainerId, color, chartOptions);
        } else if (chartOptions.chartType === 'gauge') {
            if (chart instanceof xChart.gauge)
                return chart;
            else
                return new xChart.gauge(renderContainerId, color, chartOptions);

        } else if (chartOptions.chartType === 'normalizedStackedColumn') {
            if (chart instanceof XChartNormalizedStackedColumn)
                return chart;
            else
                return new XChartNormalizedStackedColumn(renderContainerId, color, chartOptions);

        } else if (chartOptions.chartType === 'pareto') {
            if (chart instanceof XChartPareto)
                return chart;
            else
                return new XChartPareto(renderContainerId, color, chartOptions);
        } else {
            return chart;
        }
    }
    //Removes overlapped ticks if the and returns true if the removed ticks cross the specified threshold
    checkOverlapAndRemove(ticks, orientation) {
        var removedTickCount = 0;
        var tickgroup = ticks._groups;
        for (var j = 0; j < tickgroup.length; j++) {
            var c = tickgroup[j],
                n = tickgroup[j + 1];
            if (!c || !n || !c.getBoundingClientRect || !n.getBoundingClientRect)
                continue;
            if (orientation === 'vertical') {
                while (c.getBoundingClientRect().bottom > n.getBoundingClientRect().top) {
                    d3.select(n).remove();
                    j++;
                    n = tickgroup[j + 1];
                    if (!n)
                        break;
                }
            } else {
                while (c.getBoundingClientRect().right > n.getBoundingClientRect().left) {
                    d3.select(n).remove();
                    removedTickCount++;
                    j++;
                    n = tickgroup[j + 1];
                    if (!n)
                        break;
                }
            }
        }

        if ((removedTickCount / tickgroup.length) >= 0.2)
            return true;
        else
            return false;
    }
    //Segregates the data to multiple chart arrays and axis array
    //Used by groupedColumnChart for segregating line and bar series
    dataPrep(data) {
        var returnObj = {
            seriesForLineChart: [],
            seriesForChart: [],
            axesGroups: []
        };
        var count = 0;

        data.series.sort(function (a, b) {
            return a.axis - b.axis;
        });

        for (var i = 0; i < data.series.length; i++) {
            if (data.series[i].line == true) {
                var obj = {};
                obj.series = data.series[i];
                obj.index = i;
                returnObj.seriesForLineChart.push(obj);
            } else {
                var obj = {};
                obj.series = data.series[i];
                obj.index = i;
                returnObj.seriesForChart.push(obj);
            }

            if (data.series[i].axis == count + 1) {
                if (typeof returnObj.axesGroups[count] == 'undefined')
                    returnObj.axesGroups[count] = [];
                returnObj.axesGroups[count].push(data.series[i]);
            } else if (data.series[i].axis > count + 1) {
                count++;
                returnObj.axesGroups[count] = [];
                returnObj.axesGroups[count].push(data.series[i]);
            } else {
                if (typeof returnObj.axesGroups[0] == 'undefined')
                    returnObj.axesGroups[0] = [];
                returnObj.axesGroups[0].push(data.series[i]);
                data.series[i].axis = 1;
            }
        }

        return returnObj;

    }

    draw_xAxisDummy(svg, categories, height, width, renderContainerId) {

        var wrap = this.wrap;

        var x0 = d3.scaleBand()
            .range([0, width])
            .paddingInner(0.1)
            .paddingOuter(0.2);


        var names = categories.map(function (d) {
            return d.name;
        });
        var values = categories.map(function (d) {
            return d.value;
        });
        x0.domain(values);

        var xAxis = d3.axisBottom(x0);

        var ticks = '';

        var el = this.chartOptions.chartHost.querySelector("#" + renderContainerId + "_xaxis");
        d3.select(el).remove();


        ticks = svg.append("g")
            .attr("class", "x axis")
            .attr("id", renderContainerId + "_xaxis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll('text')
            .text(function (d, i) {
                return categories[i].name;
            })
            .call(wrap, x0.bandwidth());



        var overlap = this.checkOverlapAndRemove(ticks);

        svg.select('.x.axis').remove();

        return overlap;
    }
    // Prepare the data in a proper format to draw overlapped charts
    overlapDataPrep(Odata, data) {

        var overlappedData = Object.assign({}, Odata);
        var originalData = Object.assign({}, data);

        var tempCategories = [];
        for (var i = 0; i < originalData.categories.length; ++i) {
            tempCategories.push(originalData.categories[i]);
        }

        var tempSeries = [];
        for (var i = 0; i < originalData.series.length; ++i) {
            tempSeries.push(originalData.series[i]);
            for (var n = 0; n < originalData.series[i].data.length; ++n) {
                tempSeries[i].data[n] = [0];
                tempSeries[i].fmtData[n] = ['0'];
            }
        }

        function getOverlappedCategoryIndex(i, overlappedData, originalData) {
            for (var j = 0; j < overlappedData.categories.length; ++j) {
                if (originalData.categories[i].value == overlappedData.categories[j].value) {
                    return j;
                }
            }
            return -1;
        }

        function getOverlappedSeriesIndex(i, overlappedData, originalData) {
            for (var j = 0; j < overlappedData.overlappedSeries.length; ++j) {
                if (originalData.series[i].value == overlappedData.overlappedSeries[j].value) {
                    return j;
                }
            }
            return -1;
        }

        for (var i = 0; i < tempCategories.length; ++i) {
            for (var j = 0; j < tempSeries.length; ++j) {
                var catIndex = getOverlappedCategoryIndex(i, overlappedData, originalData);
                if (catIndex < 0)
                    continue;
                var seriesIndex = getOverlappedSeriesIndex(j, overlappedData, originalData);
                if (seriesIndex < 0)
                    continue;
                var dataValue = overlappedData.overlappedSeries[seriesIndex].data[catIndex][0];
                var fmtDataValue = overlappedData.overlappedSeries[seriesIndex].fmtData[catIndex][0];
                tempSeries[j].data[i] = [dataValue];
                tempSeries[j].fmtData[i] = [fmtDataValue];
            }
        }
        overlappedData.categories = tempCategories;
        overlappedData.overlappedSeries = tempSeries;

        return overlappedData;
    }

    //Wraps the text labels in the axis
    wrap(axisText, avaiableWidth, axisOrientation) {

        if (axisOrientation === 'vertical')
            axisText.each(function () {
                var text = d3.select(this);
                var newText = text.text();
                newText = newText.substring(0, 7).concat('...');
                this.textContent = newText;
            });
        else
            axisText.each(function () {
                var text = d3.select(this),
                    allWords = text.text().split(/\s+/).reverse(),
                    w,
                    lineHeight = 1.1,
                    lineNo = 0,
                    lineArr = [],
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                while (w = allWords.pop()) {
                    if (lineNo > 0) {
                        return;
                    }
                    lineArr.push(w);
                    tspan.text(lineArr.join(" "));
                    var computedWidth; // handling IE exception
                    try {
                        computedWidth = tspan.node().getComputedTextLength();
                    } catch (eee) {
                        computedWidth = tspan.node().childNodes[0].length * 8;
                    }
                    if (computedWidth > avaiableWidth) {
                        lineArr.pop();
                        tspan.text(lineArr.join(" "));
                        lineArr = [w];
                        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNo * lineHeight + dy + "em").text(w);
                    }
                }
            });
    }

    tooltip(svg, element, detailed, circular) {

    }
}

export class XChartEvents extends XChartUtility {

    constructor(chartOptions) {
        super(chartOptions);
    }

    addDefaultEventBehaviour(renderContainerId,chartOptions) {
        this.chartOptions = chartOptions || {};
        var svg = this.d3ShadowSelect('#' + renderContainerId + '_svg');

        //Default behaviour for the chart items
        //Can be switched off from chartOptions or while registering custom events

        /***************************************************Event Behaviours**********************************************************/

        //Bar
        var bars = svg.selectAll('.bar');
        var barColor = '';
        if (typeof bars._groups[0] != 'undefined')
            bars._groups[0].forEach(function (d) {
                d3.select(d).on('click', function () {
                    var currentElement = d3.select(this);
                    if (d3.event.ctrlKey) {
                        bars._groups[0].forEach(function (e) {
                            if (d3.select(e).style('opacity') === '1' && d3.select(e).attr("filter") !== "url(" + window.location.href + "#" + renderContainerId + "dropshadow)") {
                                d3.select(e).attr('filter', '');
                                d3.select(e).style('opacity', '0.5');
                            }
                        });
                        if (currentElement.attr("filter") !== "url(" + window.location.href + "#" + renderContainerId + "dropshadow)" && currentElement.style('opacity') !== '1') {
                            currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                            currentElement.style('opacity', '1');
                        } else {
                            currentElement.attr("filter", "");
                            currentElement.style('opacity', '0.5');
                        }
                    } else {
                        bars._groups[0].forEach(function (e) {
                            d3.select(e).attr('filter', '');
                            d3.select(e).style('opacity', '0.5');
                        });
                        currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                        currentElement.style('opacity', '1');
                    }
                });

                d3.select(d).on('mouseover', function () {
                    barColor = d3.select(this).style("fill");
                    var bright_color = d3.rgb(barColor).brighter(1);
                    d3.select(this).style("fill", bright_color);
                });


                d3.select(d).on('mouseout', function () {
                    if (barColor === '')
                        d3.select(this).style("fill", this.style.fill);
                    else
                        d3.select(this).style("fill", barColor);
                });
            });

        //Pie
        var slices = svg.selectAll('.pie');
        var sliceColor = '';
        if (typeof slices._groups[0] != 'undefined')
            slices._groups[0].forEach(function (d) {
                d3.select(d).on('click', function () {
                    var currentElement = d3.select(this);
                    if (d3.event.ctrlKey) {
                        slices._groups[0].forEach(function (e) {
                            if (d3.select(e).style('opacity') === '1' && d3.select(e).attr("filter") !== "url(" + window.location.href + "#" + renderContainerId + "dropshadow)") {
                                d3.select(e).attr('filter', '');
                                d3.select(e).style('opacity', '0.5');
                            }
                        });
                        if (currentElement.attr("filter") !== "url(" + window.location.href + "#" + renderContainerId + "dropshadow)" && currentElement.style('opacity') !== '1') {
                            currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                            currentElement.style('opacity', '1');
                        } else {
                            currentElement.attr("filter", "");
                            currentElement.style('opacity', '0.5');
                        }
                    } else {
                        slices._groups[0].forEach(function (e) {
                            d3.select(e).attr('filter', '');
                            d3.select(e).style('opacity', '0.5');
                        });
                        currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                        currentElement.style('opacity', '1');
                    }
                });

                d3.select(d).on('mouseover', function () {
                    sliceColor = d3.select(this).style("fill");
                    var bright_color = d3.rgb(sliceColor).brighter(1);
                    d3.select(this).style("fill", bright_color);
                });


                d3.select(d).on('mouseout', function () {
                    if (sliceColor === '')
                        d3.select(this).style("fill", this.style.fill);
                    else
                        d3.select(this).style("fill", sliceColor);
                });
            });


        //Bubble
        var bubbles = svg.selectAll('.bubble');
        var bubbleColor = '';
        if (typeof bubbles._groups[0] != 'undefined')
            bubbles._groups[0].forEach(function (d) {
                d3.select(d).on('click', function () {
                    var currentElement = d3.select(this);
                    if (d3.event.ctrlKey) {
                        bubbles._groups[0].forEach(function (e) {
                            if (d3.select(e).style('opacity') === '1' && d3.select(e).attr("filter") !== "url(" + window.location.href + "#" + renderContainerId + "dropshadow)") {
                                d3.select(e).attr('filter', '');
                                d3.select(e).style('opacity', '0.5');
                            }
                        });
                        if (currentElement.attr("filter") !== "url(" + window.location.href + "#" + renderContainerId + "dropshadow)" && currentElement.style('opacity') !== '1') {
                            currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                            currentElement.style('opacity', '1');
                        } else {
                            currentElement.attr("filter", "");
                            currentElement.style('opacity', '0.5');
                        }
                    } else {
                        bubbles._groups[0].forEach(function (e) {
                            d3.select(e).attr('filter', '');
                            d3.select(e).style('opacity', '0.5');
                        });
                        currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                        currentElement.style('opacity', '1');
                    }
                });

                d3.select(d).on('mouseover', function () {
                    bubbleColor = d3.select(this).style("fill");
                    var bright_color = d3.rgb(bubbleColor).brighter(1);
                    d3.select(this).style("fill", bright_color);
                });


                d3.select(d).on('mouseout', function () {
                    if (bubbleColor === '')
                        d3.select(this).style("fill", this.style.fill);
                    else
                        d3.select(this).style("fill", bubbleColor);
                });
            });

        //mapCircle
        var mapCircles = svg.selectAll('.mapCircle');
        var mapCircleColor = '';
        if (typeof mapCircles._groups[0] != 'undefined')
            mapCircles._groups[0].forEach(function (d) {
                d3.select(d).on('click', function () {
                    var currentElement = d3.select(this);
                    if (d3.event.ctrlKey) {
                        mapCircles._groups[0].forEach(function (e) {
                            if (d3.select(e).style('opacity') === '1') {
                                //d3.select(e).attr('filter', '');
                                d3.select(e).style('opacity', '0.5');
                            }
                        });
                        if (currentElement.style('opacity') !== '1') {
                            // currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                            currentElement.style('opacity', '1');
                        } else {
                            //currentElement.attr("filter", "");
                            currentElement.style('opacity', '0.5');
                        }
                    } else {
                        mapCircles._groups[0].forEach(function (e) {
                            //d3.select(e).attr('filter', '');
                            d3.select(e).style('opacity', '0.5');
                        });
                        //currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                        currentElement.style('opacity', '1');
                    }

                    d3.select(d).on('mouseover', function () {
                        mapCircleColor = d3.select(this).style("fill");
                        var bright_color = d3.rgb(barColor).brighter(1);
                        d3.select(this).style("fill", bright_color);
                    });


                    d3.select(d).on('mouseout', function () {
                        if (mapCircleColor === '')
                            d3.select(this).style("fill", this.style.fill);
                        else
                            d3.select(this).style("fill", mapCircleColor);
                    });
                });
            });



        //Legend
        var legends = svg.selectAll('.legend');
        var legendColor = '';
        if (typeof legends._groups[0] != 'undefined')
            legends._groups[0].forEach(function (d) {
                d3.select(d).on('click', function () {
                    var currentElement = d3.select(this);
                    legendColor = currentElement.style('fill');
                    if (currentElement.attr('filter') === '' || currentElement.attr('filter') === null) {
                        currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                    } else {
                        currentElement.attr("filter", "");
                    }
                });
            });


        //ChartArea
        svg.on('click', function () {
            if (typeof bars._groups[0] != 'undefined')
                bars._groups[0].forEach(function (d) {
                    if (d3.event.target.nodeName !== 'rect') {
                        d3.select(d).attr('filter', '');
                        d3.select(d).style('opacity', '1');
                    }
                });

            if (typeof slices._groups[0] != 'undefined')
                slices._groups[0].forEach(function (d) {
                    if (d3.event.target.nodeName !== 'path') {
                        d3.select(d).attr('filter', '');
                        d3.select(d).style('opacity', '1');
                    }
                });

            if (typeof bubbles._groups[0] != 'undefined')
                bubbles._groups[0].forEach(function (d) {
                    if (d3.event.target.nodeName !== 'circle') {
                        d3.select(d).attr('filter', '');
                        d3.select(d).style('opacity', '1');
                    }
                });
            if (typeof mapCircles._groups[0] != 'undefined')
                mapCircles._groups[0].forEach(function (d) {
                    if (d3.event.target.nodeName !== 'circle') {
                        //d3.select(d).attr('filter', '');
                        d3.select(d).style('opacity', '1');
                    }
                });
        });
    }
    //Each event handler attached to the respective objects

    registerEventHandler(eventList, renderContainerId, chartHost) {
        var container = this.d3ShadowSelect('#' + renderContainerId);
        eventList.forEach(function (d) {
            var eventTarget = container.selectAll(d.eventTarget);
            if (eventTarget && typeof eventTarget[0] != 'undefined') {
                eventTarget[0].forEach(function (e) {
                    if (d.preventDefault) {
                        d3.select(e).on(d._event, null);
                    }
                    e.addEventListener(d._event, function (event) {
                        event.srcElement = event.srcElement || event.currentTarget;
                        d.eventHandler.call(this, event);
                    });
                });
            }
        });
    }

    //For events attached to a single element in the graph
    //Custom event listener explicitly attached by the user
    registerSingleEvent(_event, eventTarget, eventHandler, preventDefault) {
        var eTarget = d3.select(eventTarget)[0][0];
        if (preventDefault)
            eTarget.on(_event, null);

        eTarget.addEventListener(_event, function () {
            eventHandler();
        });
    }
}

export class XChart extends XChartUtility {

    constructor(renderContainerId, chartOptions) {
        super(chartOptions);
        this.renderContainerId = renderContainerId;
        this._init();
        this.setOptions(chartOptions);
    }

    _init() {
        this.events = new XChartEvents();

        this.renderedChart = {};

        this._eventHandlers = [];

        var drillMapFn = function () {
            this.render(null);
        };
        //default chart options
        this.chartOptions = {
            chartClientId: '',
            drillMap: drillMapFn.bind(this),
            zoomLevel: 1,
            gaugeConfiguration: '',
            showMargin: false,
            brush: false,
            tooltip: true,
            chartType: 'groupedColumn',
            margin: {
                top: 15,
                right: 20,
                bottom: 35,
                left: 45
            },
            noOfPieSlices: 5,
            // seriesLabel:'y-axis',
            //Range 0 to 1. Option used to trigger axis redraw on domain change by "axisRedrawThreshold".
            //Set 0 to always redraw
            //Set 1 to never draw
            axisRedrawThreshold: 0.2,
            aec: 0.1,
            defaultColors: ['#03A9F4', '#E91E63', '#ff9800', '#4CAF50', '#D4E157', '#FFA726', '#9C27B0', '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#EABB14', '#af2e2e', '#5674b9', '#774ebf', '#ee9595', '#e979fc', '#1ac3d8', '#acd373', '#ee4a47', '#38a0f4', '#72368c', '#fbaf5d', '#f389ad', '#0082cf', '#af82ff', '#ef5a8c', '#873661', '#5eb762', '#b881c3', '#f68e56', '#0091a2', '#bf3333', '#846ab2', '#008374'],
            chartHost: document
        };

        //DataItems are the data points like bar, pie, bubble, etc
        this.dataitems = {
            bar: '.bar',
            pie: '.pie',
            bubble: '.bubble',
            lineCircle: '.linecircle',
            areacircle: '.areacircle',
            mapCircle: '.mapCircle'
        };

        //Axis Ticks, Legends, etc
        this.chartItems = {

        };
    }

    //Events
    //Generic Events
    //Used before chart is drawn like we call setOptions
    addEventHandler(_event, eventTarget, eventHandler, preventDefault) {

        if (typeof preventDefault === 'undefined')
            preventDefault = false;

        if (eventTarget === 'dataitems') {
            //For each dataitems in this.dataitems
            var self = this;
            this.dataitems && Object.keys(this.dataitems).forEach(function (k) {
                var target = self.dataitems[k];

                var existingEvent = self._eventHandlers.filter(function (d) {
                    return d._event === _event && d.eventTarget === target;
                });

                //If event exists for the eventTarget, change the event handler
                //Else create add a new event handler
                if (existingEvent.length > 0) {
                    existingEvent[0].eventHandler = eventHandler;
                    existingEvent[0].preventDefault = preventDefault;
                } else {
                    var eventObject = {};
                    eventObject._event = _event;
                    eventObject.eventTarget = target;
                    eventObject.eventHandler = eventHandler;
                    eventObject.preventDefault = preventDefault;
                    self._eventHandlers.push(eventObject);
                }
            });

        } else {
            var existingEvent = this._eventHandlers.filter(function (d) {
                return d._event === _event && d.eventTarget === eventTarget;
            });

            //If event exists for the eventTarget, change the event handler
            //Else create add a new event handler
            if (existingEvent.length > 0) {
                existingEvent[0].eventHandler = eventHandler;
                existingEvent[0].preventDefault = preventDefault;
            } else {
                var eventObject = {};
                eventObject._event = _event;
                eventObject.eventTarget = eventTarget;
                eventObject.eventHandler = eventHandler;
                eventObject.preventDefault = preventDefault;
                this._eventHandlers.push(eventObject);
            }
        }

    }

    //Special Events -- Used to attach events after chart has been drawn
    //Event Target is Unique Id
    registerEvent(_event, eventTarget, eventHandler, preventDefault) {
        this.events.registerSingleEvent(_event, eventTarget, eventHandler, preventDefault);
    }
    //Render chart with all options
    //Create new instance for new chart and triggers draw
    //if chartType is same triggers redraw
    render(data) {
        // if(this.chartOptions.overlap)
        // 	this.oData=data;
        // else
        if (data)
            this.data = data;

        this.color = [];

        var colorIndex = 0,
            brightnessIndex = 1;

        for (var i = 0; i < this.data.series.length; i++) {
            if (this.data.series[i].color && this.data.series[i].color !== null && this.data.series[i].color !== '') {
                this.color.push(this.data.series[i].color);
                colorIndex++;
            } else {
                if (this.chartOptions.defaultColors[colorIndex]) {
                    this.color.push(this.chartOptions.defaultColors[colorIndex]);
                } else {
                    var reIndex = colorIndex - this.chartOptions.defaultColors.length;
                    if (reIndex > this.chartOptions.defaultColors.length) {
                        colorIndex = this.chartOptions.defaultColors.length;
                        brightnessIndex++;
                    }
                    this.color.push(d3.rgb(this.chartOptions.defaultColors[reIndex]).darker(brightnessIndex));
                }
                colorIndex++;
            }
        }


        var chartObject = this.checkChart(this.renderedChart, this.color, this.renderContainerId, this.chartOptions);
        var eventName = 'render-complete';


        if (chartObject === this.renderedChart && this.chartType === this.chartOptions.chartType) {
            this.renderedChart.redraw(this.data, this._eventHandlers);
        } else {
            var el = this.chartOptions.chartHost.querySelector('#' + this.renderContainerId + '_select');
            if (el && el.parentElement) {
                el.parentElement.removeChild(el);
            }
            this.renderedChart = chartObject;
            this.renderedChart.dispatch = d3.dispatch(eventName);
            this.chartType = this.chartOptions.chartType;
            this.renderedChart.draw(this.data, this._eventHandlers);
        }



        
        
        var self = this;
        this.renderedChart.dispatch.on(eventName, function () {
            if (this.renderContainerId === self.renderContainerId) {
                self.events.addDefaultEventBehaviour(self.renderContainerId,this.chartOptions);
                self.events.registerEventHandler(self._eventHandlers, self.renderContainerId);
            }
        });

    }

    //Draws overlap series
    //Used for cascade filter
    renderOverlap(data) {
        this.oData = data;
        this.renderedChart.drawOverlap(this.oData, this.data);
    }

    removeOverlap() {
        this.renderedChart.removeOverlap(this.data);
    }
    //To set options for the chart
    //Add keys from chartOptions
    setOptions(chartOptions) {
        if (typeof chartOptions == 'undefined' || chartOptions == null) {
            return;
        }

        var options = [
            'overlap',
            'noOfPieSlices',
            'chartClientId',
            'drillMap',
            'zoomLevel',
            'gaugeConfiguration',
            'margin',
            'chartType',
            'defaultColors',
            'axisRedrawThreshold',
            'targetDragEnd',
            'updateTargetSentiment',
            'deleteTarget',
            'showMedian',
            'tooltip',
            'brush',
            'seriesLabel',
            'chartHost'
        ];

        options.forEach(function (opt) {
            var config = chartOptions[opt];
            if (typeof config !== 'undefined' && config !== null && config !== "") {
                this.chartOptions[opt] = config;
            }
        }.bind(this));

        //set true for panning grouped column
        // if (typeof chartOptions.panning !== 'undefined' && chartOptions.panning !== "" && chartOptions.panning !== null)
        //     this.chartOptions.panning = chartOptions.panning;
    }

}

export class XChartAxis extends XChartUtility {

    constructor(renderContainerId, width, height, chartOptions) {
        super(chartOptions);
        this.renderContainerId = renderContainerId;
        this.width = width;
        this.height = height;
        this.scaleType = '';

        this.axisOptions = {
            ticks: '',
            fontSize: 10,
            axisColor: '#000',
            tickColor: '#000',
            tickSize: '',
            tickFormat: '',
            orient: 'left',
            position: 'vertical', //Vertical Or Horizontal
            showPath: true,
            axisText: '',
            calculate: ''
        };
    }

    //Takes a category and returns an ordinal(qualitative) scale with direction

    addQualitativeScale(categories, innerPadding, outerPadding) {
        this.categories = categories;

        var values = this.categories.map(function (d) {
            return d.value;
        });

        var scale = '';
        if (this.axisOptions.position === 'horizontal') {
            scale = d3.scaleBand()
                .domain(values)
                .rangeRound([0, this.width])
                .paddingInner(innerPadding)
                .paddingOuter(outerPadding);
        } else {
            scale = d3.scaleBand()
                .domain(values)
                .rangeRound([0, this.height])
                .paddingInner(innerPadding)
                .paddingOuter(outerPadding);
        }

        this.scale = scale;
        this.scaleType = 'qualitative';
        return this.scale;
    }
    //Takes a category and returns an linear(quantitative) scale with direction
    //aec:axisExtrapolationCoefficient

    addQuantitativeScale(series, aec, rangeMin, rangeMax, domainMin, domainMax) {

        if (this.axisOptions.calculate !== 'auto') {
            if ((typeof domainMin === 'undefined' && typeof domainMax === 'undefined') &&
                (typeof rangeMin === 'undefined' && typeof rangeMax === 'undefined')) {
                console.log('Invalid Arguments.Specify domain and range when calculate is not set to auto');
                return;
            }
        }

        if (!aec)
            aec = 0;

        this.series = series;

        var scale = '';

        if (this.axisOptions.calculate === 'auto') {
            if (this.axisOptions.position === 'vertical') {
                scale = d3.scaleLinear().range([this.height, 0]);

                var maxY = d3.max(series, function (d) {
                    return d3.max(d.data);
                });

                scale.domain([0, maxY + aec * maxY]);
            } else {
                scale = d3.scaleLinear().range([this.width, 0]);

                var maxX = d3.max(series, function (d) {
                    return d3.max(d.data);
                });

                scale.domain([0, maxX + aec * maxX]);
            }
        } else if (this.axisOptions.calculate !== 'auto') {

            scale = d3.scaleLinear();

            if (typeof rangeMin !== 'undefined' && typeof rangeMax !== 'undefined')
                scale.range([rangeMax, rangeMin]);

            if (typeof domainMin !== 'undefined' && typeof domainMax !== 'undefined')
                scale.domain([domainMin, domainMax + aec * domainMax]);
        }


        this.scale = scale;

        this.scaleType = 'quantitative';

        return this.scale;
    }
    //Axis Drawing

    draw(scale, drawPosition, axisId, axisLabelOverlap) {

        var svg = this.d3ShadowSelect('#' + this.renderContainerId + "_mainGroup");
        //To use the helper utility functions
        var utility = this.utility;
        var axis = '';

        var axisLine = (this.axisOptions.position === 'horizontal' ? "x" : "y");

        if (!axisId) {
            axisId = this.renderContainerId + "_" + axisLine + "axis";
        }

        var _axis;
        switch (this.axisOptions.orient) {
            case "top": _axis = d3.axisTop(scale); break;
            case "bottom": _axis = d3.axisBottom(scale); break;
            case "left": _axis = d3.axisLeft(scale); break;
            case "right": _axis = d3.axisRight(scale); break;
            default: _axis = d3.axisBottom(scale); break;
        }

        if (this.scaleType === 'qualitative') {
            var categories = this.categories;
            svg.select("#" + axisId).remove();


            axis = svg.append("g")
                .attr("class", axisLine + " axis")
                .attr("id", axisId)
                .call(_axis);
            var ticks = axis
                .selectAll('text')
                .text(function (d, i) {
                    return categories[i].name;
                });

            if (this.axisOptions.position === 'horizontal') {
                if (drawPosition) {
                    axis.attr("transform", "translate(" + drawPosition.x + "," + drawPosition.y + ")");
                }

                if (axisLabelOverlap) {
                    ticks
                        .attr("y", 0)
                        .attr("x", 9)
                        .attr("dy", ".35em")
                        .attr("transform", "rotate(90)")
                        .style("text-anchor", "start");
                } else {
                    ticks.call(this.wrap, scale.bandwidth(), 'horizontal');
                }
            } else if (this.axisOptions.position === 'vertical') {
                ticks.call(this.wrap, scale.bandwidth(), 'vertical');
            }
            this.checkOverlapAndRemove(ticks, this.axisOptions.position);
            this.tooltip(ticks, '#' + axisId + ' .tick', false, false);
        } else if (this.scaleType === 'quantitative') {

            if (this.axisOptions.ticks !== '')
                _axis.ticks(this.axisOptions.ticks);
            if (this.axisOptions.tickSize !== '')
                _axis.tickSize(-this.axisOptions.tickSize, 0, 0);
            if (this.axisOptions.tickFormat !== '')
                _axis.tickFormat(this.axisOptions.tickFormat);

            if (!svg.select('#' + axisId)['_groups'][0][0]) {
                axis = svg.append("g")
                    .attr("class", axisLine + " axis")
                    .attr("id", axisId)
                    .call(_axis);
            } else {
                axis = svg.select('#' + axisId)
                    .transition()
                    .duration(1000)
                    .ease(d3.easeBounce)
                    .call(_axis);
            }


            if (drawPosition) {
                axis.attr("transform",
                    "translate(" + drawPosition.x + "," + drawPosition.y + ")");
            }

            if (!this.axisOptions.showPath)
                svg.select('.' + axisLine + '.axis path').style('display', 'none');
        }
        return axis;
    }
    // set option

    setOptions(axisOptions) {

        if (axisOptions.ticks)
            this.axisOptions.ticks = axisOptions.ticks;
        if (axisOptions.fontSize)
            this.axisOptions.fontSize = axisOptions.fontSize;
        if (axisOptions.axisColor)
            this.axisOptions.axisColor = axisOptions.axisColor;
        if (axisOptions.tickColor)
            this.axisOptions.tickColor = axisOptions.tickColor;
        if (axisOptions.tickSize)
            this.axisOptions.tickSize = axisOptions.tickSize;
        if (axisOptions.tickFormat)
            this.axisOptions.tickFormat = axisOptions.tickFormat;
        if (axisOptions.orient)
            this.axisOptions.orient = axisOptions.orient;
        if (axisOptions.position)
            this.axisOptions.position = axisOptions.position;

        this.axisOptions.showPath = axisOptions.showPath;

        if (axisOptions.axisText)
            this.axisOptions.axisText = axisOptions.axisText;

        // set true for panning in grouped column chart
        // if (axisOptions.panning)
        // 	this.axisOptions.panning = axisOptions.panning;

        if (axisOptions.calculate)
            this.axisOptions.calculate = axisOptions.calculate;
    }
}

export class XChartLegend extends XChartUtility {

    constructor(series, color, chartOptions) {
        super(chartOptions);
        this.series = series;
        this.color = color;

        this.legendOptions = {
            /*Future Properties
                Drop Box Hover Text....tooltip
                Left and Bottom position support
                Paging Support for each legend position---Future and Present supported
            */
            shape: 'rect', //Rect or Circle
            position: 'top', //Supported right and top
            size: 10,
            font: 'sans-serif',
            fontSize: 10,
            stroke: true,
            strokeColorCoefficient: 0.5, //Darkness parameter for stroke to outline the fill color
            fill: true
        };
    }

    //Drawing Legends with various position parameters

    drawLegend(position, svg, width, margin) {

        var legendWidth = this.legendOptions.size;
        var font = this.legendOptions.font;
        var fontSize = this.legendOptions.fontSize;
        var series = this.series;
        var color = this.color;
        var seriesNames = [];
        // Shortening the legend length to 30 characters
        series.forEach(function (d, i) {
            if (d.name.length > 30) {
                seriesNames.push(d.name.substring(0, 26).concat('...'));
            } else
                seriesNames.push(d.name);
        });
        if (position === 'top') {
            var legendCount = series.length;

            svg.selectAll('.legendg').remove();

            var legend = svg.selectAll(".legend")
                .data(series)
                .enter().append("g")
                .attr('class', 'legendg')
                .attr("transform", function (d, i) {
                    return "translate(" + i * (width / legendCount) + ",-" + margin.top / 2 + ")";
                });

            legend.append("rect")
                .attr("x", 45)
                .attr("width", legendWidth)
                .attr("height", legendWidth)
                .attr("class", "legend");

            legend.append("text")
                .attr("x", 60)
                .attr("y", 6)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .style("font", fontSize + 'px ' + font)
                .text(function (d, i) {
                    return seriesNames[i];
                });

            var totalTextWidth = 0;

            var textWidth = [];

            svg.selectAll('.legendg text')._groups.forEach(function (c) {
                c.forEach(function (d, i) {
                    if (!d.offsetWidth)
                        d.offsetWidth = d.getBoundingClientRect().width;
                    totalTextWidth += d.offsetWidth;
                    textWidth[i] = d.offsetWidth;
                });
            });

            svg.selectAll('.legendg').remove();

            var totalLegendWidth, dx, xPosition, yPosition;

            totalLegendWidth = totalTextWidth + (legendCount * legendWidth) + (35 * legendCount);

            dx = totalLegendWidth - (width + margin.left + margin.right);

            var recCallCount = 0;

            function drawLegend(xPosition, yPosition, startLegendIdx, endLegendIdx, recCallCount) {
                var legend = svg.selectAll(".legend" + recCallCount)
                    .data(function () {
                        var legendArr = [];
                        for (var i = startLegendIdx; i < endLegendIdx + 1; i++) {
                            legendArr.push(series[i]);
                        }
                        return legendArr;
                    })
                    .enter()
                    .append("g")
                    .attr('class', 'legendg ' + 'legendg' + recCallCount)
                    .attr("transform", function (d, i) {
                        var prevTextWidth = 0,
                            j = i + startLegendIdx - 1;
                        while (j >= startLegendIdx) {
                            prevTextWidth += textWidth[j];
                            j--;
                        }
                        return "translate(" + (xPosition + (40 * i) + prevTextWidth) + "," + (-1 * yPosition) + ")";
                    });

                legend.append("rect")
                    .attr("x", 45)
                    .attr("width", legendWidth)
                    .attr("height", legendWidth)
                    .attr("class", "legend legend" + recCallCount)
                    .style("fill", function (d, i) {
                        return color[i + startLegendIdx];
                    });

                legend.append("text")
                    .attr("x", 60)
                    .attr("y", 6)
                    .attr("dy", ".35em")
                    .style("text-anchor", "start")
                    .style("font", fontSize + 'px ' + font)
                    .text(function (d, i) {
                        return seriesNames[i + startLegendIdx];
                    });
            }

            //If legend does not exceeds width

            if (dx <= 0) {
                xPosition = width - margin.left - margin.right - totalLegendWidth;
                yPosition = margin.top - 5;
                drawLegend(xPosition, yPosition, 0, legendCount - 1, recCallCount);
            }

            //If legend exceeds width
            else {
                legendLengthExceed(0, legendCount - 1);
            }

            function legendLengthExceed(firstIdx, lastIdx) {

                var cumLegendWidth = 0,
                    threshold = 0;

                for (var i = firstIdx; i < lastIdx + 1; i++) {

                    cumLegendWidth += textWidth[i] + legendWidth + 40;
                    var cumLegWidth = cumLegendWidth;

                    if (cumLegendWidth > (width + margin.left)) {
                        threshold = i - 1;
                        cumLegendWidth -= textWidth[i] + legendWidth + 40;
                        if (recCallCount == 0) {
                            xPosition = -margin.left;
                        }
                        yPosition = (margin.top - 5) - (15 * recCallCount);
                        drawLegend(xPosition, yPosition, firstIdx, threshold, recCallCount);
                        recCallCount++;
                        break;
                    }
                }

                if (cumLegWidth < (width + margin.left)) {
                    // xPosition=width - cumLegendWidth - margin.left;
                    yPosition = (margin.top - 5) - (15 * recCallCount);
                    drawLegend(xPosition, yPosition, firstIdx, lastIdx, recCallCount);
                    return;
                }
                legendLengthExceed(threshold + 1, lastIdx);
            }
            //this.tooltip(svg, '.legend', false, false);
            return recCallCount;
        } else if (position == 'right') {

        }
        // left:{
        //  //To be implemented
        // },
        // bottom:{
        //  //To be implemented
        // }

    }
    //Set Options for overriding legend properties

    setOptions(legendOptions) {

        if (legendOptions.shape)
            this.legendOptions.shape = legendOptions.shape;
        if (legendOptions.position)
            this.legendOptions.position = legendOptions.position;
        if (legendOptions.stroke)
            this.legendOptions.stroke = legendOptions.stroke;
        if (legendOptions.strokeColorCoefficient)
            this.legendOptions.strokeColorCoefficient = legendOptions.strokeColorCoefficient;
        if (legendOptions.fill)
            this.legendOptions.fill = legendOptions.fill;
    }

}


