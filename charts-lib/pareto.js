//Pareto Chart
/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { XChartAxis, XChartUtility } from "./x-chart.js";
import * as d3 from "d3";

const XChartPareto = (function () {
    class pareto {
        constructor(renderContainerId, color, chartOptions) {
            //Information stored here will persist
            this.renderContainerId = renderContainerId;
            this.canvasWidth = chartOptions.chartHost.querySelector('#' + this.renderContainerId).offsetWidth;
            this.canvasHeight = chartOptions.chartHost.querySelector('#' + this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            //To use the helper utility functions
            this.utility = new XChartUtility(chartOptions);
            this.chartOptions = chartOptions;
        }
        draw(data) {
            var margin = this.margin;
            var color = ['#03A9F4', '#E91E63'];
            margin.right = 50;
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
                .attr('class', 'pareto');
            var mainGroup = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("id", this.renderContainerId + "_mainGroup")
                .attr('class', 'pareto');
            var axisLabelOverlap = this.utility.draw_xAxisDummy(mainGroup, data.categories, height, width, this.renderContainerId);
            if (axisLabelOverlap && this.bottomMarginSet === false) {
                margin.bottom *= 2;
                this.bottomMarginSet = true;
            }
            height = this.canvasHeight - margin.top - margin.bottom;
            svg = mainGroup;
            var chartData = [];
            var ySum = 0;
            var cumulativePercentages = [];
            var thresholdIndex = '';
            data.categories.forEach(function (d, i) {
                chartData.push({
                    categoryLongName: d.longName,
                    categoryValue: d.value,
                    categoryDimName: d.dimName,
                    value: d.value,
                    index: i,
                    categoryIndex: i,
                    name: d.name,
                    categoryName: d.name,
                    data: data.series[0].data[i],
                    seriesIndex: 0,
                    fmtData: data.series[0].fmtData[i],
                    seriesLongName: data.series[0].longName,
                    seriesValue: data.series[0].value,
                    seriesName: data.series[0].name
                });
            });
            chartData.sort(function (a, b) {
                return b.data - a.data;
            });
            chartData.forEach(function (d) {
                return ySum += d.data;
            });
            if (ySum === 0) {
                ySum = 1;
            }
            chartData.forEach(function (d, i) {
                if (i === 0)
                    cumulativePercentages.push(d.data / ySum);
                else
                    cumulativePercentages.push(cumulativePercentages[i - 1] + d.data / ySum);
            });
            chartData.forEach(function (d, i) {
                chartData[i].cumulativePercentage = (cumulativePercentages[i] * 100).toFixed(2);
            });
            var formatPercent = d3.format(".0%");
            var si = d3.format('.2s');
            var siMod = function (val) {
                return si(val).replace(/G/, 'B');
            };
            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new XChartAxis(this.renderContainerId, width, height, this.chartOptions);
            var categoryAxisOptions = {};
            categoryAxisOptions.ticks = 5;
            categoryAxisOptions.orient = 'bottom';
            categoryAxisOptions.position = 'horizontal';
            this.categoryAxis.setOptions(categoryAxisOptions);
            var categoryScale = this.categoryAxis.addQualitativeScale(chartData, 0.34, 0.2);
            var axisId;
            this.xAxis = this.categoryAxis.draw(categoryScale, {
                x: 0,
                y: height
            }, axisId, axisLabelOverlap);
            this.categoryScale = categoryScale;
            //Series Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.seriesAxis = new XChartAxis(this.renderContainerId, width, height, this.chartOptions);
            //Utility function call to add filter def to svg
            this.utility.addLinearFilter(svg, this.renderContainerId);
            var seriesAxisOptions = {};
            seriesAxisOptions.ticks = 5;
            seriesAxisOptions.tickSize = width;
            seriesAxisOptions.orient = 'left';
            seriesAxisOptions.position = 'vertical';
            seriesAxisOptions.showPath = false;
            seriesAxisOptions.tickFormat = siMod;
            this.seriesAxis.setOptions(seriesAxisOptions);
            var seriesScale = this.seriesAxis.addQuantitativeScale(data.series, 0, 0, height, 0, ySum);
            this.seriesScale = seriesScale;
            this.yAxis = this.seriesAxis.draw(seriesScale);
            //Percentage Axis
            var percentScale = d3.scaleLinear()
                .range([height, 0]);
            var percentAxis = d3.axisRight()
                .scale(percentScale)
                .tickFormat(formatPercent);
            svg.append("g")
                .attr("class", "y axis")
                .attr('id', this.renderContainerId + '_yaxis_percent')
                .call(percentAxis)
                .attr("transform", "translate(" + width + ", " + 0 + ")");
            var line = d3.line()
                .curve(d3.curveCardinal)
                .x(function (d, i) {
                    return categoryScale(d.categoryValue) + categoryScale.bandwidth() / 2;
                })
                .y(function (d, i) {
                    return percentScale(cumulativePercentages[i]);
                });
            svg.selectAll('rect')
                .data(chartData)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('x', function (d) {
                    return categoryScale(d.categoryValue);
                })
                .attr('width', categoryScale.bandwidth())
                .attr('y', height)
                .attr('height', 0)
                .style('fill', function (d, i) {
                    if (cumulativePercentages[i] < 0.8)
                        return color[0];
                    else {
                        if (thresholdIndex === '') {
                            thresholdIndex = i;
                            return color[1];
                        }
                        return color[1];
                    }
                })
                .transition()
                .ease(d3.easeBounce)
                .duration(1000)
                .attr('y', function (d, i) {
                    return (seriesScale(0) - seriesScale(d.data)) >= 2 ? seriesScale(d.data) : (seriesScale(0) - 2);
                })
                .attr('height', function (d, i) {
                    return (height - seriesScale(d.data)) <= 2 ? 2 : (height - seriesScale(d.data));
                })
                .on('end', function (d) {
                    if (d.index === data.categories.length - 1)
                        this.dispatch.call("render-complete",this, data);
                }.bind(this));
            var path = svg.append("path")
                .datum(chartData)
                .attr("class", "line")
                .attr("d", line)
                .style("stroke", 'green')
                .style("stroke-width", "2")
                .style("stroke-linejoin", "round")
                .style("stroke-linecap", "square")
                .style("fill", "none");
            var totalLength = path.node().getTotalLength();
            path
                .attr("stroke-dasharray", totalLength + "," + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);
            svg.selectAll('circle')
                .data(chartData)
                .enter()
                .append('circle')
                .attr('class', 'paretoCircle')
                .attr('cx', function (d) {
                    return categoryScale(d.categoryValue) + categoryScale.bandwidth() / 2;
                })
                .attr('cy', function (d, i) {
                    return percentScale(cumulativePercentages[i]);
                })
                .attr('r', 3)
                .style('stroke', 'green')
                .style('fill', '#fff');
            svg.append('line')
                .attr('x1', width)
                .attr('y1', percentScale(0.8))
                .attr('x2', width)
                .attr('y2', percentScale(0.8))
                .style("stroke", "red")
                .style("stroke-width", "1")
                .style("stroke-dasharray", ("3, 3"))
                .style("stroke-linejoin", "round")
                .transition()
                .duration(2000)
                .attr('x1', 0);
            thresholdIndex = thresholdIndex === 0 ? 1 : thresholdIndex;
            svg.append('line')
                .attr('x1', categoryScale(chartData[thresholdIndex - 1].categoryValue) + categoryScale.bandwidth() / 2)
                .attr('y1', percentScale(cumulativePercentages[thresholdIndex - 1]))
                .attr('x2', categoryScale(chartData[thresholdIndex - 1].categoryValue) + categoryScale.bandwidth() / 2)
                .attr('y2', percentScale(cumulativePercentages[thresholdIndex - 1]))
                .style("stroke", "blue")
                .style("stroke-width", "1")
                .style("stroke-dasharray", ("3, 3"))
                .style("stroke-linejoin", "round")
                .transition()
                .duration(2000)
                .attr('y2', height);
            if (chartOptions.tooltip) {
                this.utility.tooltip(svg, '.paretoCircle', true, false);
                this.utility.tooltip(svg, '.bar', true, false);
            }
        }
        redraw(data) {
            this.draw(data);
        }
        drawOverlap(overlappedData, originalData) {
            var margin = this.margin;
            var height = this.canvasHeight - margin.top - margin.bottom;
            var svg = this.utility.d3ShadowSelect("#" + this.renderContainerId + "_mainGroup");
            var chartData = [];
            var categoryScale = this.categoryScale;
            var chartOptions = this.chartOptions;
            var seriesScale = this.seriesScale;
            svg.selectAll('.bar').style('opacity', '0.7');
            overlappedData = this.utility.overlapDataPrep(overlappedData, originalData);
            var chartOptions = this.chartOptions;
            overlappedData.categories.forEach(function (d, i) {
                chartData.push({
                    categoryLongName: d.longName,
                    categoryValue: d.value,
                    categoryName: d.name,
                    data: overlappedData.overlappedSeries[0].data[i][0],
                    fmtData: overlappedData.overlappedSeries[0].fmtData[i][0],
                    seriesLongName: overlappedData.overlappedSeries[0].longName,
                    seriesValue: overlappedData.overlappedSeries[0].value,
                    seriesName: overlappedData.overlappedSeries[0].name
                });
            });
            var bars = svg.selectAll('.obar')
                .data(chartData);
            bars.exit().remove();
            bars
                .enter()
                .append('rect')
                .attr('class', 'obar')
                .attr('x', function (d) {
                    return categoryScale(d.categoryValue);
                })
                .attr('width', categoryScale.bandwidth())
                .attr('y', height)
                .attr('height', 0)
                .style('fill', '#FFC200');
            bars
                .transition()
                .ease(d3.easeBounce)
                .duration(1000)
                .attr('y', function (d, i) {
                    return (seriesScale(0) - seriesScale(d.data)) >= 1 ? seriesScale(d.data) : (seriesScale(0) - 1);
                })
                .attr('height', function (d, i) {
                    return (height - seriesScale(d.data)) <= 1 ? 1 : (height - seriesScale(d.data));
                });
            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.obar', true, false);
        }
        removeOverlap() {
            var margin = this.margin;
            var width = this.canvasWidth - margin.left - margin.right, height = this.canvasHeight - margin.top - margin.bottom;
            var svg = this.utility.d3ShadowSelect('#' + this.renderContainerId + '_mainGroup');
            svg.selectAll('.obar')
                .data([])
                .exit()
                .transition()
                .duration(1000)
                .ease(d3.easeBounce)
                .attr('y', height)
                .attr('height', 0)
                .remove();
            svg.selectAll('.bar').style('opacity', '1');
        }
    }
    // xChart.pareto's prototype properties.
    pareto.prototype.dispatch = d3.dispatch('RenderComplete');

    return pareto;

})();

export default XChartPareto;