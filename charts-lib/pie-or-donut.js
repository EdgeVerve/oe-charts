//Pie Chart And Donut Chart
/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { XChartUtility } from "./x-chart.js";
import * as d3 from "d3";

const XChartPieOrDonut = (function () {

    class pieOrDonut {
        constructor(renderContainerId, chartOptions) {
            //Information stored here will persist
            this.renderContainerId = renderContainerId;
            this.canvasWidth = chartOptions.chartHost.querySelector('#' + this.renderContainerId).offsetWidth;
            this.canvasHeight = chartOptions.chartHost.querySelector('#' + this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.color = chartOptions.defaultColors;
            this.chartType = chartOptions.chartType;
            this.noOfPieSlices = chartOptions.noOfPieSlices;
            this.chartOptions = chartOptions;
            //To use the helper utility functions
            this.utility = new XChartUtility(chartOptions);
        }

        _removePreviousInstance(){
            var el = this.chartOptions.chartHost.querySelector('#' + this.renderContainerId + "_svg");
            if (el && el.parentElement) {
                el.parentElement.removeChild(el);
            }
            el = this.chartOptions.chartHost.querySelector('#' + this.renderContainerId + "_select");
            if (el && el.parentElement) {
                el.parentElement.removeChild(el);
            }
        }

        draw(data) {
            this._removePreviousInstance();
            var margin = this.margin;
            this.data = data;
            var svg;
            var color = this.color;
            var renderContainerId = this.renderContainerId;
            var chartOptions = this.chartOptions;
            var noOfPieSlices = chartOptions.noOfPieSlices;
            if (data.categories.length <= noOfPieSlices) {
                noOfPieSlices = data.categories.length;
                this.reduceCategory = false;
            }
            else
                this.reduceCategory = true;
            var noOfSlice = noOfPieSlices;
            var chartType = this.chartType;
            var w = this.canvasWidth;
            var h = this.canvasHeight;
            
            var originalData = Object.assign({}, data);
            // For Multiple series
            if (originalData.series.length > 1) {
                var select = this.utility.d3ShadowSelect('#' + renderContainerId)
                    .append('div')
                    .attr('id', renderContainerId + '_select')
                    .append('select')
                    .on("change", changeSeries.bind(this));
                var seriesOptions = select.selectAll('option')
                    .data(originalData.series)
                    .enter()
                    .append('option')
                    .attr('value', function (d) {
                        return d.value;
                    })
                    .text(function (d) {
                        return d.name;
                    })
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "8");
                function changeSeries() {
                    var selectedIndex = select.property('selectedIndex'), seriesdropdownData = seriesOptions._groups[0][selectedIndex].__data__;
                    this.drawPieDonut(svg,seriesdropdownData,originalData,color,noOfSlice,pie,outerRadius,h,arc);
                    this.selectedIndex = selectedIndex;
                }
            }
            // End of multiple series
            var series = data.series;
            var legendDrawn = false;
            var r = Math.min(w, h);
            var outerRadius = r * .3, innerRadius;
            this.outerRadius = outerRadius;
            if (chartType.toLowerCase() == 'pie')
                innerRadius = 0;
            else if (chartType.toLowerCase() == 'donut')
                innerRadius = 0.6 * outerRadius;
            var arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
            var biggerArc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius * 1.1);
            var pie = d3.pie().padAngle(.00).sort(null);
            svg = this.utility.d3ShadowSelect("#" + renderContainerId)
                .append("svg")
                .attr('id', renderContainerId + '_svg')
                .attr('class', (innerRadius !== 0) ? 'donut-svg' : 'pie-svg')
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight)
                .attr("width", "100%")
                .attr('height', "100%");

            //Utility function call to add filter def to svg
            this.utility.addRadialFilter(svg, renderContainerId);

            var chartData = this.drawPieDonut(svg,series[0],originalData,color,noOfSlice,pie,outerRadius,h,arc);
            if (legendDrawn === false) {
                this.drawPieLegends(svg,chartData,margin,arc,biggerArc,outerRadius,h,color);
                legendDrawn = true;
            }
            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.pie', true, true);
        }

        redraw(data) {
            this.removeOverlap();
            this.draw(data);
        }

        drawPieDonut(svg, dd_series,data,color,noOfSlice,pie,outerRadius,h,arc) {
            var self = this;
            var chartType = this.chartOptions.chartType;
            svg.selectAll('.arc').remove();
            svg.selectAll('.dArc').remove();
            var dataValues = dd_series.data;
            var pieData = data.categories.map(function (d, i) {
                return {
                    category: d,
                    categoryDimName: d.dimName,
                    categoryLongName: d.longName,
                    categoryName: d.name,
                    categoryValue: d.value,
                    index: i,
                    fmtData: data.series[0].fmtData[i],
                    data: +dataValues[i],
                    seriesLongName: dd_series.longName,
                    seriesName: dd_series.name,
                    seriesValue: dd_series.value
                };
            });
            pieData.sort(function (a, b) {
                return parseFloat(b.data) - parseFloat(a.data);
            });
            pieData.forEach(function (d) {
                if (isNaN(d.data))
                    d.data = 0;
            });
            data = pieData;
            var totalSum = d3.sum(data, function (d) {
                return d.data;
            });
            if (data.length > noOfSlice) {
                var finalPieData = [];
                var sumOthers = d3.sum(data, function (d, j) {
                    if (j > noOfSlice - 2)
                        return d.data;
                    else
                        return 0;
                });
                for (var i = 0; i < data.length; i++) {
                    if (i < noOfSlice - 1) {
                        finalPieData.push(data[i]);
                    }
                    else {
                        finalPieData.push({
                            category: "others",
                            index: i,
                            categoryDimName: "Others",
                            categoryLongName: "Others",
                            categoryName: "Others",
                            categoryValue: "Others",
                            seriesLongName: "Others",
                            seriesName: "Others",
                            seriesValue: "Others",
                            fmtData: sumOthers.toString(),
                            data: sumOthers
                        });
                        break;
                    }
                }
                data = finalPieData;
            }
            var dataset = data.map(function (d) {
                return d;
            });
            var sum = 0;
            for (var i = 0; i < dataset.length; i++) {
                sum += dataset[i].data;
            }
            var percentages = dataset.map(function (d) {
                return parseFloat((d.data * 100) / sum).toFixed(2);
            });
            var percentSum = 0;
            var percentagesRoundOff = percentages.map(function (d, i) {
                if (i === percentages.length - 1)
                    return (100 - percentSum);
                else {
                    percentSum = percentSum + Math.round(d);
                    return Math.round(d);
                }
            });
            var arcData = pie(dataset.map(function (d) {
                return d.data;
            }));
            arcData.forEach(function (d, i) {
                d.percent = percentages[i];
                d.category = dataset[i].category;
                d.index = i;
                d.categoryDimName = dataset[i].categoryDimName;
                d.categoryLongName = dataset[i].categoryLongName;
                d.categoryName = dataset[i].categoryName;
                d.categoryValue = dataset[i].categoryValue;
                d.fmtData = dataset[i].fmtData;
                d.seriesLongName = dataset[i].seriesLongName;
                d.seriesName = dataset[i].seriesName;
                d.seriesValue = dataset[i].seriesValue;
            });
            var arcs = svg.selectAll("g.arc")
                .data(arcData)
                .enter()
                .append("g")
                .attr("class", "arc")
                .attr("transform", "translate(" + (outerRadius + 40) + ", " + ((h / 2)) + ")");
            arcs.append("path")
                .attr("fill", function (d, i) {
                    return color[i];
                })
                .attr("class", 'pie')
                .style("stroke", function (d, i) {
                    return d3.rgb(color[i]).darker(2);
                })
                .each(function (d) {
                    this._current = d;
                })
                .transition()
                .ease(d3.easeBounce)
                .duration(1000)
                .on('end', function (d) {
                    if (d.index === noOfSlice - 1) {
                        self.dispatch.call("render-complete", self, arcData);
                    }
                })
                .attrTween("d", tweenPie);
            function tweenPie(b) {
                b.innerRadius = 0;
                var i = d3.interpolate({
                    startAngle: 0,
                    endAngle: 0
                }, b);
                return function (t) {
                    return arc(i(t));
                };
            }
            if (chartType == 'donut') {
                arcs.append("text")
                    .attr("class", "pietext")
                    .attr("transform", function (d) {
                        var centroid = arc.centroid(d);
                        return "translate(" + centroid + ")";
                    })
                    .attr("dy", ".35em")
                    .style("text-anchor", "middle")
                    .style("font-size", "10px")
                    .style("fill", "white")
                    .text(function (d, i) {
                        return percentagesRoundOff[i] + "%";
                    })
                    .style('display', function (d, i) {
                        if (parseFloat(percentages[i]) > 5)
                            return 'block';
                        else
                            return "none";
                    });
            }
            else {
                arcs.append("text")
                    .attr("class", "pietext")
                    .attr("transform", function (d) {
                        var offset = outerRadius / 3;
                        var angle = (d.startAngle + d.endAngle) / 2;
                        var xOff = Math.sin(angle) * offset;
                        var yOff = -Math.cos(angle) * offset;
                        var centroid = arc.centroid(d);
                        centroid[0] = centroid[0] + xOff;
                        centroid[1] = centroid[1] + yOff;
                        return "translate(" + centroid + ")";
                    })
                    .attr("dy", ".35em")
                    .style("text-anchor", "middle")
                    .style("font-size", "10px")
                    .style("fill", "white")
                    .text(function (d, i) {
                        return percentagesRoundOff[i] + "%";
                    })
                    .style('display', function (d, i) {
                        if (parseFloat(percentages[i]) > 5)
                            return 'block';
                        else
                            return "none";
                    });
            }
            return data;
        }

        drawPieLegends(svg,data,margin,arc,biggerArc,outerRadius,h,color) {
            var legends = data;
            var legendCount = legends.length;
            var legendWidth = 10;
            var legendSpacing = 6;
            var diameter = 2 * outerRadius;
            var netLegendHeight = (legendWidth + legendSpacing) * legendCount;
            var legendPerPage, totalPages, pageNo;
            if (netLegendHeight / diameter > 1) {
                legendPerPage = Math.floor(diameter / (legendWidth + legendSpacing));
                totalPages = Math.ceil(legendCount / legendPerPage);
                pageNo = 1;
                var startIndex = (pageNo - 1) * legendPerPage;
                var endIndex = startIndex + legendPerPage;
                var seriesSubset = [], colorSubset = [];
                for (var i = 0; i < legends.length; i++) {
                    if (i >= startIndex && i < endIndex) {
                        seriesSubset.push(legends[i]);
                        colorSubset.push(color[i]);
                    }
                }
                DrawLegendSubset(seriesSubset, colorSubset, legendPerPage, pageNo, totalPages);
            }
            else {
                var legendWidth = 9;
                var legendPosition = h / 2 - ((data.length / 2) * (legendWidth + 7));
                var legend = svg.selectAll(".legend")
                    .data(legends)
                    .enter().append("g")
                    .attr("transform", function (d, i) {
                        return "translate(" + (outerRadius * 1.5) + "," + (legendPosition + (i * 16)) + ")";
                    });
                legend.append("rect")
                    .attr("x", (outerRadius * 1.2) - 18)
                    .attr("width", 9)
                    .attr("height", 9)
                    .attr("class", "legend")
                    .style("fill", function (d, i) {
                        return color[i];
                    });
                legend.append("text")
                    .attr("x", (outerRadius * 1.2) - 5)
                    .attr("y", 9)
                    .style("text-anchor", "start")
                    .text(function (d) {
                        return d.categoryLongName;
                    });
            }
            function DrawLegendSubset(seriesSubset, colorSubset, legendPerPage, pageNo, totalPages) {
                var legend = svg.selectAll("g.legendg")
                    .data(seriesSubset)
                    .enter().append("g")
                    .attr('class', 'legendg')
                    .attr("transform", function (d, i) {
                        return "translate(" + (outerRadius * 1.5) + "," + (margin.top + (i * (legendWidth + legendSpacing))) + ")";
                    });
                legend.append("rect")
                    .attr("x", 45)
                    .attr("width", legendWidth)
                    .attr("height", legendWidth)
                    .attr("class", "legend")
                    .on("mouseover", pieLegendMouseOver)
                    .on("mouseout", pieLegendMouseOut)
                    .style('fill', function (d, i) {
                        return colorSubset[i];
                    });
                legend.append("text")
                    .attr("x", 60)
                    .attr("y", 6)
                    .attr("dy", ".35em")
                    .style("text-anchor", "start")
                    .text(function (d) {
                        return d.categoryLongName;
                    });
                var pageText = svg.append("g")
                    .attr('class', 'pageNo')
                    .attr("transform", "translate(" + (outerRadius * 2.5) + "," + (margin.top + ((legendPerPage + 1) * (legendWidth + legendSpacing))) + ")");
                pageText.append('text').text(pageNo + '/' + totalPages)
                    .attr('dx', '.90em');
                var prevtriangle = svg.append("g")
                    .attr('class', 'prev')
                    .attr("transform", "translate(" + (outerRadius * 2.45) + "," + (margin.top + ((legendPerPage + 1.5) * (legendWidth + legendSpacing))) + ")")
                    .on('click', prevLegend)
                    .style('cursor', 'pointer');
                var nexttriangle = svg.append("g")
                    .attr('class', 'next')
                    .attr("transform", "translate(" + (outerRadius * 2.75) + "," + (margin.top + ((legendPerPage + 1.5) * (legendWidth + legendSpacing))) + ")")
                    .on('click', nextLegend)
                    .style('cursor', 'pointer');
                nexttriangle.append('polygon')
                    .style('stroke', '#000')
                    .style('fill', '#000')
                    .attr('points', '0,0, 10,0, 5,5');
                prevtriangle.append('polygon')
                    .style('stroke', '#000')
                    .style('fill', '#000')
                    .attr('points', '0,5, 10,5, 5,0');
                if (pageNo == totalPages) {
                    nexttriangle.style('opacity', '0.5');
                    nexttriangle.on('click', '')
                        .style('cursor', '');
                }
                else if (pageNo == 1) {
                    prevtriangle.style('opacity', '0.5');
                    prevtriangle.on('click', '')
                        .style('cursor', '');
                }
            }
            function prevLegend() {
                pageNo--;
                svg.selectAll("g.legendg").remove();
                svg.select('.pageNo').remove();
                svg.select('.prev').remove();
                svg.select('.next').remove();
                var startIndex = (pageNo - 1) * legendPerPage;
                var endIndex = startIndex + legendPerPage;
                var seriesSubset = [], colorSubset = [];
                for (var i = 0; i < legends.length; i++) {
                    if (i >= startIndex && i < endIndex) {
                        seriesSubset.push(legends[i]);
                        colorSubset.push(color[i]);
                    }
                }
                DrawLegendSubset(seriesSubset, colorSubset, legendPerPage, pageNo, totalPages);
            }
            function nextLegend() {
                pageNo++;
                svg.selectAll("g.legendg").remove();
                svg.select('.pageNo').remove();
                svg.select('.prev').remove();
                svg.select('.next').remove();
                var startIndex = (pageNo - 1) * legendPerPage;
                var endIndex = startIndex + legendPerPage;
                var seriesSubset = [], colorSubset = [];
                for (var i = 0; i < legends.length; i++) {
                    if (i >= startIndex && i < endIndex) {
                        seriesSubset.push(legends[i]);
                        colorSubset.push(color[i]);
                    }
                }
                DrawLegendSubset(seriesSubset, colorSubset, legendPerPage, pageNo, totalPages);
            }
            function pieLegendMouseOver() {
                var legendColor = this.style.fill;
                var paths = svg.selectAll('path');
                paths._groups[0].forEach(function (d, i) {
                    var pathColor = d3.select(d).attr('fill');
                    if (d3.rgb(pathColor).toString() == d3.rgb(legendColor).toString()) {
                        d3.select(d).transition()
                            .duration(500)
                            .attr("d", biggerArc);
                    }
                    else {
                        d3.select(d).transition()
                            .duration(500)
                            .attr("d", arc);
                    }
                });
            }
            function pieLegendMouseOut() {
                var paths = svg.selectAll('path');
                paths._groups[0].forEach(function (d, i) {
                    d3.select(d).transition()
                        .duration(500)
                        .attr("d", arc);
                });
            }
            if (this.chartOptions.tooltip)
                this.utility.tooltip(svg, '.legend', false, true);
        }

        drawOverlap(overlappedData, originalData) {
            var chartOptions = this.chartOptions;
            var renderContainerId = this.renderContainerId;
            originalData = this.data;
            var reduceCategory;
            overlappedData = this.utility.overlapDataPrep(overlappedData, originalData);
            var svg = this.utility.d3ShadowSelect("#" + renderContainerId + "_svg");
            var noOfPieSlices = chartOptions.noOfPieSlices;
            if (originalData.categories.length <= noOfPieSlices) {
                noOfPieSlices = originalData.categories.length;
                reduceCategory = false;
            }
            else
                reduceCategory = true;
            var noOfSlice = noOfPieSlices;
            // reducing the opacity
            svg.selectAll('.pie').style('opacity', 0.7);
            var index = this.selectedIndex;
            if (typeof (index) == 'undefined' || index == '')
                index = 0;
            var donutInnerRadius = this.outerRadius;
            var h = this.canvasHeight;
            var w = this.canvasWidth;
            var arcs = this.arcs;
            var color = this.color;
            for (var i = 0; i < overlappedData.overlappedSeries[index].data.length; i++) {
                var difference = originalData.series[index].data[i] - overlappedData.overlappedSeries[index].data[i][0];
                overlappedData.overlappedSeries[index].data[i][1] = difference;
                overlappedData.overlappedSeries[index].fmtData[i][1] = difference.toString();
            }
            var dataValues = overlappedData.overlappedSeries[index].data;
            var pieData = originalData.categories.map(function (d, i) {
                return {
                    category: d,
                    categoryDimName: d.dimName,
                    categoryLongName: d.longName,
                    categoryName: d.name,
                    categoryValue: d.value,
                    fmtData: overlappedData.overlappedSeries[0].fmtData[i],
                    data: dataValues[i],
                    seriesLongName: overlappedData.overlappedSeries[index].longName,
                    seriesName: overlappedData.overlappedSeries[index].name,
                    seriesValue: overlappedData.overlappedSeries[index].value
                };
            });
            pieData.sort(function (a, b) {
                return parseFloat(b.data[0] + b.data[1]) - parseFloat(a.data[0] + a.data[1]);
            });
            overlappedData.overlappedSeries[index].data.sort(function (a, b) {
                return parseFloat(b[0] + b[1]) - parseFloat(a[0] + a[1]);
            });
            var overlappedData = overlappedData.overlappedSeries[index].data;
            var data = pieData;
            // divide other category data into two parts
            var dataLength = originalData.series[index].data.length;
            var otherOverlappedData = [];
            if (dataLength >= noOfSlice) {
                var sumOthers = 0;
                var median = Math.floor((dataLength - noOfSlice) / 2);
                median = median + noOfSlice - 2;
                for (var i = noOfSlice - 1; i <= median; i++)
                    sumOthers = sumOthers + originalData.series[index].data[i];
                otherOverlappedData.push(sumOthers);
                sumOthers = 0;
                for (var i = median + 1; i < dataLength; i++)
                    sumOthers = sumOthers + originalData.series[index].data[i];
                otherOverlappedData.push(sumOthers);
            }
            if (reduceCategory) {
                overlappedData = overlappedData.slice(0, (noOfSlice - 1));
                overlappedData.push(otherOverlappedData);
            }
            overlappedData = d3.merge(overlappedData);
            var dataset = overlappedData;
            var totalSum = d3.sum(data, function (d) {
                return d.data;
            });
            var sum = 0;
            for (var i = 0; i < dataset.length; i++) {
                sum += dataset[i];
            }
            var percentages = dataset.map(function (d) {
                return ((d / sum) * 100).toFixed(2);
            });
            var percentSum = 0;
            var percentagesRoundOff = percentages.map(function (d, i) {
                if (i === percentages.length - 1)
                    return (100 - percentSum);
                else {
                    percentSum = percentSum + Math.round(d);
                    return Math.round(d);
                }
            });
            svg.selectAll('.dArc').remove();
            var donutOuterRadius = donutInnerRadius * 1.2;
            var arcInnerRadius = donutInnerRadius + 2;
            var dArc = d3.arc()
                .innerRadius(arcInnerRadius)
                .outerRadius(donutOuterRadius);
            var pie = d3.pie().sort(null);
            var arcData = pie(dataset);
            var j = 0;
            if (reduceCategory)
                arcData.forEach(function (d, i) {
                    if (i < (2 * noOfSlice - 2)) {
                        d.percent = percentages[i];
                        d.category = pieData[j].category;
                        d.categoryDimName = pieData[j].categoryDimName;
                        d.categoryLongName = pieData[j].categoryLongName;
                        d.categoryName = pieData[j].categoryName;
                        d.categoryValue = pieData[j].categoryValue;
                        d.fmtData = pieData[j].fmtData;
                        d.seriesLongName = pieData[j].seriesLongName;
                        d.seriesName = pieData[j].seriesName;
                        d.seriesValue = pieData[j].seriesValue;
                        if (++i % 2 === 0)
                            j++;
                    }
                    else {
                        d.percent = percentages[i];
                        d.category = "Others";
                        d.categoryDimName = "Others";
                        d.categoryLongName = "Others";
                        d.categoryName = "Others";
                        d.categoryValue = "Others";
                        d.fmtData = d.data.toString();
                        d.seriesLongName = "Others";
                        d.seriesName = "Others";
                        d.seriesValue = "Others";
                    }
                });
            else {
                arcData.forEach(function (d, i) {
                    d.percent = percentages[i];
                    d.category = pieData[j].category;
                    d.categoryDimName = pieData[j].categoryDimName;
                    d.categoryLongName = pieData[j].categoryLongName;
                    d.categoryName = pieData[j].categoryName;
                    d.categoryValue = pieData[j].categoryValue;
                    d.fmtData = pieData[j].fmtData;
                    d.seriesLongName = pieData[j].seriesLongName;
                    d.seriesName = pieData[j].seriesName;
                    d.seriesValue = pieData[j].seriesValue;
                    if (++i % 2 === 0)
                        j++;
                });
            }
            var arcs = svg.selectAll("g.dArc")
                .data(arcData)
                .enter()
                .append("g")
                .attr("class", "dArc")
                .attr("transform", "translate(" + (donutInnerRadius + 40) + ", " + ((h / 2)) + ")");
            var j = 0;
            arcs.append("path")
                .attr("class", 'outerDonut')
                .attr("fill", function (d, i) {
                    if (i % 2 == 0)
                        return "#FFC200";
                    else
                        return color[j++];
                })
                .style("stroke", 'black')
                .style('stroke-width', '0.3px')
                .style('opacity', function (d, i) {
                    if (i % 2 == 0)
                        return .9;
                    else
                        return .3;
                })
                .each(function (d) {
                    this._current = d;
                })
                .transition()
                .ease(d3.easeBounce)
                .duration(1000)
                .attrTween("d", tweenPie);
            function tweenPie(b) {
                b.donutInnerRadius = 0;
                var i = d3.interpolate({
                    startAngle: 0,
                    endAngle: 0
                }, b);
                return function (t) {
                    return dArc(i(t));
                };
            }
            arcs.append("text")
                .attr("class", "pietext")
                .attr("transform", function (d) {
                    var offset = donutOuterRadius / 300;
                    var angle = (d.startAngle + d.endAngle) / 2;
                    var xOff = Math.sin(angle) * offset;
                    var yOff = -Math.cos(angle) * offset;
                    var centroid = dArc.centroid(d);
                    centroid[0] = centroid[0] + xOff;
                    centroid[1] = centroid[1] + yOff;
                    return "translate(" + centroid + ")";
                })
                .attr("dy", ".35em")
                .style("text-anchor", "middle")
                .style("font-size", "10px")
                .style("fill", "white")
                .text(function (d, i) {
                    if (i % 2 == 0)
                        return percentagesRoundOff[i] + "%";
                })
                .style('display', function (d, i) {
                    if (parseFloat(percentages[i]) > 1)
                        return 'block';
                    else
                        return "none";
                });
            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.outerDonut', true, true);
        }

        removeOverlap() {
            var renderContainerId = this.renderContainerId;
            var svg = this.utility.d3ShadowSelect("#" + renderContainerId + "_svg");
            svg.selectAll('.dArc').remove();
            // resetting the opacity
            svg.selectAll('.pie').style('opacity', 1);
        }
    }

    return pieOrDonut;
})();
export default XChartPieOrDonut;

