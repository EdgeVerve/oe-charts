
//Line Chart
//PI.xChart\src\js\plots\line.js
/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { XChartAxis, XChartUtility, XChartLegend } from "./x-chart.js";
import * as d3 from "d3";

const XChartLine = (function () {
    class line {
        constructor(renderContainerId, color, chartOptions) {
            //Information stored here will persist
            this.renderContainerId = renderContainerId;
            this.canvasWidth = chartOptions.chartHost.querySelector('#' + this.renderContainerId).offsetWidth;
            this.canvasHeight = chartOptions.chartHost.querySelector('#' + this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.color = color;
            this.subCategoryScale;
            this.axisRedrawThreshold = chartOptions.axisRedrawThreshold;
            this.aec = chartOptions.aec;
            this.chartOptions = chartOptions;
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
                .attr('class', 'line');
            var mainGroup = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("id", this.renderContainerId + "_mainGroup")
                .attr('class', 'line');
            var axisLabelOverlap = this.utility.draw_xAxisDummy(mainGroup, data.categories, height, width, this.renderContainerId);
            if (axisLabelOverlap) {
                margin.bottom *= 2;
                this.bottomMarginSet = true;
            }
            var legend = new XChartLegend(data.series, color, chartOptions);
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
            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new XChartAxis(this.renderContainerId, width, height, chartOptions);
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
            this.seriesAxis = new XChartAxis(this.renderContainerId, width, height, chartOptions);
            var seriesAxisOptions = {};
            seriesAxisOptions.ticks = 5;
            seriesAxisOptions.tickSize = width;
            seriesAxisOptions.orient = 'left';
            seriesAxisOptions.position = 'vertical';
            seriesAxisOptions.showPath = false;
            seriesAxisOptions.tickFormat = siMod;
            seriesAxisOptions.calculate = 'auto';
            this.seriesAxis.setOptions(seriesAxisOptions);
            var seriesScale = this.seriesAxis.addQuantitativeScale(data.series, this.aec);
            this.yAxis = this.seriesAxis.draw(seriesScale);
            if (this.chartOptions.seriesLabel) {
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left)
                    .attr("x", 0 - (height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text(this.chartOptions.seriesLabel);
            }
            //Line rendering starts here
            for (var i = 0; i < data.series.length; i++) {
                var dataValues = data.series[i].data;
                var fmtDataValues = data.series[i].fmtData;
                var lineData = data.categories.map(function (d, j) {
                    return {
                        category: d,
                        categoryName: d.name,
                        categoryDimName: d.dimName,
                        categoryLongName: d.longName,
                        categoryValue: d.value,
                        seriesName: data.series[i].name,
                        seriesValue: data.series[i].value,
                        seriesLongName: data.series[i].longName,
                        seriesIndex: i,
                        categoryIndex: j,
                        index: j,
                        data: +dataValues[j],
                        fmtData: fmtDataValues[j]
                    };
                });
                var x = d3.scaleBand()
                    .rangeRound([0, width], 0.1, 0.2)
                    .domain(lineData.map(function (d) {
                        return d.categoryName;
                    }));
                this.subCategoryScale = x;
                var line = d3.line()
                    .curve(d3.curveLinear)
                    .x(function (d) {
                        return x(d.categoryName) + (x.bandwidth() / 2);
                    })
                    .y(function (d) {
                        return seriesScale(d.data);
                    });
                svg.append("path")
                    .datum(lineData)
                    .attr("class", "line")
                    .attr("d", line)
                    .style("stroke", color[i])
                    .style("stroke-width", "4")
                    .style("stroke-linejoin", "round")
                    .style("stroke-linecap", "square")
                    .style("fill", "none");
                svg.selectAll("circle .circle" + i)
                    .data(lineData)
                    .enter()
                    .append("circle")
                    .attr("class", "linecircle circle" + i)
                    .attr("cx", function (d) {
                        return x(d.categoryName) + (x.bandwidth() / 2);
                    })
                    .attr("cy", function (d) {
                        return seriesScale(d.data);
                    })
                    .attr("r", "4")
                    .style("stroke-width", "2")
                    .style("stroke", color[i])
                    .style("fill", "#fff")
                    .each(function (d) {
                        if (d.index === data.categories.length - 1 && d.seriesIndex === data.series.length - 1) {
                            this.dispatch.call("render-complete",this, data);
                        }
                    }.bind(this));
            }
            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.linecircle', true, false);
            var curtain = svg.append('rect')
                .attr('x', -1 * width)
                .attr('y', -1 * height)
                .attr('height', height)
                .attr('width', width)
                .attr('class', 'curtain')
                .attr('transform', 'rotate(180)')
                .style('fill', '#ffffff');
            var t = svg.transition()
                .delay(750)
                .duration(1000)
                .ease(d3.easeLinear);
            t.select('rect.curtain')
                .attr('width', 0);
        }
        redraw(data) {
            var color = this.color;
            var margin = this.margin;
            var el = this.chartOptions.chartHost.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);
            var chartOptions = this.chartOptions;
            var width = this.canvasWidth - margin.left - margin.right, height = this.canvasHeight - margin.top - margin.bottom;
            var svg = this.utility.d3ShadowSelect("#" + this.renderContainerId).append("svg")
                .attr("id", this.renderContainerId + "_svg")
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight)
                .attr("width", "100%")
                .attr("height", "100%")
                .attr('class', 'line');
            var mainGroup = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("id", this.renderContainerId + "_mainGroup")
                .attr('class', 'line');
            var axisLabelOverlap = this.utility.draw_xAxisDummy(mainGroup, data.categories, height, width, this.renderContainerId);
            if (!axisLabelOverlap && this.bottomMarginSet) {
                margin.bottom /= 2;
            }
            var legend = new XChartLegend(data.series, color, chartOptions);
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
            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new XChartAxis(this.renderContainerId, width, height, chartOptions);
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
            this.seriesAxis = new XChartAxis(this.renderContainerId, width, height, chartOptions);
            var seriesAxisOptions = {};
            seriesAxisOptions.ticks = 5;
            seriesAxisOptions.tickSize = width;
            seriesAxisOptions.orient = 'left';
            seriesAxisOptions.position = 'vertical';
            seriesAxisOptions.showPath = false;
            seriesAxisOptions.tickFormat = siMod;
            seriesAxisOptions.calculate = 'auto';
            this.seriesAxis.setOptions(seriesAxisOptions);
            var seriesScale = this.seriesAxis.addQuantitativeScale(data.series, this.aec);
            this.yAxis = this.seriesAxis.draw(seriesScale);
            //Line rendering starts here
            for (var i = 0; i < data.series.length; i++) {
                var dataValues = data.series[i].data;
                var fmtDataValues = data.series[i].fmtData;
                var lineData = data.categories.map(function (d, j) {
                    return {
                        category: d,
                        categoryName: d.name,
                        categoryDimName: d.dimName,
                        categoryLongName: d.longName,
                        categoryValue: d.value,
                        seriesName: data.series[i].name,
                        seriesValue: data.series[i].value,
                        seriesLongName: data.series[i].longName,
                        data: +dataValues[j],
                        fmtData: fmtDataValues[j]
                    };
                });
                lineData.forEach(function (d) {
                    if (isNaN(d.data)) {
                        d.data = 0;
                        d.fmtData = '0';
                    }
                });
                var x = d3.scaleBand()
                    .rangeRound([0, width])
                    .paddingInner(0.1)
                    .paddingOuter(0.2)
                    .domain(lineData.map(function (d) {
                        return d.categoryName;
                    }));
                var line = d3.line()
                    .curve(d3.curveLinear)
                    .x(function (d) {
                        return x(d.categoryName) + (x.bandwidth() / 2);
                    })
                    .y(function (d) {
                        return seriesScale(d.data);
                    });
                svg.append("path")
                    .datum(lineData)
                    .attr("class", "line")
                    .attr("d", line)
                    .style("stroke", color[i])
                    .style("stroke-width", "4")
                    .style("stroke-linejoin", "round")
                    .style("stroke-linecap", "square")
                    .style("fill", "none");
                svg.selectAll("circle .circle" + i)
                    .data(lineData)
                    .enter()
                    .append("circle")
                    .attr("class", "linecircle circle" + i)
                    .attr("cx", function (d) {
                        return x(d.categoryName) + (x.bandwidth() / 2);
                    })
                    .attr("cy", function (d) {
                        return seriesScale(d.data);
                    })
                    .attr("r", "4")
                    .style("stroke-width", "2")
                    .style("stroke", color[i])
                    .style("fill", "#fff")
                    .each(function (d) {
                        if (d.index === data.categories.length - 1 && d.seriesIndex === data.series.length - 1) {
                            this.dispatch.call("render-complete",this, data);
                        }
                    }.bind(this));
            }
            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.linecircle', true, false);
            var curtain = svg.append('rect')
                .attr('x', -1 * width)
                .attr('y', -1 * height)
                .attr('height', height)
                .attr('width', width)
                .attr('class', 'curtain')
                .attr('transform', 'rotate(180)')
                .style('fill', '#ffffff');
            var t = svg.transition()
                .delay(750)
                .duration(1000)
                .ease(d3.easeLinear);
            t.select('rect.curtain')
                .attr('width', 0);
        }
        drawOverlap(overlappedData, originalData) {
            overlappedData = this.utility.overlapDataPrep(overlappedData, originalData);
            this.redraw(overlappedData);
        }
        removeOverlap(data) {
            this.draw(data);
        }
    }

    return line;
})();
export default XChartLine;