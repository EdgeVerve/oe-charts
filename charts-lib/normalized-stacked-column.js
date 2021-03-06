
//normalizedStackedColumn Chart
//PI.xChart\src\js\plots\normalizedStackedColumn.js
/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { XChartAxis, XChartUtility, XChartLegend } from "./x-chart.js";
import * as d3 from "d3";

const XChartNormalizedStackedColumn = (function () {

    class normalizedStackedColumn {
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
        }
        draw(data) {
            var color = this.color;
            var margin = this.margin;
            var chartOptions = this.chartOptions;
            var sCHeight = [];
            var sCStartPoint = [];
            this.sCHeight = sCHeight;
            this.sCStartPoint = sCStartPoint;
            var el = this.chartOptions.chartHost.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);
            //To use the helper utility functions
            this.utility = new XChartUtility(chartOptions);
            var width = this.canvasWidth - margin.left - margin.right, height = this.canvasHeight - margin.top - margin.bottom;
            var svg = this.utility.d3ShadowSelect("#" + this.renderContainerId).append("svg")
                .attr("id", this.renderContainerId + "_svg")
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight)
                .attr("width", "100%")
                .attr("height", "100%")
                .attr('class', 'normalizedStackedColumn');
            var mainGroup = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("id", this.renderContainerId + "_mainGroup")
                .attr('class', 'normalizedStackedColumn');
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

            /* 
            Stack in v3 takes just the values, but now should be initialized with number of items
            */

            var stack = d3.stack()
                .keys(data.series.map( s => s['name'] ));
                // .value(function (d) {
                //     return d.values;
                // });
            var formatPercent = d3.format(".0%");
            //Utility function call to add filter def to svg
            this.utility.addLinearFilter(svg, this.renderContainerId);
            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new XChartAxis(this.renderContainerId, width, height,this.chartOptions);
            var categoryAxisOptions = {};
            categoryAxisOptions.ticks = 5;
            categoryAxisOptions.orient = 'bottom';
            categoryAxisOptions.position = 'horizontal';
            this.categoryAxis.setOptions(categoryAxisOptions);
            var axisId;
            var categoryScale = this.categoryAxis.addQualitativeScale(data.categories, 0.34, 0.2);
            this.categoryScale = categoryScale;
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
            seriesAxisOptions.tickFormat = formatPercent;
            this.seriesAxis.setOptions(seriesAxisOptions);
            var seriesScale = this.seriesAxis.addQuantitativeScale(data.series, 0.1, 0, height);
            this.seriesScale = seriesScale;
            this.yAxis = this.seriesAxis.draw(seriesScale);
            this.subCategoryScale = d3.scaleBand()
                .domain(data.series.map(function (d) {
                    return d.value;
                })).range([0, categoryScale.bandwidth()]);
            function findSum(categoryIndex) {
                var sum = 0;
                for (var i = 0; i < data.series.length; i++) {
                    sum += data.series[i].data[categoryIndex];
                }
                return sum;
            }
            var stackData = data.series.map(function (d, i) {
                return {
                    values: data.categories.map(function (e, j) {
                        var sum = findSum(j);
                        if (sum === 0) {
                            sum = 1;
                        }
                        return {
                            seriesIndex: i,
                            categoryIndex: j,
                            seriesName: d.name,
                            seriesValue: d.value,
                            seriesLongName: d.longName,
                            y: d.data[j] / sum
                        };
                    })
                };
            });
            //outer groups for grouping the rectangles with same category
            var barGroups = svg.selectAll(".outerbar")
                .data(data.categories)
                .enter()
                .append("g")
                .attr("class", "outerbar")
                .attr("transform", function (d) {
                    return "translate(" + (categoryScale(d.value)) + ",0)";
                });
            //Adding data for rects
            var bars = barGroups
                .selectAll("rect")
                .data(function (d, i) {
                    var rArray = [];
                    var prevSum = 0;
                    for (var x = 0; x < stackData.length; x++) {
                        var stackInst = stackData[x];
                        rArray.push({
                            seriesName: stackInst.values[i].seriesName,
                            y0: prevSum,
                            y1: prevSum + stackInst.values[i].y,
                            seriesIndex: stackInst.values[i].seriesIndex,
                            categoryIndex: stackInst.values[i].categoryIndex,
                            seriesLongName: stackInst.values[i].seriesLongName,
                            seriesValue: stackInst.values[i].seriesValue,
                            data: data.series[x].data[i],
                            fmtData: data.series[x].fmtData[i],
                            index: i,
                            category: d,
                            categoryLongName: data.categories[i] === null ? '' : data.categories[i].longName,
                            categoryName: d.name,
                            categoryDimName: d.dimName,
                            categoryValue: d.value
                        });
                        prevSum += stackInst.values[i].y;
                    }
                    return rArray;
                });

            //Adding rects for each data point
            bars.enter()
                .append("rect")
                .attr("class", "bar")
                .style("fill", function (d, i) {
                    return color[d.seriesIndex];
                })
                .style("stroke", function (d, i) {
                    return color[d.seriesIndex];
                })
                .style("stroke-width", "1")
                .attr("height", function (d) {
                    return 0;
                })
                .attr("y", function (d) {
                    return height;
                })
                .attr("width", categoryScale.bandwidth())
                .transition()
                .ease(d3.easeBounce)
                .duration(1000)
                .attr("height", function (d) {
                    sCHeight.push(seriesScale(d.y0) - seriesScale(d.y1));
                    return seriesScale(d.y0) - seriesScale(d.y1);
                })
                .attr("y", function (d) {
                    sCStartPoint.push(seriesScale(d.y1));
                    return seriesScale(d.y1);
                })
                .on('end', function (d) {
                    if (d.categoryIndex === data.categories.length - 1 && d.seriesIndex == data.series.length - 1) {
                        this.dispatch.call("render-complete",this, data, stackData);
                    }
                }.bind(this));
            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.bar', true, false);
        }
        
        redraw(data) {
            this.removeOverlap();
            var color = this.color;
            var margin = this.margin;
            var sCHeight = [];
            var sCStartPoint = [];
            this.sCHeight = sCHeight;
            this.sCStartPoint = sCStartPoint;
            var chartOptions = this.chartOptions;
            var width = this.canvasWidth - margin.left - margin.right, height = this.canvasHeight - margin.top - margin.bottom;
            var svg = this.utility.d3ShadowSelect("#" + this.renderContainerId + '_svg');
            var mainGroup = this.utility.d3ShadowSelect('#' + this.renderContainerId + "_mainGroup");
            //this.removeOverlap(data);
            var axisLabelOverlap = this.utility.draw_xAxisDummy(mainGroup, data.categories, height, width, this.renderContainerId);
            if (!axisLabelOverlap && this.bottomMarginSet) {
                margin.bottom /= 2;
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
            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new XChartAxis(this.renderContainerId, width, height,this.chartOptions);
            var categoryAxisOptions = {};
            categoryAxisOptions.ticks = 5;
            categoryAxisOptions.orient = 'bottom';
            categoryAxisOptions.position = 'horizontal';
            this.categoryAxis.setOptions(categoryAxisOptions);
            var axisId;
            var categoryScale = this.categoryAxis.addQualitativeScale(data.categories, 0.34, 0.2);
            this.categoryScale = categoryScale;
            this.xAxis = this.categoryAxis.draw(categoryScale, {
                x: 0,
                y: height
            }, axisId, axisLabelOverlap);
            var seriesScale = this.seriesAxis.scale;
            //SubCategory Scale to further category into series for each category
            this.subCategoryScale = d3.scaleBand()
                .domain(data.series.map(function (d) {
                    return d.value;
                })).range([0, categoryScale.bandwidth()]);
            var stack = d3.stack()
                .value(function (d) {
                    return d.values;
                });
            function findSum(categoryIndex) {
                var sum = 0;
                for (var i = 0; i < data.series.length; i++) {
                    sum += data.series[i].data[categoryIndex];
                }
                return sum;
            }
            var stackData = data.series.map(function (d, i) {
                return {
                    values: data.categories.map(function (e, j) {
                        var sum = findSum(j);
                        if (sum === 0) {
                            sum = 1;
                        }
                        return {
                            seriesIndex: i,
                            categoryIndex: j,
                            seriesName: d.name,
                            seriesValue: d.value,
                            seriesLongName: d.longName,
                            y: d.data[j] / sum
                        };
                    })
                };
            });
            var barGroups = svg.selectAll(".outerbar")
                .data(data.categories);
            barGroups.exit().remove();
            barGroups.enter()
                .append('g')
                .attr("class", "outerbar")
                .attr("transform", function (d) {
                    return "translate(" + (categoryScale(d.value) + this.subCategoryScale.bandwidth() / 2) + ",0)";
                }.bind(this));
            barGroups
                .transition()
                .duration(400)
                .attr("transform", function (d) {
                    return "translate(" + (categoryScale(d.value)) + ",0)";
                }.bind(this));
            //Adding data for rects
            var bars = barGroups
                .selectAll("rect")
                .data(function (d, i) {
                    var rArray = [];
                    for (var x = 0; x < stack(stackData).length; x++) {
                        rArray.push({
                            seriesName: stack(stackData)[x].values[i].seriesName,
                            y0: stack(stackData)[x].values[i].y0,
                            y1: stack(stackData)[x].values[i].y0 + stack(stackData)[x].values[i].y,
                            seriesIndex: stack(stackData)[x].values[i].seriesIndex,
                            categoryIndex: stack(stackData)[x].values[i].categoryIndex,
                            seriesLongName: stack(stackData)[x].values[i].seriesLongName,
                            seriesValue: stack(stackData)[x].values[i].seriesValue,
                            data: data.series[x].data[i],
                            fmtData: data.series[x].fmtData[i],
                            category: d,
                            categoryLongName: data.categories[i] === null ? '' : data.categories[i].longName,
                            categoryName: d.name,
                            categoryDimName: d.dimName,
                            categoryValue: d.value
                        });
                    }
                    return rArray;
                });
            bars.exit().remove();
            bars.enter()
                .append("rect")
                .attr("class", "bar")
                .style("fill", function (d, i) {
                    return color[d.seriesIndex];
                })
                .style("stroke", function (d, i) {
                    return color[d.seriesIndex];
                })
                .style("stroke-width", "1")
                .attr("height", function (d) {
                    return 0;
                })
                .attr("y", function (d) {
                    return height;
                });
            bars
                .transition()
                .ease(d3.easeBounce)
                .duration(1000)
                .attr("height", function (d) {
                    return seriesScale(d.y0) - seriesScale(d.y1);
                })
                .attr("y", function (d) {
                    return seriesScale(d.y1);
                })
                .attr("width", categoryScale.bandwidth())
                .on('end', function (d) {
                    if (d.categoryIndex === data.categories.length - 1 && d.seriesIndex == data.series.length - 1) {
                        svg.selectAll(".outerbar").remove();
                        redrawBars(this);
                    }
                }.bind(this));


            function redrawBars(that) {
                var barGroups = svg.selectAll(".outerbar")
                    .data(data.categories)
                    .enter()
                    .append("g")
                    .attr("class", "outerbar")
                    .attr("transform", function (d) {
                        return "translate(" + (categoryScale(d.value)) + ",0)";
                    });
                var bars = barGroups
                    .selectAll("rect")
                    .data(function (d, i) {
                        var rArray = [];
                        for (var x = 0; x < stack(stackData).length; x++) {
                            rArray.push({
                                seriesName: stack(stackData)[x].values[i].seriesName,
                                y0: stack(stackData)[x].values[i].y0,
                                y1: stack(stackData)[x].values[i].y0 + stack(stackData)[x].values[i].y,
                                seriesIndex: stack(stackData)[x].values[i].seriesIndex,
                                categoryIndex: stack(stackData)[x].values[i].categoryIndex,
                                seriesLongName: stack(stackData)[x].values[i].seriesLongName,
                                seriesValue: stack(stackData)[x].values[i].seriesValue,
                                data: data.series[x].data[i],
                                fmtData: data.series[x].fmtData[i],
                                category: d,
                                categoryLongName: data.categories[i] === null ? '' : data.categories[i].longName,
                                categoryName: d.name,
                                categoryDimName: d.dimName,
                                categoryValue: d.value
                            });
                        }
                        return rArray;
                    });
                bars.enter()
                    .append("rect")
                    .attr("class", "bar")
                    .style("fill", function (d, i) {
                        return color[d.seriesIndex];
                    })
                    .style("stroke", function (d, i) {
                        return color[d.seriesIndex];
                    })
                    .style("stroke-width", "1")
                    .attr("width", categoryScale.bandwidth())
                    .attr("height", function (d) {
                        sCHeight.push(seriesScale(d.y0) - seriesScale(d.y1));
                        return seriesScale(d.y0) - seriesScale(d.y1);
                    })
                    .attr("y", function (d) {
                        sCStartPoint.push(seriesScale(d.y1));
                        return seriesScale(d.y1);
                    })
                    .each(function (d) {
                        if (d.categoryIndex === (data.categories.length - 1) && d.seriesIndex == (data.series.length - 1)) {
                            that.dispatch.call("render-complete",that, data);
                        }
                    }.bind(that));
                if (chartOptions.tooltip)
                    that.utility.tooltip(svg, '.bar', true, false);
            }
        }
        
        drawOverlap(overlappedData, originalData) {
            overlappedData = this.utility.overlapDataPrep(overlappedData, originalData);
            var chartOptions = this.chartOptions;
            var seriesScale = this.seriesAxis.scale, categoryScale = this.categoryScale;
            var sCHeight = this.sCHeight;
            var sCStartPoint = this.sCStartPoint;
            var svg = this.utility.d3ShadowSelect('#' + this.renderContainerId + "_mainGroup");
            // reducing the opacity
            svg.selectAll('.bar').style('opacity', 0.7);
            var stack = d3.stack()
                .value(function (d) {
                    return d.values;
                });
            function findSum(categoryIndex) {
                var sum = 0;
                for (var i = 0; i < originalData.series.length; i++) {
                    sum += originalData.series[i].data[categoryIndex];
                }
                return sum;
            }
            var stackData = overlappedData.overlappedSeries.map(function (d, i) {
                return {
                    values: overlappedData.categories.map(function (e, j) {
                        var sum = findSum(j);
                        if (sum === 0) {
                            sum = 1;
                        }
                        return {
                            seriesIndex: i,
                            categoryIndex: j,
                            seriesName: d.name,
                            seriesValue: d.value,
                            seriesLongName: d.longName,
                            y: d.data[j][0] / sum
                        };
                    })
                };
            });
            var overlappedBars = svg.selectAll(".overlappedBar")
                .data(originalData.categories)
                .enter()
                .append("g")
                .attr("class", "overlappedBar")
                .attr("transform", function (d) {
                    return "translate(" + (categoryScale(d.value)) + ",0)";
                });
            overlappedBars = svg.selectAll(".overlappedBar")
                .selectAll("rect")
                .data(function (d, i) {
                    var rArray = [];
                    for (var x = 0; x < stack(stackData).length; x++) {
                        rArray.push({
                            seriesName: stack(stackData)[x].values[i].seriesName,
                            y0: stack(stackData)[x].values[i].y0,
                            y1: stack(stackData)[x].values[i].y0 + stack(stackData)[x].values[i].y,
                            seriesIndex: stack(stackData)[x].values[i].seriesIndex,
                            categoryIndex: stack(stackData)[x].values[i].categoryIndex,
                            seriesLongName: stack(stackData)[x].values[i].seriesLongName,
                            seriesValue: stack(stackData)[x].values[i].seriesValue,
                            data: overlappedData.overlappedSeries[x].data[i][0],
                            fmtData: overlappedData.overlappedSeries[x].fmtData[i][0],
                            category: d,
                            categoryLongName: overlappedData.categories[i] === null ? '' : overlappedData.categories[i].longName,
                            categoryName: d.name,
                            categoryDimName: d.dimName,
                            categoryValue: d.value
                        });
                    }
                    return rArray;
                });
            var yi = 0;
            overlappedBars.enter()
                .append("rect")
                .attr("class", "ObarRect")
                .attr('y', function (d) {
                    var s = (sCStartPoint[yi] + sCHeight[yi]);
                    yi++;
                    return s;
                })
                .attr('height', 0)
                .attr("width", categoryScale.bandwidth())
                .style("fill", "#FFC200")
                .style("opacity", 1)
                .style("stroke", 'black')
                .style('stroke-width', '0.3px');
            yi = 0;
            overlappedBars.exit().remove();
            overlappedBars.transition()
                .duration(1000)
                .ease(d3.easeBounce)
                .attr("y", function (d, i) {
                    var s = (sCStartPoint[yi] + sCHeight[yi] - (seriesScale(d.y0) - seriesScale(d.y1)));
                    yi++;
                    return s;
                })
                .attr("height", function (d) {
                    return seriesScale(d.y0) - seriesScale(d.y1);
                });
            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.ObarRect', true, false);
        }
        removeOverlap(data) {
            var subCategoryScale = this.subCategoryScale, seriesScale = this.seriesAxis.scale, categoryScale = this.categoryScale;
            var sCHeight = this.sCHeight;
            var sCStartPoint = this.sCStartPoint;
            var svg = this.utility.d3ShadowSelect('#' + this.renderContainerId + "_mainGroup");
            var overlappedBars = svg.selectAll(".overlappedBar")
                .data(function (d) {
                    var rArray = [];
                    return rArray;
                })
                .enter()
                .append("g")
                .attr("class", "overlappedBar");
            overlappedBars = svg.selectAll(".overlappedBar")
                .selectAll("rect")
                .data(function (d, i) {
                    var rArray = [];
                    return rArray;
                });
            var yi = 0;
            overlappedBars.enter()
                .append("rect")
                .attr('y', function (d, i) {
                    var s = (sCStartPoint[yi] + sCHeight[yi] - (seriesScale(d.y0) - seriesScale(d.y1)));
                    yi++;
                    return s;
                })
                .attr('height', function (d) {
                    return seriesScale(d.y0) - seriesScale(d.y1);
                })
                .attr("width", categoryScale.bandwidth());
            yi = 0;
            overlappedBars
                .exit()
                .transition()
                .duration(1000)
                .ease(d3.easeBounce)
                .attr("y", function (d) {
                    var s = (sCStartPoint[yi] + sCHeight[yi]);
                    yi++;
                    return s;
                })
                .attr("height", 0)
                .remove()
                .on('end', function () {
                    // resetting the opacity
                    svg.selectAll('.bar').style('opacity', 1);
                    var outerBars = svg.selectAll(".overlappedBar");
                    outerBars.remove();
                });
        }
    }

    normalizedStackedColumn.prototype.dispatch = d3.dispatch('RenderComplete');




    return normalizedStackedColumn;
})();
export default XChartNormalizedStackedColumn;
