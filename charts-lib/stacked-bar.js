//StackedBar Chart
//PI.xChart\src\js\plots\stackedBar.js
/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { XChartAxis, XChartUtility, XChartLegend } from "./x-chart.js";
import * as d3 from "d3";

const XChartStackedBar = (function () {
    class stackedBar {
        constructor(renderContainerId, color, chartOptions) {
            //Information stored here will persist
            this.chartOptions = chartOptions;
            this.renderContainerId = renderContainerId;
            this.canvasWidth = chartOptions.chartHost.querySelector('#' + this.renderContainerId).offsetWidth;
            this.canvasHeight = chartOptions.chartHost.querySelector('#' + this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.color = color;
            this.margin.left = 80;
            //To use the helper utility functions
            this.utility = new XChartUtility(chartOptions);
        }
        draw(data) {
            var color = this.color;
            var margin = this.margin;
            var sBStartPoint = [];
            this.sBStartPoint = sBStartPoint;
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
                .attr('class', 'stackedBar');
            var mainGroup = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("id", this.renderContainerId + "_mainGroup")
                .attr('class', 'stackedBar');
            var legend = new XChartLegend(data.series, color, this.chartOptions);
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
            function ConvertDataSet(data) {
                var indata = data;
                var newdataset = [];
                for (var j = 0; j < indata.series.length; ++j) {
                    var t = {};
                    var dataele = [];
                    for (var i = 0; i < indata.categories.length; ++i) {
                        dataele.push({
                            seriesName: indata.series[j].name,
                            seriesLongName: indata.series[j].longName,
                            seriesValue: indata.series[j].value,
                            index: i,
                            seriesIndex: j,
                            category: indata.categories[i],
                            categoryDimName: indata.categories[i].dimName,
                            categoryName: indata.categories[i].name,
                            categoryLongName: indata.categories[i].longName,
                            categoryValue: indata.categories[i].value,
                            value: indata.series[j].data[i],
                            fmtValue: indata.series[j].fmtData[i]
                        });
                    }
                    t.data = dataele;
                    t.name = indata.series[j].name;
                    t.longName = indata.series[j].longName;
                    t.value = indata.series[j].value;
                    newdataset.push(t);
                }
                return newdataset;
            }
            var newdataset = ConvertDataSet(data);
            var dataset = newdataset;
            dataset = dataset.map(function (d) {
                return d.data.map(function (o, i) {
                    return {
                        y: o.value,
                        fmt: o.fmtValue,
                        x: o.categoryName,
                        category: o.category,
                        categoryDimName: o.categoryDimName,
                        categoryName: o.categoryName,
                        categoryLongName: o.categoryLongName,
                        categoryValue: o.categoryValue,
                        index: o.index,
                        seriesIndex: o.seriesIndex,
                        seriesName: o.seriesName,
                        seriesLongName: o.seriesLongName,
                        seriesValue: o.seriesValue
                    };
                });
            });
            
            var _stackMap = {};
            dataset.forEach(function(group){
                group.forEach(function(d){
                    if(!_stackMap[d.categoryValue]){
                        _stackMap[d.categoryValue] = 0;
                    }
                    d.y0 = _stackMap[d.categoryValue];
                    _stackMap[d.categoryValue] += d.y;
                });
            });

            dataset = dataset.map(function (group) {
                return group.map(function (d) {
                    // Invert the x and y values, and y0 becomes x0
                    return {
                        x: d.y,
                        y: d.categoryValue,
                        x0: d.y0,
                        data: d.y,
                        category: d.category,
                        categoryDimName: d.categoryDimName,
                        categoryName: d.categoryName,
                        categoryLongName: d.categoryLongName,
                        categoryValue: d.categoryValue,
                        index: d.index,
                        seriesIndex: d.seriesIndex,
                        seriesName: d.seriesName,
                        seriesLongName: d.seriesLongName,
                        seriesValue: d.seriesValue,
                        fmtData: d.fmt
                    };
                });
            });
            
            var xMax = d3.max(dataset, function (group) {
                return d3.max(group, function (d) {
                    return d.x + d.x0;
                });
            });
            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new XChartAxis(this.renderContainerId, width, height, this.chartOptions);
            var categoryAxisOptions = {};
            categoryAxisOptions.ticks = 5;
            categoryAxisOptions.orient = 'left';
            categoryAxisOptions.position = 'vertical';
            this.categoryAxis.setOptions(categoryAxisOptions);
            var categoryScale = this.categoryAxis.addQualitativeScale(data.categories, 0.34, 0.2);
            this.yAxis = this.categoryAxis.draw(categoryScale);
            //Series Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.seriesAxis = new XChartAxis(this.renderContainerId, width, height, this.chartOptions);
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
            //Stacked Bar Rendering
            var groups = svg.selectAll('.group')
                .data(dataset)
                .enter()
                .append('g')
                .attr("class", "group")
                .style('fill', function (d, i) {
                    return color[i];
                });
            svg.selectAll(".group")
                .data(data)
                .attr("class", "group");
            groups = svg.selectAll(".group");
            var bars = groups.selectAll('rect')
                .data(function (d) {
                    return d;
                });
            bars
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr("rx", 1)
                .attr("ry", 1)
                .attr('x', 0)
                .attr('y', function (d, i) {
                    return categoryScale(d.y);
                })
                .attr('height', function (d) {
                    return categoryScale.bandwidth();
                })
                .attr('width', 0)
                .transition()
                .ease(d3.easeBounce)
                .duration(1000)
                .attr('x', function (d) {
                    sBStartPoint.push(seriesScale(d.x0));
                    return seriesScale(d.x0);
                })
                .attr('width', function (d) {
                    return seriesScale(d.x);
                })
                .on('end', function (d) {
                    if (d.index === data.categories.length - 1 && d.seriesIndex == data.series.length - 1) {
                        this.dispatch.call("render-complete", this, data);
                    }
                }.bind(this));
            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.bar', true, false);
        }
        redraw(data) {
            this.removeOverlap(data);
            var color = this.color;
            var margin = this.margin;
            var chartOptions = this.chartOptions;
            var axisRedrawThreshold = chartOptions.axisRedrawThreshold;
            var width = this.canvasWidth - margin.left - margin.right, height = this.canvasHeight - margin.top - margin.bottom;
            var sBStartPoint = [];
            this.sBStartPoint = sBStartPoint;
            var svg = this.utility.d3ShadowSelect("#" + this.renderContainerId + "_svg");
            var mainGroup = this.utility.d3ShadowSelect("#" + this.renderContainerId + "_mainGroup");
            var legend = new XChartLegend(data.series, color, this.chartOptions);
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
            function ConvertDataSet(data) {
                var indata = data;
                var newdataset = [];
                for (var j = 0; j < indata.series.length; ++j) {
                    var t = {};
                    var dataele = [];
                    for (var i = 0; i < indata.categories.length; ++i) {
                        dataele.push({
                            seriesName: indata.series[j].name,
                            seriesLongName: indata.series[j].longName,
                            seriesValue: indata.series[j].value,
                            index: i,
                            seriesIndex: j,
                            category: indata.categories[i],
                            categoryDimName: indata.categories[i].dimName,
                            categoryName: indata.categories[i].name,
                            categoryLongName: indata.categories[i].longName,
                            categoryValue: indata.categories[i].value,
                            value: indata.series[j].data[i],
                            fmtValue: indata.series[j].fmtData[i]
                        });
                    }
                    t.data = dataele;
                    t.name = indata.series[j].name;
                    t.longName = indata.series[j].longName;
                    t.value = indata.series[j].value;
                    newdataset.push(t);
                }
                return newdataset;
            }
            var newdataset = ConvertDataSet(data);
            var dataset = newdataset;
            dataset = dataset.map(function (d) {
                return d.data.map(function (o, i) {
                    return {
                        y: o.value,
                        fmt: o.fmtValue,
                        x: o.categoryName,
                        category: o.category,
                        categoryDimName: o.categoryDimName,
                        categoryName: o.categoryName,
                        categoryLongName: o.categoryLongName,
                        categoryValue: o.categoryValue,
                        index: o.index,
                        seriesIndex: o.seriesIndex,
                        seriesName: o.seriesName,
                        seriesLongName: o.seriesLongName,
                        seriesValue: o.seriesValue
                    };
                });
            });
            var stack = d3.stack()
                .keys(data.series.map((s, i) => i))
                .value(function (inst, i1, i2, arr) {
                    debugger;
                    return arr[i2][i1].y;
                });
            dataset = stack(dataset.slice());
            dataset = dataset.map(function (group) {
                return group.map(function (d) {
                    // Invert the x and y values, and y0 becomes x0
                    return {
                        x: d.y,
                        y: d.categoryValue,
                        x0: d.y0,
                        data: d.y,
                        category: d.category,
                        categoryDimName: d.categoryDimName,
                        categoryName: d.categoryName,
                        categoryLongName: d.categoryLongName,
                        categoryValue: d.categoryValue,
                        index: d.index,
                        seriesIndex: d.seriesIndex,
                        seriesName: d.seriesName,
                        seriesLongName: d.seriesLongName,
                        seriesValue: d.seriesValue,
                        fmtData: d.fmt
                    };
                });
            });
            var xMax = d3.max(dataset, function (group) {
                return d3.max(group, function (d) {
                    return d.x + d.x0;
                });
            });
            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new XChartAxis(this.renderContainerId, width, height, this.chartOptions);
            var categoryAxisOptions = {};
            categoryAxisOptions.ticks = 5;
            categoryAxisOptions.orient = 'left';
            categoryAxisOptions.position = 'vertical';
            this.categoryAxis.setOptions(categoryAxisOptions);
            var categoryScale = this.categoryAxis.addQualitativeScale(data.categories, 0.34, 0.2);
            this.yAxis = this.categoryAxis.draw(categoryScale);
            //Series Axis -- Create Object-->Set Options-->Add Scale-->Draw
            var seriesAxis = this.seriesAxis;
            var seriesAxisOptions = {};
            seriesAxisOptions.ticks = 5;
            seriesAxisOptions.tickSize = height;
            seriesAxisOptions.orient = 'bottom';
            seriesAxisOptions.position = 'horizontal';
            seriesAxisOptions.showPath = false;
            seriesAxisOptions.tickFormat = siMod;
            seriesAxis.setOptions(seriesAxisOptions);
            var seriesScale = this.seriesAxis.scale;
            var previousMaxX = seriesScale.domain()[1];
            if (Math.abs((previousMaxX - xMax) / previousMaxX) > axisRedrawThreshold) {
                seriesScale = seriesAxis.addQuantitativeScale(data.series, 0.1, width, 0, 0, xMax);
                this.XAxis = seriesAxis.draw(seriesScale, {
                    x: 0,
                    y: height
                });
                this.seriesAxis = seriesAxis;
                this.seriesAxis.scale = seriesScale;
            }
            //Stacked Bar Rendering
            var groups = svg.selectAll('.group')
                .data(dataset);
            groups.exit().remove();
            groups
                .enter()
                .append('g')
                .attr("class", "group")
                .style('fill', function (d, i) {
                    return color[i];
                });
            svg.selectAll(".group")
                .data(data)
                .attr("class", "group");
            groups = svg.selectAll(".group");
            var bars = groups.selectAll('rect');
            bars
                .attr('y', function (d, i) {
                    return categoryScale(d.y);
                })
                .attr('height', function (d) {
                    return categoryScale.bandwidth();
                })
                .transition()
                .ease(d3.easeBounce)
                .duration(1000)
                .attr('x', function (d) {
                    return seriesScale(d.x0);
                })
                .attr('width', function (d) {
                    return seriesScale(d.x);
                });
            bars = groups.selectAll('rect')
                .data(function (d) {
                    return d;
                });
            bars.exit().remove();
            bars
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr("rx", 1)
                .attr("ry", 1)
                .attr('x', 0)
                .attr('width', 0);
            bars
                .attr('y', function (d, i) {
                    return categoryScale(d.y);
                })
                .attr('height', function (d) {
                    return categoryScale.bandwidth();
                })
                .transition()
                .ease(d3.easeBounce)
                .duration(1000)
                .attr('x', function (d) {
                    sBStartPoint.push(seriesScale(d.x0));
                    return seriesScale(d.x0);
                })
                .attr('width', function (d) {
                    return seriesScale(d.x);
                })
                .on('end', function (d) {
                    if (d.index === data.categories.length - 1 && d.seriesIndex == data.series.length - 1) {
                        svg.selectAll(".group").remove();
                        redrawBars(this);
                    }
                }.bind(this));
            function redrawBars(that) {
                var groups = svg.selectAll('.group')
                    .data(dataset)
                    .enter()
                    .append('g')
                    .attr("class", "group")
                    .style('fill', function (d, i) {
                        return color[i];
                    });
                svg.selectAll(".group")
                    .data(data)
                    .attr("class", "group");
                groups = svg.selectAll(".group");
                var bars = groups.selectAll('rect')
                    .data(function (d) {
                        return d;
                    });
                bars
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr("rx", 1)
                    .attr("ry", 1)
                    .attr('y', function (d, i) {
                        return categoryScale(d.y);
                    })
                    .attr('height', function (d) {
                        return categoryScale.bandwidth();
                    })
                    .attr('x', function (d) {
                        sBStartPoint.push(seriesScale(d.x0));
                        return seriesScale(d.x0);
                    })
                    .attr('width', function (d) {
                        return seriesScale(d.x);
                    })
                    .each(function (d) {
                        if (d.index === data.categories.length - 1 && d.seriesIndex == data.series.length - 1) {
                            that.dispatch.call("render-complete", that, data);
                        }
                    }.bind(that));
                if (chartOptions.tooltip)
                    that.utility.tooltip(svg, '.bar', true, false);
            }
        }
        drawOverlap(overlappedData, originalData) {
            overlappedData = this.utility.overlapDataPrep(overlappedData, originalData);
            var xScale = this.seriesAxis.scale;
            var yScale = this.categoryAxis.scale;
            var sBStartPoint = this.sBStartPoint;
            var chartOptions = this.chartOptions;
            var svg = this.utility.d3ShadowSelect('#' + this.renderContainerId + "_mainGroup");
            // reducing the opacity
            svg.selectAll('.bar').style('opacity', 0.7);
            function ConvertDataSet(data) {
                var indata = data;
                var newdataset = [];
                for (var j = 0; j < indata.overlappedSeries.length; ++j) {
                    var t = {};
                    var dataele = [];
                    for (var i = 0; i < indata.categories.length; ++i) {
                        dataele.push({
                            overlappedSeriesName: indata.overlappedSeries[j].name,
                            overlappedSeriesLongName: indata.overlappedSeries[j].longName,
                            overlappedSeriesValue: indata.overlappedSeries[j].value,
                            category: indata.categories[i],
                            categoryDimName: indata.categories[i].dimName,
                            categoryName: indata.categories[i].name,
                            categoryLongName: indata.categories[i].longName,
                            categoryValue: indata.categories[i].value,
                            value: indata.overlappedSeries[j].data[i][0],
                            fmtValue: indata.overlappedSeries[j].fmtData[i][0]
                        });
                    }
                    t.data = dataele;
                    t.name = indata.overlappedSeries[j].name;
                    t.longName = indata.overlappedSeries[j].longName;
                    t.value = indata.overlappedSeries[j].value;
                    newdataset.push(t);
                }
                return newdataset;
            }
            var returnArray = [];
            var newdataset = ConvertDataSet(overlappedData);
            var dataset = newdataset;
            dataset = dataset.map(function (d) {
                return d.data.map(function (o, i) {
                    return {
                        y: o.value,
                        fmt: o.fmtValue,
                        x: o.categoryName,
                        category: o.category,
                        categoryDimName: o.categoryDimName,
                        categoryLongName: o.categoryLongName,
                        categoryValue: o.categoryValue,
                        seriesName: o.overlappedSeriesName,
                        seriesLongName: o.overlappedSeriesLongName,
                        seriesValue: o.overlappedSeriesValue
                    };
                });
            });
            var stack = d3.stack()
                .keys(data.series.map((s, i) => i))
                .value(function (inst, i1, i2, arr) {
                    debugger;
                    return arr[i2][i1].y;
                });
            dataset = stack(dataset.slice());
            var dataset = dataset.map(function (group) {
                return group.map(function (d) {
                    // Invert the x and y values, and y0 becomes x0
                    return {
                        x: d.y,
                        y: d.categoryValue,
                        x0: d.y0,
                        data: d.y,
                        category: d.category,
                        categoryDimName: d.categoryDimName,
                        categoryLongName: d.categoryLongName,
                        categoryValue: d.categoryValue,
                        SeriesName: d.seriesName,
                        seriesLongName: d.seriesLongName,
                        SeriesValue: d.seriesValue,
                        fmtData: d.fmt
                    };
                });
            });
            var xi = 0;
            var Ogroups = svg.selectAll('.overlappedGroup')
                .data(dataset)
                .enter()
                .append('g')
                .attr("class", "overlappedGroup")
                .style('fill', "#FFC200")
                .style("stroke", 'black')
                .style('stroke-width', '0.3px');
            Ogroups = svg.selectAll(".overlappedGroup");
            var overlappedBars = Ogroups.selectAll('rect')
                .data(function (d) {
                    return d;
                });
            overlappedBars.exit().remove();
            overlappedBars
                .enter()
                .append('rect')
                .attr('class', 'overlappedBar')
                .attr("rx", 1)
                .attr("ry", 1)
                .attr('width', 0);
            overlappedBars.transition()
                .duration(1000)
                .ease(d3.easeBounce)
                .attr('x', function () {
                    return sBStartPoint[xi++];
                })
                .attr('y', function (d, i) {
                    return yScale(d.y);
                })
                .attr('height', function (d) {
                    return yScale.bandwidth();
                })
                .attr('width', function (d) {
                    return xScale(d.x);
                });
            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.overlappedBar', true, false);
        }
        removeOverlap(data) {
            var tempData = [];
            for (var i = data.series.length - 1; i >= 0; i--) {
                tempData.push({});
            }
            var xScale = this.seriesAxis.scale;
            var yScale = this.categoryAxis.scale;
            var svg = this.utility.d3ShadowSelect('#' + this.renderContainerId + "_mainGroup");
            var xi = 0;
            var overlappedBars = svg.selectAll('.overlappedGroup')
                .data(tempData)
                .enter()
                .append('g')
                .attr("class", "overlappedGroup")
                .style('fill', "#FFC200");
            overlappedBars = svg.selectAll(".overlappedGroup")
                .selectAll('rect')
                .data(function (d) {
                    return d;
                });
            overlappedBars
                .enter()
                .append('rect')
                .attr('class', 'overlappedBar')
                .attr('width', function (d) {
                    return xScale(d.x);
                });
            overlappedBars
                .exit()
                .transition()
                .duration(1000)
                .ease(d3.easeBounce)
                .attr('width', 0)
                .remove()
                .on('end', function () {
                    // resetting the opacity
                    svg.selectAll('.bar').style('opacity', 1);
                    var outerBars = svg.selectAll(".overlappedBar");
                    outerBars.remove();
                });
            
        }
    }

    // xChart.stackedBar's prototype properties.
    stackedBar.prototype.dispatch = d3.dispatch('RenderComplete');

    return stackedBar;
})();
export default XChartStackedBar;