
//Grouped Bar
//PI.xChart\src\js\plots\groupedBar.js
/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { XChartAxis, XChartUtility, XChartLegend } from "./x-chart.js";
import * as d3 from "d3";

const XChartGroupedBar = (function () {

    class groupedBar {
        constructor(renderContainerId, color, chartOptions) {
            //Information stored here will persist
            this.chartOptions = chartOptions;
            this.renderContainerId = renderContainerId;
            this.canvasWidth = chartOptions.chartHost.querySelector('#'+this.renderContainerId).offsetWidth;
            this.canvasHeight = chartOptions.chartHost.querySelector('#'+this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.color = color;
            this.margin.left = 80;
            //To use the helper utility functions
            this.utility = new XChartUtility(chartOptions);
        }
        draw(data) {
            var color = this.color;
            var margin = this.margin;
            var chartOptions = this.chartOptions;
            var el = this.chartOptions.chartHost.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);
            var width = this.canvasWidth - margin.left - margin.right, height = this.canvasHeight - margin.top - margin.bottom;
            var svg = this.utility.d3ShadowSelect("#" + this.renderContainerId).append("svg")
                .attr("id", this.renderContainerId + "_svg")
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight)
                .attr("width", "100%")
                .attr("height", "100%")
                .attr('class', 'groupedBar');
            var mainGroup = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("id", this.renderContainerId + "_mainGroup")
                .attr('class', 'groupedBar');
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
            //Utility function call to add filter def to svg
            this.utility.addLinearFilter(svg, this.renderContainerId);
            var xMax = d3.max(data.series, function (d) {
                return d3.max(d.data);
            });
            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new XChartAxis(this.renderContainerId, width, height,this.chartOptions);
            var categoryAxisOptions = {};
            categoryAxisOptions.ticks = 5;
            categoryAxisOptions.orient = 'left';
            categoryAxisOptions.position = 'vertical';
            this.categoryAxis.setOptions(categoryAxisOptions);
            var categoryScale = this.categoryAxis.addQualitativeScale(data.categories, 0.34, 0.2);
            this.yAxis = this.categoryAxis.draw(categoryScale);
            //Series Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.seriesAxis = new XChartAxis(this.renderContainerId, width, height,this.chartOptions);
            var seriesAxisOptions = {};
            seriesAxisOptions.ticks = 5;
            seriesAxisOptions.tickSize = height;
            seriesAxisOptions.orient = 'bottom';
            seriesAxisOptions.position = 'horizontal';
            seriesAxisOptions.showPath = false;
            seriesAxisOptions.tickFormat = siMod;
            this.seriesAxis.setOptions(seriesAxisOptions);
            var seriesScale = this.seriesAxis.addQuantitativeScale(data.series, 0.1, width, 0, 0, xMax);
            this.xAxis = this.seriesAxis.draw(seriesScale, {
                x: 0,
                y: height
            });
            if (this.chartOptions.seriesLabel) {
                svg.append("text")
                    .attr("y", height + 10)
                    .attr("x", width / 2)
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text(this.chartOptions.seriesLabel);
            }
            var subCategoryScale = d3.scaleBand()
                .domain(data.series.map(function (d) {
                    return d.value;
                }))
                .rangeRound([0, categoryScale.bandwidth()]);
            this.subCategoryScale = subCategoryScale;
            var groups = svg.selectAll(".group")
                .data(data.categories)
                .enter()
                .append("g")
                .attr("class", "group")
                .attr("transform", function (d) {
                    return "translate(0," + categoryScale(d.value) + ")";
                });
            var bars = groups.selectAll('rect')
                .data(function (d, i) {
                    var rArray = [];
                    for (var x = 0; x < data.series.length; x++) {
                        rArray.push({
                            seriesName: data.series[x].name,
                            seriesValue: data.series[x].value,
                            data: data.series[x].data[i],
                            fmtData: data.series[x].fmtData[i],
                            index: i,
                            seriesIndex: x,
                            seriesLongName: data.series[x].longName,
                            category: d,
                            categoryLongName: d.longName,
                            categoryValue: d.value,
                            categoryDimName: d.dimName,
                            categoryName: d.name
                        });
                    }
                    return rArray;
                });

            bars.enter()
                .append('rect')
                .attr('class', 'bar')
                .attr("rx", 1)
                .attr("ry", 1)
                .attr("x", function (d) {
                    return 0;
                })
                .attr('y', function (d) {
                    return subCategoryScale(d.seriesName);
                })
                .attr('height', function (d) {
                    return subCategoryScale.bandwidth() - 2;
                })
                .attr("width", 0)
                .style('fill', function (d, i) {
                    return color[i];
                })
                .transition()
                .ease(d3.easeBounce)
                .duration(1000)
                .attr("width", function (d) {
                    var datum = Math.abs(seriesScale(d.data));
                    return (datum <= 2 && datum !== 0) ? 2 : seriesScale(d.data);
                })
                .on('end', function (d) {
                    if (d.index === data.categories.length - 1 && d.seriesIndex == data.series.length - 1) {
                        this.dispatch.call("render-complete",this, data);
                    }
                }.bind(this));

            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.bar', true, false);
        }
        redraw(data) {
            this.removeOverlap();
            var color = this.color;
            var margin = this.margin;
            var chartOptions = this.chartOptions;
            var axisRedrawThreshold = chartOptions.axisRedrawThreshold;
            var width = this.canvasWidth - margin.left - margin.right, height = this.canvasHeight - margin.top - margin.bottom;
            var svg = this.utility.d3ShadowSelect("#" + this.renderContainerId + '_svg');
            var mainGroup = this.utility.d3ShadowSelect('#' + this.renderContainerId + "_mainGroup");
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
            var xMax = d3.max(data.series, function (d) {
                return d3.max(d.data);
            });
            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new XChartAxis(this.renderContainerId, width, height,this.chartOptions);
            var categoryAxisOptions = {};
            categoryAxisOptions.ticks = 5;
            categoryAxisOptions.orient = 'left';
            categoryAxisOptions.position = 'vertical';
            this.categoryAxis.setOptions(categoryAxisOptions);
            var categoryScale = this.categoryAxis.addQualitativeScale(data.categories, 0.34, 0.2);
            this.yAxis = this.categoryAxis.draw(categoryScale);
            //Series Axis
            var seriesAxis = this.seriesAxis;
            var seriesScale = this.seriesAxis.scale;
            var seriesAxisOptions = {};
            seriesAxisOptions.ticks = 5;
            seriesAxisOptions.tickSize = height;
            seriesAxisOptions.orient = 'bottom';
            seriesAxisOptions.position = 'horizontal';
            seriesAxisOptions.showPath = false;
            seriesAxisOptions.tickFormat = siMod;
            seriesAxis.setOptions(seriesAxisOptions);
            var previousMaxX = seriesScale.domain()[1];
            if (Math.abs((previousMaxX - xMax) / previousMaxX) > axisRedrawThreshold) {
                seriesScale = seriesAxis.addQuantitativeScale(data.series, 0.1, width, 0, 0, xMax);
                this.xAxis = seriesAxis.draw(seriesScale, {
                    x: 0,
                    y: height
                });
                this.seriesAxis = seriesAxis;
                this.seriesAxis.scale = seriesScale;
            }
            var subCategoryScale = d3.scaleBand()
                .domain(data.series.map(function (d) {
                    return d.value;
                }))
                .rangeRound([0, categoryScale.bandwidth()]);
            this.subCategoryScale = subCategoryScale;
            var groups = svg.selectAll(".group")
                .data(data.categories);
            groups.exit().remove();
            groups
                .enter()
                .append("g")
                .attr("class", "group")
                .attr("transform", function (d) {
                    return "translate(0," + categoryScale(d.value) + ")";
                });
            groups
                .transition()
                .duration(400)
                .attr("transform", function (d) {
                    return "translate(0," + categoryScale(d.value) + ")";
                });
            var bars = groups.selectAll('rect')
                .data(function (d, i) {
                    var rArray = [];
                    for (var x = 0; x < data.series.length; x++) {
                        rArray.push({
                            seriesName: data.series[x].name,
                            seriesValue: data.series[x].value,
                            data: data.series[x].data[i],
                            fmtData: data.series[x].fmtData[i],
                            index: i,
                            seriesIndex: x,
                            seriesLongName: data.series[x].longName,
                            category: d,
                            categoryLongName: d.longName,
                            categoryValue: d.value,
                            categoryDimName: d.dimName,
                            categoryName: d.name
                        });
                    }
                    return rArray;
                });
            bars.exit().remove();
            bars.enter()
                .append('rect')
                .attr('class', 'bar')
                .attr("rx", 1)
                .attr("ry", 1)
                .attr("x", function (d) {
                    return 0;
                })
                .attr("width", 0)
                .style('fill', function (d, i) {
                    return color[i];
                });
            bars.transition()
                .ease(d3.easeBounce)
                .duration(1000)
                .attr('y', function (d) {
                    return subCategoryScale(d.seriesName);
                })
                .attr('height', function (d) {
                    return subCategoryScale.bandwidth() - 2;
                })
                .attr("width", function (d) {
                    return seriesScale(d.data) <= 2 && seriesScale(d.data) !== 0 ? 2 : seriesScale(d.data);
                })
                .on('end', function (d) {
                    if (d.index === data.categories.length - 1 && d.seriesIndex == data.series.length - 1) {
                        svg.selectAll(".group").remove();
                        redrawBars(this);
                    }
                }.bind(this));
            function redrawBars(that) {
                var groups = svg.selectAll(".group")
                    .data(data.categories)
                    .enter()
                    .append("g")
                    .attr("class", "group")
                    .attr("transform", function (d) {
                        return "translate(0," + categoryScale(d.value) + ")";
                    });
                var bars = groups.selectAll('rect')
                    .data(function (d, i) {
                        var rArray = [];
                        for (var x = 0; x < data.series.length; x++) {
                            rArray.push({
                                seriesName: data.series[x].name,
                                seriesValue: data.series[x].value,
                                data: data.series[x].data[i],
                                fmtData: data.series[x].fmtData[i],
                                index: i,
                                seriesIndex: x,
                                seriesLongName: data.series[x].longName,
                                category: d,
                                categoryLongName: d.longName,
                                categoryValue: d.value,
                                categoryDimName: d.dimName,
                                categoryName: d.name
                            });
                        }
                        return rArray;
                    });
                bars.enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr("rx", 1)
                    .attr("ry", 1)
                    .attr("x", function (d) {
                        return 0;
                    })
                    .attr('y', function (d) {
                        return subCategoryScale(d.seriesName);
                    })
                    .attr('height', function (d) {
                        return subCategoryScale.bandwidth() - 2;
                    })
                    .style('fill', function (d, i) {
                        return color[i];
                    })
                    .attr("width", function (d) {
                        return seriesScale(d.data) <= 2 && seriesScale(d.data) !== 0 ? 2 : seriesScale(d.data);
                    })
                    .each(function (d) {
                        if (d.index === data.categories.length - 1 && d.seriesIndex == data.series.length - 1) {
                            that.dispatch.call("render-complete",this, data);
                        }
                    }.bind(that));
                if (chartOptions.tooltip)
                    that.utility.tooltip(svg, '.bar', true, false);
            }
        }
        drawOverlap(overlappedData, originaldata) {
            var overlappedData = this.utility.overlapDataPrep(overlappedData, originaldata);
            var subCategoryScale = this.subCategoryScale;
            var seriesScale = this.seriesAxis.scale;
            var categoryScale = this.categoryAxis.scale;
            var chartOptions = this.chartOptions;
            var svg = this.utility.d3ShadowSelect('#' + this.renderContainerId + "_mainGroup");
            // reducing the opacity
            svg.selectAll('.bar').style('opacity', 0.7);
            var overlappedBars = svg.selectAll(".overlappedBar")
                .data(overlappedData.categories)
                .enter()
                .append("g")
                .attr("class", "overlappedBar")
                .attr("transform", function (d) {
                    return "translate(0," + categoryScale(d.value) + ")";
                });
            overlappedBars = svg.selectAll('.overlappedBar')
                .selectAll('rect')
                .data(function (d, i) {
                    var rArray = [];
                    for (var x = 0; x < overlappedData.overlappedSeries.length; x++) {
                        rArray.push({
                            seriesValue: overlappedData.overlappedSeries[x].value,
                            seriesName: overlappedData.overlappedSeries[x].name,
                            data: overlappedData.overlappedSeries[x].data[i][0],
                            fmtData: overlappedData.overlappedSeries[x].fmtData[i][0],
                            index: i,
                            seriesLongName: overlappedData.overlappedSeries[x].longName,
                            category: d,
                            categoryLongName: d.longName,
                            categoryValue: d.value,
                            categoryDimName: d.dimName,
                            categoryName: d.name
                        });
                    }
                    return rArray;
                });
            overlappedBars
                .enter()
                .append('rect')
                .attr('class', 'ObarRect')
                .attr("rx", 1)
                .attr("ry", 1)
                .attr("x", 0)
                .attr('y', function (d) {
                    return subCategoryScale(d.seriesName);
                })
                .attr('height', function (d) {
                    return subCategoryScale.bandwidth() - 2;
                })
                .style('fill', '#ffC200')
                .style("stroke", 'black')
                .style('stroke-width', '0.3px')
                .attr("width", 0);
            overlappedBars.exit().remove();
            overlappedBars.transition()
                .duration(1000)
                .ease(d3.easeBounce)
                .attr("width", function (d) {
                    return seriesScale(d.data) <= 1 && seriesScale(d.data) !== 0 ? 1 : seriesScale(d.data);
                });
            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.ObarRect', true, false);
        }

        removeOverlap(data) {
            var seriesScale = this.seriesAxis.scale, categoryScale = this.categoryAxis.scale;
            var svg = this.utility.d3ShadowSelect('#' + this.renderContainerId + "_mainGroup");
            var overlappedBars = svg.selectAll(".overlappedBar")
                .data(function (d) {
                    var rArray = [];
                    return rArray;
                })
                .enter()
                .append("g")
                .attr("class", "overlappedBar");
            overlappedBars = svg.selectAll('.overlappedBar')
                .selectAll('rect')
                .data(function (d, i) {
                    var rArray = [];
                    return rArray;
                });
            overlappedBars
                .enter()
                .append('rect');
            overlappedBars
                .exit()
                .transition()
                .duration(1000)
                .ease(d3.easeBounce)
                .attr("width", 0)
                .remove()
                .on('end', function () {
                    // resetting the opacity
                    svg.selectAll('.bar').style('opacity', 1);
                    var outerBars = svg.selectAll(".overlappedBar");
                    outerBars.remove();
                });
        }
    }
    

    return groupedBar;
})();
export default XChartGroupedBar;