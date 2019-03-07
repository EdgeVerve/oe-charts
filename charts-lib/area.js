
//Area Chart
//PI.xChart\src\js\plots\area.js
/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { XChartAxis, XChartUtility, XChartLegend } from "./x-chart.js";
import * as d3 from "d3";

const XChartArea = (function () {
    class area {
        constructor(renderContainerId, color, chartOptions) {
            //Information stored here will persist
            this.renderContainerId = renderContainerId;
            this.canvasWidth = chartOptions.chartHost.querySelector('#' + this.renderContainerId).offsetWidth;
            this.canvasHeight = chartOptions.chartHost.querySelector('#' + this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.color = color;
            //To use the helper utility functions
            this.utility = new XChartUtility(chartOptions);
            this.chartOptions = chartOptions;
        }
        draw(data) {
            var color = this.color;
            var el = this.chartOptions.chartHost.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);
            var chartOptions = this.chartOptions;
            var width = this.canvasWidth - this.margin.left - this.margin.right, height = this.canvasHeight - this.margin.top - this.margin.bottom;
            var svg = this.utility.d3ShadowSelect("#" + this.renderContainerId).append("svg")
                .attr("id", this.renderContainerId + "_svg")
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight)
                .attr("width", "100%")
                .attr("height", "100%")
                .attr('class', 'area');
            var mainGroup = svg.append("g")
                .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
                .attr("id", this.renderContainerId + "_mainGroup")
                .attr('class', 'area');
            var axisLabelOverlap = this.utility.draw_xAxisDummy(mainGroup, data.categories, height, width, this.renderContainerId);
            if (axisLabelOverlap) {
                this.margin.bottom *= 2;
                this.bottomMarginSet = true;
            }
            var legend = new XChartLegend(data.series, color, this.chartOptions);
            //Set options for legend here
            // legend.setOptions({});
            var legendRows = legend.drawLegend('top', mainGroup, width, this.margin) + 1;
            this.margin.top = 20 * legendRows;
            mainGroup.selectAll('.legendg').remove();
            height = this.canvasHeight - this.margin.top - this.margin.bottom;
            // svg.attr("width", width + this.margin.left + this.margin.right)
            //     .attr("height", height + this.margin.top + this.margin.bottom);
            mainGroup.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
            svg = mainGroup;
            legend.drawLegend('top', svg, width, this.margin);
            var formatPercent = d3.format(".0%");
            data.series.forEach(function (d, i) {
                d.color = color[i];
            });
            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new XChartAxis(this.renderContainerId, width, height, this.chartOptions);
            var categoryAxisOptions = {};
            categoryAxisOptions.ticks = 5;
            categoryAxisOptions.orient = 'bottom';
            categoryAxisOptions.position = 'horizontal';
            this.categoryAxis.setOptions(categoryAxisOptions);
            var categoryScale = this.categoryAxis.addQualitativeScale(data.categories, 0.1, 0.2);
            var axisId;
            this.xAxis = this.categoryAxis.draw(categoryScale, {
                x: 0,
                y: height
            }, axisId, axisLabelOverlap);
            //Series Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.seriesAxis = new XChartAxis(this.renderContainerId, width, height, this.chartOptions);
            var seriesAxisOptions = {};
            seriesAxisOptions.ticks = 5;
            seriesAxisOptions.tickSize = width;
            seriesAxisOptions.orient = 'left';
            seriesAxisOptions.position = 'vertical';
            seriesAxisOptions.showPath = false;
            seriesAxisOptions.tickFormat = formatPercent;
            this.seriesAxis.setOptions(seriesAxisOptions);
            var seriesScale = this.seriesAxis.addQuantitativeScale(data.series, 0.1, 0, height);
            this.yAxis = this.seriesAxis.draw(seriesScale);
            var area = d3.area()
                .curve(d3.curveLinear)
                .x(function (d) {
                    return categoryScale(d.category) + categoryScale.bandwidth() / 2;
                })
                .y0(function (d) {
                    return seriesScale(d.y0);
                })
                .y1(function (d) {
                    return seriesScale(d.y0 + d.y);
                });
            var stack = d3.stack()
                .value(function (d) {
                    return d.values;
                });
            svg.selectAll('.layerg').remove();
            svg.selectAll('.circle').remove();
            function findSum(categoryIndex) {
                var sum = 0;
                for (var i = 0; i < data.series.length; i++) {
                    sum += data.series[i].data[categoryIndex];
                }
                return sum;
            }
            var stackData = data.series.map(function (d, i) {
                return {
                    name: d.name,
                    color: d.color,
                    values: data.categories.map(function (e, j) {
                        var sum = findSum(j);
                        return {
                            seriesLongName: data.series[i].longName,
                            seriesValue: data.series[i].value,
                            fmtData: data.series[i].fmtData[j],
                            categoryLongName: e.longName,
                            index: j,
                            seriesIndex: i,
                            category: e.longName,
                            categoryDimName: e.dimName,
                            categoryName: e.name,
                            categoryValue: e.value,
                            y: d.data[j] / sum
                        };
                    })
                };
            });

            var _stackSum = {};
            stackData.forEach(function(stackIn){
                stackIn.values.forEach(function(d){
                    if(!_stackSum[d.category]){
                        _stackSum[d.category] = 0;
                    }
                    d.y0 = _stackSum[d.category];
                    _stackSum[d.category] += d.y;
                });
            });
            var layerGroup = svg.selectAll(".layerg")
                .data(stackData)
                .enter()
                .append("g")
                .attr("class", "layerg");
            var thisobj = this;
            var areas = layerGroup.append("path")
                .attr("class", "area")
                .attr("d", area(stackData[0].values))
                .style("stroke", function (d, i) {
                    return d.color;
                })
                .style("fill", function (d, i) {
                    return d.color;
                })
                .transition()
                .duration(1000)
                .attr("d", function (d) {
                    return area(d.values);
                })
                .on('end', function () {
                    for (var i = 0; i < stackData.length; i++) {
                        svg.selectAll('.circle' + i)
                            .data(stackData[i].values)
                            .enter()
                            .append('circle')
                            .attr('class', 'areacircle circle' + i)
                            .attr('cx', function (d) {
                                return categoryScale(d.category) + categoryScale.bandwidth() / 2;
                            })
                            .attr('cy', height)
                            .attr('r', 4)
                            .style('stroke', color[i])
                            .style('stroke-width', 0.5)
                            .style('fill', '#fff')
                            .transition()
                            .delay(function (d) {
                                return i * 100;
                            })
                            .duration(1000)
                            .attr('cy', function (d) {
                                return seriesScale(d.y + d.y0);
                            })
                            .each(function (d) {
                                if (d.index === data.categories.length - 1 && d.seriesIndex === data.series.length - 1)
                                    thisobj.dispatch.call("render-complete", thisobj, data, stackData);
                            });
                    }
                    if (chartOptions.tooltip)
                        thisobj.utility.tooltip(svg, '.areacircle', true, false);
                });
        }
        redraw(data) {
            var color = this.color;
            var width = this.canvasWidth - this.margin.left - this.margin.right, height = this.canvasHeight - this.margin.top - this.margin.bottom;
            var chartOptions = this.chartOptions;
            var svg = this.utility.d3ShadowSelect('#' + this.renderContainerId + "_svg");
            var mainGroup = this.utility.d3ShadowSelect('#' + this.renderContainerId + "_mainGroup");
            var axisLabelOverlap = this.utility.draw_xAxisDummy(mainGroup, data.categories, height, width, this.renderContainerId);
            if (!axisLabelOverlap && this.bottomMarginSet) {
                this.margin.bottom /= 2;
            }
            var legend = new XChartLegend(data.series, color, this.chartOptions);
            //Set options for legend here
            // legend.setOptions({});
            var legendRows = legend.drawLegend('top', mainGroup, width, this.margin) + 1;
            this.margin.top = 20 * legendRows;
            mainGroup.selectAll('.legendg').remove();
            height = this.canvasHeight - this.margin.top - this.margin.bottom;
            svg.attr("width", width + this.margin.left + this.margin.right)
                .attr("height", height + this.margin.top + this.margin.bottom);
            mainGroup.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
            svg = mainGroup;
            legend.drawLegend('top', svg, width, this.margin);
            var formatPercent = d3.format(".0%");
            data.series.forEach(function (d, i) {
                d.color = color[i];
            });
            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new XChartAxis(this.renderContainerId, width, height, this.chartOptions);
            var categoryAxisOptions = {};
            categoryAxisOptions.ticks = 5;
            categoryAxisOptions.orient = 'bottom';
            categoryAxisOptions.position = 'horizontal';
            this.categoryAxis.setOptions(categoryAxisOptions);
            var categoryScale = this.categoryAxis.addQualitativeScale(data.categories, 0.1, 0.2);
            var axisId;
            this.xAxis = this.categoryAxis.draw(categoryScale, {
                x: 0,
                y: height
            }, axisId, axisLabelOverlap);
            //Series Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.seriesAxis = new XChartAxis(this.renderContainerId, width, height, this.chartOptions);
            var seriesAxisOptions = {};
            seriesAxisOptions.ticks = 5;
            seriesAxisOptions.tickSize = width;
            seriesAxisOptions.orient = 'left';
            seriesAxisOptions.position = 'vertical';
            seriesAxisOptions.showPath = false;
            seriesAxisOptions.tickFormat = formatPercent;
            this.seriesAxis.setOptions(seriesAxisOptions);
            var seriesScale = this.seriesAxis.addQuantitativeScale(data.series, 0.1, 0, height);
            this.yAxis = this.seriesAxis.draw(seriesScale);
            var area = d3.area()
                .curve(d3.curveLinear)
                .x(function (d) {
                    return categoryScale(d.category) + categoryScale.bandwidth() / 2;
                })
                .y0(function (d) {
                    return seriesScale(d.y0);
                })
                .y1(function (d) {
                    return seriesScale(d.y0 + d.y);
                });
            var stack = d3.stack()
                .value(function (d) {
                    return d.values;
                });
            svg.selectAll('.layerg').remove();
            svg.selectAll('.areacircle').remove();
            function findSum(categoryIndex) {
                var sum = 0;
                for (var i = 0; i < data.series.length; i++) {
                    sum += data.series[i].data[categoryIndex];
                }
                return sum;
            }
            var stackData = data.series.map(function (d, i) {
                return {
                    name: d.name,
                    color: d.color,
                    values: data.categories.map(function (e, j) {
                        var sum = findSum(j);
                        return {
                            seriesLongName: data.series[i].longName,
                            seriesValue: data.series[i].value,
                            categoryValue: e.value,
                            fmtData: data.series[i].fmtData[j],
                            categoryLongName: e.longName,
                            index: j,
                            seriesIndex: i,
                            category: e.longName,
                            categoryDimName: e.dimName,
                            categoryName: e.name,
                            y: d.data[j] / sum
                        };
                    })
                };
            });
            stackData.forEach(function (d) {
                d.values.forEach(function (x) {
                    if (isNaN(x.y))
                        x.y = 0;
                    x.fmtData = '0';
                });
            });

            var _stackSum = {};
            stackData.forEach(function(stackIn){
                stackIn.values.forEach(function(d){
                    if(!_stackSum[d.category]){
                        _stackSum[d.category] = 0;
                    }
                    d.y0 = _stackSum[d.category];
                    _stackSum[d.category] += d.y;
                });
            });

            var layerGroup = svg.selectAll(".layerg")
                .data(stackData)
                .enter()
                .append("g")
                .attr("class", "layerg");
            var thisobj = this;
            var areas = layerGroup.append("path")
                .attr("class", "area")
                .attr("d", area(stackData[0].values))
                .style("stroke", function (d, i) {
                    return d.color;
                })
                .style("fill", function (d, i) {
                    return d.color;
                }).transition()
                .duration(1000)
                .attr("d", function (d) {
                    return area(d.values);
                })
                .on('end', function () {



                    for (var i = 0; i < stackData.length; i++) {
                        svg.selectAll('.circle' + i)
                            .data(stackData[i].values)
                            .enter()
                            .append('circle')
                            .attr('class', 'areacircle circle' + i)
                            .attr('cx', function (d) {
                                return categoryScale(d.category) + categoryScale.bandwidth() / 2;
                            })
                            .attr('cy', height)
                            .attr('r', 4)
                            .style('stroke', color[i])
                            .style('stroke-width', 0.5)
                            .style('fill', '#fff')
                            .transition()
                            .delay(function (d) {
                                return i * 100;
                            })
                            .duration(1000)
                            .attr('cy', function (d) {
                                return seriesScale(d.y + d.y0);
                            })
                            .each(function (d) {
                                if (d.index === data.categories.length - 1 && d.seriesIndex === data.series.length - 1)
                                    thisobj.dispatch.call("render-complete", thisobj, data, stack(stackData));
                            });
                    }
                    if (chartOptions.tooltip)
                        thisobj.utility.tooltip(svg, '.areacircle', true, false);
                });
        }
        drawOverlap(data, originalData) {
            var overlappedData = this.utility.overlapDataPrep(data, originalData);
            this.redraw(overlappedData);
        }
        removeOverlap(data) {
            this.redraw(data);
        }
    }

    // xChart.area's prototype properties.
    area.prototype.dispatch = d3.dispatch('RenderComplete');

    return area;
})();

export default XChartArea;