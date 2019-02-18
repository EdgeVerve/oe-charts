
//Bubble Chart
//PI.xChart\src\js\plots\bubble.js
/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { XChartAxis, XChartUtility } from "./x-chart.js";
import * as d3 from "d3";

const XChartBubble = (function () {
    class bubble {
        constructor(renderContainerId, color, chartOptions) {
            //Information stored here will persist
            this.renderContainerId = renderContainerId;
            this.canvasWidth = chartOptions.chartHost.querySelector("#" +this.renderContainerId).offsetWidth;
            this.canvasHeight = chartOptions.chartHost.querySelector("#" +this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.color = color;
            //To use the helper utility functions
            this.utility = new XChartUtility(chartOptions);
            this.chartOptions = chartOptions;
        }
        draw(data) {
            var margin = this.margin;
            var color = this.color;
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
                .attr('class', 'bubbleChart');
            var mainGroup = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("id", this.renderContainerId + "_mainGroup")
                .attr('class', 'bubbleChart');
            var axisLabelOverlap = this.utility.draw_xAxisDummy(mainGroup, data.categories, height, width, this.renderContainerId);
            if (axisLabelOverlap) {
                margin.bottom *= 2;
                this.bottomMarginSet = true;
            }
            height = this.canvasHeight - margin.top - margin.bottom;
            var returnArray = [];
            var si = d3.format('.2s');
            var siMod = function (val) {
                return si(val).replace(/G/, 'B');
            };
            var singleMeasure = 0;
            if (data.series.length < 2) {
                data.series[1] = data.series[0];
                singleMeasure = 1;
            }
            //Utility function call to add filter def to svg
            this.utility.addRadialFilter(svg, this.renderContainerId);
            var yScale = d3.scaleLinear()
                .range([height, 0]);
            yScale.domain([0, (d3.max(data.series[0].data) + (0.3 * d3.max(data.series[0].data)))]);
            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new XChartAxis(this.renderContainerId, width, height,this.chartOptions);
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
            this.seriesAxis = new XChartAxis(this.renderContainerId, width, height,this.chartOptions);
            var seriesAxisOptions = {};
            seriesAxisOptions.ticks = 5;
            seriesAxisOptions.tickSize = width;
            seriesAxisOptions.orient = 'left';
            seriesAxisOptions.position = 'vertical';
            seriesAxisOptions.showPath = false;
            seriesAxisOptions.tickFormat = siMod;
            seriesAxisOptions.calculate = 'auto';
            this.seriesAxis.setOptions(seriesAxisOptions);
            var seriesScale = this.seriesAxis.addQuantitativeScale(data.series, 0.3);
            this.yAxis = this.seriesAxis.draw(seriesScale);
            var rScale = d3.scaleLinear()
                .range([(0.05 * Math.min(height, width)), (0.15 * Math.min(height, width))])
                .domain([d3.min(data.series[1].data), d3.max(data.series[1].data)]);
            this.rScale = rScale;
            // svg.attr("width", width + margin.left + margin.right)
            //     .attr("height", height + margin.top + margin.bottom);
            mainGroup.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            svg = mainGroup;
            svg.append("g")
                .attr("transform", "translate(0,0)")
                .append("text")
                .attr('id', this.renderContainerId + '_bubbleDescText')
                .style('font-family', 'sans-serif')
                .style('font-size', '10');
            var text_node = this.utility.d3ShadowSelect('#' + this.renderContainerId + '_bubbleDescText');
            var maxTextWidth = '';
            text_node.append('tspan')
                .text("CIRCLE SIZE SHOWS " + data.series[1].longName.toUpperCase())
                .attr('x', 0)
                .attr('y', 0)
                .attr('dy', '8');
            text_node.append('tspan')
                .text("VERTICAL POSITION SHOWS " + data.series[0].longName.toUpperCase())
                .attr('x', 0)
                .attr('y', 0)
                .attr('dy', '20');
            svg.selectAll('#' + this.renderContainerId + '_bubbleDescText tspan')._groups[0].forEach(function (d) {
                maxTextWidth = d.getBoundingClientRect().width;
            });
            text_node.attr("transform", "translate(" + (width - maxTextWidth) + ',-' + (margin.top - 10) + ")");
            var bubbleData = data.categories.map(function (d, i) {
                var rArray = [];
                for (var x = 0; x < data.series.length; x++) {
                    rArray.push({
                        index: i,
                        seriesIndex: x,
                        seriesName: data.series[x].name,
                        seriesValue: data.series[x].value,
                        data: data.series[x].data[i],
                        fmtData: data.series[x].fmtData[i],
                        seriesLongName: data.series[x].longName,
                        categoryLongName: d.longName,
                        categoryValue: d.value,
                        categoryDimName: d.dimName,
                        categoryName: d.name
                    });
                }
                return rArray;
            });
            bubbleData.forEach(function (d) {
                d.categoryDimName = d[0].categoryDimName;
                d.categoryValue = d[0].categoryValue;
                d.categoryLongName = d[0].categoryLongName;
                d.categoryName = d[0].categoryName;
                d.categoryIndex = d[0].index;
                d.index = d[0].index;
                d.seriesIndex = d[0].seriesIndex;
                d.seriesValue = d[0].seriesValue;
                d.data = d[0].data;
                d.fmtData = d[0].fmtData;
                d.seriesLongName = d[0].seriesLongName;
            });
            var bubbles = svg.selectAll("circle")
                .data(bubbleData)
                .enter().insert("circle")
                .attr("cx", function (d, i) {
                    return categoryScale(d[0].categoryLongName) + (categoryScale.bandwidth() / 2);
                })
                .attr("cy", function (d) {
                    return seriesScale(d[0].data);
                })
                .attr("r", '0')
                .style("fill", function (d) {
                    return color[0];
                })
                .style("opacity", "0.8")
                .attr('class', 'bubble');
            bubbles.transition()
                .delay(function (d, i) {
                    return i * 100;
                })
                .duration(500)
                .attr("r", function (d) {
                    return rScale(d[1].data);
                })
                .on('end', function (d) {
                    if (d[0].index === data.categories.length - 1) {
                        this.dispatch.call("render-complete",this, data);
                    }
                }.bind(this));
            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.bubble', true, false);
            if (typeof (data.chartTitle) !== "undefined" && data.chartTitle !== null && data.chartTitle !== '') {
                svg.append("text")
                    .attr("transform", "translate(" + (width / 2) + " ," + "0)")
                    .style("text-anchor", "middle")
                    .attr('class', 'chartTitle')
                    .text(data.chartTitle);
            }
            if (singleMeasure == 1) {
                data.series.splice(1, 1);
            }
        }
        redraw(data) {
            var margin = this.margin;
            var color = this.color;
            var chartOptions = this.chartOptions;
            var width = this.canvasWidth - margin.left - margin.right, height = this.canvasHeight - margin.top - margin.bottom;
            var svg = this.utility.d3ShadowSelect("#" + this.renderContainerId + '_svg');
            var mainGroup = this.utility.d3ShadowSelect('#' + this.renderContainerId + "_mainGroup");
            var axisLabelOverlap = this.utility.draw_xAxisDummy(mainGroup, data.categories, height, width, this.renderContainerId);
            if (!axisLabelOverlap && this.bottomMarginSet) {
                margin.bottom /= 2;
            }
            height = this.canvasHeight - margin.top - margin.bottom;
            var returnArray = [];
            var si = d3.format('.2s');
            var siMod = function (val) {
                return si(val).replace(/G/, 'B');
            };
            var singleMeasure = 0;
            if (data.series.length < 2) {
                data.series[1] = data.series[0];
                singleMeasure = 1;
            }
            var yScale = d3.scaleLinear()
                .range([height, 0]);
            yScale.domain([0, (d3.max(data.series[0].data) + (0.3 * d3.max(data.series[0].data)))]);
            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new XChartAxis(this.renderContainerId, width, height,this.chartOptions);
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
            this.seriesAxis = new XChartAxis(this.renderContainerId, width, height,this.chartOptions);
            var seriesAxisOptions = {};
            seriesAxisOptions.ticks = 5;
            seriesAxisOptions.tickSize = width;
            seriesAxisOptions.orient = 'left';
            seriesAxisOptions.position = 'vertical';
            seriesAxisOptions.showPath = false;
            seriesAxisOptions.tickFormat = siMod;
            seriesAxisOptions.calculate = 'auto';
            this.seriesAxis.setOptions(seriesAxisOptions);
            var seriesScale = this.seriesAxis.addQuantitativeScale(data.series, 0.3);
            this.yAxis = this.seriesAxis.draw(seriesScale);
            var rScale = d3.scaleLinear()
                .range([(0.05 * Math.min(height, width)), (0.15 * Math.min(height, width))])
                .domain([d3.min(data.series[1].data), d3.max(data.series[1].data)]);
            svg.attr("width", "100%")
                .attr("height", "100%");
            mainGroup.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            svg = mainGroup;
            var bubbleData = data.categories.map(function (d, i) {
                var rArray = [];
                for (var x = 0; x < data.series.length; x++) {
                    rArray.push({
                        index: i,
                        seriesIndex: x,
                        seriesName: data.series[x].name,
                        seriesValue: data.series[x].value,
                        data: data.series[x].data[i],
                        fmtData: data.series[x].fmtData[i],
                        seriesLongName: data.series[x].longName,
                        categoryLongName: d.longName,
                        categoryValue: d.value,
                        categoryDimName: d.dimName,
                        categoryName: d.name
                    });
                }
                return rArray;
            });
            bubbleData.forEach(function (d) {
                d.categoryDimName = d[0].categoryDimName;
                d.categoryValue = d[0].categoryValue;
                d.categoryLongName = d[0].categoryLongName;
                d.categoryName = d[0].categoryName;
                d.categoryIndex = d[0].index;
                d.index = d[0].index;
                d.seriesIndex = d[0].seriesIndex;
                d.seriesValue = d[0].seriesValue;
                d.data = d[0].data;
                d.fmtData = d[0].fmtData;
                d.seriesLongName = d[0].seriesLongName;
            });
            var bubbles = svg.selectAll("circle")
                .data(bubbleData);
            bubbles.exit().remove();
            bubbles
                .enter().insert("circle")
                .attr("cx", function (d, i) {
                    return categoryScale(d[0].categoryLongName) + (categoryScale.bandwidth() / 2);
                })
                .attr("cy", function (d) {
                    return seriesScale(d[0].data);
                })
                .attr("r", '0')
                .style("fill", function (d) {
                    return color[0];
                })
                .style("opacity", "0.8")
                .attr('class', 'bubble');
            bubbles.transition()
                .delay(function (d, i) {
                    return i * 100;
                })
                .duration(500)
                .attr("r", function (d) {
                    return rScale(d[1].data);
                })
                .on('end', function (d) {
                    if (d[0].index === data.categories.length - 1) {
                        this.dispatch.call("render-complete",this, data);
                    }
                }.bind(this));
            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.bubble', true, false);
            if (typeof (data.chartTitle) !== "undefined" && data.chartTitle !== null && data.chartTitle !== '') {
                svg.append("text")
                    .attr("transform", "translate(" + (width / 2) + " ," + "0)")
                    .style("text-anchor", "middle")
                    .attr('class', 'chartTitle')
                    .text(data.chartTitle);
            }
            if (singleMeasure == 1) {
                data.series.splice(1, 1);
            }
        }
        drawOverlap(overlappedData, originalData) {
            overlappedData = this.utility.overlapDataPrep(overlappedData, originalData);
            this.redraw(overlappedData);
        }
        removeOverlap(data) {
            this.redraw(data);
        }
    }
    
    bubble.prototype.dispatch = d3.dispatch('RenderComplete');

    return bubble;
})();

export default XChartBubble;