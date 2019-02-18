//GroupedColumn Chart
//PI.xChart\src\js\plots\groupedColumn.js
/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { XChartAxis, XChartUtility, XChartLegend } from "./x-chart.js";
import * as d3 from "d3";

const XChartGroupedColumn = (function () {
    class groupedColumn {

        constructor(renderContainerId, color, chartOptions) {
            //Information stored here will persist
            this.chartOptions = chartOptions;
            this.renderContainerId = renderContainerId;
            this.canvasWidth = chartOptions.chartHost.querySelector('#'+this.renderContainerId).offsetWidth;
            this.canvasHeight = chartOptions.chartHost.querySelector('#'+this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.color = color;
            this.axisRedrawThreshold = chartOptions.axisRedrawThreshold;
            this.aec = chartOptions.aec;
            this.overlapDraw = false;
            //To use the helper utility functions
            this.utility = new XChartUtility(chartOptions);
        }

        lineDraw(seriesForLineChart, data, that) {
            for (var i = 0; i < seriesForLineChart.length; i++)
                if (isNaN(seriesForLineChart[i].series.axis))
                    seriesForLineChart[i].series.axis = 1;
            var chartOptions = that.chartOptions;
            var svg = this.utility.d3ShadowSelect("#" + that.renderContainerId + '_mainGroup');
            var categoryScale = that.categoryAxis.scale;
            var seriesScales = that.seriesScales;
            var color = that.color;
            svg.selectAll('path.line').remove();
            svg.selectAll('circle').remove();
            var series = seriesForLineChart.map(function (d) {
                return d.series;
            });
            for (var i = 0; i < series.length; i++) {
                var dataValues = series[i].data;
                var fmtDataValues = series[i].fmtData;
                var lineData = data.categories.map(function (d, j) {
                    return {
                        category: d.name,
                        longName: d.longName,
                        value: d.value,
                        index: j,
                        seriesIndex: i,
                        series: series[i].longName,
                        data: +dataValues[j],
                        fmtData: fmtDataValues[j],
                        axis: series[i].axis,
                        categoryLongName: d.longName,
                        seriesLongName: series[i].longName
                    };
                });
                var line = d3.line()
                    .curve(d3.curveLinear)
                    .x(function (d, i) {
                        return categoryScale(d.value) + categoryScale.bandwidth() / 2;
                    })
                    .y(function (d) {
                        return seriesScales[d.axis - 1](d.data);
                    });
                svg.append("path")
                    .datum(lineData)
                    .attr("class", "line")
                    .attr("d", line)
                    .style("stroke", color[seriesForLineChart[i].index])
                    .style("stroke-width", "3")
                    .style("stroke-linejoin", "round")
                    .style("stroke-linecap", "square")
                    .style("fill", "none");
                svg.selectAll(".circle .circle" + i)
                    .data(lineData)
                    .enter()
                    .append("circle")
                    .attr("class", "gCLinecircle circle" + i)
                    .attr("cx", function (d, i) {
                        return categoryScale(d.value) + categoryScale.bandwidth() / 2;
                    })
                    .attr("cy", function (d) {
                        return seriesScales[d.axis - 1](d.data);
                    })
                    .attr("r", "3")
                    .style("stroke-width", "1")
                    .style("stroke", color[seriesForLineChart[i].index])
                    .style("fill", "#fff")
                    .each(function (d) {
                        if (d.index === data.categories.length - 1 && d.seriesIndex === seriesForLineChart.length - 1)
                            that.dispatch.call('render-complete',that, data, that.seriesForChart);
                    });
            }
            if (chartOptions.tooltip)
                that.utility.tooltip(svg, '.gCLinecircle', true, false);
        }

        draw(data) {
            var color = this.color;
            var margin = this.margin;
            var chartOptions = this.chartOptions;
            this.bottomMarginSet = false;
            var seriesScales = [];
            var el = this.chartOptions.chartHost.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);
            //Adjust margin to accomodate multiple axes
            var left = this.chartOptions.seriesLabel ? 50 : 30, right = 10;
            var yAxisCount = 1;
            for (var sIndex = 0; sIndex < data.series.length; ++sIndex) {
                if (data.series[sIndex].axis && data.series[sIndex].axis > 1 && data.series[sIndex].axis > yAxisCount) {
                    yAxisCount++;
                    if (yAxisCount % 2 === 0) {
                        right += 40;
                    }
                    else {
                        left += 40;
                    }
                }
            }
            //Setting appropriate margin attributes
            margin.right = right;
            margin.left = left;
            var width = this.canvasWidth - margin.left - margin.right, height = this.canvasHeight - margin.top - margin.bottom;
            var svg = this.utility.d3ShadowSelect("#" + this.renderContainerId).append("svg")
                .attr("id", this.renderContainerId + "_svg")
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight)
                .attr("width", "100%")
                .attr("height", "100%")
                .attr('class', 'groupedColumn');
            var mainGroup = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("id", this.renderContainerId + "_mainGroup")
                .attr('class', 'groupedColumn');
            var axisLabelOverlap = this.utility.draw_xAxisDummy(mainGroup, data.categories, height, width, this.renderContainerId);
            if (axisLabelOverlap) {
                margin.bottom *= 2;
                this.bottomMarginSet = true;
            }
            var legend = new XChartLegend(data.series, color,this.chartOptions);
            //Set options for legend here
            // legend.setOptions({});
            var legendRows = legend.drawLegend('top', mainGroup, width, margin) + 1;
            margin.top = 20 * legendRows;
            mainGroup.selectAll('.legendg').remove();
            height = this.canvasHeight - margin.top - margin.bottom;
            // svg.attr("width", width + margin.left + margin.right)
            //     .attr("height", height + margin.top + margin.bottom);
            mainGroup.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            svg = mainGroup;
            legend.drawLegend('top', svg, width, margin);
            var si = d3.format('.2s');
            var siMod = function (val) {
                return si(val).replace(/G/, 'B');
            };
            //Utility Function to separate data for bar and line
            //Input : data
            //Output : Object (with line, bar and axis groups)
            var prepData = this.utility.dataPrep(data);
            var seriesForLineChart = prepData.seriesForLineChart, seriesForChart = prepData.seriesForChart, axesGroups = prepData.axesGroups;
            this.seriesForChart = seriesForChart;
            if (seriesForLineChart.length > 0)
                this.seriesForLineChart = seriesForLineChart;
            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new XChartAxis(this.renderContainerId, width, height,this.chartOptions);
            var categoryAxisOptions = {};
            categoryAxisOptions.ticks = 5;
            categoryAxisOptions.orient = 'bottom';
            categoryAxisOptions.position = 'horizontal';
            this.categoryAxis.setOptions(categoryAxisOptions);
            var categoryScale = this.categoryAxis.addQualitativeScale(data.categories, 0.34, 0.2);
            var axisId;
            this.xAxis = this.categoryAxis.draw(categoryScale, {
                x: 0,
                y: height
            }, axisId, axisLabelOverlap);
            //SubCategory Scale to further category into series for each category
            var subCategoryScale = d3.scaleBand()
                .domain(seriesForChart.map(function (d) {
                    return d.series.value;
                })).range([0, categoryScale.bandwidth()]);
            //Utility function call to add filter def to svg
            this.utility.addLinearFilter(svg, this.renderContainerId);
            this.subCategoryScale = subCategoryScale;
            this.seriesScales = seriesScales;
            this.seriesAxes = [];
            //Series Axis -- Create Object-->Set Options-->Add Scale-->Draw
            var seriesAxisOptions = {};
            seriesAxisOptions.position = 'vertical';
            seriesAxisOptions.tickFormat = siMod;
            for (var i = 0; i < axesGroups.length; i++) {
                var maxY = d3.max(axesGroups[i], function (d) {
                    return d3.max(d.data);
                });
                var minY = d3.min(axesGroups[i], function (d) {
                    return d3.min(d.data);
                });
                if (minY > 0)
                    minY = 0;
                minY = minY * 1.2;
                var seriesAxis = new XChartAxis(this.renderContainerId, width, height,this.chartOptions);
                var position = {
                    x: 0,
                    y: 0
                };
                //Add scales to the scales array and draw
                //Applying conditional attributes and render coordinates
                var seriesScale = '';
                if (i === 0) {
                    seriesAxisOptions.ticks = 5;
                    seriesAxisOptions.tickSize = width;
                    seriesAxisOptions.showPath = false;
                    seriesAxis.setOptions(seriesAxisOptions);
                    seriesScale = seriesAxis.addQuantitativeScale(data.series, this.aec, 0, height, minY, maxY);
                }
                else {
                    if (i % 2 === 0) {
                        seriesAxisOptions.ticks = '';
                        seriesAxisOptions.tickSize = '';
                        seriesAxisOptions.showPath = true;
                        seriesAxis.setOptions(seriesAxisOptions);
                        seriesScale = seriesAxis.addQuantitativeScale(data.series, this.aec, 0, height, minY, maxY);
                        position.x = (0 - margin.left + i * 30);
                    }
                    else {
                        seriesAxisOptions.ticks = '';
                        seriesAxisOptions.tickSize = '';
                        seriesAxisOptions.showPath = true;
                        seriesAxisOptions.orient = 'right';
                        seriesAxis.setOptions(seriesAxisOptions);
                        seriesScale = seriesAxis.addQuantitativeScale(data.series, 0.1, 0, height, minY, maxY);
                        position.x = (width + ((i - 1) * 20));
                    }
                }
                seriesAxis.draw(seriesScale, position, this.renderContainerId + "_yaxis_" + i);
                this.seriesAxes.push(seriesAxis);
                seriesScales.push(seriesScale);
            }
            if (this.chartOptions.seriesLabel) {
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left)
                    .attr("x", 0 - (height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text(this.chartOptions.seriesLabel);
            }
            var outerGroup = svg.selectAll(".outerBar")
                .data(data.categories)
                .enter()
                .append("g")
                .attr("class", "outerBar")
                .attr("transform", function (d) {
                    return "translate(" + categoryScale(d.value) + ",0)";
                });
            var bars = outerGroup
                .selectAll('rect')
                .data(function (d, i) {
                    var rArray = [];
                    for (var x = 0; x < seriesForChart.length; x++) {
                        rArray.push({
                            seriesName: seriesForChart[x].series.name,
                            seriesIndex: seriesForChart[x].index,
                            data: seriesForChart[x].series.data[i],
                            seriesMedian: seriesForChart[x].series.median,
                            fmtData: seriesForChart[x].series.fmtData[i],
                            index: i,
                            seriesLongName: seriesForChart[x].series.longName,
                            seriesValue: seriesForChart[x].series.value,
                            categoryLongName: d.longName,
                            categoryName: d.name,
                            categoryValue: d.value,
                            categoryDimName: d.dimName,
                            axis: seriesForChart[x].series.axis
                        });
                    }
                    return rArray;
                });
            bars.enter()
                .append("rect")
                .attr('class', 'bar')
                .attr("x", function (d) {
                    return subCategoryScale(d.seriesValue);
                })
                .attr("width", subCategoryScale.bandwidth())
                .attr('y', function (d) {
                    var yScale = seriesScales[d.axis - 1];
                    return yScale(0);
                })
                .attr('rx', '1')
                .attr('ry', '1')
                .attr('height', 0)
                .style("fill", function (d) {
                    return color[d.seriesIndex];
                })
                .style('opacity', 1)
                .transition()
                .ease(d3.easeBounce)
                .duration(1000)
                .attr('y', function (d) {
                    if (d.data >= 0) {
                        var yScale = seriesScales[d.axis - 1];
                        return (yScale(0) - yScale(d.data)) >= 2 && (yScale(0) - yScale(d.data)) !== 0 ? yScale(d.data) : (yScale(0) - 2);
                    }
                    else {
                        var yScale = seriesScales[d.axis - 1];
                        return yScale(0);
                    }
                })
                .attr('height', function (d) {
                    var yScale = seriesScales[d.axis - 1];
                    return Math.abs(yScale(d.data) - yScale(0)) <= 2 && Math.abs(yScale(d.data) - yScale(0)) !== 0 ? 2 : Math.abs(yScale(d.data) - yScale(0));
                })
                .on('end', function (d) {
                    if (d.index === data.categories.length - 1) {
                        if (seriesForLineChart.length > 0)
                            this.lineDraw(seriesForLineChart, data, this);
                        else {
                            if (d.seriesIndex === data.series.length - 1) {
                                this.dispatch.call('render-complete',this, data, seriesForChart);
                            }
                        }
                    }
                }.bind(this));
            if (chartOptions.showMedian) {
                var medianLineGroup = svg.append('g')
                    .attr('class', 'medianLine');
                var medianLine = medianLineGroup
                    .selectAll('.medianLine')
                    .data(function (d, i) {
                        var rArray = [];
                        for (var x = 0; x < seriesForChart.length; x++) {
                            rArray.push({
                                seriesName: seriesForChart[x].series.name,
                                seriesIndex: seriesForChart[x].index,
                                data: seriesForChart[x].series.data[i],
                                seriesMedian: seriesForChart[x].series.median,
                                fmtData: seriesForChart[x].series.fmtData[i],
                                index: i,
                                seriesLongName: seriesForChart[x].series.longName,
                                seriesValue: seriesForChart[x].series.value,
                                axis: seriesForChart[x].series.axis
                            });
                        }
                        return rArray;
                    });
                medianLine.enter()
                    .append('line')
                    .attr('class', 'medianline0')
                    .attr("x1", 12)
                    .attr("y1", function (d) {
                        var yScale = seriesScales[d.axis - 1];
                        return yScale(d.seriesMedian);
                    })
                    .attr("x2", width)
                    .attr("y2", function (d) {
                        var yScale = seriesScales[d.axis - 1];
                        return yScale(d.seriesMedian);
                    })
                    .style('stroke', function (d) {
                        return color[d.seriesIndex];
                    })
                    .style("stroke-width", "1px");
                medianLine.enter()
                    .append('line')
                    .attr('class', 'medianline1')
                    .attr("x1", 12)
                    .attr("y1", function (d) {
                        var yScale = seriesScales[d.axis - 1];
                        return yScale(d.seriesMedian);
                    })
                    .attr("x2", width)
                    .attr("y2", function (d) {
                        var yScale = seriesScales[d.axis - 1];
                        return yScale(d.seriesMedian);
                    })
                    .style('stroke', '#fff')
                    .style('stroke-dasharray', '5,5')
                    .style("stroke-width", "1px");
                medianLine.enter()
                    .append('text')
                    .attr('x', 10)
                    .attr('y', function (d) {
                        var yScale = seriesScales[d.axis - 1];
                        return yScale(d.seriesMedian);
                    })
                    .text('median')
                    .attr('dy', '.25em')
                    .style('font-family', "sans-serif")
                    .style('font-size', "10")
                    .style('fill', function (d) {
                        return color[d.seriesIndex];
                    })
                    .attr('text-anchor', 'end');
            }
            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.bar', true, false);
        }

        redraw(data) {
            var color = this.color;
            var margin = this.margin;
            var chartOptions = this.chartOptions;
            var axisRedrawThreshold = chartOptions.axisRedrawThreshold;
            var width = this.canvasWidth - margin.left - margin.right, height = this.canvasHeight - margin.top - margin.bottom;
            var svg = this.utility.d3ShadowSelect("#" + this.renderContainerId + '_svg');
            var mainGroup = this.utility.d3ShadowSelect('#' + this.renderContainerId + "_mainGroup");
            d3.selectAll('.medianLine').remove();
            this.removeOverlap(data);
            var axisLabelOverlap = this.utility.draw_xAxisDummy(mainGroup, data.categories, height, width, this.renderContainerId);
            var bottomMarginChanged = false;
            if (!axisLabelOverlap && this.bottomMarginSet) {
                margin.bottom /= 2;
                this.bottomMarginSet = false;
                bottomMarginChanged = true;
            }
            else if (axisLabelOverlap && !this.bottomMarginSet) {
                margin.bottom *= 2;
                this.bottomMarginSet = true;
                bottomMarginChanged = true;
            }
            else if (axisLabelOverlap && !this.bottomMarginSet) {
                margin.bottom *= 2;
                this.bottomMarginSet = true;
                bottomMarginChanged = true;
            }
            var legend = new XChartLegend(data.series, color,this.chartOptions);
            //Set options for legend here
            // legend.setOptions({});
            var legendRows = legend.drawLegend('top', mainGroup, width, margin) + 1;
            margin.top = 20 * legendRows;
            mainGroup.selectAll('.legendg').remove();
            height = this.canvasHeight - margin.top - margin.bottom;
            svg.attr("width", "100%")
                .attr("height", "100%");
            mainGroup.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            svg = mainGroup;
            legend.drawLegend('top', svg, width, margin);
            var si = d3.format('.2s');
            var siMod = function (val) {
                return si(val).replace(/G/, 'B');
            };
            var prepData = this.utility.dataPrep(data);
            var seriesForLineChart = prepData.seriesForLineChart, seriesForChart = prepData.seriesForChart, axesGroups = prepData.axesGroups;
            this.seriesForChart = seriesForChart;
            if (seriesForLineChart.length > 0)
                this.seriesForLineChart = seriesForLineChart;
            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new XChartAxis(this.renderContainerId, width, height,this.chartOptions);
            var categoryAxisOptions = {};
            categoryAxisOptions.ticks = 5;
            categoryAxisOptions.orient = 'bottom';
            categoryAxisOptions.position = 'horizontal';
            this.categoryAxis.setOptions(categoryAxisOptions);
            var categoryScale = this.categoryAxis.addQualitativeScale(data.categories, 0.34, 0.2);
            var axisId;
            this.xAxis = this.categoryAxis.draw(categoryScale, {
                x: 0,
                y: height
            }, axisId, axisLabelOverlap);
            //SubCategory Scale to further category into series for each category
            var subCategoryScale = d3.scaleBand()
                .domain(seriesForChart.map(function (d) {
                    return d.series.value;
                })).range([0, categoryScale.bandwidth()]);
            this.subCategoryScale = subCategoryScale;
            var seriesScales = [];
            for (var i = 0; i < axesGroups.length; i++) {
                var maxY = d3.max(axesGroups[i], function (d) {
                    return d3.max(d.data);
                });
                var minY = d3.min(axesGroups[i], function (d) {
                    return d3.min(d.data);
                });
                if (minY > 0)
                    minY = 0;
                minY = minY * 1.2;
                var seriesAxis = this.seriesAxes[i];
                var previousMaxY = seriesAxis.scale.domain()[1] / (1 + this.aec);
                var position = {
                    x: 0,
                    y: 0
                };
                //Add scales to the scales array and draw
                //Applying conditional attributes and render coordinates
                var seriesScale = '';
                if (i === 0) {
                    position = position;
                }
                else {
                    if (i % 2 === 0) {
                        position.x = (0 - margin.left + i * 30);
                    }
                    else {
                        position.x = (width + ((i - 1) * 20));
                    }
                }
                if (Math.abs((previousMaxY - maxY) / previousMaxY) > axisRedrawThreshold) {
                    seriesScale = seriesAxis.addQuantitativeScale(data.series, this.aec, 0, height, minY, maxY);
                    seriesAxis.draw(seriesScale, position, this.renderContainerId + "_yaxis_" + i);
                    this.seriesAxes[i] = seriesAxis;
                    seriesScales.push(seriesScale);
                }
                else {
                    if (bottomMarginChanged) {
                        seriesScale = axisRedrawThreshold === 1 ? seriesAxis.addQuantitativeScale(data.series, this.aec, 0, height, seriesAxis.scale.domain()[0], previousMaxY) : seriesAxis.addQuantitativeScale(data.series, this.aec, 0, height, minY, maxY);
                        seriesAxis.draw(seriesScale, position, this.renderContainerId + "_yaxis_" + i);
                        this.seriesAxes[i] = seriesAxis;
                        seriesScales.push(seriesScale);
                    }
                    else {
                        seriesScales.push(seriesAxis.scale);
                    }
                }
            }
            this.seriesScales = seriesScales;
            var outerGroup = svg.selectAll(".outerBar")
                .data(data.categories);
            outerGroup.exit().remove();
            outerGroup.enter()
                .append('g')
                .attr("class", "outerBar")
                .attr("transform", function (d) {
                    return "translate(" + categoryScale(d.value) + ",0)";
                });
            outerGroup
                .transition()
                .duration(400)
                .attr("transform", function (d) {
                    return "translate(" + categoryScale(d.value) + ",0)";
                });
            var bars = outerGroup
                .selectAll('.bar')
                .data(function (d, i) {
                    var rArray = [];
                    for (var x = 0; x < seriesForChart.length; x++) {
                        rArray.push({
                            seriesName: seriesForChart[x].series.name,
                            seriesIndex: seriesForChart[x].index,
                            data: seriesForChart[x].series.data[i],
                            fmtData: seriesForChart[x].series.fmtData[i],
                            index: i,
                            seriesLongName: seriesForChart[x].series.longName,
                            seriesValue: seriesForChart[x].series.value,
                            categoryLongName: d.longName,
                            categoryName: d.name,
                            categoryValue: d.value,
                            categoryDimName: d.dimName,
                            axis: seriesForChart[x].series.axis
                        });
                    }
                    return rArray;
                });
            bars.exit().remove();
            bars.enter()
                .append("rect")
                .attr('class', 'bar')
                .attr("x", function (d) {
                    return subCategoryScale(d.seriesValue);
                })
                .attr('y', height)
                .attr('rx', '1')
                .attr('ry', '1')
                .attr('height', 0)
                .style("fill", function (d) {
                    return color[d.seriesIndex];
                })
                .style('opacity', 1);
            bars.transition()
                .ease(d3.easeBounce)
                .duration(1000)
                .attr("x", function (d) {
                    return subCategoryScale(d.seriesValue);
                })
                .attr('y', function (d) {
                    if (d.data >= 0) {
                        var yScale = seriesScales[d.axis - 1];
                        return (yScale(0) - yScale(d.data)) >= 2 && (yScale(0) - yScale(d.data)) !== 0 ? yScale(d.data) : (yScale(0) - 2);
                    }
                    else {
                        var yScale = seriesScales[d.axis - 1];
                        return yScale(0);
                    }
                })
                .attr('height', function (d) {
                    var yScale = seriesScales[d.axis - 1];
                    return Math.abs(yScale(d.data) - yScale(0)) <= 2 && Math.abs(yScale(d.data) - yScale(0)) !== 0 ? 2 : Math.abs(yScale(d.data) - yScale(0));
                })
                .attr("width", subCategoryScale.bandwidth())
                .on('end', function (d) {
                    if (d.index === data.categories.length - 1 && d.seriesIndex === data.series.length - 1) {
                        svg.selectAll(".outerBar").remove();
                        redrawBars(this);
                    }
                }.bind(this));

                
            function redrawBars(that) {
                var outerGroup = svg.selectAll(".outerBar")
                    .data(data.categories)
                    .enter()
                    .append("g")
                    .attr("class", "outerBar")
                    .attr("transform", function (d) {
                        return "translate(" + categoryScale(d.value) + ",0)";
                    });
                var bars = outerGroup
                    .selectAll('rect')
                    .data(function (d, i) {
                        var rArray = [];
                        for (var x = 0; x < seriesForChart.length; x++) {
                            rArray.push({
                                seriesName: seriesForChart[x].series.name,
                                seriesIndex: seriesForChart[x].index,
                                data: seriesForChart[x].series.data[i],
                                fmtData: seriesForChart[x].series.fmtData[i],
                                index: i,
                                seriesLongName: seriesForChart[x].series.longName,
                                seriesValue: seriesForChart[x].series.value,
                                categoryLongName: d.longName,
                                categoryName: d.name,
                                categoryValue: d.value,
                                categoryDimName: d.dimName,
                                axis: seriesForChart[x].series.axis
                            });
                        }
                        return rArray;
                    });
                bars.enter()
                    .append("rect")
                    .attr('class', 'bar')
                    .attr("x", function (d) {
                        return subCategoryScale(d.seriesValue);
                    })
                    .attr("width", subCategoryScale.bandwidth())
                    .attr('rx', '1')
                    .attr('ry', '1')
                    .style("fill", function (d) {
                        return color[d.seriesIndex];
                    })
                    .style('opacity', 1)
                    .attr('y', function (d) {
                        if (d.data >= 0) {
                            var yScale = seriesScales[d.axis - 1];
                            return (yScale(0) - yScale(d.data)) >= 2 && (yScale(0) - yScale(d.data)) !== 0 ? yScale(d.data) : (yScale(0) - 2);
                        }
                        else {
                            var yScale = seriesScales[d.axis - 1];
                            return yScale(0);
                        }
                    })
                    .attr('height', function (d) {
                        var yScale = seriesScales[d.axis - 1];
                        return Math.abs(yScale(d.data) - yScale(0)) <= 2 && Math.abs(yScale(d.data) - yScale(0)) !== 0 ? 2 : Math.abs(yScale(d.data) - yScale(0));
                    })
                    .each(function (d) {
                        if (d.index === data.categories.length - 1) {
                            if (seriesForLineChart.length > 0)
                                that.lineDraw(seriesForLineChart, data, that);
                            else if (d.seriesIndex === data.series.length - 1) {
                                that.dispatch.call('render-complete',that, data, seriesForChart);
                            }
                        }
                    });
                if (chartOptions.showMedian) {
                    var medianLineGroup = svg.append('g')
                        .attr('class', 'medianLine');
                    var medianLine = medianLineGroup
                        .selectAll('.medianLine')
                        .data(function (d, i) {
                            var rArray = [];
                            for (var x = 0; x < seriesForChart.length; x++) {
                                rArray.push({
                                    seriesName: seriesForChart[x].series.name,
                                    seriesIndex: seriesForChart[x].index,
                                    data: seriesForChart[x].series.data[i],
                                    seriesMedian: seriesForChart[x].series.median,
                                    fmtData: seriesForChart[x].series.fmtData[i],
                                    index: i,
                                    seriesLongName: seriesForChart[x].series.longName,
                                    seriesValue: seriesForChart[x].series.value,
                                    axis: seriesForChart[x].series.axis
                                });
                            }
                            return rArray;
                        });
                    medianLine.enter()
                        .append('line')
                        .attr('class', 'medianline0')
                        .attr("x1", 12)
                        .attr("y1", function (d) {
                            var yScale = seriesScales[d.axis - 1];
                            return yScale(d.seriesMedian);
                        })
                        .attr("x2", width)
                        .attr("y2", function (d) {
                            var yScale = seriesScales[d.axis - 1];
                            return yScale(d.seriesMedian);
                        })
                        .style('stroke', function (d) {
                            return color[d.seriesIndex];
                        })
                        .style("stroke-width", "1px");
                    medianLine.enter()
                        .append('line')
                        .attr('class', 'medianline1')
                        .attr("x1", 12)
                        .attr("y1", function (d) {
                            var yScale = seriesScales[d.axis - 1];
                            return yScale(d.seriesMedian);
                        })
                        .attr("x2", width)
                        .attr("y2", function (d) {
                            var yScale = seriesScales[d.axis - 1];
                            return yScale(d.seriesMedian);
                        })
                        .style('stroke', '#fff')
                        .style('stroke-dasharray', '5,5')
                        .style("stroke-width", "1px");
                    medianLine.enter()
                        .append('text')
                        .attr('x', 10)
                        .attr('y', function (d) {
                            var yScale = seriesScales[d.axis - 1];
                            return yScale(d.seriesMedian);
                        })
                        .text('median')
                        .attr('dy', '.25em')
                        .style('font-family', "sans-serif")
                        .style('font-size', "10")
                        .style('fill', function (d) {
                            return color[d.seriesIndex];
                        })
                        .attr('text-anchor', 'end');
                }
                if (chartOptions.tooltip)
                    that.utility.tooltip(svg, '.bar', true, false);
                svg.selectAll('.bar')._groups[0].forEach(function (d) {
                    d3.select(d)
                        .style('opacity', 1)
                        .attr('filter', '');
                });
            }
        }

        drawOverlap(OverlappedData, originalData) {
            OverlappedData = this.utility.overlapDataPrep(OverlappedData, originalData);
            var prepData = this.utility.dataPrep(originalData);
            this.seriesForLineChart = prepData.seriesForLineChart;
            this.overlapDraw = true;
            var overSeries = OverlappedData.overlappedSeries;
            var chartOptions = this.chartOptions;
            // setting default axis
            for (var i = 0; i < originalData.series.length; i++)
                if (isNaN(originalData.series[i].axis))
                    originalData.series[i].axis = 1;
            // converting array of arrays to a single array
            for (var i = 0; i < overSeries.length; i++) {
                overSeries[i].data = d3.merge(overSeries[i].data);
                overSeries[i].fmtData = d3.merge(overSeries[i].fmtData);
            }
            var seriesForLineChart = [];
            for (var i = 0; i < OverlappedData.series.length; i++) {
                if (OverlappedData.series[i].line == true) {
                    var obj = {};
                    obj.series = Object.assign({}, overSeries[i]);
                    obj.index = i;
                    seriesForLineChart.push(obj);
                    for (var j = 0; j < overSeries[i].data.length; j++)
                        overSeries[i].data[j] = 0;
                }
            }
            this.seriesForLineChart = seriesForLineChart;
            var margin = this.margin, height = this.canvasHeight - margin.top - margin.bottom;
            var categoryScale = this.categoryAxis.scale;
            var seriesScales = this.seriesScales;
            var svg = this.utility.d3ShadowSelect('#' + this.renderContainerId + "_mainGroup");
            var subCategoryScale = this.subCategoryScale;
            //remove line
            svg.selectAll('path.line').remove();
            svg.selectAll('circle').remove();
            // reducing the opacity
            svg.selectAll('.bar').style('opacity', 0.7);
            // overlapped bar with new values
            var overlappedBar = svg.selectAll(".overlappedBar")
                .data(originalData.categories)
                .enter()
                .append("g")
                .attr("class", "overlappedBar")
                .attr("transform", function (d) {
                    return "translate(" + categoryScale(d.value) + ",0)";
                });
            overlappedBar = svg.selectAll('.overlappedBar')
                .selectAll('rect')
                .data(function (d, i) {
                    var rArray = [];
                    for (var x = 0; x < overSeries.length; x++) {
                        rArray.push({
                            seriesName: overSeries[x].name,
                            seriesIndex: x,
                            data: overSeries[x].data[i],
                            fmtData: overSeries[x].fmtData[i],
                            index: i,
                            seriesLongName: overSeries[x].longName,
                            seriesValue: overSeries[x].value,
                            categoryLongName: d.longName,
                            categoryName: d.name,
                            categoryDimName: d.dimName,
                            axis: originalData.series[x].axis
                        });
                    }
                    return rArray;
                });
            overlappedBar
                .enter()
                .append("rect")
                .attr('class', 'ObarRect')
                .attr("x", function (d) {
                    return subCategoryScale(d.seriesName);
                })
                .attr('y', function (d) {
                    var yScale = seriesScales[d.axis - 1];
                    return yScale(0);
                })
                .attr('height', 0)
                .attr("width", subCategoryScale.bandwidth())
                .attr('rx', '1')
                .attr('ry', '1')
                .style("fill", '#FFC200')
                .style("opacity", 1)
                .style('stroke', 'black')
                .style('stroke-width', '.3px');
            overlappedBar
                .exit()
                .remove();
            overlappedBar
                .transition()
                .duration(1000)
                .ease(d3.easeBounce)
                .attr('y', function (d) {
                    if (d.data >= 0) {
                        var yScale = seriesScales[d.axis - 1];
                        return (yScale(0) - yScale(d.data)) >= 1 && (yScale(0) - yScale(d.data)) !== 0 ? yScale(d.data) : (yScale(0) - 1);
                    }
                    else {
                        var yScale = seriesScales[d.axis - 1];
                        return yScale(0);
                    }
                })
                .attr('height', function (d) {
                    var yScale = seriesScales[d.axis - 1];
                    return Math.abs(yScale(d.data) - yScale(0)) <= 1 && Math.abs(yScale(d.data) - yScale(0)) !== 0 ? 1 : Math.abs(yScale(d.data) - yScale(0));
                })
                .on('end', function (d) {
                    if (d.index === originalData.categories.length - 1) {
                        if (this.seriesForLineChart.length > 0)
                            this.lineDraw(this.seriesForLineChart, originalData, this);
                    }
                }.bind(this));
            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.ObarRect', true, false);
        }

        removeOverlap(data) {
            var margin = this.margin, height = this.canvasHeight - margin.top - margin.bottom;
            var svg = this.utility.d3ShadowSelect('#' + this.renderContainerId + "_mainGroup");
            //remove line
            svg.selectAll('path.line').remove();
            svg.selectAll('circle').remove();
            var prepData = this.utility.dataPrep(data);
            this.seriesForLineChart = prepData.seriesForLineChart;
            var overlappedBar = svg.selectAll('.overlappedBar')
                .selectAll('rect')
                .data(function (d) {
                    var rArray = [];
                    return rArray;
                });
            var seriesScales = this.seriesScales;
            overlappedBar.enter()
                .append("rect")
                .attr('y', function (d) {
                    var seriesScale = seriesScales[d.axis - 1];
                    return seriesScale(d.data);
                })
                .attr('height', function (d) {
                    var seriesScale = seriesScales[d.axis - 1];
                    return height - seriesScale(d.data);
                });
            overlappedBar.exit()
                .transition()
                .duration(1000)
                .ease(d3.easeBounce)
                .attr('y', function (d) {
                    var yScale = seriesScales[d.axis - 1];
                    return yScale(0);
                })
                .attr('height', 0)
                .remove()
                .on('end', function (d) {
                    if (d.index === data.categories.length - 1 && d.seriesIndex === data.series.length - 1) {
                        // resetting the opacity
                        svg.selectAll('.bar').style('opacity', 1);
                        //removing the groups
                        var outerBars = svg.selectAll(".overlappedBar");
                        outerBars.remove();
                        this.lineDraw(this.seriesForLineChart, data, this);
                    }
                }.bind(this));
            this.overlapDraw = false;
        }

    }

    return groupedColumn;

})();
export default XChartGroupedColumn ;