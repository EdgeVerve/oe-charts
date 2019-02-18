//Map
//PI.xChart\src\js\plots\map.js
/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { XChartUtility } from "./x-chart.js";
import { TopoJson } from '../countries/topojson';
import * as d3 from "d3";

const XChartMap = (function () {
    class map {
        constructor(renderContainerId, color, chartOptions) {
            //Information stored here will persist
            this.renderContainerId = renderContainerId;
            this.canvasWidth = chartOptions.chartHost.querySelector('#' + renderContainerId).offsetWidth;
            this.canvasHeight = chartOptions.chartHost.querySelector('#' + renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.zoomLevel = chartOptions.zoomLevel;
            this.drillMap = chartOptions.drillMap;
            this.color = color;
            this.overlapDraw = false;
            this.chartOptions = chartOptions;
            //To use the helper utility functions
            this.utility = new XChartUtility(chartOptions);
            //variables
            this.regionData = [];
            this.countryData = [];
            this.regionarray = [];
            this.countryarray = [];
            this.countryLabels = [];
            this.regionLabels = [];
            this.zoom;
            this.pan;
            var self = this;
            this.DrawCircles = function (svg, g, zoomLevel, newData, originalData) {
                var data = [];
                var circleClass = 'mapCircle';
                if (this.overlapDraw == true && typeof originalData != "undefined") {
                    data = originalData;
                    data = data.concat(newData);
                    circleClass = 'mapOverLapCircle';
                }
                else
                    data = newData;
                if (this.overlapDraw == false && svg.selectAll(".mapCircle")._groups[0].length > 0)
                    return;
                var scale = 0.25 * self.canvasHeight;
                var center = [0, 45];
                var projection = d3.geoMercator()
                    .translate([0, 0])
                    .center(center)
                    .scale(scale);
                //var minSize = [scale / 0, scale / 16, scale / 16, scale / 28, scale / 28, scale / 48, scale / 48];
                var minSize = [2, 2, 2, 1, 1];
                var maxSize = [scale / 1, scale / 4, scale / 4, scale / 8, scale / 8, scale / 12, scale / 12];
                var index = Math.ceil(zoomLevel);
                var y = d3.scaleLinear().range([minSize[index], Math.round(maxSize[index])]);
                var Vals;
                if (this.overlapDraw == true) {
                    Vals = originalData.map(function (obj) {
                        return obj.data;
                    });
                }
                else {
                    Vals = data.map(function (obj) {
                        return obj.data;
                    });
                }
                var max = Math.max.apply(null, Vals);
                var min = Math.min.apply(null, Vals);
                y.domain([0, max]);
                //code to draw circle
                var circles = g.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", circleClass)
                    .attr("cx", function (d) {
                        return projection([d.lon, d.lat])[0];
                    })
                    .attr("cy", function (d) {
                        return projection([d.lon, d.lat])[1];
                    })
                    .attr("r", function (d) {
                        return 0;
                    });
                if (this.overlapDraw == true) {
                    circles.style("fill", function (d) {
                        return '#FFC200';
                    }).style("stroke", function (d) {
                        return '#FFC200';
                    }).style("opacity", 1);
                }
                else if (circles._groups[0].length > 0) {
                    circles.style("fill", function (d) {
                        return d.color;
                    }).style("stroke", function (d) {
                        return d.color;
                    }).style("opacity", 1);
                }
                if (zoomLevel >= 1 && zoomLevel < 2)
                    circles.attr('name', 'regioncircle');
                else
                    circles.attr('name', 'countrycircle');
                circles.transition()
                    .duration(1000)
                    .attr("r", function (d) {
                        return y(d.data);
                    })
                    .on('end', function (d) {
                        if (d.index === data.length - 1)
                            this.dispatch.call("render-complete", this);
                    }.bind(this));
                self.utility.tooltip(svg, '.' + circleClass, true, false);
            };
            this.DrawLabels = function (svg, g, zoomLevel, data) {
                if (svg.selectAll("[name='countriestext']")._groups[0].length > 0 || svg.selectAll("[name='regiontext']")._groups[0].length > 0)
                    return;
                var width = self.canvasWidth;
                var height = self.canvasHeight;
                var scale = 0.25 * height;
                var center = [0, 45];
                var projection = d3.geoMercator()
                    .translate([0, 0])
                    .center(center)
                    .scale(scale);
                var fontsize = 5;
                if (zoomLevel >= 1 && zoomLevel < 2) {
                    fontsize = Math.round((scale * 0.25) / zoomLevel);
                }
                else if (zoomLevel >= 2 && zoomLevel <= 4) {
                    fontsize = Math.round((scale * 0.15) / zoomLevel);
                }
                //var minSize = [scale / 0, scale / 16, scale / 16, scale / 28, scale / 28, scale / 48, scale / 48];
                var minSize = [2, 2, 2, 1, 1];
                var maxSize = [scale / 1, scale / 4, scale / 4, scale / 8, scale / 8, scale / 12, scale / 12];
                var index = Math.ceil(zoomLevel);
                var y = d3.scaleLinear().range([minSize[index], Math.round(maxSize[index])]);
                var Vals = data.map(function (obj) {
                    return obj.data;
                });
                var max = Math.max.apply(null, Vals);
                var min = Math.min.apply(null, Vals);
                y.domain([0, max]);
                var texts = g.selectAll('text')
                    .data(data)
                    .enter()
                    .append('text')
                    .attr("x", function (d) {
                        return projection([d.lon, d.lat])[0];
                    })
                    .attr("y", function (d) {
                        return projection([d.lon, d.lat])[1] + y(d.data) + 2;
                    })
                    .attr("dy", ".35em")
                    .attr("class", 'mapText')
                    .text(function (d) {
                        return d.name;
                    }).attr("style", ("font-family:'Calibri';text-anchor:middle;font-size:" + fontsize));
                if (zoomLevel >= 1 && zoomLevel < 2) {
                    texts.attr('name', 'regiontext');
                }
                else if (zoomLevel >= 2 && zoomLevel <= 4) {
                    texts.attr('name', 'countriestext');
                }
            };
            this.PopulateArray = function (data, zoomLevel, index) {
                var ary = [];
                for (var j = 0; j < data.categories.length; ++j) {
                    var c = {};
                    c.categoryLongName = data.categories[j].longName;
                    c.data = data.series[index].data[j];
                    c.fmtData = data.series[index].fmtData[j];
                    c.seriesLongName = data.series[index].longName;
                    c.index = j;
                    c.categoryValue = data.categories[j].value;
                    c.categoryDimName = data.categories[j].dimName;
                    if (data.series[index].color != undefined)
                        c.color = data.series[index].color;
                    else
                        c.color = chartOptions.defaultColors[index];
                    var retVal = PopulateLonLat(c, c.categoryLongName, zoomLevel);
                    if (retVal != false) {
                        ary.push(c);
                    }
                }
                return ary;
            };
            this.PopulateLabelsArray = function (data, zoomLevel) {
                var ary = [];
                for (var j = 0; j < data.categories.length; ++j) {
                    var c = {};
                    c.categoryLongName = data.categories[j].longName;
                    c.name = data.categories[j].name;
                    c.data = data.series[0].data[j];
                    var retVal = PopulateLonLat(c, c.categoryLongName, zoomLevel);
                    if (retVal != false) {
                        ary.push(c);
                    }
                }
                return ary;
            };
            function PopulateLonLat(e, location, zoomLevel) {
                var regionData = self.regionData;
                var countryData = self.countryData;
                if (zoomLevel >= 1 && zoomLevel < 2) {
                    for (var i = 0; i < regionData.length; ++i) {
                        if (regionData[i].name.toLowerCase() == location.toLowerCase()) {
                            e.lon = regionData[i].lon;
                            e.lat = regionData[i].lat;
                            return;
                        }
                    }
                    console.log("Error:lat and long details not found for :" + location);
                    return false;
                }
                else if (zoomLevel >= 2 && zoomLevel < 4) {
                    for (var i = 0; i < countryData.length; ++i) {
                        if (countryData[i].name.toLowerCase() == location.toLowerCase()) {
                            e.lon = countryData[i].lon;
                            e.lat = countryData[i].lat;
                            return;
                        }
                    }
                    console.log("Error:lat and long details not found for :" + location);
                    return false;
                }
            }
            this.move = function () {
                var zoom = self.zoom;
                var svg = self.utility.d3ShadowSelect('#' + self.renderContainerId + '_svg');
                var g = self.utility.d3ShadowSelect('#' + self.renderContainerId + '_svg_g');
                var zoomLevel = d3.zoomTransform(this).k;
                self.zoomLevel = zoomLevel;
                var t = [d3.event.transform.x,d3.event.transform.y], s = d3.event.transform.k;
                var width = self.canvasWidth, height = self.canvasHeight;
                t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
                t[1] = Math.min(height / 2 * (s - 1) + 230 * s, Math.max(height / 2 * (1 - s) - 230 * s, t[1]));
                //zoom.translateTo(d3.event.target,t[0],t[1]);
                g.style("stroke-width", 1 / s)
                    .transition().duration(1000)
                    .attr("transform", "translate(" + t + ")scale(" + s + ")");
                if (zoomLevel >= 1 && zoomLevel < 2) {
                    //remove labels
                    if (svg.selectAll("[name='countriestext']").length > 0)
                        svg.selectAll("[name='countriestext']").remove();
                    //remove circles
                    if (svg.selectAll("[name='countrycircle']").length > 0) {
                        svg.selectAll("[name='countrycircle']").remove();
                    }
                    if (svg.selectAll("[name='regioncircle']")._groups[0].length == 0) {
                        self.DrawCircles(svg, g, zoomLevel, self.regionarray);
                        self.DrawLabels(svg, g, zoomLevel, self.regionLabels);
                    }
                }
                else if (zoomLevel >= 2 && zoomLevel <= 4) {
                    if (svg.selectAll("[name='regiontext']").length > 0) {
                        svg.selectAll("[name='regiontext']").remove();
                    }
                    if (svg.selectAll("[name='regioncircle']").length > 0) {
                        svg.selectAll("[name='regioncircle']").remove();
                    }
                    if (svg.selectAll("[name='countrycircle']")._groups[0].length == 0) {
                        if (self.countryarray.length == 0 && self.drillMap) {
                            self.drillMap(zoomLevel);
                        }
                        else {
                            self.DrawCircles(svg, g, zoomLevel, self.countryarray);
                            self.DrawLabels(svg, g, zoomLevel, self.countryLabels);
                        }
                    }
                }
                //else if(zoomLevel>=5 && zoomLevel<=8)
                //{
                //code to get city/next level Data
                //}
            };
        }
        draw(data) {
            if (typeof this.zoomLevel == "undefined" && this.zoomLevel == null) {
                this.zoomLevel = 1;
            }
            var el = this.chartOptions.chartHost.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);
            var zoomLevel = this.zoomLevel;
            var drillMap = this.drillMap;
            var renderContainerId = this.renderContainerId;
            var self = this;
            var chartOptions = this.chartOptions;
            if (zoomLevel >= 1 && zoomLevel < 2) {
                //var margin = { top: 0.03 * canvasHeight, right: Math.min(0.1 * canvasWidth, 20), bottom: 0.03 * canvasHeight, left: Math.min(0.05 * canvasWidth, 15) },
                var margin = {
                    top: 5,
                    right: 5,
                    bottom: 3,
                    left: 7
                };
                var width = this.canvasWidth - margin.right - margin.left, height = this.canvasHeight - margin.top - margin.bottom;
                var scale = 0.25 * this.canvasHeight;
                var center = [0, 45];
                var projection = d3.geoMercator()
                    .translate([0, 0])
                    .center(center)
                    .scale(scale);
                this.zoom = d3.zoom()
                    .scaleExtent([1, 8])
                    .on("zoom", this.move);
                this.pan = d3.zoom()
                    .scaleExtent([1, 1])
                    .on("zoom", this.move);
                var path = d3.geoPath(projection);
                var svg = this.utility.d3ShadowSelect("#" + renderContainerId).append("svg")
                    .attr("width", "100%")
                    .attr("id", renderContainerId + "_svg")
                    .attr('class', 'map')
                    .attr("height", "100%")
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight)
                    .append("g")
                    .attr("id", renderContainerId + "_svg_outerGroup")
                    .attr('class', 'outerGroupMap')
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                    .call(this.zoom);
                svg.append("rect")
                    .attr('class', 'rectMap')
                    .attr("x", -width / 2)
                    .attr("y", -height / 2)
                    .attr("width", width)
                    .attr("height", height)
                    .style('fill', '#ACC7F2');
                var g = svg.append("g")
                    .attr("id", renderContainerId + "_svg_g")
                    .attr('class', 'innerGroupMap');
                var g1;
                var topologyObj = new TopoJson;
                d3.json("countries/countries.json").then(function (countries) {
                    g1 = g.append("g")
                        .attr("id", "countries")
                        .attr("class", "countiresGroup")
                        .selectAll("g")
                        .data(topologyObj.topojson.feature(countries, countries.objects.countries).features)
                        .enter()
                        .append('g');
                    g1.append("path")
                        .attr("id", function (d) {
                            return d.id;
                        })
                        .attr("d", path)
                        .attr('style', "stroke: #939196;fill: #F4F3EF;stroke-width: 0.5px;stroke-linejoin: round;stroke-opacity: 0.35;stroke-linecap: round;");
                    //Utility function call to add filter def to svg
                    //self.utility.addRadialFilter(svg, self.renderContainerId);
                    var tempStr = chartOptions.chartClientId + '_inOut';
                    //d3.selectAll('button[zoom-action="' + tempStr + '"]').on('click', function () {
                    var chartElem = this.utility.d3ShadowSelect('#' + chartOptions.chartClientId);
                    chartElem.on('dblclick', function () {
                        d3.event.preventDefault();
                        var zoom = self.zoom;
                        var scale = zoom.scale(), extent = zoom.scaleExtent(), translate = zoom.translate(), x = translate[0], y = translate[1], factor = (this.id.indexOf('zoom_in') > 0) ? 1.2 : 1 / 1.2, target_scale = scale * factor;
                        // If we're already at an extent, done
                        if (target_scale === extent[0] || target_scale === extent[1]) {
                            return false;
                        }
                        // If the factor is too much, scale it down to reach the extent exactly
                        var clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
                        if (clamped_target_scale != target_scale) {
                            target_scale = clamped_target_scale;
                            factor = target_scale / scale;
                        }
                        // Center each vector, stretch, then put back
                        x = (x - center[0]) * factor + center[0];
                        y = (y - center[1]) * factor + center[1];
                        // Transition to the new view over 350ms
                        d3.transition().duration(350).tween("zoom", function () {
                            var interpolate_scale = d3.interpolate(scale, target_scale), interpolate_trans = d3.interpolate(translate, [x, y]);
                            return function (t) {
                                zoom.scale(interpolate_scale(t))
                                    .translate(interpolate_trans(t));
                                zoomed();
                            };
                        });
                    });
                    self.renderData(data);
                }.bind(this));
            }
            function zoomed() {
                var zoom = self.zoom;
                var zoomLevel = zoom.scale();
                self.zoomLevel = zoomLevel;
                g.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")");
                if (zoomLevel >= 1 && zoomLevel < 2) {
                    //remove labels
                    if (svg.selectAll("[name='countriestext']").length > 0)
                        svg.selectAll("[name='countriestext']").remove();
                    //remove circles
                    if (svg.selectAll("[name='countrycircle']").length > 0) {
                        svg.selectAll("[name='countrycircle']").remove();
                    }
                    if (svg.selectAll("[name='regioncircle']")[0].length == 0) {
                        self.DrawCircles(svg, g, zoomLevel, self.regionarray);
                        self.DrawLabels(svg, g, zoomLevel, self.regionLabels);
                    }
                }
                else if (zoomLevel >= 2 && zoomLevel <= 4) {
                    if (svg.selectAll("[name='regiontext']").length > 0) {
                        svg.selectAll("[name='regiontext']").remove();
                    }
                    if (svg.selectAll("[name='regioncircle']").length > 0) {
                        svg.selectAll("[name='regioncircle']").remove();
                    }
                    if (svg.selectAll("[name='countrycircle']")[0].length == 0) {
                        if (self.countryarray.length == 0) {
                            drillMap(zoomLevel);
                        }
                        else {
                            self.DrawCircles(svg, g, zoomLevel, self.countryarray);
                            self.DrawLabels(svg, g, zoomLevel, self.countryLabels);
                        }
                    }
                }
            }
        }
        redraw(data) {
            var zoomLevel = this.zoomLevel;
            var drillMap = this.drillMap;
            var renderContainerId = this.renderContainerId;
            this.renderData(data);
        }
        drawOverlap(data, oData) {
            this.overlapDraw = true;
            var svg = this.utility.d3ShadowSelect('#' + this.renderContainerId + '_svg');
            var g = this.utility.d3ShadowSelect('#' + this.renderContainerId + '_svg_g');
            this.utility.d3ShadowSelect('#' + this.renderContainerId + "_svg_outerGroup").call(d3.zoom().on("zoom", this.pan));
            var chartOptions = this.chartOptions;
            var originalData = [];
            if (this.zoomLevel >= 1 && this.zoomLevel < 2) {
                this.regionarray = [];
                for (var i = 0; i < data.series.length; i++) {
                    var region = [];
                    region = this.PopulateArray(data, this.zoomLevel, i, true);
                    this.regionarray = this.regionarray.concat(region);
                }
                originalData = [];
                for (var i = 0; i < oData.series.length; i++) {
                    var region = [];
                    region = this.PopulateArray(oData, this.zoomLevel, i);
                    originalData = originalData.concat(region);
                }
                this.DrawCircles(svg, g, this.zoomLevel, this.regionarray, originalData);
            }
            else if (this.zoomLevel >= 2 && this.zoomLevel <= 4) {
                this.countryarray = [];
                for (var i = 0; i < data.series.length; i++) {
                    var country = [];
                    country = this.PopulateArray(data, this.zoomLevel, i, true);
                    this.countryarray = this.countryarray.concat(country);
                }
                originalData = [];
                for (var i = 0; i < oData.series.length; i++) {
                    var country = [];
                    country = this.PopulateArray(oData, this.zoomLevel, i);
                    originalData = originalData.concat(country);
                }
                this.DrawCircles(svg, g, this.zoomLevel, this.countryarray, originalData);
            }
        }
        renderData(data) {
            var zoomLevel = this.zoomLevel;
            var svg = this.utility.d3ShadowSelect('#' + this.renderContainerId + '_svg');
            var g = this.utility.d3ShadowSelect('#' + this.renderContainerId + '_svg_g');
            var self = this;
            function _sort(arr,sortFn){
                return arr.sort(sortFn);
            }
            if (zoomLevel >= 1 && zoomLevel < 2) {
                d3.csv("countries/Region.csv").then(function (regions) {
                    self.regionData = regions;
                    self.regionarray = [];
                    for (var i = 0; i < data.series.length; i++) {
                        var region = [];
                        region = self.PopulateArray(data, self.zoomLevel, i);
                        self.regionarray = self.regionarray.concat(region);
                    }
                    self.regionLabels = self.PopulateLabelsArray(data, zoomLevel);
                    self.DrawCircles(svg, g, zoomLevel, self.regionarray);
                    self.DrawLabels(svg, g, zoomLevel, self.regionLabels);
                });
            }
            else if (zoomLevel >= 2 && zoomLevel <= 4) {
                d3.csv("countries/Countries.csv").then(function (countries) {
                    self.countryData = countries;
                    self.countryarray = [];
                    for (var i = 0; i < data.series.length; i++) {
                        var country = [];
                        country = self.PopulateArray(data, zoomLevel, i);
                        self.countryarray = self.countryarray.concat(country);
                    }
                    self.countryarray = _sort(self.countryarray,function (o) { return o.data; }).reverse();
                    self.countryLabels = self.PopulateLabelsArray(data, zoomLevel);
                    self.DrawCircles(svg, g, zoomLevel, self.countryarray);
                    self.DrawLabels(svg, g, zoomLevel, self.countryLabels);
                });
            }
        }
        removeOverlap(data) {
            this.overlapDraw = false;
            this.utility.d3ShadowSelect('#' + this.renderContainerId + "_svg_outerGroup").call(this.zoom);
            var svg = this.utility.d3ShadowSelect('#' + this.renderContainerId + '_svg');
            if (svg.selectAll(".mapOverLapCircle").length > 0)
                svg.selectAll(".mapOverLapCircle").remove();
        }
    }
    return map;
})();
export default XChartMap;