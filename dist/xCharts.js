/*
    * ©2015 EdgeVerve Systems Limited, Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. The Program may contain / reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted. Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/

//start of closure warpper

(function (context, xChart) {
    //Validating presence of d3 with appropriate error messages.
    if (!context.d3) {
        if (console && console.warn) {
            console.warn("xCharts requires d3 to run. Make sure you have included d3 in the reference");
        } else {
            throw "xCharts requires d3 to run. Make sure you have included d3 in the reference";
        }
    } else {
        context.xChart = xChart(context.d3);
    }

}(this, function (d3) {
    //    "use strict";

    // Create the stub object
    var xChart = {
        version: "0.0.1",
        authors: "Sourav Kumar, Pragyan Das, Jyothsna Shriyan, Atul Pandit",
        company: "EdgeVerve Systems Limited",
        quote: "In the end you should only measure and look at the numbers that drive action, meaning that the data tells you what you should do next."
    };
    //Start xChart.chart

    xChart.chart = function (renderContainerId) {

        this.renderContainerId = renderContainerId;

        this.utility = new xChart.utility();

        this.events = new xChart.events();

        this.renderedChart = {};

        this._eventHandlers = [];

        //default chart options
        this.chartOptions = {
            chartClientId: '',
            drillMap: '',
            zoomLevel: 1,
            gaugeConfiguration: '',
            showMargin: false,
            brush: false,
            tooltip: true,
            chartType: 'groupedColumn',
            margin: {
                top: 15,
                right: 20,
                bottom: 35,
                left: 45
            },
            noOfPieSlices: 5,
            // seriesLabel:'y-axis',
            //Range 0 to 1. Option used to trigger axis redraw on domain change by "axisRedrawThreshold".
            //Set 0 to always redraw
            //Set 1 to never draw
            axisRedrawThreshold: 0.2,
            aec: 0.1,
            defaultColors: ['#03A9F4', '#E91E63', '#ff9800', '#4CAF50', '#D4E157', '#FFA726', '#9C27B0', '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#EABB14', '#af2e2e', '#5674b9', '#774ebf', '#ee9595', '#e979fc', '#1ac3d8', '#acd373', '#ee4a47', '#38a0f4', '#72368c', '#fbaf5d', '#f389ad', '#0082cf', '#af82ff', '#ef5a8c', '#873661', '#5eb762', '#b881c3', '#f68e56', '#0091a2', '#bf3333', '#846ab2', '#008374']

        };

        //DataItems are the data points like bar, pie, bubble, etc
        this.dataitems = {
            bar: '.bar',
            pie: '.pie',
            bubble: '.bubble',
            lineCircle: '.linecircle',
            areacircle: '.areacircle',
            mapCircle: '.mapCircle'
        };

        //Axis Ticks, Legends, etc
        this.chartItems = {

        };

        //legendOptions

        //axisOptions

        //Events
        //Generic Events
        //Used before chart is drawn like we call setOptions
        this.addEventHandler = function (_event, eventTarget, eventHandler, preventDefault) {

            if (typeof preventDefault === 'undefined')
                preventDefault = false;

            if (eventTarget === 'dataitems') {
                //For each dataitems in this.dataitems
                for (var k in this.dataitems) {
                    var target = this.dataitems[k];

                    var existingEvent = this._eventHandlers.filter(function (d) {
                        return d._event === _event && d.eventTarget === target;
                    });

                    //If event exists for the eventTarget, change the event handler
                    //Else create add a new event handler
                    if (existingEvent.length > 0) {
                        existingEvent[0].eventHandler = eventHandler;
                        existingEvent[0].preventDefault = preventDefault;
                    } else {
                        var eventObject = {};
                        eventObject._event = _event;
                        eventObject.eventTarget = target;
                        eventObject.eventHandler = eventHandler;
                        eventObject.preventDefault = preventDefault;
                        this._eventHandlers.push(eventObject);
                    }

                }

            } else {
                var existingEvent = this._eventHandlers.filter(function (d) {
                    return d._event === _event && d.eventTarget === eventTarget;
                });

                //If event exists for the eventTarget, change the event handler
                //Else create add a new event handler
                if (existingEvent.length > 0) {
                    existingEvent[0].eventHandler = eventHandler;
                    existingEvent[0].preventDefault = preventDefault;
                } else {
                    var eventObject = {};
                    eventObject._event = _event;
                    eventObject.eventTarget = eventTarget;
                    eventObject.eventHandler = eventHandler;
                    eventObject.preventDefault = preventDefault;
                    this._eventHandlers.push(eventObject);
                }
            }

        };

        //Special Events -- Used to attach events after chart has been drawn 
        //Event Target is Unique Id
        this.registerEvent = function (_event, eventTarget, eventHandler, preventDefault) {
            this.events.registerSingleEvent(_event, eventTarget, eventHandler, preventDefault);
        }
        //Render chart with all options
        //Create new instance for new chart and triggers draw
        //if chartType is same triggers redraw
        this.render = function (data) {
            // if(this.chartOptions.overlap)
            // 	this.oData=data;
            // else
            if (data)
                this.data = data;

            this.color = [];

            var colorIndex = 0,
                brightnessIndex = 1;

            for (var i = 0; i < this.data.series.length; i++) {
                if (this.data.series[i].color && this.data.series[i].color !== null && this.data.series[i].color !== '') {
                    this.color.push(this.data.series[i].color);
                    colorIndex++;
                } else {
                    if (this.chartOptions.defaultColors[colorIndex]) {
                        this.color.push(this.chartOptions.defaultColors[colorIndex]);
                    } else {
                        var reIndex = colorIndex - this.chartOptions.defaultColors.length;
                        if (reIndex > this.chartOptions.defaultColors.length) {
                            colorIndex = this.chartOptions.defaultColors.length;
                            brightnessIndex++;
                        }
                        this.color.push(d3.rgb(this.chartOptions.defaultColors[reIndex]).darker(brightnessIndex));
                    }
                    colorIndex++;
                }
            }


            var chartObject = this.utility.checkChart(this.renderedChart, this.color, this.renderContainerId, this.chartOptions);


            if (chartObject === this.renderedChart && this.chartType === this.chartOptions.chartType) {
                this.renderedChart.redraw(this.data, this._eventHandlers);
            } else {
                var el = document.querySelector('#' + this.renderContainerId + '_select');
                if (el && el.parentElement) {
                    el.parentElement.removeChild(el);
                }
                this.renderedChart = chartObject;
                this.chartType = this.chartOptions.chartType;
                this.renderedChart.draw(this.data, this._eventHandlers);
            }

            this.renderedChart.dispatch.on('RenderComplete.redraw' + this.renderContainerId, function (that) {
                if (that.renderContainerId === this.renderContainerId) {
                    this.events.addDefaultEventBehaviour(this.renderContainerId);
                    this.events.registerEventHandler(this._eventHandlers, this.renderContainerId);
                }
            }.bind(this));
        }

        //Draws overlap series
        //Used for cascade filter
        this.renderOverlap = function (data) {
            this.oData = data;
            this.renderedChart.drawOverlap(this.oData, this.data);
        }

        this.removeOverlap = function () {
            this.renderedChart.removeOverlap(this.data);
        }
        //To set options for the chart
        //Add keys from chartOptions
        this.setOptions = function (chartOptions) {
            if (typeof chartOptions.overlap !== 'undefined' && chartOptions.overlap !== "" && chartOptions.overlap !== null)
                this.chartOptions.overlap = chartOptions.overlap;
            if (typeof chartOptions.noOfPieSlices !== 'undefined' && chartOptions.noOfPieSlices !== "" && chartOptions.noOfPieSlices !== null)
                this.chartOptions.noOfPieSlices = chartOptions.noOfPieSlices;
            if (typeof chartOptions.chartClientId !== 'undefined' && chartOptions.chartClientId !== "" && chartOptions.chartClientId !== null)
                this.chartOptions.chartClientId = chartOptions.chartClientId;
            if (typeof chartOptions.drillMap !== 'undefined' && chartOptions.drillMap !== "" && chartOptions.drillMap !== null)
                this.chartOptions.drillMap = chartOptions.drillMap;
            if (typeof chartOptions.zoomLevel !== 'undefined' && chartOptions.zoomLevel !== "" && chartOptions.zoomLevel !== null)
                this.chartOptions.zoomLevel = chartOptions.zoomLevel;
            if (typeof chartOptions.gaugeConfiguration !== 'undefined' && chartOptions.gaugeConfiguration !== "" && chartOptions.gaugeConfiguration !== null)
                this.chartOptions.gaugeConfiguration = chartOptions.gaugeConfiguration;
            if (typeof chartOptions.margin !== 'undefined' && chartOptions.margin !== "" && chartOptions.margin !== null)
                this.chartOptions.margin = chartOptions.margin;
            if (typeof chartOptions.chartType !== 'undefined' && chartOptions.chartType !== "" && chartOptions.chartType !== null)
                this.chartOptions.chartType = chartOptions.chartType;
            if (typeof chartOptions.defaultColors !== 'undefined' && chartOptions.defaultColors !== "" && chartOptions.defaultColors !== null)
                this.chartOptions.defaultColors = chartOptions.defaultColors;
            if (typeof chartOptions.zoomLevel !== 'undefined' && chartOptions.zoomLevel !== "" && chartOptions.zoomLevel !== null)
                this.chartOptions.zoomLevel = chartOptions.zoomLevel;
            if (typeof chartOptions.axisRedrawThreshold !== 'undefined' && chartOptions.axisRedrawThreshold !== "" && chartOptions.axisRedrawThreshold !== null)
                this.chartOptions.axisRedrawThreshold = chartOptions.axisRedrawThreshold;
            if (typeof chartOptions.targetDragEnd !== 'undefined' && chartOptions.targetDragEnd !== "" && chartOptions.targetDragEnd !== null)
                this.chartOptions.targetDragEnd = chartOptions.targetDragEnd;
            if (typeof chartOptions.updateTargetSentiment !== 'undefined' && chartOptions.updateTargetSentiment !== "" && chartOptions.updateTargetSentiment !== null)
                this.chartOptions.updateTargetSentiment = chartOptions.updateTargetSentiment;
            if (typeof chartOptions.deleteTarget !== 'undefined' && chartOptions.deleteTarget !== "" && chartOptions.deleteTarget !== null)
                this.chartOptions.deleteTarget = chartOptions.deleteTarget;
            if (typeof chartOptions.showMedian !== 'undefined' && chartOptions.showMedian !== "" && chartOptions.showMedian !== null)
                this.chartOptions.showMedian = chartOptions.showMedian;
            if (typeof chartOptions.tooltip !== 'undefined' && chartOptions.tooltip !== "" && chartOptions.tooltip !== null)
                this.chartOptions.tooltip = chartOptions.tooltip;
            if (typeof chartOptions.brush !== 'undefined' && chartOptions.brush !== "" && chartOptions.brush !== null)
                this.chartOptions.brush = chartOptions.brush;
            if (typeof chartOptions.seriesLabel !== 'undefined' && chartOptions.seriesLabel !== "" && chartOptions.seriesLabel !== null)
                this.chartOptions.seriesLabel = chartOptions.seriesLabel;

            //set true for panning grouped column
            // if (typeof chartOptions.panning !== 'undefined' && chartOptions.panning !== "" && chartOptions.panning !== null)
            //     this.chartOptions.panning = chartOptions.panning;
        };
    };

    // End xChart.chart
    //Start of Events
    xChart.events = function () {
        this.addDefaultEventBehaviour = function (renderContainerId) {
            var svg = d3.select('#' + renderContainerId + '_svg');

            //Default behaviour for the chart items
            //Can be switched off from chartOptions or while registering custom events

            /***************************************************Event Behaviours**********************************************************/

            //Bar
            var bars = svg.selectAll('.bar');
            var barColor = '';
            if (typeof bars[0] != 'undefined')
                bars[0].forEach(function (d) {
                    d3.select(d).on('click', function () {
                        var currentElement = d3.select(this);
                        if (d3.event.ctrlKey) {
                            bars[0].forEach(function (e) {
                                if (d3.select(e).style('opacity') === '1' && d3.select(e).attr("filter") !== "url(" + window.location.href + "#" + renderContainerId + "dropshadow)") {
                                    d3.select(e).attr('filter', '');
                                    d3.select(e).style('opacity', '0.5');
                                }
                            });
                            if (currentElement.attr("filter") !== "url(" + window.location.href + "#" + renderContainerId + "dropshadow)" && currentElement.style('opacity') !== '1') {
                                currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                                currentElement.style('opacity', '1');
                            } else {
                                currentElement.attr("filter", "");
                                currentElement.style('opacity', '0.5');
                            }
                        } else {
                            bars[0].forEach(function (e) {
                                d3.select(e).attr('filter', '');
                                d3.select(e).style('opacity', '0.5');
                            });
                            currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                            currentElement.style('opacity', '1');
                        }
                    });

                    d3.select(d).on('mouseover', function () {
                        barColor = d3.select(this).style("fill");
                        var bright_color = d3.rgb(barColor).brighter(1);
                        d3.select(this).style("fill", bright_color);
                    });


                    d3.select(d).on('mouseout', function () {
                        if (barColor === '')
                            d3.select(this).style("fill", this.style.fill);
                        else
                            d3.select(this).style("fill", barColor);
                    });
                });

            //Pie
            var slices = svg.selectAll('.pie');
            var sliceColor = '';
            if (typeof slices[0] != 'undefined')
                slices[0].forEach(function (d) {
                    d3.select(d).on('click', function () {
                        var currentElement = d3.select(this);
                        if (d3.event.ctrlKey) {
                            slices[0].forEach(function (e) {
                                if (d3.select(e).style('opacity') === '1' && d3.select(e).attr("filter") !== "url(" + window.location.href + "#" + renderContainerId + "dropshadow)") {
                                    d3.select(e).attr('filter', '');
                                    d3.select(e).style('opacity', '0.5');
                                }
                            });
                            if (currentElement.attr("filter") !== "url(" + window.location.href + "#" + renderContainerId + "dropshadow)" && currentElement.style('opacity') !== '1') {
                                currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                                currentElement.style('opacity', '1');
                            } else {
                                currentElement.attr("filter", "");
                                currentElement.style('opacity', '0.5');
                            }
                        } else {
                            slices[0].forEach(function (e) {
                                d3.select(e).attr('filter', '');
                                d3.select(e).style('opacity', '0.5');
                            });
                            currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                            currentElement.style('opacity', '1');
                        }
                    });

                    d3.select(d).on('mouseover', function () {
                        sliceColor = d3.select(this).style("fill");
                        var bright_color = d3.rgb(sliceColor).brighter(1);
                        d3.select(this).style("fill", bright_color);
                    });


                    d3.select(d).on('mouseout', function () {
                        if (sliceColor === '')
                            d3.select(this).style("fill", this.style.fill);
                        else
                            d3.select(this).style("fill", sliceColor);
                    });
                })


            //Bubble
            var bubbles = svg.selectAll('.bubble');
            var bubbleColor = '';
            if (typeof bubbles[0] != 'undefined')
                bubbles[0].forEach(function (d) {
                    d3.select(d).on('click', function () {
                        var currentElement = d3.select(this);
                        if (d3.event.ctrlKey) {
                            bubbles[0].forEach(function (e) {
                                if (d3.select(e).style('opacity') === '1' && d3.select(e).attr("filter") !== "url(" + window.location.href + "#" + renderContainerId + "dropshadow)") {
                                    d3.select(e).attr('filter', '');
                                    d3.select(e).style('opacity', '0.5');
                                }
                            });
                            if (currentElement.attr("filter") !== "url(" + window.location.href + "#" + renderContainerId + "dropshadow)" && currentElement.style('opacity') !== '1') {
                                currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                                currentElement.style('opacity', '1');
                            } else {
                                currentElement.attr("filter", "");
                                currentElement.style('opacity', '0.5');
                            }
                        } else {
                            bubbles[0].forEach(function (e) {
                                d3.select(e).attr('filter', '');
                                d3.select(e).style('opacity', '0.5');
                            });
                            currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                            currentElement.style('opacity', '1');
                        }
                    });

                    d3.select(d).on('mouseover', function () {
                        bubbleColor = d3.select(this).style("fill");
                        var bright_color = d3.rgb(bubbleColor).brighter(1);
                        d3.select(this).style("fill", bright_color);
                    });


                    d3.select(d).on('mouseout', function () {
                        if (bubbleColor === '')
                            d3.select(this).style("fill", this.style.fill);
                        else
                            d3.select(this).style("fill", bubbleColor);
                    });
                })

            //mapCircle
            var mapCircles = svg.selectAll('.mapCircle');
            var mapCircleColor = '';
            if (typeof mapCircles[0] != 'undefined')
                mapCircles[0].forEach(function (d) {
                    d3.select(d).on('click', function () {
                        var currentElement = d3.select(this);
                        if (d3.event.ctrlKey) {
                            mapCircles[0].forEach(function (e) {
                                if (d3.select(e).style('opacity') === '1') {
                                    //d3.select(e).attr('filter', '');
                                    d3.select(e).style('opacity', '0.5');
                                }
                            });
                            if (currentElement.style('opacity') !== '1') {
                                // currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                                currentElement.style('opacity', '1');
                            } else {
                                //currentElement.attr("filter", "");
                                currentElement.style('opacity', '0.5');
                            }
                        } else {
                            mapCircles[0].forEach(function (e) {
                                //d3.select(e).attr('filter', '');
                                d3.select(e).style('opacity', '0.5');
                            });
                            //currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                            currentElement.style('opacity', '1');
                        }

                        d3.select(d).on('mouseover', function () {
                            mapCircleColor = d3.select(this).style("fill");
                            var bright_color = d3.rgb(barColor).brighter(1);
                            d3.select(this).style("fill", bright_color);
                        });


                        d3.select(d).on('mouseout', function () {
                            if (mapCircleColor === '')
                                d3.select(this).style("fill", this.style.fill);
                            else
                                d3.select(this).style("fill", mapCircleColor);
                        });
                    });
                });



            //Legend
            var legends = svg.selectAll('.legend');
            var legendColor = '';
            if (typeof legends[0] != 'undefined')
                legends[0].forEach(function (d) {
                    d3.select(d).on('click', function () {
                        var currentElement = d3.select(this);
                        legendColor = currentElement.style('fill');
                        if (currentElement.attr('filter') === '' || currentElement.attr('filter') === null) {
                            currentElement.attr("filter", "url(" + window.location.href + "#" + renderContainerId + "dropshadow)");
                        } else {
                            currentElement.attr("filter", "");
                        }
                    });
                });


            //ChartArea
            svg.on('click', function () {
                if (typeof bars[0] != 'undefined')
                    bars[0].forEach(function (d) {
                        if (d3.select(d3.event.target).attr('class').indexOf('bar') === -1 && d3.select(d3.event.target).attr('class').indexOf("legend") === -1) {
                            d3.select(d).attr('filter', '');
                            d3.select(d).style('opacity', '1');
                        }
                    });

                slices[0].forEach(function (d) {
                    if (typeof slices[0] != 'undefined')
                        if (d3.select(d3.event.target).attr('class').indexOf('pie') === -1 && d3.select(d3.event.target).attr('class').indexOf("legend") === -1) {
                            d3.select(d).attr('filter', '');
                            d3.select(d).style('opacity', '1');
                        }
                });

                bubbles[0].forEach(function (d) {
                    if (typeof bubbles[0] != 'undefined')
                        if (d3.select(d3.event.target).attr('class').indexOf('bubble') === -1 && d3.select(d3.event.target).attr('class').indexOf("legend") === -1) {
                            d3.select(d).attr('filter', '');
                            d3.select(d).style('opacity', '1');
                        }
                });
                mapCircles[0].forEach(function (d) {
                    if (typeof mapCircles[0] != 'undefined')
                        if (d3.select(d3.event.target).attr('class').indexOf('mapCircle') === -1 && d3.select(d3.event.target).attr('class').indexOf("legend") === -1) {
                            //d3.select(d).attr('filter', '');
                            d3.select(d).style('opacity', '1');
                        }
                });
            });
        }
        //Each event handler attached to the respective objects

        this.registerEventHandler = function (eventList, renderContainerId) {
            var container = d3.select('#' + renderContainerId);
            eventList.forEach(function (d) {
                var eventTarget = container.selectAll(d.eventTarget);
                if (eventTarget && typeof eventTarget[0] != 'undefined') {
                    eventTarget[0].forEach(function (e) {
                        if (d.preventDefault) {
                            d3.select(e).on(d._event, null);
                        }
                        e.addEventListener(d._event, function (event) {
                            event.srcElement = event.srcElement || event.currentTarget;
                            d.eventHandler.call(this, event);
                        });
                    });
                }
            });
        };


        //For events attached to a single element in the graph
        //Custom event listener explicitly attached by the user
        this.registerSingleEvent = function (_event, eventTarget, eventHandler, preventDefault) {
            var eTarget = d3.select(eventTarget)[0][0];
            if (preventDefault)
                eTarget.on(_event, null);

            eTarget.addEventListener(_event, function () {
                eventHandler();
            });
        };
    };
    //End of Events
    //Start of xChart.axis...

    xChart.axis = function (renderContainerId, width, height) {

        this.renderContainerId = renderContainerId;
        this.width = width;
        this.height = height;
        this.utility = new xChart.utility();
        this.scaleType = '';

        this.axisOptions = {
            ticks: '',
            fontSize: 10,
            axisColor: '#000',
            tickColor: '#000',
            tickSize: '',
            tickFormat: '',
            orient: 'left',
            position: 'vertical', //Vertical Or Horizontal
            showPath: true,
            axisText: '',
            calculate: '',
            //panning: ''
        }
        //Takes a category and returns an ordinal(qualitative) scale with direction

        this.addQualitativeScale = function (categories, innerPadding, outerPadding) {
            this.categories = categories;

            var values = this.categories.map(function (d) {
                return d.value;
            });

            var scale = '';
            if (this.axisOptions.position === 'horizontal') {
                scale = d3.scale.ordinal()
                    .domain(values)
                    .rangeRoundBands([0, this.width], innerPadding, outerPadding);
            } else {
                scale = d3.scale.ordinal()
                    .domain(values)
                    .rangeRoundBands([0, this.height], innerPadding, outerPadding);
            }

            this.scale = scale;
            this.scaleType = 'qualitative';
            return this.scale;
        }
        //Takes a category and returns an linear(quantitative) scale with direction
        //aec:axisExtrapolationCoefficient

        this.addQuantitativeScale = function (series, aec, rangeMin, rangeMax, domainMin, domainMax) {

            if (this.axisOptions.calculate !== 'auto') {
                if ((typeof domainMin === 'undefined' && typeof domainMax === 'undefined') &&
                    (typeof rangeMin === 'undefined' && typeof rangeMax === 'undefined')) {
                    console.log('Invalid Arguments.Specify domain and range when calculate is not set to auto');
                    return;
                }
            }

            if (!aec)
                aec = 0;

            this.series = series;

            var scale = '';

            if (this.axisOptions.calculate === 'auto') {
                if (this.axisOptions.position === 'vertical') {
                    scale = d3.scale.linear().range([height, 0]);

                    var maxY = d3.max(series, function (d) {
                        return d3.max(d.data);
                    });

                    scale.domain([0, maxY + aec * maxY]);
                } else {
                    scale = d3.scale.linear().range([width, 0]);

                    var maxX = d3.max(series, function (d) {
                        return d3.max(d.data);
                    });

                    scale.domain([0, maxX + aec * maxX]);
                }
            } else if (this.axisOptions.calculate !== 'auto') {

                scale = d3.scale.linear();

                if (typeof rangeMin !== 'undefined' && typeof rangeMax !== 'undefined')
                    scale.range([rangeMax, rangeMin])

                if (typeof domainMin !== 'undefined' && typeof domainMax !== 'undefined')
                    scale.domain([domainMin, domainMax + aec * domainMax]);
            }


            this.scale = scale;

            this.scaleType = 'quantitative';

            return this.scale;
        }
        //Axis Drawing

        this.draw = function (scale, drawPosition, axisId, axisLabelOverlap) {
            var svg = d3.select('#' + this.renderContainerId + "_mainGroup");
            //To use the helper utility functions
            var utility = this.utility;
            var axis = '';
            if (this.axisOptions.position === 'horizontal' && this.scaleType === 'qualitative') {

                if (!axisId) {
                    axisId = this.renderContainerId + "_xaxis";
                }

                var categories = this.categories;

                svg.select("#" + axisId).remove();

                var xAxis = d3.svg.axis()
                    .scale(scale)
                    .orient(this.axisOptions.orient);

                /*if (this.axisOptions.panning) {
                    svg.select('.panningxAxis').remove();
                    svg = svg.append('svg')
                        .attr('class', 'panningxAxis')
                        .attr('id', 'panningXAxis');
                }*/


                axis = svg.append("g")
                    .attr("class", "x axis")
                    .attr("id", axisId)
                    .call(xAxis);

                if (drawPosition) {
                    axis.attr("transform",
                        "translate(" + drawPosition.x + "," + drawPosition.y + ")");
                }

                var ticks = axis
                    .selectAll('text')
                    .text(function (d, i) {
                        return categories[i].name;
                    });

                //axisLabelOverlap = utility.draw_xAxisDummy(svg, categories, this.height, this.width, this.renderContainerId);

                if (axisLabelOverlap) {
                    ticks
                        .attr("y", 0)
                        .attr("x", 9)
                        .attr("dy", ".35em")
                        .attr("transform", "rotate(90)")
                        .style("text-anchor", "start");
                    utility.checkOverlapAndRemove(ticks);
                } else {
                    ticks.call(utility.wrap, scale.rangeBand(), 'horizontal');
                    utility.checkOverlapAndRemove(ticks);
                }

                utility.tooltip(ticks, '#' + axisId + ' .tick', false, false);

            } else if (this.axisOptions.position === 'vertical' && this.scaleType === 'qualitative') {

                if (!axisId) {
                    axisId = this.renderContainerId + "_yaxis";
                }

                var categories = this.categories;

                svg.select("#" + axisId).remove();

                var yAxis = d3.svg.axis()
                    .scale(scale)
                    .orient(this.axisOptions.orient);

                axis = svg.append("g")
                    .attr("class", "y axis")
                    .attr("id", axisId)
                    .call(yAxis);

                var ticks = axis
                    .selectAll('text')
                    .text(function (d, i) {
                        return categories[i].name;
                    })
                    .call(utility.wrap, scale.rangeBand(), 'vertical');

                utility.checkOverlapAndRemove(ticks, this.axisOptions.position);
                utility.tooltip(ticks, '#' + axisId + ' .tick', false, false);


                // //To Add YAxis Label and postion label with rotation


                // if (typeof(this.axisOptions.yAxisLabel) !== "undefined" && this.axisOptions.yAxisLabel !== null && this.axisOptions.yAxisLabel !== '') {
                // 	yAxisGrp
                // 		.append("text")
                // 		.attr("y", 15)
                // 		.attr("x", -15)
                // 		.style("text-anchor", "end")
                // 		.attr("transform", "rotate(-90)")
                // 		.attr('class', 'chartLabel')
                // 		.text(this.axisOptions.yAxisLabel)
                // }

            } else if (this.axisOptions.position === 'horizontal' && this.scaleType === 'quantitative') {

                if (!axisId) {
                    axisId = this.renderContainerId + "_xaxis";
                }

                //svg.select("#" + axisId).remove();

                var xAxis = d3.svg.axis()
                    .scale(scale)
                    .orient(this.axisOptions.orient);

                if (this.axisOptions.ticks !== '')
                    xAxis.ticks(this.axisOptions.ticks);
                if (this.axisOptions.tickSize !== '')
                    xAxis.tickSize(-this.axisOptions.tickSize, 0, 0);
                if (this.axisOptions.tickFormat !== '')
                    xAxis.tickFormat(this.axisOptions.tickFormat);

                if (!svg.select('#' + axisId)[0][0])
                    axis = svg.append("g")
                        .attr("class", "x axis")
                        .attr("id", axisId)
                        .call(xAxis);
                else
                    axis = svg.select('#' + axisId)
                        .transition()
                        .duration(1000)
                        .ease("bounce")
                        .call(xAxis);

                if (drawPosition) {
                    axis.attr("transform",
                        "translate(" + drawPosition.x + "," + drawPosition.y + ")");
                }

                if (!this.axisOptions.showPath)
                    svg.select('.x.axis path').style('display', 'none');

            } else if (this.axisOptions.position === 'vertical' && this.scaleType === 'quantitative') {

                if (!axisId) {
                    axisId = this.renderContainerId + "_yaxis";
                }

                //svg.select("#" + axisId).remove();

                var yAxis = d3.svg.axis()
                    .scale(scale)
                    .orient(this.axisOptions.orient);

                if (this.axisOptions.ticks !== '')
                    yAxis.ticks(this.axisOptions.ticks);
                if (this.axisOptions.tickSize !== '')
                    yAxis.tickSize(-this.axisOptions.tickSize, 0, 0);
                if (this.axisOptions.tickFormat !== '')
                    yAxis.tickFormat(this.axisOptions.tickFormat);

                if (!svg.select('#' + axisId)[0][0])
                    axis = svg.append("g")
                        .attr("class", "y axis")
                        .attr("id", axisId)
                        .call(yAxis);
                else
                    axis = svg.select('#' + axisId)
                        .transition()
                        .duration(1000)
                        .ease("bounce")
                        .call(yAxis);

                if (drawPosition) {
                    axis.attr("transform",
                        "translate(" + drawPosition.x + "," + drawPosition.y + ")");
                }

                if (!this.axisOptions.showPath)
                    svg.select('.y.axis path').style('display', 'none');

                //To Add YAxis Label and postion label with rotation


                // if (typeof(this.axisOptions.yAxisLabel) !== "undefined" && this.axisOptions.yAxisLabel !== null && this.axisOptions.yAxisLabel !== '') {
                // 	axis
                // 		.append("text")
                // 		.attr("y", 5)
                // 		.attr("x", -10)
                // 		.style("text-anchor", "end")
                // 		.attr("transform", "rotate(-90)")
                // 		.attr('class', 'chartLabel')
                // 		.text(this.axisOptions.yAxisLabel)
                // }

            }

            return axis;
        }
        // set option

        this.setOptions = function (axisOptions) {

            if (axisOptions.ticks)
                this.axisOptions.ticks = axisOptions.ticks;
            if (axisOptions.fontSize)
                this.axisOptions.fontSize = axisOptions.fontSize;
            if (axisOptions.axisColor)
                this.axisOptions.axisColor = axisOptions.axisColor;
            if (axisOptions.tickColor)
                this.axisOptions.tickColor = axisOptions.tickColor;
            if (axisOptions.tickSize)
                this.axisOptions.tickSize = axisOptions.tickSize;
            if (axisOptions.tickFormat)
                this.axisOptions.tickFormat = axisOptions.tickFormat;
            if (axisOptions.orient)
                this.axisOptions.orient = axisOptions.orient;
            if (axisOptions.position)
                this.axisOptions.position = axisOptions.position;

            this.axisOptions.showPath = axisOptions.showPath;

            if (axisOptions.axisText)
                this.axisOptions.axisText = axisOptions.axisText;

            // set true for panning in grouped column chart
            // if (axisOptions.panning)
            // 	this.axisOptions.panning = axisOptions.panning;

            if (axisOptions.calculate)
                this.axisOptions.calculate = axisOptions.calculate;
        }
    };

    //End of xChart.axis
    //Start of Legend
    xChart.legend = function (series, color) {

        this.series = series;
        this.color = color;
        this.utility = new xChart.utility();

        this.legendOptions = {
			/*Future Properties
				Drop Box Hover Text....tooltip
				Left and Bottom position support
				Paging Support for each legend position---Future and Present supported
			*/
            shape: 'rect', //Rect or Circle
            position: 'top', //Supported right and top
            size: 10,
            font: 'sans-serif',
            fontSize: 10,
            stroke: true,
            strokeColorCoefficient: 0.5, //Darkness parameter for stroke to outline the fill color
            fill: true
        };
        //Drawing Legends with various position parameters

        this.drawLegend = function (position, svg, width, margin) {

            var legendWidth = this.legendOptions.size;
            var font = this.legendOptions.font;
            var fontSize = this.legendOptions.fontSize;
            var series = this.series;
            var color = this.color
            var seriesNames = [];
            // Shortening the legend length to 30 characters
            series.forEach(function (d, i) {
                if (d.name.length > 30) {
                    seriesNames.push(d.name.substring(0, 26).concat('...'));
                } else
                    seriesNames.push(d.name);
            })
            if (position === 'top') {
                var legendCount = series.length;

                svg.selectAll('.legendg').remove();

                var legend = svg.selectAll(".legend")
                    .data(series)
                    .enter().append("g")
                    .attr('class', 'legendg')
                    .attr("transform", function (d, i) {
                        return "translate(" + i * (width / legendCount) + ",-" + margin.top / 2 + ")";
                    });

                legend.append("rect")
                    .attr("x", 45)
                    .attr("width", legendWidth)
                    .attr("height", legendWidth)
                    .attr("class", "legend")

                legend.append("text")
                    .attr("x", 60)
                    .attr("y", 6)
                    .attr("dy", ".35em")
                    .style("text-anchor", "start")
                    .style("font", fontSize + 'px ' + font)
                    .text(function (d, i) {
                        return seriesNames[i];
                    });

                var totalTextWidth = 0;

                var textWidth = [];

                svg.selectAll('.legendg text').forEach(function (c) {
                    c.forEach(function (d, i) {
                        if (!d.offsetWidth)
                            d.offsetWidth = d.getBoundingClientRect().width;
                        totalTextWidth += d.offsetWidth;
                        textWidth[i] = d.offsetWidth;
                    })
                })

                svg.selectAll('.legendg').remove();

                var totalLegendWidth, dx, xPosition, yPosition;

                totalLegendWidth = totalTextWidth + (legendCount * legendWidth) + (35 * legendCount);

                dx = totalLegendWidth - (width + margin.left + margin.right);

                var recCallCount = 0;

                function drawLegend(xPosition, yPosition, startLegendIdx, endLegendIdx, recCallCount) {
                    var legend = svg.selectAll(".legend" + recCallCount)
                        .data(function () {
                            var legendArr = [];
                            for (var i = startLegendIdx; i < endLegendIdx + 1; i++) {
                                legendArr.push(series[i]);
                            }
                            return legendArr;
                        })
                        .enter()
                        .append("g")
                        .attr('class', 'legendg ' + 'legendg' + recCallCount)
                        .attr("transform", function (d, i) {
                            var prevTextWidth = 0,
                                j = i + startLegendIdx - 1;
                            while (j >= startLegendIdx) {
                                prevTextWidth += textWidth[j];
                                j--;
                            }
                            return "translate(" + (xPosition + (40 * i) + prevTextWidth) + "," + (-1 * yPosition) + ")";
                        });

                    legend.append("rect")
                        .attr("x", 45)
                        .attr("width", legendWidth)
                        .attr("height", legendWidth)
                        .attr("class", "legend legend" + recCallCount)
                        .style("fill", function (d, i) {
                            return color[i + startLegendIdx];
                        })

                    legend.append("text")
                        .attr("x", 60)
                        .attr("y", 6)
                        .attr("dy", ".35em")
                        .style("text-anchor", "start")
                        .style("font", fontSize + 'px ' + font)
                        .text(function (d, i) {
                            return seriesNames[i + startLegendIdx];
                        });
                }

                //If legend does not exceeds width

                if (dx <= 0) {
                    xPosition = width - margin.left - margin.right - totalLegendWidth;
                    yPosition = margin.top - 5;
                    drawLegend(xPosition, yPosition, 0, legendCount - 1, recCallCount);
                }

                //If legend exceeds width
                else {
                    legendLengthExceed(0, legendCount - 1);
                }

                function legendLengthExceed(firstIdx, lastIdx) {

                    var cumLegendWidth = 0,
                        threshold = 0;

                    for (var i = firstIdx; i < lastIdx + 1; i++) {

                        cumLegendWidth += textWidth[i] + legendWidth + 40;
                        var cumLegWidth = cumLegendWidth;

                        if (cumLegendWidth > (width + margin.left)) {
                            threshold = i - 1;
                            cumLegendWidth -= textWidth[i] + legendWidth + 40;
                            if (recCallCount == 0) {
                                xPosition = -margin.left;
                            }
                            yPosition = (margin.top - 5) - (15 * recCallCount);
                            drawLegend(xPosition, yPosition, firstIdx, threshold, recCallCount);
                            recCallCount++;
                            break;
                        }
                    }

                    if (cumLegWidth < (width + margin.left)) {
                        // xPosition=width - cumLegendWidth - margin.left;
                        yPosition = (margin.top - 5) - (15 * recCallCount);
                        drawLegend(xPosition, yPosition, firstIdx, lastIdx, recCallCount);
                        return;
                    }
                    legendLengthExceed(threshold + 1, lastIdx);
                }
                this.utility.tooltip(svg, '.legend', false, false);
                return recCallCount;
            } else if (position == 'right') {

            }
            // left:{
            //  //To be implemented
            // },
            // bottom:{
            //  //To be implemented
            // }

        }
        //Set Options for overriding legend properties

        this.setOptions = function (legendOptions) {

            if (legendOptions.shape)
                this.legendOptions.shape = legendOptions.shape;
            if (legendOptions.position)
                this.legendOptions.position = legendOptions.position;
            if (legendOptions.stroke)
                this.legendOptions.stroke = legendOptions.stroke;
            if (legendOptions.strokeColorCoefficient)
                this.legendOptions.strokeColorCoefficient = legendOptions.strokeColorCoefficient;
            if (legendOptions.fill)
                this.legendOptions.fill = legendOptions.fill;
        }
    };
    //End of Legend
    //Area Chart
    //PI.xChart\src\js\plots\area.js
    xChart.area = (function () {
        function area(renderContainerId, color, chartOptions) {

            //Information stored here will persist
            this.renderContainerId = renderContainerId;
            this.canvasWidth = document.getElementById(this.renderContainerId).offsetWidth;
            this.canvasHeight = document.getElementById(this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.color = color;
            //To use the helper utility functions
            this.utility = new xChart.utility();
            this.chartOptions = chartOptions;
        };

        // xChart.area's prototype properties.
        area.prototype.dispatch = d3.dispatch('RenderComplete');

        area.prototype.draw = function (data) {

            var color = this.color;
            var el = document.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);

            var chartOptions = this.chartOptions;
            var width = this.canvasWidth - this.margin.left - this.margin.right,
                height = this.canvasHeight - this.margin.top - this.margin.bottom;

            var svg = d3.select("#" + this.renderContainerId).append("svg")
                .attr("id", this.renderContainerId + "_svg")
                .attr("width", width + this.margin.left + this.margin.right)
                .attr("height", height + this.margin.top + this.margin.bottom)
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

            var legend = new xChart.legend(data.series, color);

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
            })

            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new xChart.axis(this.renderContainerId, width, height);

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
            this.seriesAxis = new xChart.axis(this.renderContainerId, width, height);

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

            var area = d3.svg.area()
                .interpolate("linear")
                .x(function (d) {
                    return categoryScale(d.category) + categoryScale.rangeBand() / 2;
                })
                .y0(function (d) {
                    return seriesScale(d.y0);
                })
                .y1(function (d) {
                    return seriesScale(d.y0 + d.y);
                });

            var stack = d3.layout.stack()
                .values(function (d) {
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
                            category: e.name,
                            categoryDimName: e.dimName,
                            categoryName: e.name,
                            categoryValue: e.value,
                            y: d.data[j] / sum
                        }
                    })
                }
            });

            var layerGroup = svg.selectAll(".layerg")
                .data(stack(stackData))
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
                .each('end', function () {
                    for (var i = 0; i < stack(stackData).length; i++) {

                        svg.selectAll('.circle' + i)
                            .data(stack(stackData)[i].values)
                            .enter()
                            .append('circle')
                            .attr('class', 'areacircle circle' + i)
                            .attr('cx', function (d) {
                                return categoryScale(d.category) + categoryScale.rangeBand() / 2;
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
                                    thisobj.dispatch.RenderComplete(thisobj, data, stack(stackData));
                            });
                    }

                    if (chartOptions.tooltip)
                        thisobj.utility.tooltip(svg, '.areacircle', true, false);
                });
        }

        area.prototype.redraw = function (data) {

            var color = this.color;
            var width = this.canvasWidth - this.margin.left - this.margin.right,
                height = this.canvasHeight - this.margin.top - this.margin.bottom;
            var chartOptions = this.chartOptions;
            var svg = d3.select('#' + this.renderContainerId + "_svg");

            var mainGroup = d3.select('#' + this.renderContainerId + "_mainGroup");

            var axisLabelOverlap = this.utility.draw_xAxisDummy(mainGroup, data.categories, height, width, this.renderContainerId);
            if (!axisLabelOverlap && this.bottomMarginSet) {
                this.margin.bottom /= 2;
            }

            var legend = new xChart.legend(data.series, color);

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
            })

            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new xChart.axis(this.renderContainerId, width, height);

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
            this.seriesAxis = new xChart.axis(this.renderContainerId, width, height);

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

            var area = d3.svg.area()
                .interpolate("linear")
                .x(function (d) {
                    return categoryScale(d.category) + categoryScale.rangeBand() / 2;
                })
                .y0(function (d) {
                    return seriesScale(d.y0);
                })
                .y1(function (d) {
                    return seriesScale(d.y0 + d.y);
                });

            var stack = d3.layout.stack()
                .values(function (d) {
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
                            category: e.name,
                            categoryDimName: e.dimName,
                            categoryName: e.name,
                            y: d.data[j] / sum
                        }
                    })
                }
            });

            stackData.forEach(function (d) {
                d.values.forEach(function (x) {
                    if (isNaN(x.y))
                        x.y = 0;
                    x.fmtData = '0';
                });
            });

            var layerGroup = svg.selectAll(".layerg")
                .data(stack(stackData))
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
                .each('end', function () {
                    for (var i = 0; i < stack(stackData).length; i++) {

                        svg.selectAll('.circle' + i)
                            .data(stack(stackData)[i].values)
                            .enter()
                            .append('circle')
                            .attr('class', 'areacircle circle' + i)
                            .attr('cx', function (d) {
                                return categoryScale(d.category) + categoryScale.rangeBand() / 2;
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
                                    thisobj.dispatch.RenderComplete(thisobj, data, stack(stackData));
                            });
                    }
                    if (chartOptions.tooltip)
                        thisobj.utility.tooltip(svg, '.areacircle', true, false);
                });
        }

        area.prototype.drawOverlap = function (data, originalData) {
            var overlappedData = this.utility.overlapDataPrep(data, originalData);
            this.redraw(overlappedData);
        }

        area.prototype.removeOverlap = function (data) {
            this.redraw(data);
        }
        return area;
    })();
    //Bubble Chart
    //PI.xChart\src\js\plots\bubble.js
    xChart.bubble = (function () {
        function bubble(renderContainerId, color, chartOptions) {

            //Information stored here will persist
            this.renderContainerId = renderContainerId;
            this.canvasWidth = document.getElementById(this.renderContainerId).offsetWidth;
            this.canvasHeight = document.getElementById(this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.color = color;

            //To use the helper utility functions
            this.utility = new xChart.utility();
            this.chartOptions = chartOptions;

        };

        // xChart.bubble's prototype properties.

        bubble.prototype.dispatch = d3.dispatch('RenderComplete');

        bubble.prototype.draw = function (data) {

            var margin = this.margin;
            var color = this.color;
            var chartOptions = this.chartOptions;
            var el = document.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);

            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select("#" + this.renderContainerId).append("svg")
                .attr("id", this.renderContainerId + "_svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
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
                return si(val).replace(/G/, 'B')
            };

            var singleMeasure = 0;

            if (data.series.length < 2) {
                data.series[1] = data.series[0];
                singleMeasure = 1;
            }


            //Utility function call to add filter def to svg
            this.utility.addRadialFilter(svg, this.renderContainerId);

            var yScale = d3.scale.linear()
                .range([height, 0]);

            yScale.domain([0, (d3.max(data.series[0].data) + (0.3 * d3.max(data.series[0].data)))]);


            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new xChart.axis(this.renderContainerId, width, height);

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
            this.seriesAxis = new xChart.axis(this.renderContainerId, width, height);

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

            var rScale = d3.scale.linear()
                .range([(0.05 * Math.min(height, width)), (0.15 * Math.min(height, width))])
                .domain([d3.min(data.series[1].data), d3.max(data.series[1].data)]);

            this.rScale = rScale;

            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            mainGroup.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg = mainGroup;

            svg.append("g")
                .attr("transform", "translate(0,0)")
                .append("text")
                .attr('id', this.renderContainerId + '_bubbleDescText')
                .style('font-family', 'sans-serif')
                .style('font-size', '10');

            var text_node = d3.select('#' + this.renderContainerId + '_bubbleDescText');
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

            svg.selectAll('#' + this.renderContainerId + '_bubbleDescText tspan')[0].forEach(function (d) {
                maxTextWidth = d.getBBox().width;
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
                    return categoryScale(d[0].categoryName) + (categoryScale.rangeBand() / 2);
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
                .each('end', function (d) {
                    if (d[0].index === data.categories.length - 1) {
                        this.dispatch.RenderComplete(this, data);
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

        bubble.prototype.redraw = function (data) {

            var margin = this.margin;
            var color = this.color;
            var chartOptions = this.chartOptions;
            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select("#" + this.renderContainerId + '_svg');
            var mainGroup = d3.select('#' + this.renderContainerId + "_mainGroup");


            var axisLabelOverlap = this.utility.draw_xAxisDummy(mainGroup, data.categories, height, width, this.renderContainerId);
            if (!axisLabelOverlap && this.bottomMarginSet) {
                margin.bottom /= 2;
            }

            height = this.canvasHeight - margin.top - margin.bottom;

            var returnArray = [];

            var si = d3.format('.2s');
            var siMod = function (val) {
                return si(val).replace(/G/, 'B')
            };

            var singleMeasure = 0;

            if (data.series.length < 2) {
                data.series[1] = data.series[0];
                singleMeasure = 1;
            }

            var yScale = d3.scale.linear()
                .range([height, 0]);

            yScale.domain([0, (d3.max(data.series[0].data) + (0.3 * d3.max(data.series[0].data)))]);


            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new xChart.axis(this.renderContainerId, width, height);

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
            this.seriesAxis = new xChart.axis(this.renderContainerId, width, height);

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

            var rScale = d3.scale.linear()
                .range([(0.05 * Math.min(height, width)), (0.15 * Math.min(height, width))])
                .domain([d3.min(data.series[1].data), d3.max(data.series[1].data)]);


            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

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
                    return categoryScale(d[0].categoryName) + (categoryScale.rangeBand() / 2);
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
                .each('end', function (d) {
                    if (d[0].index === data.categories.length - 1) {
                        this.dispatch.RenderComplete(this, data);
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

        bubble.prototype.drawOverlap = function (overlappedData, originalData) {
            overlappedData = this.utility.overlapDataPrep(overlappedData, originalData);
            this.redraw(overlappedData);
        }

        bubble.prototype.removeOverlap = function (data) {
            this.redraw(data);
        }
        return bubble;
    })();
    //Gauge Chart
    //PI.xChart\src\js\plots\gauge.js
    xChart.gauge = (function () {
        function gauge(renderContainerId, color, chartOptions) {

            //Information stored here will persist
            this.renderContainerId = renderContainerId;
            this.canvasWidth = document.getElementById(this.renderContainerId).offsetWidth;
            this.canvasHeight = document.getElementById(this.renderContainerId).offsetHeight;
            this.margin = {
                top: 20,
                right: 0,
                bottom: 0,
                left: 20
            };
            this.configuration = chartOptions.gaugeConfiguration;
            this.chartOptions = chartOptions;

        };

        // xChart.gauge's prototype properties.
        gauge.prototype.dispatch = d3.dispatch('RenderComplete');
        gauge.prototype.draw = function (data) {

            var margin = this.margin;
            var renderContainerId = this.renderContainerId;
            var configuration = this.configuration;
            var el = document.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);
            var chartOptions = this.chartOptions;
            var w = this.canvasWidth - this.margin.left - this.margin.right,
                h = this.canvasHeight - this.margin.top - this.margin.bottom;

            var r = Math.min(w, h);

            var config = configuration;

            config.size = r * 0.95;

            config.raduis = (r * 0.95) / 2;
            config.cx = r / 2 + (w - h) / 2;
            config.cy = r / 2 + margin.top;

            config.min = undefined != configuration.min ? configuration.min : 0;
            config.max = undefined != configuration.max ? configuration.max : 100;
            config.range = config.max - config.min;
            config.actualValue = configuration.actualValue;
            config.targetValue = configuration.targetValue;
            config.majorTicks = configuration.majorTicks || 5;
            config.minorTicks = configuration.minorTicks || 2;

            config.greenColor = configuration.greenColor || "#109618";
            config.yellowColor = configuration.yellowColor || "#FF9900";
            config.redColor = configuration.redColor || "#DC3912";

            config.transitionDuration = configuration.transitionDuration || 500;

            var _currentRotation = '';

            var body = d3.select("#" + renderContainerId)
                .append("svg:svg")
                .attr("id", renderContainerId + '_svg')
                .attr("width", this.canvasWidth)
                .attr("height", this.canvasHeight)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "gauge");

            var text_node = body.append('g')
                .attr('transform', "translate(" + 10 + "," + 10 + ")")
                .style('display', 'none')
                .append('text')

                .attr('id', renderContainerId + '_textLabel')
                .style('font-family', 'sans-serif')
                .style('font-size', '12');


            var text_node1 = text_node.append('tspan')
                .text("ACTUAL VALUE : " + config.actualValue)
                .attr('x', 0)
                .attr('y', 0)
                .attr('dy', '0');

            //var text_width = text_node1[0][0].getBBox().width;

            //text_node.append('tspan')
            //.text("||")
            //.attr('x', 0)
            //.attr('y', 0)
            // .attr('dx', text_width+5);

            text_node.append('tspan')
                .text("TARGET VALUE : " + config.targetValue)
                .attr('x', 0)
                .attr('y', 0)
                .attr('dy', 12);


            body.append("svg:circle")
                .attr("cx", config.cx)
                .attr("cy", config.cy)
                .attr("r", config.raduis)
                .style("fill", "#ccc")
                .style("stroke", "#000")
                .style('display', 'none')
                .style("stroke-width", "0.5px");

            body.append("svg:circle")
                .attr("cx", config.cx)
                .attr("cy", config.cy)
                .attr("r", 0.9 * config.raduis)
                .style("fill", "#fff")
                .style("stroke", "#e0e0e0")
                .style("stroke-width", "2px");

            for (var index in config.greenZones) {
                drawBand(config.greenZones[index].from, config.greenZones[index].to, config.greenColor);
            }

            for (var index in config.yellowZones) {
                drawBand(config.yellowZones[index].from, config.yellowZones[index].to, config.yellowColor);
            }

            for (var index in config.redZones) {
                drawBand(config.redZones[index].from, config.redZones[index].to, config.redColor);
            }

            if (undefined != config.label) {
                var fontSize = Math.round(config.size / 9);
                body.append("svg:text")
                    .attr("x", config.cx)
                    .attr("y", config.cy / 2 + 20)
                    .attr("dy", fontSize / 2)
                    .attr("text-anchor", "middle")
                    .text(config.label)
                    .style('display', 'none')
                    .style("font-size", fontSize + "px")
                    .style("fill", "#333")
                    .style("stroke-width", "0px");
            }

            var fontSize = Math.round(config.size / 16);
            var majorDelta = config.range / (config.majorTicks - 1);
            for (var major = config.min; major <= config.max; major += majorDelta) {
                var minorDelta = majorDelta / config.minorTicks;
                for (var minor = major + minorDelta; minor < Math.min(major + majorDelta, config.max); minor += minorDelta) {
                    var point1 = valueToP(minor, 0.75);
                    var point2 = valueToP(minor, 0.85);

                    body.append("svg:line")
                        .attr("x1", point1.x)
                        .attr("y1", point1.y)
                        .attr("x2", point2.x)
                        .attr("y2", point2.y)
                        .style('display', 'none')
                        .style("stroke", "#666")
                        .style("stroke-width", "1px");
                }

                var point1 = valueToP(major, 0.7);
                var point2 = valueToP(major, 0.85);

                body.append("svg:line")
                    .attr("x1", point1.x)
                    .attr("y1", point1.y)
                    .attr("x2", point2.x)
                    .attr("y2", point2.y)
                    .style('display', 'none')
                    .style("stroke", "#333")
                    .style("stroke-width", "2px");

                if (major == config.min || major == config.max) {
                    var point = valueToP(major, 0.63);

                    body.append("svg:text")
                        .attr("x", point.x)
                        .attr("y", point.y)
                        .attr("dy", fontSize / 3)
                        .attr("text-anchor", major == config.min ? "start" : "end")
                        .text(major)
                        .style("font-size", fontSize + "px")
                        .style("fill", "#333")
                        .style("stroke-width", "0px");
                }
            }
            var pointerContainer = body.append("svg:g").attr("class", "pointerContainer");

            var midValue = (config.min + config.max) / 2;

            var pointerPath = buildPointerPath(midValue);

            var pointerLine = d3.svg.line()
                .x(function (d) {
                    return d.x
                })
                .y(function (d) {
                    return d.y
                })
                .interpolate("basis");

            pointerContainer.selectAll("path")
                .data([pointerPath])
                .enter()
                .append("svg:path")
                .attr("d", pointerLine)
                .style("fill", "#03A9F4")
                .style("stroke", "#03A9F4")
                // .style("fill", "#dc3912")
                // .style("stroke", "#c63310")
                .style("fill-opacity", 0.7)

            pointerContainer.append("svg:circle")
                .attr("cx", config.cx)
                .attr("cy", config.cy)
                .attr("r", 0.12 * config.raduis)
                //.style("fill", "#4684EE")
                .style('fill', '#03A9F4')
                //.style("stroke", "#666")
                .style("opacity", 0.7);

            var fontSize = Math.round(config.size / 10);
            pointerContainer.selectAll("text")
                .data([midValue])
                .enter()
                .append("svg:text")

                //.attr("x", config.cx)
                //.attr("y", config.cy / 2 + 20)
                //.attr("dy", fontSize / 2)

                .attr("x", config.cx)
                .attr("y", config.size - config.cy / 4 - fontSize + margin.top)
                .attr("dy", fontSize / 2)
                .attr("text-anchor", "middle")
                .style("font-size", fontSize + "px")
                .style("fill", "#000")
                .style("stroke-width", "0px");

            redraw(config.min, 0);

            redraw(config.actualValue, 1000);

            function buildPointerPath(value) {
                var delta = config.range / 13;

                var head = valueToPoint(value, 0.85);
                var head1 = valueToPoint(value - delta, 0.12);
                var head2 = valueToPoint(value + delta, 0.12);

                var tailValue = value - (config.range * (1 / (270 / 360)) / 2);
                var tail = valueToPoint(tailValue, 0.28);
                var tail1 = valueToPoint(tailValue - delta, 0.12);
                var tail2 = valueToPoint(tailValue + delta, 0.12);

                return [head, head1, tail2, tail, tail1, head2, head];

                function valueToPoint(value, factor) {
                    var point = valueToP(value, factor);
                    point.x -= config.cx;
                    point.y -= config.cy;
                    return point;
                }
            }

            function drawBand(start, end, color) {
                if (0 >= end - start) return;

                body.append("svg:path")
                    .style("fill", color)
                    .style('opacity', '0.5')
                    .attr("d", d3.svg.arc()
                        .startAngle(valueToRadians(start))
                        .endAngle(valueToRadians(end))
                        .innerRadius(0.65 * config.raduis)
                        .outerRadius(0.85 * config.raduis))
                    .attr("transform", function () {
                        return "translate(" + config.cx + ", " + config.cy + ") rotate(270)"
                    });
            }

            function redraw(value, transitionDuration) {
                var pointerContainer = body.select(".pointerContainer");

                pointerContainer.selectAll("text").text(Math.round(value));

                var pointer = pointerContainer.selectAll("path");
                pointer.transition()
                    .duration(undefined != transitionDuration ? transitionDuration : config.transitionDuration)
                    .attrTween("transform", function () {
                        var pointerValue = value;
                        if (value > config.max) pointerValue = config.max + 0.02 * config.range;
                        else if (value < config.min) pointerValue = config.min - 0.02 * config.range;
                        var targetRotation = (valueToDegrees(pointerValue) - 90);
                        var currentRotation = _currentRotation || targetRotation;
                        _currentRotation = targetRotation;

                        return function (step) {
                            var rotation = currentRotation + (targetRotation - currentRotation) * step;
                            return "translate(" + config.cx + ", " + config.cy + ") rotate(" + rotation + ")";
                        }
                    });
            }

            function valueToDegrees(value) {
                return value / config.range * 270 - (config.min / config.range * 270 + 45);
            }

            function valueToRadians(value) {
                return valueToDegrees(value) * Math.PI / 180;
            }

            function valueToP(value, factor) {
                return {
                    x: config.cx - config.raduis * factor * Math.cos(valueToRadians(value)),
                    y: config.cy - config.raduis * factor * Math.sin(valueToRadians(value))
                };
            }
        }

        gauge.prototype.redraw = function (data) {
            this.draw(data);
        }

        gauge.prototype.drawOverlap = function (data, originalData) {
            this.draw(data);
        }

        gauge.prototype.removeOverlap = function (data) {
            this.draw(data);
        }

        return gauge;
    })();
    //Grouped Bar
    //PI.xChart\src\js\plots\groupedBar.js
    xChart.groupedBar = (function () {
        function groupedBar(renderContainerId, color, chartOptions) {

            //Information stored here will persist
            this.chartOptions = chartOptions;
            this.renderContainerId = renderContainerId;
            this.canvasWidth = document.getElementById(this.renderContainerId).offsetWidth;
            this.canvasHeight = document.getElementById(this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.color = color;
            this.margin.left = 80;

            //To use the helper utility functions
            this.utility = new xChart.utility();
        };

        // xChart.groupedBar's prototype properties.

        groupedBar.prototype.dispatch = d3.dispatch('RenderComplete');

        groupedBar.prototype.draw = function (data) {

            var color = this.color;
            var margin = this.margin;
            var chartOptions = this.chartOptions;
            var el = document.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);

            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select("#" + this.renderContainerId).append("svg")
                .attr("id", this.renderContainerId + "_svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr('class', 'groupedBar');

            var mainGroup = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("id", this.renderContainerId + "_mainGroup")
                .attr('class', 'groupedBar');

            var legend = new xChart.legend(data.series, color);

            //Set options for legend here
            // legend.setOptions({});

            var legendRows = legend.drawLegend('top', mainGroup, width, margin) + 1;
            margin.top = 20 * legendRows;
            mainGroup.selectAll('.legendg').remove();

            height = this.canvasHeight - margin.top - margin.bottom;

            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

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
            this.categoryAxis = new xChart.axis(this.renderContainerId, width, height);

            var categoryAxisOptions = {};
            categoryAxisOptions.ticks = 5;
            categoryAxisOptions.orient = 'left';
            categoryAxisOptions.position = 'vertical';


            this.categoryAxis.setOptions(categoryAxisOptions);
            var categoryScale = this.categoryAxis.addQualitativeScale(data.categories, 0.34, 0.2);
            this.yAxis = this.categoryAxis.draw(categoryScale);

            //Series Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.seriesAxis = new xChart.axis(this.renderContainerId, width, height);

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

            var subCategoryScale = d3.scale.ordinal()
                .domain(data.series.map(function (d) {
                    return d.value;
                }))
                .rangeRoundBands([0, categoryScale.rangeBand()]);

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
                    return subCategoryScale.rangeBand() - 2;
                })
                .attr("width", 0)
                .style('fill', function (d, i) {
                    return color[i];
                });

            bars.transition()
                .ease('bounce')
                .duration(1000)
                .attr("width", function (d) {
                    return seriesScale(d.data) <= 2 && seriesScale(d.data) !== 0 ? 2 : seriesScale(d.data);
                })
                .each('end', function (d) {
                    if (d.index === data.categories.length - 1 && d.seriesIndex == data.series.length - 1) {
                        this.dispatch.RenderComplete(this, data);
                    }
                }.bind(this));

            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.bar', true, false);
        }

        groupedBar.prototype.redraw = function (data) {

            this.removeOverlap();
            var color = this.color;
            var margin = this.margin;
            var chartOptions = this.chartOptions;
            var axisRedrawThreshold = chartOptions.axisRedrawThreshold;
            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select("#" + this.renderContainerId + '_svg');
            var mainGroup = d3.select('#' + this.renderContainerId + "_mainGroup");

            var legend = new xChart.legend(data.series, color);
            //Set options for legend here
            // legend.setOptions({});

            var legendRows = legend.drawLegend('top', mainGroup, width, margin) + 1;
            margin.top = 20 * legendRows;
            mainGroup.selectAll('.legendg').remove();

            height = this.canvasHeight - margin.top - margin.bottom;

            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

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
            this.categoryAxis = new xChart.axis(this.renderContainerId, width, height);
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

            var subCategoryScale = d3.scale.ordinal()
                .domain(data.series.map(function (d) {
                    return d.value;
                }))
                .rangeRoundBands([0, categoryScale.rangeBand()]);

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
                .ease('bounce')
                .duration(1000)
                .attr('y', function (d) {
                    return subCategoryScale(d.seriesName);
                })
                .attr('height', function (d) {
                    return subCategoryScale.rangeBand() - 2;
                })
                .attr("width", function (d) {
                    return seriesScale(d.data) <= 2 && seriesScale(d.data) !== 0 ? 2 : seriesScale(d.data);
                })
                .each('end', function (d) {
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
                        return subCategoryScale.rangeBand() - 2;
                    })
                    .style('fill', function (d, i) {
                        return color[i];
                    })
                    .attr("width", function (d) {
                        return seriesScale(d.data) <= 2 && seriesScale(d.data) !== 0 ? 2 : seriesScale(d.data);
                    })
                    .each(function (d) {
                        if (d.index === data.categories.length - 1 && d.seriesIndex == data.series.length - 1) {
                            that.dispatch.RenderComplete(this, data);
                        }
                    }.bind(that));

                if (chartOptions.tooltip)
                    that.utility.tooltip(svg, '.bar', true, false);
            }
        }

        groupedBar.prototype.drawOverlap = function (overlappedData, originaldata) {

            var overlappedData = this.utility.overlapDataPrep(overlappedData, originaldata);
            var subCategoryScale = this.subCategoryScale;
            var seriesScale = this.seriesAxis.scale;
            var categoryScale = this.categoryAxis.scale;
            var chartOptions = this.chartOptions;
            var svg = d3.select('#' + this.renderContainerId + "_mainGroup");

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
                    return subCategoryScale.rangeBand() - 2;
                })
                .style('fill', '#ffC200')
                .style("stroke", 'black')
                .style('stroke-width', '0.3px')
                .attr("width", 0);

            overlappedBars.exit().remove();

            overlappedBars.transition()
                .duration(1000)
                .ease('bounce')
                .attr("width", function (d) {
                    return seriesScale(d.data) <= 1 && seriesScale(d.data) !== 0 ? 1 : seriesScale(d.data);
                });

            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.ObarRect', true, false);
        }

        groupedBar.prototype.removeOverlap = function (data) {

            var seriesScale = this.seriesAxis.scale,
                categoryScale = this.categoryAxis.scale;

            var svg = d3.select('#' + this.renderContainerId + "_mainGroup");
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
                .ease('bounce')
                .attr("width", 0)
                .remove()
                .each('end', function () {
                    // resetting the opacity
                    svg.selectAll('.bar').style('opacity', 1);
                    var outerBars = svg.selectAll(".overlappedBar");
                    outerBars.remove();
                });
        }
        return groupedBar;
    })();
    //GroupedColumn Chart
    //PI.xChart\src\js\plots\groupedColumn.js
    xChart.groupedColumn = (function () {
        function groupedColumn(renderContainerId, color, chartOptions) {

            //Information stored here will persist
            this.chartOptions = chartOptions;
            this.renderContainerId = renderContainerId;
            this.canvasWidth = document.getElementById(this.renderContainerId).offsetWidth;
            this.canvasHeight = document.getElementById(this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.color = color;
            this.axisRedrawThreshold = chartOptions.axisRedrawThreshold;
            this.aec = chartOptions.aec;
            this.overlapDraw = false;

            //To use the helper utility functions
            this.utility = new xChart.utility();
        }

        groupedColumn.prototype.dispatch = d3.dispatch('RenderComplete');

        groupedColumn.prototype.lineDraw = function (seriesForLineChart, data, that) {

            for (var i = 0; i < seriesForLineChart.length; i++)
                if (isNaN(seriesForLineChart[i].series.axis))
                    seriesForLineChart[i].series.axis = 1;
            var chartOptions = that.chartOptions;
            var svg = d3.select("#" + that.renderContainerId + '_mainGroup');
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
                    }
                });

                var line = d3.svg.line()
                    .interpolate("linear")
                    .x(function (d, i) {
                        return categoryScale(d.value) + categoryScale.rangeBand() / 2;
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
                        return categoryScale(d.value) + categoryScale.rangeBand() / 2;
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
                            that.dispatch.RenderComplete(that, data, that.seriesForChart);
                    });
            }

            if (chartOptions.tooltip)
                that.utility.tooltip(svg, '.gCLinecircle', true, false);
        };

        groupedColumn.prototype.draw = function (data) {

            var color = this.color;
            var margin = this.margin;
            var chartOptions = this.chartOptions;
            this.bottomMarginSet = false;
            var seriesScales = [];
            var el = document.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);

            //Adjust margin to accomodate multiple axes
            var left = this.chartOptions.seriesLabel ? 50 : 30,
                right = 10;
            var yAxisCount = 1;
            for (var sIndex = 0; sIndex < data.series.length; ++sIndex) {
                if (data.series[sIndex].axis && data.series[sIndex].axis > 1 && data.series[sIndex].axis > yAxisCount) {
                    yAxisCount++;
                    if (yAxisCount % 2 === 0) {
                        right += 40;
                    } else {
                        left += 40;
                    }
                }
            }

            //Setting appropriate margin attributes
            margin.right = right;
            margin.left = left;

            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select("#" + this.renderContainerId).append("svg")
                .attr("id", this.renderContainerId + "_svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
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

            var legend = new xChart.legend(data.series, color);

            //Set options for legend here
            // legend.setOptions({});

            var legendRows = legend.drawLegend('top', mainGroup, width, margin) + 1;
            margin.top = 20 * legendRows;
            mainGroup.selectAll('.legendg').remove();

            height = this.canvasHeight - margin.top - margin.bottom;

            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

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


            var seriesForLineChart = prepData.seriesForLineChart,
                seriesForChart = prepData.seriesForChart,
                axesGroups = prepData.axesGroups;

            this.seriesForChart = seriesForChart;
            if (seriesForLineChart.length > 0)
                this.seriesForLineChart = seriesForLineChart;
            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new xChart.axis(this.renderContainerId, width, height);

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
            var subCategoryScale = d3.scale.ordinal()
                .domain(seriesForChart.map(function (d) {
                    return d.series.value;
                })).rangeRoundBands([0, categoryScale.rangeBand()]);

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

                var seriesAxis = new xChart.axis(this.renderContainerId, width, height);

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

                } else {
                    if (i % 2 === 0) {
                        seriesAxisOptions.ticks = '';
                        seriesAxisOptions.tickSize = '';
                        seriesAxisOptions.showPath = true;
                        seriesAxis.setOptions(seriesAxisOptions);
                        seriesScale = seriesAxis.addQuantitativeScale(data.series, this.aec, 0, height, minY, maxY);
                        position.x = (0 - margin.left + i * 30);
                    } else {
                        seriesAxisOptions.ticks = '';
                        seriesAxisOptions.tickSize = '';
                        seriesAxisOptions.showPath = true;
                        seriesAxisOptions.orient = 'right';
                        seriesAxis.setOptions(seriesAxisOptions);
                        seriesScale = seriesAxis.addQuantitativeScale(data.series, 0.1, 0, height, minY, maxY);
                        position.x = (width + ((i - 1) * 20));
                    }
                }

                seriesAxis.draw(seriesScale, position, this.renderContainerId + "_yaxis_" + i)
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
                .attr("width", subCategoryScale.rangeBand())
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
                .ease('bounce')
                .duration(1000)
                .attr('y', function (d) {
                    if (d.data >= 0) {
                        var yScale = seriesScales[d.axis - 1];
                        return (yScale(0) - yScale(d.data)) >= 2 && (yScale(0) - yScale(d.data)) !== 0 ? yScale(d.data) : (yScale(0) - 2);
                    } else {
                        var yScale = seriesScales[d.axis - 1];
                        return yScale(0);
                    }

                })
                .attr('height', function (d) {
                    var yScale = seriesScales[d.axis - 1];
                    return Math.abs(yScale(d.data) - yScale(0)) <= 2 && Math.abs(yScale(d.data) - yScale(0)) !== 0 ? 2 : Math.abs(yScale(d.data) - yScale(0));
                })
                .each('end', function (d) {
                    if (d.index === data.categories.length - 1) {
                        if (seriesForLineChart.length > 0)
                            this.lineDraw(seriesForLineChart, data, this);
                        else {
                            if (d.seriesIndex === data.series.length - 1) {
                                this.dispatch.RenderComplete(this, data, seriesForChart);
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

        };

        groupedColumn.prototype.redraw = function (data) {

            var color = this.color;
            var margin = this.margin;
            var chartOptions = this.chartOptions;
            var axisRedrawThreshold = chartOptions.axisRedrawThreshold;
            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select("#" + this.renderContainerId + '_svg');
            var mainGroup = d3.select('#' + this.renderContainerId + "_mainGroup");

            d3.selectAll('.medianLine').remove();

            this.removeOverlap(data);

            var axisLabelOverlap = this.utility.draw_xAxisDummy(mainGroup, data.categories, height, width, this.renderContainerId);

            var bottomMarginChanged = false;
            if (!axisLabelOverlap && this.bottomMarginSet) {
                margin.bottom /= 2;
                this.bottomMarginSet = false;
                bottomMarginChanged = true;
            } else if (axisLabelOverlap && !this.bottomMarginSet) {
                margin.bottom *= 2;
                this.bottomMarginSet = true;
                bottomMarginChanged = true;
            } else if (axisLabelOverlap && !this.bottomMarginSet) {
                margin.bottom *= 2;
                this.bottomMarginSet = true;
                bottomMarginChanged = true;
            }

            var legend = new xChart.legend(data.series, color);

            //Set options for legend here
            // legend.setOptions({});

            var legendRows = legend.drawLegend('top', mainGroup, width, margin) + 1;
            margin.top = 20 * legendRows;
            mainGroup.selectAll('.legendg').remove();

            height = this.canvasHeight - margin.top - margin.bottom;

            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            mainGroup.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg = mainGroup;

            legend.drawLegend('top', svg, width, margin);

            var si = d3.format('.2s');
            var siMod = function (val) {
                return si(val).replace(/G/, 'B');
            };

            var prepData = this.utility.dataPrep(data);


            var seriesForLineChart = prepData.seriesForLineChart,
                seriesForChart = prepData.seriesForChart,
                axesGroups = prepData.axesGroups;

            this.seriesForChart = seriesForChart;
            if (seriesForLineChart.length > 0)
                this.seriesForLineChart = seriesForLineChart;
            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new xChart.axis(this.renderContainerId, width, height);
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
            var subCategoryScale = d3.scale.ordinal()
                .domain(seriesForChart.map(function (d) {
                    return d.series.value;
                })).rangeRoundBands([0, categoryScale.rangeBand()]);

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
                } else {
                    if (i % 2 === 0) {
                        position.x = (0 - margin.left + i * 30);

                    } else {
                        position.x = (width + ((i - 1) * 20));
                    }
                }

                if (Math.abs((previousMaxY - maxY) / previousMaxY) > axisRedrawThreshold) {
                    seriesScale = seriesAxis.addQuantitativeScale(data.series, this.aec, 0, height, minY, maxY);
                    seriesAxis.draw(seriesScale, position, this.renderContainerId + "_yaxis_" + i);
                    this.seriesAxes[i] = seriesAxis;
                    seriesScales.push(seriesScale);
                } else {
                    if (bottomMarginChanged) {
                        seriesScale = axisRedrawThreshold === 1 ? seriesAxis.addQuantitativeScale(data.series, this.aec, 0, height, seriesAxis.scale.domain()[0], previousMaxY) : seriesAxis.addQuantitativeScale(data.series, this.aec, 0, height, minY, maxY);
                        seriesAxis.draw(seriesScale, position, this.renderContainerId + "_yaxis_" + i);
                        this.seriesAxes[i] = seriesAxis;
                        seriesScales.push(seriesScale);
                    } else {
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
                .ease('bounce')
                .duration(1000)
                .attr("x", function (d) {
                    return subCategoryScale(d.seriesValue);
                })
                .attr('y', function (d) {
                    if (d.data >= 0) {
                        var yScale = seriesScales[d.axis - 1];
                        return (yScale(0) - yScale(d.data)) >= 2 && (yScale(0) - yScale(d.data)) !== 0 ? yScale(d.data) : (yScale(0) - 2);
                    } else {
                        var yScale = seriesScales[d.axis - 1];
                        return yScale(0);
                    }

                })
                .attr('height', function (d) {
                    var yScale = seriesScales[d.axis - 1];
                    return Math.abs(yScale(d.data) - yScale(0)) <= 2 && Math.abs(yScale(d.data) - yScale(0)) !== 0 ? 2 : Math.abs(yScale(d.data) - yScale(0));
                })
                .attr("width", subCategoryScale.rangeBand())
                .each('end', function (d) {
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
                    .attr("width", subCategoryScale.rangeBand())
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
                        } else {
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
                                that.dispatch.RenderComplete(that, data, seriesForChart);
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

                svg.selectAll('.bar')[0].forEach(function (d) {
                    d3.select(d)
                        .style('opacity', 1)
                        .attr('filter', '');
                });
            }
        };

        groupedColumn.prototype.drawOverlap = function (OverlappedData, originalData) {

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
                overSeries[i].fmtData = d3.merge(overSeries[i].fmtData)
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
            var margin = this.margin,
                height = this.canvasHeight - margin.top - margin.bottom;
            var categoryScale = this.categoryAxis.scale;
            var seriesScales = this.seriesScales;
            var svg = d3.select('#' + this.renderContainerId + "_mainGroup");
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
                .attr("width", subCategoryScale.rangeBand())
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
                .ease('bounce')
                .attr('y', function (d) {
                    if (d.data >= 0) {
                        var yScale = seriesScales[d.axis - 1];
                        return (yScale(0) - yScale(d.data)) >= 1 && (yScale(0) - yScale(d.data)) !== 0 ? yScale(d.data) : (yScale(0) - 1);
                    } else {
                        var yScale = seriesScales[d.axis - 1];
                        return yScale(0);
                    }
                })
                .attr('height', function (d) {
                    var yScale = seriesScales[d.axis - 1];
                    return Math.abs(yScale(d.data) - yScale(0)) <= 1 && Math.abs(yScale(d.data) - yScale(0)) !== 0 ? 1 : Math.abs(yScale(d.data) - yScale(0));
                })
                .each('end', function (d) {
                    if (d.index === originalData.categories.length - 1) {
                        if (this.seriesForLineChart.length > 0)
                            this.lineDraw(this.seriesForLineChart, originalData, this);
                    }
                }.bind(this));

            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.ObarRect', true, false);
        };

        groupedColumn.prototype.removeOverlap = function (data) {

            var margin = this.margin,
                height = this.canvasHeight - margin.top - margin.bottom;
            var svg = d3.select('#' + this.renderContainerId + "_mainGroup");
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
                .ease('bounce')
                .attr('y', function (d) {
                    var yScale = seriesScales[d.axis - 1];
                    return yScale(0);
                })
                .attr('height', 0)
                .remove()
                .each('end', function (d) {
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
        };

        return groupedColumn;

    })();
    //Kpi
    //PI.xChart\src\js\plots\kpi.js
    xChart.kpi = (function () {

        function kpi(renderContainerId, color, chartOptions) {

            //Information stored here will persist
            this.renderContainerId = renderContainerId;
            this.canvasWidth = document.getElementById(this.renderContainerId).offsetWidth;
            this.canvasHeight = document.getElementById(this.renderContainerId).offsetHeight;
            this.margin = {
                top: 5,
                right: 5,
                bottom: 5,
                left: 5
            };
            this.configuration = chartOptions.gaugeConfiguration;
            this.utility = new xChart.utility();
            this.chartOptions = chartOptions;

        };

        kpi.prototype.dispatch = d3.dispatch('RenderComplete');

        kpi.prototype.draw = function (data) {

            var margin = this.margin;
            var renderContainerId = this.renderContainerId;
            var configuration = Object.assign({}, data.gaugeConfiguration);
            var chartOptions = this.chartOptions;
            var el = document.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);

            var w = this.canvasWidth - margin.left - margin.right,
                h = this.canvasHeight - margin.top - margin.bottom;

            var r = 0.8 * Math.min(w, h);

            var config = configuration;
            var trendValue;
            var trendData;

            // checking the prescence of trendValue and trendData
            if (data.trendValue && data.trendValue.data && !isNaN(data.trendValue.data)) {
                trendData = data.trendValue.data;
                trendValue = data.trendValue.fmtData;
            }

            config.size = r;
            config.radius = w <= h ? r / 2 : (((w - h) / 4) < h / 4 ? ((r / 2) + ((w - h) / 4)) : ((r / 2) + (h / 4)));

            config.cx = w <= h ? (0.15 * w + config.radius) : w / 2;
            config.cy = h <= w ? (0.15 * h + config.radius) : h / 2;

            config.min = undefined != configuration.min ? configuration.min : 0;
            config.max = undefined != configuration.max ? configuration.max : 100;
            config.range = config.max - config.min;

            config.actualValue = configuration.actualValue;
            config.targetValue = configuration.targetValue;
            config.fmtTarget = configuration.fmtTarget;
            config.valueFlag = configuration.valueFlag;
            config.majorTicks = configuration.majorTicks || 5;
            config.minorTicks = configuration.minorTicks || 2;
            config.sentiment = configuration.sentiment;
            config.greenColor = configuration.greenColor || "#109618";
            config.yellowColor = configuration.yellowColor || "#FF9900";
            config.redColor = configuration.redColor || "#DC3912";
            config.systemTarget = config.targetValue;
            config.isSystemTarget = true;


            if (isNaN(config.systemTarget) || typeof config.systemTarget === 'undefined' || config.systemTarget === 'NA') {
                config.systemTarget = config.max;
                config.targetValue = config.systemTarget;
                config.isSystemTarget = false;
            }

            config.pointerWidth = 5;
            config.pointerTailLength = 2;
            config.pointerHeadLengthPercent = 0.8;
            config.pointerHeadLength = Math.round(config.radius * config.pointerHeadLengthPercent);

            config.transitionDuration = configuration.transitionDuration || 500;
            var _currentRotation = '';
            var rangeColor = '#C8C8C8';
            var valueColor = config.isSystemTarget && config.valueFlag ? getColor(config.actualValue) : '#000000';
            var triangleColor = "#1E90FF";
            var minPoint = valueToP(config.min, 1.05);
            var maxPoint = valueToP(config.max, 1.05);
            var systemTargetTextAnchorAngle = valueToDegrees(config.systemTarget);
            var systemTargetTextPoint = valueToP(config.systemTarget, 1.15);
            var systemTargetTrianglePoint = valueToP(config.systemTarget, 1.05);
            var triangleRotationAngle = valueToDegrees(config.systemTarget);
            var angleOfRange = valueToDegrees(config.max);
            var angleOfMinRange = valueToDegrees(config.min);
            var angleOfSystemtarget = valueToDegrees(config.systemTarget);

            var midValue = (config.min + config.max) / 2;
            var innerBandInnerRadius = 0.95 * config.radius;
            var innerBandOuterRadius = 0.65 * config.radius;

            // various font size setting
            var minSize = Math.min(w, h);
            var multiplier = minSize / 20;
            var valueFontSize = multiplier * 2 <= 18 ? 18 : multiplier * 2;
            var trendFontSize = multiplier * 2 <= 12 ? 12 : multiplier * 2;
            var rangeFontSize = multiplier * 1.3 <= 15 ? 15 : multiplier * 1.2;
            var horizontalLineLength = multiplier * 1.5 <= 10 ? 10 : multiplier * 1.5;
            var verticalLineLength = multiplier <= 8 ? 8 : multiplier;

            var pointerdata = [
                [config.pointerWidth / 2, 0],
                [0, -config.pointerHeadLength],
                [-(config.pointerWidth / 2), 0],
                [0, config.pointerTailLength],
                [config.pointerWidth / 2, 0]
            ];

            // setting trend value if present
            if (trendValue && !isNaN(data.trendValue.data)) {
                var trendTimeRange = data.request.kpiperiodtype;
                if (trendTimeRange)
                    if (trendTimeRange === 'default')
                        trendTimeRange = 'BTD';
                    else
                        trendTimeRange = trendTimeRange.toUpperCase();

                var trendStartPoint = {},
                    trendEndPoint = {},
                    trendGroupPosition = {},
                    trendLineColor,
                    trendValueColor,
                    trendTriangleRotation,
                    difference,
                    trendRotation;

                trendValueColor = '#000000';
                if (config.actualValue && trendData)
                    difference = config.actualValue - trendData;
                else
                    difference = 0;

                trendLineColor = "#C8C8C8";

                //color setting
                if (config.sentiment === 'up') {
                    if (difference > 0)
                        trendLineColor = config.greenColor;
                    else if (difference < 0)
                        trendLineColor = config.redColor;
                } else {
                    if (difference > 0)
                        trendLineColor = config.redColor;
                    else if (difference < 0)
                        trendLineColor = config.greenColor;
                }

                if (isNaN(difference))
                    difference = 0;

                trendTriangleRotation = 30;

                trendStartPoint = {
                    x: 0,
                    y: 0
                };
                trendEndPoint = {
                    x: 1.5 * horizontalLineLength,
                    y: 0
                };

                // point setting
                if ((config.sentiment === 'down' && difference < 0) || (config.sentiment === 'up' && difference < 0)) {
                    trendRotation = 90;
                    trendGroupPosition = {
                        x: (w - 6 * multiplier),
                        y: (-multiplier)
                    }

                } else if ((config.sentiment === 'up' && difference > 0) || (config.sentiment === 'down' && difference > 0)) {
                    trendRotation = -90;
                    trendGroupPosition = {
                        x: (w - 6 * multiplier),
                        y: (2 * multiplier + 7)
                    }

                } else {
                    trendRotation = 0;
                    trendGroupPosition = {
                        x: (w - 6 * multiplier),
                        y: (multiplier)
                    }
                }
            }

            var arc = d3.svg.arc()
                .innerRadius(innerBandInnerRadius)
                .outerRadius(innerBandOuterRadius)
                .startAngle(valueToRadians(config.min));

            var kpiBody = d3.select("#" + renderContainerId)
                .append("svg")
                .attr("id", renderContainerId + '_svg')
                .attr("width", this.canvasWidth)
                .attr("height", this.canvasHeight)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "Gaugekpi");

            kpiBody = kpiBody.append('g')
                .attr('transform', "translate(" + 5 + "," + 5 + ")");

            if (config.isSystemTarget) {
                for (var index in config.greenZones) {
                    drawOuterBand(config.greenZones[index].from, config.greenZones[index].to, config.greenColor, 0.95 * config.radius, config.radius);
                }
                for (var index in config.yellowZones) {
                    drawOuterBand(config.yellowZones[index].from, config.yellowZones[index].to, config.yellowColor, 0.95 * config.radius, config.radius);
                }
                for (var index in config.redZones) {
                    drawOuterBand(config.redZones[index].from, config.redZones[index].to, config.redColor, 0.95 * config.radius, config.radius);
                }
            }

            var targetData = Math.round(((config.max - config.actualValue) / config.range) * 100);
            var actualData = Math.round(((config.actualValue - config.min) / config.range) * 100);

            kpiBody.append("path")
                .data([targetData])
                .style("fill", "#F8F8F8")
                .style('opacity', '0.8')
                .attr('class', 'kpi')
                .attr("d", d3.svg.arc()
                    .startAngle(valueToRadians(config.min))
                    .endAngle(valueToRadians(config.max))
                    .innerRadius(innerBandInnerRadius)
                    .outerRadius(innerBandOuterRadius))
                .attr("transform", function () {
                    return "translate(" + config.cx + ", " + config.cy + ") rotate(270)"
                });

            kpiBody.append("path")
                .datum({
                    endAngle: valueToRadians(config.min),
                    data: actualData
                })
                .style("fill", "#C8C8C8")
                .attr('class', 'kpi')
                .style('opacity', 1)
                .attr("transform", function () {
                    return "translate(" + config.cx + ", " + config.cy + ") rotate(270)"
                })
                .transition()
                .duration(1000)
                .attrTween("d", function (d) {
                    var interpolate = d3.interpolate(d.endAngle, valueToRadians(config.actualValue));
                    return function (t) {
                        d.endAngle = interpolate(t);
                        return arc(d);
                    };
                });

            // range text setting
            kpiBody.append("text")
                .attr("transform", "translate(" + (minPoint.x) + "," + minPoint.y + ")")
                .text(parseFloat(config.min))
                .style("font-size", rangeFontSize + "px")
                .attr("text-anchor", 'end')
                .style("fill", rangeColor);

            kpiBody.append("text")
                .attr("transform", "translate(" + (maxPoint.x) + "," + maxPoint.y + ")")
                .text(function () {
                    if (config.max.toString().length > 2) {
                        return (d3.format('0.3s')(config.max)).toUpperCase()
                    } else {
                        return parseFloat(config.max);
                    }
                })
                .style("font-size", rangeFontSize + "px")
                .attr("text-anchor", 'start')
                .style("fill", rangeColor);


            if (config.isSystemTarget)
                kpiBody.append("path")
                    .data([config.fmtTarget])
                    .attr('class', 'triangle')
                    .attr("d", d3.svg.symbol().type('triangle-down').size(40))
                    .style("fill", triangleColor)
                    .attr("transform", "translate(" + systemTargetTrianglePoint.x + "," + systemTargetTrianglePoint.y + ")rotate(" + (triangleRotationAngle + 30) + ")");

            var pointerContainer = kpiBody.append("g")
                .attr("class", "pointerContainer");

            var pointerLine = d3.svg.line()
                .x(function (d) {
                    return d[0];
                })
                .y(function (d) {
                    return d[1];
                })
                .interpolate("monotone");

            pointerContainer.selectAll("path")
                .data([pointerdata])
                .enter()
                .append("path")
                .attr("d", pointerLine)
                .style("fill", "#4c4c4c")
                .style("fill-opacity", 0.7);

            pointerContainer
                .append("text")
                .data([config.actualValue])
                .attr("x", config.cx)
                .attr("y", (config.cy + 2.5 * multiplier))
                .attr("dy", valueFontSize / 2)
                .attr("text-anchor", "middle")
                .attr("font-weight", "bold")
                .style("font-size", valueFontSize + "px")
                .style("fill", valueColor);

            // draw the trend according to sentiment of kpi
            if (typeof trendValue != 'undefined' && !isNaN(data.trendValue.data) && data && data.request && data.request.kpiperiodtype && data.request.kpiperiodtype !== 'default') {

                var trendGroup = kpiBody.append('g')
                    .attr('transform', 'translate(' + trendGroupPosition.x + ',' + trendGroupPosition.y + ')rotate(' + trendRotation + ')');

                // show the trend value
                kpiBody.append('text')
                    .attr('x', w - 8 * multiplier)
                    .attr('y', 1.5 * multiplier)
                    .text(trendValue)
                    .style("font-size", trendFontSize)
                    .attr("font-weight", "bold")
                    .attr("text-anchor", "end")
                    .style("fill", trendValueColor);

                trendGroup.append('line')
                    .attr("x1", trendStartPoint.x)
                    .attr("y1", trendStartPoint.y)
                    .attr("x2", trendEndPoint.x)
                    .attr("y2", trendEndPoint.y)
                    .attr('class', 'trendLine')
                    .style('display', 'block')
                    .style("stroke", trendLineColor)
                    .style("stroke-width", "2px");

                trendGroup.append("path")
                    .attr('class', 'trendCircle')
                    .attr("d", d3.svg.symbol().type('triangle-down').size(30))
                    .style("fill", trendLineColor)
                    .attr("transform", "translate(" + trendEndPoint.x + "," + (trendEndPoint.y + 1) + ")rotate(" + trendTriangleRotation + ")");

                // show  trend time range
                if (trendTimeRange)
                    kpiBody.append('text')
                        .attr('x', 3 * multiplier)
                        .attr('y', 1.5 * multiplier)
                        .text(trendTimeRange)
                        .style("font-size", trendFontSize)
                        .attr("font-weight", "bold")
                        .attr("text-anchor", "start")
                        .style("fill", trendValueColor);
            }

            redraw(config.min, 0);

            redraw(config.actualValue, 1000);

            this.utility.tooltip(kpiBody, '.kpi', false, false);
            this.utility.tooltip(kpiBody, '.triangle', false, false);

            function drawOuterBand(start, end, color, innerRadius, outerRadius) {
                if (0 >= end - start) return;
                var data = Math.round(((end - start) / config.range) * 100);
                kpiBody.append("path")
                    .data([data])
                    .style("fill", color)
                    .style('opacity', '0.8')
                    .attr('class', 'kpi')
                    .attr("d", d3.svg.arc()
                        .startAngle(valueToRadians(start))
                        .endAngle(valueToRadians(end))
                        .innerRadius(innerRadius)
                        .outerRadius(outerRadius))
                    .attr("transform", function () {
                        return "translate(" + config.cx + ", " + config.cy + ") rotate(270)"
                    });
            }

            function redraw(value, transitionDuration) {

                var pointerContainer = kpiBody.select(".pointerContainer");

                if (config.valueFlag && config.actualValue)
                    pointerContainer
                        .select("text")
                        .transition()
                        .duration(1000)
                        .tween("text", function (d) {
                            var i = d3.interpolate(this.textContent, d);
                            var thisObj = this;
                            return function (t) {
                                this.textContent = Math.round(i(t));
                            };
                        })
                        .each('end', function (d) {
                            this.textContent = data.fmtValue;
                        });
                else
                    pointerContainer.selectAll("text").text("No value");

                var pointer = pointerContainer.selectAll("path");
                pointer.transition()
                    .duration(undefined != transitionDuration ? transitionDuration : config.transitionDuration)
                    .attrTween("transform", function () {
                        var pointerValue = value;
                        if (value > config.max) pointerValue = config.max + 0.02 * config.range;
                        else if (value < config.min) pointerValue = config.min - 0.02 * config.range;
                        var targetRotation = (valueToDegrees(pointerValue) - 90);
                        var currentRotation = _currentRotation || targetRotation;
                        _currentRotation = targetRotation;

                        return function (step) {
                            var rotation = currentRotation + (targetRotation - currentRotation) * step;
                            return "translate(" + config.cx + ", " + config.cy + ") rotate(" + rotation + ")";
                        }
                    });
            }

            function valueToDegrees(value) {
                return value / config.range * 180 - (config.min / config.range * 180);
            }

            function valueToRadians(value) {
                return valueToDegrees(value) * Math.PI / 180;
            }

            function valueToP(value, factor) {
                return {
                    x: config.cx - config.radius * factor * Math.cos(valueToRadians(value)),
                    y: config.cy - config.radius * factor * Math.sin(valueToRadians(value))
                };
            }

            function getColor(data) {
                var valueColor = '#000000';
                if (data >= config.greenZones[0].from && data <= config.greenZones[0].to)
                    valueColor = config.greenColor;
                else if (data >= config.redZones[0].from && data <= config.redZones[0].to)
                    valueColor = config.redColor;
                else if (data >= config.yellowZones[0].from && data <= config.yellowZones[0].to)
                    valueColor = config.yellowColor;
                return valueColor;
            }

        }

        kpi.prototype.redraw = function (data) {
            this.draw(data);
        }

        kpi.prototype.drawOverlap = function (data, originalData) {
            this.draw(data);
        }

        kpi.prototype.removeOverlap = function (data) {
            this.draw(data);
        }

        return kpi;

    })();
    //Line Chart
    //PI.xChart\src\js\plots\line.js
    xChart.line = (function () {
        function line(renderContainerId, color, chartOptions) {

            //Information stored here will persist
            this.renderContainerId = renderContainerId;
            this.canvasWidth = document.getElementById(this.renderContainerId).offsetWidth;
            this.canvasHeight = document.getElementById(this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.color = color;
            this.subCategoryScale;

            this.axisRedrawThreshold = chartOptions.axisRedrawThreshold;
            this.aec = chartOptions.aec;
            this.chartOptions = chartOptions;


            //To use the helper utility functions
            this.utility = new xChart.utility();
        };

        // xChart.line's prototype properties.
        line.prototype.dispatch = d3.dispatch('RenderComplete');

        line.prototype.draw = function (data) {

            var color = this.color;
            var margin = this.margin;
            var chartOptions = this.chartOptions;
            var el = document.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);

            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select("#" + this.renderContainerId).append("svg")
                .attr("id", this.renderContainerId + "_svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
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

            var legend = new xChart.legend(data.series, color);

            //Set options for legend here
            // legend.setOptions({});

            var legendRows = legend.drawLegend('top', mainGroup, width, margin) + 1;
            margin.top = 20 * legendRows;
            mainGroup.selectAll('.legendg').remove();

            height = this.canvasHeight - margin.top - margin.bottom;

            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            mainGroup.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg = mainGroup;

            legend.drawLegend('top', svg, width, margin);

            var si = d3.format('.2s');
            var siMod = function (val) {
                return si(val).replace(/G/, 'B')
            };

            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new xChart.axis(this.renderContainerId, width, height);

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
            this.seriesAxis = new xChart.axis(this.renderContainerId, width, height);

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
                    }
                });

                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], 0.1, 0.2)
                    .domain(lineData.map(function (d) {
                        return d.categoryName
                    }));
                this.subCategoryScale = x;
                var line = d3.svg.line()
                    .interpolate("linear")
                    .x(function (d) {
                        return x(d.categoryName) + (x.rangeBand() / 2);
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
                        return x(d.categoryName) + (x.rangeBand() / 2);
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
                            this.dispatch.RenderComplete(this, data);
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
                .style('fill', '#ffffff')
            var t = svg.transition()
                .delay(750)
                .duration(1000)
                .ease('linear');

            t.select('rect.curtain')
                .attr('width', 0);
        }

        line.prototype.redraw = function (data) {

            var color = this.color;
            var margin = this.margin;
            var el = document.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);
            var chartOptions = this.chartOptions;
            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select("#" + this.renderContainerId).append("svg")
                .attr("id", this.renderContainerId + "_svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr('class', 'line');

            var mainGroup = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("id", this.renderContainerId + "_mainGroup")
                .attr('class', 'line');

            var axisLabelOverlap = this.utility.draw_xAxisDummy(mainGroup, data.categories, height, width, this.renderContainerId);
            if (!axisLabelOverlap && this.bottomMarginSet) {
                margin.bottom /= 2;
            }

            var legend = new xChart.legend(data.series, color);

            //Set options for legend here
            // legend.setOptions({});

            var legendRows = legend.drawLegend('top', mainGroup, width, margin) + 1;
            margin.top = 20 * legendRows;
            mainGroup.selectAll('.legendg').remove();

            height = this.canvasHeight - margin.top - margin.bottom;

            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            mainGroup.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg = mainGroup;

            legend.drawLegend('top', svg, width, margin);

            var si = d3.format('.2s');
            var siMod = function (val) {
                return si(val).replace(/G/, 'B')
            };

            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new xChart.axis(this.renderContainerId, width, height);

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
            this.seriesAxis = new xChart.axis(this.renderContainerId, width, height);

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
                    }
                });

                lineData.forEach(function (d) {
                    if (isNaN(d.data)) {
                        d.data = 0;
                        d.fmtData = '0';
                    }
                });

                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], 0.1, 0.2)
                    .domain(lineData.map(function (d) {
                        return d.categoryName;
                    }));

                var line = d3.svg.line()
                    .interpolate("linear")
                    .x(function (d) {
                        return x(d.categoryName) + (x.rangeBand() / 2);
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
                        return x(d.categoryName) + (x.rangeBand() / 2);
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
                            this.dispatch.RenderComplete(this, data);
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
                .style('fill', '#ffffff')
            var t = svg.transition()
                .delay(750)
                .duration(1000)
                .ease('linear');

            t.select('rect.curtain')
                .attr('width', 0);
        }

        line.prototype.drawOverlap = function (overlappedData, originalData) {
            overlappedData = this.utility.overlapDataPrep(overlappedData, originalData);
            this.redraw(overlappedData);
        }

        line.prototype.removeOverlap = function (data) {
            this.draw(data);
        }
        return line;
    })();
    //normalizedStackedColumn Chart
    //PI.xChart\src\js\plots\normalizedStackedColumn.js
    xChart.normalizedStackedColumn = (function () {
        function normalizedStackedColumn(renderContainerId, color, chartOptions) {

            //Information stored here will persist
            this.chartOptions = chartOptions;
            this.renderContainerId = renderContainerId;
            this.canvasWidth = document.getElementById(this.renderContainerId).offsetWidth;
            this.canvasHeight = document.getElementById(this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.color = color;
            this.axisRedrawThreshold = chartOptions.axisRedrawThreshold;
            this.aec = chartOptions.aec;
            this.overlapDraw = false;
        }

        normalizedStackedColumn.prototype.dispatch = d3.dispatch('RenderComplete');
        normalizedStackedColumn.prototype.draw = function (data) {

            var color = this.color;
            var margin = this.margin;
            var chartOptions = this.chartOptions;
            var sCHeight = [];
            var sCStartPoint = [];
            this.sCHeight = sCHeight;
            this.sCStartPoint = sCStartPoint;

            var el = document.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);

            //To use the helper utility functions
            this.utility = new xChart.utility();

            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select("#" + this.renderContainerId).append("svg")
                .attr("id", this.renderContainerId + "_svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
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

            var legend = new xChart.legend(data.series, color);

            //Set options for legend here
            // legend.setOptions({});

            var legendRows = legend.drawLegend('top', mainGroup, width, margin) + 1;
            margin.top = 20 * legendRows;
            mainGroup.selectAll('.legendg').remove();

            height = this.canvasHeight - margin.top - margin.bottom;

            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            mainGroup.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg = mainGroup;

            legend.drawLegend('top', svg, width, margin);

            var stack = d3.layout.stack()
                .values(function (d) {
                    return d.values;
                });

            var formatPercent = d3.format(".0%");

            //Utility function call to add filter def to svg
            this.utility.addLinearFilter(svg, this.renderContainerId);

            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new xChart.axis(this.renderContainerId, width, height);

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
            this.seriesAxis = new xChart.axis(this.renderContainerId, width, height);

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


            this.subCategoryScale = d3.scale.ordinal()
                .domain(data.series.map(function (d) {
                    return d.value
                })).rangeBands([0, categoryScale.rangeBand()]);

            function findSum(categoryIndex) {
                sum = 0;
                for (var i = 0; i < data.series.length; i++) {
                    sum += data.series[i].data[categoryIndex];
                }

                return sum;
            }


            var stackData = data.series.map(function (d, i) {
                return {
                    values: data.categories.map(function (e, j) {
                        sum = findSum(j);
                        return {
                            seriesIndex: i,
                            categoryIndex: j,
                            seriesName: d.name,
                            seriesValue: d.value,
                            seriesLongName: d.longName,
                            y: d.data[j] / sum
                        }
                    })
                }
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
                            index: i,
                            category: d,
                            categoryLongName: data.categories[i] === null ? '' : data.categories[i].longName,
                            categoryName: d.name,
                            categoryDimName: d.dimName,
                            categoryValue: d.value
                        });
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
                .attr("width", categoryScale.rangeBand())
                .transition()
                .ease('bounce')
                .duration(1000)
                .attr("height", function (d) {
                    sCHeight.push(seriesScale(d.y0) - seriesScale(d.y1));
                    return seriesScale(d.y0) - seriesScale(d.y1);
                })
                .attr("y", function (d) {
                    sCStartPoint.push(seriesScale(d.y1));
                    return seriesScale(d.y1);
                })
                .each('end', function (d) {
                    if (d.categoryIndex === data.categories.length - 1 && d.seriesIndex == data.series.length - 1) {
                        this.dispatch.RenderComplete(this, data, stackData);
                    }
                }.bind(this));

            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.bar', true, false);

        };

        normalizedStackedColumn.prototype.redraw = function (data) {

            this.removeOverlap();
            var color = this.color;
            var margin = this.margin;
            var sCHeight = [];
            var sCStartPoint = [];
            this.sCHeight = sCHeight;
            this.sCStartPoint = sCStartPoint;
            var chartOptions = this.chartOptions;

            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select("#" + this.renderContainerId + '_svg');
            var mainGroup = d3.select('#' + this.renderContainerId + "_mainGroup");

            //this.removeOverlap(data);

            var axisLabelOverlap = this.utility.draw_xAxisDummy(mainGroup, data.categories, height, width, this.renderContainerId);
            if (!axisLabelOverlap && this.bottomMarginSet) {
                margin.bottom /= 2;
            }

            var legend = new xChart.legend(data.series, color);

            //Set options for legend here
            // legend.setOptions({});

            var legendRows = legend.drawLegend('top', mainGroup, width, margin) + 1;
            margin.top = 20 * legendRows;
            mainGroup.selectAll('.legendg').remove();

            height = this.canvasHeight - margin.top - margin.bottom;

            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            mainGroup.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg = mainGroup;

            legend.drawLegend('top', svg, width, margin);


            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new xChart.axis(this.renderContainerId, width, height);

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
            this.subCategoryScale = d3.scale.ordinal()
                .domain(data.series.map(function (d) {
                    return d.value
                })).rangeBands([0, categoryScale.rangeBand()]);

            var stack = d3.layout.stack()
                .values(function (d) {
                    return d.values;
                });

            function findSum(categoryIndex) {
                sum = 0;
                for (var i = 0; i < data.series.length; i++) {
                    sum += data.series[i].data[categoryIndex];
                }

                return sum;
            }


            var stackData = data.series.map(function (d, i) {
                return {
                    values: data.categories.map(function (e, j) {
                        sum = findSum(j);
                        return {
                            seriesIndex: i,
                            categoryIndex: j,
                            seriesName: d.name,
                            seriesValue: d.value,
                            seriesLongName: d.longName,
                            y: d.data[j] / sum
                        }
                    })
                }
            });

            var barGroups = svg.selectAll(".outerbar")
                .data(data.categories);

            barGroups.exit().remove();

            barGroups.enter()
                .append('g')
                .attr("class", "outerbar")
                .attr("transform", function (d) {
                    return "translate(" + (categoryScale(d.value) + this.subCategoryScale.rangeBand() / 2) + ",0)";
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
                .ease('bounce')
                .duration(1000)
                .attr("height", function (d) {
                    return seriesScale(d.y0) - seriesScale(d.y1);
                })
                .attr("y", function (d) {
                    return seriesScale(d.y1);
                })
                .attr("width", categoryScale.rangeBand())
                .each('end', function (d) {
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
                    .attr("width", categoryScale.rangeBand())
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
                            that.dispatch.RenderComplete(that, data);
                        }
                    }.bind(that));

                if (chartOptions.tooltip)
                    that.utility.tooltip(svg, '.bar', true, false);
            }

        };

        normalizedStackedColumn.prototype.drawOverlap = function (overlappedData, originalData) {

            overlappedData = this.utility.overlapDataPrep(overlappedData, originalData);
            var chartOptions = this.chartOptions;
            var seriesScale = this.seriesAxis.scale,
                categoryScale = this.categoryScale;

            var sCHeight = this.sCHeight;
            var sCStartPoint = this.sCStartPoint;

            var svg = d3.select('#' + this.renderContainerId + "_mainGroup");
            // reducing the opacity
            svg.selectAll('.bar').style('opacity', 0.7);

            var stack = d3.layout.stack()
                .values(function (d) {
                    return d.values;
                });

            function findSum(categoryIndex) {
                sum = 0;
                for (var i = 0; i < originalData.series.length; i++) {
                    sum += originalData.series[i].data[categoryIndex];
                }
                return sum;
            }

            var stackData = overlappedData.overlappedSeries.map(function (d, i) {
                return {
                    values: overlappedData.categories.map(function (e, j) {
                        sum = findSum(j);
                        return {
                            seriesIndex: i,
                            categoryIndex: j,
                            seriesName: d.name,
                            seriesValue: d.value,
                            seriesLongName: d.longName,
                            y: d.data[j][0] / sum
                        }
                    })
                }
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
                .attr("width", categoryScale.rangeBand())
                .style("fill", "#FFC200")
                .style("opacity", 1)
                .style("stroke", 'black')
                .style('stroke-width', '0.3px');

            yi = 0;

            overlappedBars.exit().remove();

            overlappedBars.transition()
                .duration(1000)
                .ease('bounce')
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
        };

        normalizedStackedColumn.prototype.removeOverlap = function (data) {

            var subCategoryScale = this.subCategoryScale,
                seriesScale = this.seriesAxis.scale,
                categoryScale = this.categoryScale;

            var sCHeight = this.sCHeight;
            var sCStartPoint = this.sCStartPoint;

            var svg = d3.select('#' + this.renderContainerId + "_mainGroup");

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
                .attr("width", categoryScale.rangeBand());

            yi = 0;

            overlappedBars
                .exit()
                .transition()
                .duration(1000)
                .ease('bounce')
                .attr("y", function (d) {
                    var s = (sCStartPoint[yi] + sCHeight[yi]);
                    yi++;
                    return s;
                })
                .attr("height", 0)
                .remove()
                .each('end', function () {
                    // resetting the opacity
                    svg.selectAll('.bar').style('opacity', 1);

                    var outerBars = svg.selectAll(".overlappedBar");
                    outerBars.remove();
                });
        };

        return normalizedStackedColumn;
    })();
    //Pareto Chart

    xChart.pareto = (function () {
        function pareto(renderContainerId, color, chartOptions) {

            //Information stored here will persist
            this.renderContainerId = renderContainerId;
            this.canvasWidth = document.getElementById(this.renderContainerId).offsetWidth;
            this.canvasHeight = document.getElementById(this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            //To use the helper utility functions
            this.utility = new xChart.utility();
            this.chartOptions = chartOptions;

        };

        // xChart.pareto's prototype properties.

        pareto.prototype.dispatch = d3.dispatch('RenderComplete');

        pareto.prototype.draw = function (data) {

            var margin = this.margin;
            var color = ['#03A9F4', '#E91E63'];

            margin.right = 50;

            var el = document.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);
            var chartOptions = this.chartOptions;
            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select("#" + this.renderContainerId).append("svg")
                .attr("id", this.renderContainerId + "_svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
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
                })
            });

            chartData.sort(function (a, b) {
                return b.data - a.data
            });

            chartData.forEach(function (d) {
                return ySum += d.data;
            })

            chartData.forEach(function (d, i) {
                if (i === 0)
                    cumulativePercentages.push(d.data / ySum);
                else
                    cumulativePercentages.push(cumulativePercentages[i - 1] + d.data / ySum);
            })

            chartData.forEach(function (d, i) {
                chartData[i].cumulativePercentage = (cumulativePercentages[i] * 100).toFixed(2);
            })

            var formatPercent = d3.format(".0%");

            var si = d3.format('.2s');
            var siMod = function (val) {
                return si(val).replace(/G/, 'B');
            }

            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new xChart.axis(this.renderContainerId, width, height);

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
            this.seriesAxis = new xChart.axis(this.renderContainerId, width, height);

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
            var percentScale = d3.scale.linear()
                .range([height, 0]);

            var percentAxis = d3.svg.axis()
                .scale(percentScale)
                .orient("right")
                .tickFormat(formatPercent);

            svg.append("g")
                .attr("class", "y axis")
                .attr('id', this.renderContainerId + '_yaxis_percent')
                .call(percentAxis)
                .attr("transform", "translate(" + width + ", " + 0 + ")");

            var line = d3.svg.line()
                .interpolate("cardinal")
                .x(function (d, i) {
                    return categoryScale(d.categoryValue) + categoryScale.rangeBand() / 2;
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
                .attr('width', categoryScale.rangeBand())
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
                .ease('bounce')
                .duration(1000)
                .attr('y', function (d, i) {
                    return (seriesScale(0) - seriesScale(d.data)) >= 2 ? seriesScale(d.data) : (seriesScale(0) - 2);
                })
                .attr('height', function (d, i) {
                    return (height - seriesScale(d.data)) <= 2 ? 2 : (height - seriesScale(d.data));
                })
                .each('end', function (d) {
                    if (d.index === data.categories.length - 1)
                        this.dispatch.RenderComplete(this, data);
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
                .ease("linear")
                .attr("stroke-dashoffset", 0);

            svg.selectAll('circle')
                .data(chartData)
                .enter()
                .append('circle')
                .attr('class', 'paretoCircle')
                .attr('cx', function (d) {
                    return categoryScale(d.categoryValue) + categoryScale.rangeBand() / 2;
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
                .attr('x1', categoryScale(chartData[thresholdIndex - 1].categoryValue) + categoryScale.rangeBand() / 2)
                .attr('y1', percentScale(cumulativePercentages[thresholdIndex - 1]))
                .attr('x2', categoryScale(chartData[thresholdIndex - 1].categoryValue) + categoryScale.rangeBand() / 2)
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

        };

        pareto.prototype.redraw = function (data) {
            this.draw(data);
        }

        pareto.prototype.drawOverlap = function (overlappedData, originalData) {

            var margin = this.margin;
            var height = this.canvasHeight - margin.top - margin.bottom;
            var svg = d3.select("#" + this.renderContainerId + "_mainGroup");
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
                })
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
                .attr('width', categoryScale.rangeBand())
                .attr('y', height)
                .attr('height', 0)
                .style('fill', '#FFC200');

            bars
                .transition()
                .ease('bounce')
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

        pareto.prototype.removeOverlap = function () {

            var margin = this.margin;
            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select('#' + this.renderContainerId + '_mainGroup');

            svg.selectAll('.obar')
                .data([])
                .exit()
                .transition()
                .duration(1000)
                .ease('bounce')
                .attr('y', height)
                .attr('height', 0)
                .remove();
            svg.selectAll('.bar').style('opacity', '1');

        }

        return pareto;

    })();
    //Pie Chart And Donut Chart
    xChart.pieOrDonut = (function () {

        function pieOrDonut(renderContainerId, chartOptions) {

            //Information stored here will persist
            this.renderContainerId = renderContainerId;
            this.canvasWidth = document.getElementById(this.renderContainerId).offsetWidth;
            this.canvasHeight = document.getElementById(this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.color = chartOptions.defaultColors;
            this.chartType = chartOptions.chartType;
            this.noOfPieSlices = chartOptions.noOfPieSlices;
            this.chartOptions = chartOptions;

            //To use the helper utility functions
            this.utility = new xChart.utility();
        };

        //xChart.pieOrDonut's prototype properties
        pieOrDonut.prototype.dispatch = d3.dispatch('RenderComplete');
        pieOrDonut.prototype.draw = function (data) {
            this.data = data;
            var color = this.color;
            var renderContainerId = this.renderContainerId;
            var chartOptions = this.chartOptions;
            var noOfPieSlices = chartOptions.noOfPieSlices;
            if (data.categories.length <= noOfPieSlices) {
                noOfPieSlices = data.categories.length;
                this.reduceCategory = false;
            } else
                this.reduceCategory = true;

            var noOfSlice = noOfPieSlices;
            var chartType = this.chartType;
            var w = this.canvasWidth;
            var h = this.canvasHeight;

            var el = document.querySelector('#' + renderContainerId + "_svg");
            if (el && el.parentElement) {
                el.parentElement.removeChild(el);
            }
            el = document.querySelector('#' + renderContainerId + "_select");
            if (el && el.parentElement) {
                el.parentElement.removeChild(el);
            }

            var originalData = Object.assign({}, data);

            // For Multiple series
            if (originalData.series.length > 1) {

                var select = d3.select('#' + renderContainerId)
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
                    var selectedIndex = select.property('selectedIndex'),
                        seriesdropdownData = seriesOptions[0][selectedIndex].__data__;
                    drawPieDonut(seriesdropdownData);
                    this.selectedIndex = selectedIndex;
                };

            }
            // End of multiple series

            var series = data.series;

            var legendDrawn = false;

            var r = Math.min(w, h);

            var outerRadius = r * .3,
                innerRadius;
            this.outerRadius = outerRadius;

            if (chartType.toLowerCase() == 'pie')
                innerRadius = 0;
            else if (chartType.toLowerCase() == 'donut')
                innerRadius = 0.6 * outerRadius;

            var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

            var biggerArc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius * 1.1);

            var pie = d3.layout.pie().padAngle(.00).sort(null);

            var svg = d3.select("#" + renderContainerId)
                .append("svg")
                .attr('id', renderContainerId + '_svg')
                .attr('class', 'donutsvg')
                .attr("width", w)
                .attr('height', h);

            //Utility function call to add filter def to svg
            this.utility.addRadialFilter(svg, renderContainerId);
            var thisobj = this;

            function drawPieDonut(dd_series) {

                svg.selectAll('.arc').remove();
                svg.selectAll('.dArc').remove();
                data = originalData;

                var dataValues = dd_series.data;
                var fmtDataValue = dd_series.fmtData;
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
                })
                data = pieData;

                var totalSum = d3.sum(data, function (d) {
                    return d.data;
                });

                if (data.length > noOfSlice) {
                    var finalPieData = [];
                    var sumOthers = d3.sum(data, function (d, j) {
                        if (j > noOfSlice - 2) return d.data;
                        else return 0;
                    });

                    for (var i = 0; i < data.length; i++) {
                        if (i < noOfSlice - 1) {
                            finalPieData.push(data[i]);
                        } else {
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
                    return d.data
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
                    .attr("transform", "translate(" + (outerRadius + 40) + ", " + ((h / 2)) + ")")


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
                    .ease("bounce")
                    .duration(1000)
                    .each('end', function (d) {
                        if (d.index === noOfSlice - 1) {
                            thisobj.dispatch.RenderComplete(thisobj, arcData);
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
                } else {
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

                if (legendDrawn === false) {
                    drawPieLegends(data);
                    legendDrawn = true;
                }

                if (chartOptions.tooltip)
                    thisobj.utility.tooltip(svg, '.pie', true, true);
            }

            function drawPieLegends(data) {

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
                    var seriesSubset = [],
                        colorSubset = [];

                    for (var i = 0; i < legends.length; i++) {
                        if (i >= startIndex && i < endIndex) {
                            seriesSubset.push(legends[i]);
                            colorSubset.push(color[i]);
                        }
                    }

                    DrawLegendSubset(seriesSubset, colorSubset, legendPerPage, pageNo, totalPages);
                } else {

                    var legendWidth = 9;
                    var legendPosition = h / 2 - ((data.length / 2) * (legendWidth + 7));

                    var legend = svg.selectAll(".legend")
                        .data(legends)
                        .enter().append("g")
                        .attr("transform", function (d, i) {
                            return "translate(" + (outerRadius * 2) + "," + (legendPosition + (i * 16)) + ")";
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
                            return "translate(" + (outerRadius * 2) + "," + (margin.top + (i * (legendWidth + legendSpacing))) + ")";
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
                        nexttriangle.style('opacity', '0.5')
                        nexttriangle.on('click', '')
                            .style('cursor', '');
                    } else if (pageNo == 1) {
                        prevtriangle.style('opacity', '0.5')
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

                    var seriesSubset = [],
                        colorSubset = [];

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

                    var seriesSubset = [],
                        colorSubset = [];

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
                    paths[0].forEach(function (d, i) {
                        var pathColor = d3.select(d).attr('fill');
                        if (d3.rgb(pathColor).toString() == d3.rgb(legendColor).toString()) {
                            d3.select(d).transition()
                                .duration(500)
                                .attr("d", biggerArc);
                        } else {
                            d3.select(d).transition()
                                .duration(500)
                                .attr("d", arc);
                        }
                    });
                }

                function pieLegendMouseOut() {
                    var paths = svg.selectAll('path');
                    paths[0].forEach(function (d, i) {
                        d3.select(d).transition()
                            .duration(500)
                            .attr("d", arc);
                    });
                }
                if (chartOptions.tooltip)
                    thisobj.utility.tooltip(svg, '.legend', false, true);
            }

            drawPieDonut(series[0]);

        }

        pieOrDonut.prototype.redraw = function (data) {
            this.data = data;
            this.removeOverlap();
            var chartOptions = this.chartOptions;
            var color = this.color;
            var renderContainerId = this.renderContainerId;
            var noOfPieSlices = chartOptions.noOfPieSlices;
            if (data.categories.length <= noOfPieSlices) {
                noOfPieSlices = data.categories.length;
                this.reduceCategory = false;
            } else
                this.reduceCategory = true;

            var noOfSlice = noOfPieSlices;
            var chartType = this.chartType;
            var w = this.canvasWidth;
            var h = this.canvasHeight;

            var el = document.querySelector('#' + renderContainerId + "_svg");
            if (el && el.parentElement) {
                el.parentElement.removeChild(el);
            }
            el = document.querySelector('#' + renderContainerId + "_select");
            if (el && el.parentElement) {
                el.parentElement.removeChild(el);
            }

            var originalData = Object.assign({}, data);

            var thisobj = this;

            // For Multiple series
            if (originalData.series.length > 1) {

                var select = d3.select('#' + renderContainerId)
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
                    var selectedIndex = select.property('selectedIndex'),
                        seriesdropdownData = seriesOptions[0][selectedIndex].__data__;
                    drawPieDonut(seriesdropdownData);
                    this.selectedIndex = selectedIndex;
                };

            }
            // End of multiple series

            var series = data.series;

            var legendDrawn = false;

            var r = Math.min(w, h);

            var outerRadius = r * .3,
                innerRadius;
            this.outerRadius = outerRadius;

            if (chartType.toLowerCase() == 'pie')
                innerRadius = 0;
            else if (chartType.toLowerCase() == 'donut')
                innerRadius = 0.6 * outerRadius;

            var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

            var biggerArc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius * 1.1);

            var pie = d3.layout.pie().padAngle(.00).sort(null);

            var svg = d3.select("#" + renderContainerId)
                .append("svg")
                .attr('id', renderContainerId + '_svg')
                .attr('class', 'donutsvg')
                .attr("width", w)
                .attr('height', h);

            //Utility function call to add filter def to svg
            this.utility.addRadialFilter(svg, renderContainerId);
            var thisobj = this;

            function drawPieDonut(dd_series) {

                svg.selectAll('.arc').remove();
                svg.selectAll('.dArc').remove();
                data = originalData;

                var dataValues = dd_series.data;
                var fmtDataValue = dd_series.fmtData;
                var pieData = data.categories.map(function (d, i) {
                    return {
                        category: d,
                        categoryDimName: d.dimName,
                        categoryLongName: d.longName,
                        categoryName: d.name,
                        categoryValue: d.value,
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

                data = pieData;

                var totalSum = d3.sum(data, function (d) {
                    return d.data;
                });

                if (data.length > noOfSlice) {
                    var finalPieData = [];
                    var sumOthers = d3.sum(data, function (d, j) {
                        if (j > noOfSlice - 2) return d.data;
                        else return 0;
                    });

                    for (var i = 0; i < data.length; i++) {
                        if (i < noOfSlice - 1) {
                            finalPieData.push(data[i]);
                        } else {
                            finalPieData.push({
                                category: 'Others',
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
                    return d.data
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
                    .attr("transform", "translate(" + (outerRadius + 40) + ", " + ((h / 2)) + ")")


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
                        if (d.index === noOfSlice - 1) {
                            thisobj.dispatch.RenderComplete(thisobj, arcData);
                        }
                    })
                    .transition()
                    .ease("bounce")
                    .duration(1000)
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
                } else {
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
                    if (chartOptions.tooltip)
                        thisobj.utility.tooltip(svg, '.pie', true, true);
                }

                if (legendDrawn === false) {
                    drawPieLegends(data);
                    legendDrawn = true;
                }

                // thisobj.dispatch.RenderComplete(arcData, thisobj);

            }

            function drawPieLegends(data) {

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
                    var seriesSubset = [],
                        colorSubset = [];

                    for (var i = 0; i < legends.length; i++) {
                        if (i >= startIndex && i < endIndex) {
                            seriesSubset.push(legends[i]);
                            colorSubset.push(color[i]);
                        }
                    }

                    DrawLegendSubset(seriesSubset, colorSubset, legendPerPage, pageNo, totalPages);
                } else {

                    var legendWidth = 9;
                    var legendPosition = h / 2 - ((data.length / 2) * (legendWidth + 7));

                    var legend = svg.selectAll(".legend")
                        .data(legends)
                        .enter().append("g")
                        .attr("transform", function (d, i) {
                            return "translate(" + (outerRadius * 2) + "," + (legendPosition + (i * 16)) + ")";
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
                            return "translate(" + (outerRadius * 2) + "," + (margin.top + (i * (legendWidth + legendSpacing))) + ")";
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
                        nexttriangle.style('opacity', '0.5')
                        nexttriangle.on('click', '')
                            .style('cursor', '');
                    } else if (pageNo == 1) {
                        prevtriangle.style('opacity', '0.5')
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

                    var seriesSubset = [],
                        colorSubset = [];

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

                    var seriesSubset = [],
                        colorSubset = [];

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
                    paths[0].forEach(function (d, i) {
                        var pathColor = d3.select(d).attr('fill');
                        if (d3.rgb(pathColor).toString() == d3.rgb(legendColor).toString()) {
                            d3.select(d).transition()
                                .duration(500)
                                .attr("d", biggerArc);
                        } else {
                            d3.select(d).transition()
                                .duration(500)
                                .attr("d", arc);
                        }
                    });
                }

                function pieLegendMouseOut() {
                    var paths = svg.selectAll('path');
                    paths[0].forEach(function (d, i) {
                        d3.select(d).transition()
                            .duration(500)
                            .attr("d", arc);
                    });
                }
                if (chartOptions.tooltip)
                    thisobj.utility.tooltip(svg, '.legend', false, true);
            }

            drawPieDonut(series[0]);

        }

        pieOrDonut.prototype.drawOverlap = function (overlappedData, originalData) {

            var chartOptions = this.chartOptions;
            var renderContainerId = this.renderContainerId;
            originalData = this.data;
            var reduceCategory;
            overlappedData = this.utility.overlapDataPrep(overlappedData, originalData);
            var svg = d3.select("#" + renderContainerId + "_svg");
            var noOfPieSlices = chartOptions.noOfPieSlices;
            if (originalData.categories.length <= noOfPieSlices) {
                noOfPieSlices = originalData.categories.length;
                reduceCategory = false;
            } else
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
                }
            });

            pieData.sort(function (a, b) {
                return parseFloat(b.data[0] + b.data[1]) - parseFloat(a.data[0] + a.data[1]);
            });

            overlappedData.overlappedSeries[index].data.sort(function (a, b) {
                return parseFloat(b[0] + b[1]) - parseFloat(a[0] + a[1])
            })

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

            var dArc = d3.svg.arc()
                .innerRadius(arcInnerRadius)
                .outerRadius(donutOuterRadius);

            var pie = d3.layout.pie().sort(null);
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
                    } else {
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
                .ease("bounce")
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

        pieOrDonut.prototype.removeOverlap = function (data) {
            var renderContainerId = this.renderContainerId;
            var svg = d3.select("#" + renderContainerId + "_svg");
            svg.selectAll('.dArc').remove();
            // resetting the opacity
            svg.selectAll('.pie').style('opacity', 1);
        }

        return pieOrDonut;
    })();
    //SegmentedGroupedColumn Chart
    //PI.xChart\src\js\plots\segmentedGroupedColumn.js
    xChart.segmentedGroupedColumn = (function () {
        function segmentedGroupedColumn(renderContainerId, color, chartOptions) {

            //Information stored here will persist
            this.renderContainerId = renderContainerId;
            this.canvasWidth = document.getElementById(this.renderContainerId).offsetWidth;
            this.canvasHeight = document.getElementById(this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.color = color;
            this.axisRedrawThreshold = chartOptions.axisRedrawThreshold;
            this.aec = chartOptions.aec;
            this.chartOptions = chartOptions;

            //To use the helper utility functions
            this.utility = new xChart.utility();
            this.subCategoryScale = [];
            this.xWidth = [];
        }

        // xChart.segmentedGroupedColumn's prototype properties.
        segmentedGroupedColumn.prototype.dispatch = d3.dispatch('RenderComplete');
        segmentedGroupedColumn.prototype.draw = function (data) {
            var color = this.color;
            var margin = this.margin;
            var utility = this.utility;
            var renderContainerId = this.renderContainerId;
            var subCategoryScaleArray = this.subCategoryScale;
            var xWidthArray = this.xWidth;
            var chartOptions = this.chartOptions;
            var el = document.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);

            margin.bottom = 90;

            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select("#" + this.renderContainerId).append("svg")
                .attr("id", this.renderContainerId + "_svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr('class', 'segmentedGroupedColumn');

            var mainGroup = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("id", this.renderContainerId + "_mainGroup")
                .attr('class', 'segmentedGroupedColumn');

            svg = mainGroup;

            //            legend.drawLegend('top', svg, width, margin);

            var si = d3.format('.2s');
            var siMod = function (val) {
                return si(val).replace(/G/, 'B')
            };


            var maxData = d3.max(data.series, function (d) {
                return d3.max(d.data);
            });

            //Series Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.seriesAxis = new xChart.axis(this.renderContainerId, width, height);

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

            var seriesScale = this.seriesAxis.addQuantitativeScale(data.series, 0.1, 0, height, 0, maxData);

            this.yAxis = this.seriesAxis.draw(seriesScale);

            var pointCount = 0;
            var totalDataPointCount = 0;

            data.series.forEach(function (d) {
                totalDataPointCount += d.data.length;
            })

            var xWidth = 0;

            data.categories.forEach(function (d, i) {

                svg.append('line')
                    .style("stroke", "grey")
                    .attr("x1", xWidth)
                    .attr("y1", height)
                    .attr("x2", xWidth)
                    .attr("y2", height + margin.bottom);

                var subCategoryCount = data.series[i].value.length;
                var partialWidth = (subCategoryCount / totalDataPointCount) * width;

                //sub-category axis
                var subCategoryScale = d3.scale.ordinal()
                    .rangeBands([0, partialWidth], 0.025, 0.4)
                    .domain(data.series[i].value);

                subCategoryScaleArray.push(subCategoryScale);

                var subCategoryAxis = d3.svg.axis()
                    .scale(subCategoryScale)
                    .orient("bottom");

                var subCatAxis = svg.append("g")
                    .attr("class", "x axis axis_" + i)
                    .attr("id", renderContainerId + "_xaxis")
                    .attr("transform", "translate(" + xWidth + "," + height + ")")
                    .call(subCategoryAxis)

                var ticks = subCatAxis.selectAll('text')
                    .text(function (e, j) {
                        return data.series[i].name[j].substring(0, 10);
                    });


                subCatAxis.selectAll('path')
                    .style('stroke', 'grey');

                ticks
                    .attr("y", 0)
                    .attr("x", 9)
                    .attr("dy", ".35em")
                    .attr("transform", "rotate(90)")
                    .style("text-anchor", "start");

                //ticks.call(utility.wrap, subCategoryScale.rangeBand());               

                //utility.checkOverlapAndRemove(ticks);

                //category-axis

                var categoryScale = d3.scale.ordinal()
                    .rangeBands([0, partialWidth]);

                categoryScale.domain([d.value]);

                var categoryAxis = d3.svg.axis()
                    .scale(categoryScale)
                    .orient("bottom")
                    .tickSize(0, -margin.bottom / 2 - 55);

                var parentAxis =
                    svg.append("g")
                        .attr("class", "x axis parent")
                        .attr("id", renderContainerId + "_xaxis" + i)
                        .style("stroke-dasharray", ("3, 3"))
                        .attr("transform", "translate(" + xWidth + "," + (height + margin.bottom - 20) + ")")
                        .call(categoryAxis);

                parentAxis.selectAll('.tick line').remove();

                parentAxis.selectAll('path').remove();

                var current_category = d;
                var current_index = i;
                svg.selectAll('.bar .bar_' + i)
                    .data(function () {
                        var rArray = [];
                        for (var x = 0; x < data.series[current_index].value.length; x++) {
                            rArray.push({
                                categoryIndex: current_index,
                                index: current_index,
                                fmtData: data.series[current_index].fmtData[x],
                                data: data.series[current_index].data[x],
                                seriesLongName: data.series[current_index].longName[x],
                                seriesName: data.series[current_index].name[x],
                                seriesValue: data.series[current_index].value[x],
                                seriesIndex: x,
                                categoryValue: current_category.value,
                                categoryName: current_category.name,
                                categoryDimName: current_category.dimName,
                                categoryLongName: current_category.longName
                            });
                        }
                        return rArray;
                    })
                    .enter()
                    .append('rect')
                    .attr('class', 'bar bar_' + i)
                    .attr('x', function (e) {
                        return xWidth + subCategoryScale(e.seriesLongName);
                    })
                    .attr('width', subCategoryScale.rangeBand())
                    .attr('y', height)
                    .attr('height', 0)
                    .style('fill', function (d) {
                        return color[i];
                    })
                    .transition()
                    .duration(1000)
                    .ease('bounce')
                    .attr('y', function (f, j) {
                        return seriesScale(data.series[i].data[j]);
                    })
                    .attr('height', function (f, j) {
                        return Math.abs(seriesScale(data.series[i].data[j]) - height);
                    })
                    .each('end', function (d) {
                        pointCount++;
                        if (pointCount === totalDataPointCount)
                            this.dispatch.RenderComplete(this, data);
                    }.bind(this));

                xWidthArray.push(xWidth);
                xWidth += partialWidth;

            }.bind(this));

            svg.append('line')
                .style("stroke", "grey")
                .attr("x1", xWidth)
                .attr("y1", height)
                .attr("x2", xWidth)
                .attr("y2", height + margin.bottom);

            this.utility.tooltip(svg, '.bar', true, false);
        }


        segmentedGroupedColumn.prototype.redraw = function (data) {
            this.draw(data);
        }

        segmentedGroupedColumn.prototype.drawOverlap = function (overlappedData, originalData) {

            var chartOptions = this.chartOptions;
            var xWidth = this.xWidth;
            var seriesScale = this.seriesAxis.scale;
            var subCategoryScale = this.subCategoryScale;
            var margin = this.margin;
            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select('#' + this.renderContainerId + '_mainGroup');

            svg.selectAll('.overlappedBar')
                .remove();

            originalData.categories.forEach(function (d, i) {
                overlappedData.categories.forEach(function (e, j) {
                    if (d.value === e.value) {
                        var partialWidth = xWidth[i];

                        var current_category = e;
                        var current_index = j;
                        svg.selectAll('.overlappedBar .bar_' + j)
                            .data(function () {
                                var rArray = [];
                                for (var x = 0; x < overlappedData.series[current_index].value.length; x++) {
                                    rArray.push({
                                        fmtData: overlappedData.series[current_index].fmtData[x],
                                        seriesLongName: overlappedData.series[current_index].longName[x],
                                        categoryLongName: current_category.longName
                                    });
                                }
                                return rArray;
                            })
                            .enter()
                            .append('rect')
                            .attr('class', 'overlappedBar bar_' + j)
                            .attr('x', function (f) {
                                return partialWidth + subCategoryScale[i](f.seriesLongName);
                            })
                            .attr('width', subCategoryScale[i].rangeBand())
                            .attr('y', height)
                            .attr('height', 0)
                            .style('fill', '#FFC200')
                            .transition()
                            .duration(1000)
                            .ease('bounce')
                            .attr('y', function (f, k) {
                                return seriesScale(overlappedData.series[j].data[k]);
                            })
                            .attr('height', function (f, k) {
                                return Math.abs(seriesScale(overlappedData.series[j].data[k]) - height);
                            });
                    }
                })
            })
            this.utility.tooltip(svg, '.overlappedBar', true, false);
        }

        segmentedGroupedColumn.prototype.removeOverlap = function (data) {

            var margin = this.margin;
            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select('#' + this.renderContainerId + '_mainGroup');
            svg.selectAll('.overlappedBar')
                .data([])
                .exit()
                .transition()
                .duration(1000)
                .ease('bounce')
                .attr('y', height)
                .attr('height', 0)
                .remove();
        }

        return segmentedGroupedColumn;

    })();
    //StackedBar Chart
    //PI.xChart\src\js\plots\stackedBar.js
    xChart.stackedBar = (function () {
        function stackedBar(renderContainerId, color, chartOptions) {

            //Information stored here will persist
            this.chartOptions = chartOptions;
            this.renderContainerId = renderContainerId;
            this.canvasWidth = document.getElementById(this.renderContainerId).offsetWidth;
            this.canvasHeight = document.getElementById(this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.color = color;
            this.margin.left = 80;

            //To use the helper utility functions
            this.utility = new xChart.utility();

        };

        // xChart.stackedBar's prototype properties.
        stackedBar.prototype.dispatch = d3.dispatch('RenderComplete');

        stackedBar.prototype.draw = function (data) {

            var color = this.color;
            var margin = this.margin;
            var sBStartPoint = [];
            this.sBStartPoint = sBStartPoint;
            var chartOptions = this.chartOptions;
            var el = document.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);

            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select("#" + this.renderContainerId).append("svg")
                .attr("id", this.renderContainerId + "_svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr('class', 'stackedBar');

            var mainGroup = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("id", this.renderContainerId + "_mainGroup")
                .attr('class', 'stackedBar');

            var legend = new xChart.legend(data.series, color);

            //Set options for legend here
            // legend.setOptions({});

            var legendRows = legend.drawLegend('top', mainGroup, width, margin) + 1;
            margin.top = 20 * legendRows;
            mainGroup.selectAll('.legendg').remove();

            height = this.canvasHeight - margin.top - margin.bottom;

            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

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

            var stack = d3.layout.stack();

            dataset = stack(dataset);

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
            this.categoryAxis = new xChart.axis(this.renderContainerId, width, height);

            var categoryAxisOptions = {};
            categoryAxisOptions.ticks = 5;
            categoryAxisOptions.orient = 'left';
            categoryAxisOptions.position = 'vertical';


            this.categoryAxis.setOptions(categoryAxisOptions);

            var categoryScale = this.categoryAxis.addQualitativeScale(data.categories, 0.34, 0.2);

            this.yAxis = this.categoryAxis.draw(categoryScale);

            //Series Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.seriesAxis = new xChart.axis(this.renderContainerId, width, height);

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
                .attr("ry", 1);

            bars
                .attr('x', 0)
                .attr('y', function (d, i) {
                    return categoryScale(d.y);
                })
                .attr('height', function (d) {
                    return categoryScale.rangeBand();
                })
                .attr('width', 0)
                .transition()
                .ease('bounce')
                .duration(1000)
                .attr('x', function (d) {
                    sBStartPoint.push(seriesScale(d.x0));
                    return seriesScale(d.x0);
                })
                .attr('width', function (d) {
                    return seriesScale(d.x);
                })
                .each('end', function (d) {
                    if (d.index === data.categories.length - 1 && d.seriesIndex == data.series.length - 1) {
                        this.dispatch.RenderComplete(this, data);
                    }
                }.bind(this));

            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.bar', true, false);
        }

        stackedBar.prototype.redraw = function (data) {

            this.removeOverlap(data);
            var color = this.color;
            var margin = this.margin;
            var chartOptions = this.chartOptions;
            var axisRedrawThreshold = chartOptions.axisRedrawThreshold;
            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;
            var sBStartPoint = [];
            this.sBStartPoint = sBStartPoint;

            var svg = d3.select("#" + this.renderContainerId + "_svg");

            var mainGroup = d3.select("#" + this.renderContainerId + "_mainGroup");

            var legend = new xChart.legend(data.series, color);

            //Set options for legend here
            // legend.setOptions({});

            var legendRows = legend.drawLegend('top', mainGroup, width, margin) + 1;
            margin.top = 20 * legendRows;
            mainGroup.selectAll('.legendg').remove();

            height = this.canvasHeight - margin.top - margin.bottom;

            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

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

            var stack = d3.layout.stack();

            dataset = stack(dataset);

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
            this.categoryAxis = new xChart.axis(this.renderContainerId, width, height);
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
                    return categoryScale.rangeBand();
                })
                .transition()
                .ease('bounce')
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
                    return categoryScale.rangeBand();
                })
                .transition()
                .ease('bounce')
                .duration(1000)
                .attr('x', function (d) {
                    sBStartPoint.push(seriesScale(d.x0));
                    return seriesScale(d.x0);
                })
                .attr('width', function (d) {
                    return seriesScale(d.x);
                })
                .each('end', function (d) {
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
                        return categoryScale.rangeBand();
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
                            that.dispatch.RenderComplete(that, data);
                        }
                    }.bind(that));

                if (chartOptions.tooltip)
                    that.utility.tooltip(svg, '.bar', true, false);
            }
        }

        stackedBar.prototype.drawOverlap = function (overlappedData, originalData) {

            overlappedData = this.utility.overlapDataPrep(overlappedData, originalData);
            var xScale = this.seriesAxis.scale;
            var yScale = this.categoryAxis.scale;
            var sBStartPoint = this.sBStartPoint;
            var chartOptions = this.chartOptions;
            var svg = d3.select('#' + this.renderContainerId + "_mainGroup");
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
            var stack = d3.layout.stack();
            dataset = stack(dataset);

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
                .ease('bounce')
                .attr('x', function () {
                    return sBStartPoint[xi++];
                })
                .attr('y', function (d, i) {
                    return yScale(d.y);
                })
                .attr('height', function (d) {
                    return yScale.rangeBand();
                })
                .attr('width', function (d) {
                    return xScale(d.x);
                });

            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.overlappedBar', true, false);
        }

        stackedBar.prototype.removeOverlap = function (data) {

            var tempData = [];
            for (var i = data.series.length - 1; i >= 0; i--) {
                tempData.push({});
            }

            var xScale = this.seriesAxis.scale;
            var yScale = this.categoryAxis.scale;
            var svg = d3.select('#' + this.renderContainerId + "_mainGroup");
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
                .ease('bounce')
                .attr('width', 0)
                .remove()
                .each('end', function () {
                    // resetting the opacity
                    svg.selectAll('.bar').style('opacity', 1);

                    var outerBars = svg.selectAll(".overlappedBar");
                    outerBars.remove();
                });;
        }

        return stackedBar;
    })();
    //StackedColumn Chart
    //PI.xChart\src\js\plots\stackedColumn.js
    xChart.stackedColumn = (function () {
        function stackedColumn(renderContainerId, color, chartOptions) {

            //Information stored here will persist
            this.chartOptions = chartOptions;
            this.renderContainerId = renderContainerId;
            this.canvasWidth = document.getElementById(this.renderContainerId).offsetWidth;
            this.canvasHeight = document.getElementById(this.renderContainerId).offsetHeight;
            this.margin = Object.assign({}, chartOptions.margin);
            this.color = color;
            this.axisRedrawThreshold = chartOptions.axisRedrawThreshold;
            this.aec = chartOptions.aec;

            //To use the helper utility functions
            this.utility = new xChart.utility();
        }

        // xChart.stackedColumn's prototype properties.
        stackedColumn.prototype.dispatch = d3.dispatch('RenderComplete');
        stackedColumn.prototype.draw = function (data) {

            var color = this.color;
            var margin = this.margin;
            var sCHeight = [];
            var sCStartPoint = [];
            this.sCHeight = sCHeight;
            this.sCStartPoint = sCStartPoint;
            var chartOptions = this.chartOptions;
            var el = document.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);

            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select("#" + this.renderContainerId).append("svg")
                .attr("id", this.renderContainerId + "_svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr('class', 'stackedColumn');

            var mainGroup = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("id", this.renderContainerId + "_mainGroup")
                .attr('class', 'stackedColumn');

            var axisLabelOverlap = this.utility.draw_xAxisDummy(mainGroup, data.categories, height, width, this.renderContainerId);
            if (axisLabelOverlap) {
                margin.bottom *= 2;
                this.bottomMarginSet = true;
            }

            var legend = new xChart.legend(data.series, color);

            //Set options for legend here
            // legend.setOptions({});

            var legendRows = legend.drawLegend('top', mainGroup, width, margin) + 1;
            margin.top = 20 * legendRows;
            mainGroup.selectAll('.legendg').remove();

            height = this.canvasHeight - margin.top - margin.bottom;

            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            mainGroup.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg = mainGroup;

            legend.drawLegend('top', svg, width, margin);

            var si = d3.format('.2s');
            var siMod = function (val) {
                return si(val).replace(/G/, 'B')
            };


            //Utility function call to add filter def to svg
            this.utility.addLinearFilter(svg, this.renderContainerId);

            var sumArray = [];

            for (var i = 0; i < data.categories.length; i++) {
                var sum = 0;
                for (var j = 0; j < data.series.length; j++) {
                    sum += data.series[j].data[i];
                }
                sumArray.push(sum);
            }

            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new xChart.axis(this.renderContainerId, width, height);

            var categoryAxisOptions = {};
            categoryAxisOptions.ticks = 5;
            categoryAxisOptions.orient = 'bottom';
            categoryAxisOptions.position = 'horizontal';

            this.categoryAxis.setOptions(categoryAxisOptions);

            var categoryScale = this.categoryAxis.addQualitativeScale(data.categories, 0.34, 0.2);
            // var categoryScale=d3.scale.ordinal().domain(data.categories.map(function(d){return d.value}))
            //              .rangeRoundBands([0,width],0.1,0.2);\
            this.categoryScale = categoryScale;
            var axisId;
            this.xAxis = this.categoryAxis.draw(categoryScale, {
                x: 0,
                y: height
            }, axisId, axisLabelOverlap);

            //Series Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.seriesAxis = new xChart.axis(this.renderContainerId, width, height);

            var seriesAxisOptions = {};
            seriesAxisOptions.ticks = 5;
            seriesAxisOptions.tickSize = width;
            seriesAxisOptions.orient = 'left';
            seriesAxisOptions.position = 'vertical';
            seriesAxisOptions.showPath = false;
            seriesAxisOptions.tickFormat = siMod;

            this.seriesAxis.setOptions(seriesAxisOptions);

            var seriesScale = this.seriesAxis.addQuantitativeScale(data.series, 0.1, 0, height, 0, d3.max(sumArray));

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

            //SubCategory Scale to further category into series for each category
            this.subCategoryScale = d3.scale.ordinal()
                .domain(data.series.map(function (d) {
                    return d.value
                })).rangeBands([0, categoryScale.rangeBand()]);

            //var b=this.subCategoryScale;

            //outer groups for grouping the rectangles with same category
            var barGroups = svg.selectAll(".outerbar")
                .data(data.categories)
                .enter()
                .append("g")
                .attr("class", "outerbar")
                .attr("transform", function (d) {
                    return "translate(" + (categoryScale(d.value)) + ",0)";
                }.bind(this));

            //Adding data for rects
            var bars = barGroups
                .selectAll("rect")
                .data(function (d, i) {
                    var rArray = [];
                    var y0 = 0;
                    for (var x = 0; x < data.series.length; x++) {
                        rArray.push({
                            seriesName: data.series[x].name,
                            y0: y0,
                            y1: y0 + data.series[x].data[i],
                            index: i,
                            seriesIndex: x,
                            seriesLongName: data.series[x].longName,
                            seriesValue: data.series[x].value,
                            data: data.series[x].data[i],
                            fmtData: data.series[x].fmtData[i],
                            category: d,
                            categoryLongName: data.categories[i] === null ? '' : data.categories[i].longName,
                            categoryName: d.name,
                            categoryDimName: d.dimName,
                            categoryValue: d.value
                        });
                        y0 += data.series[x].data[i];
                    }
                    return rArray;
                });

            //Adding rects for each data point
            bars.enter()
                .append("rect")
                .attr("class", "bar")
                .style("fill", function (d, i) {
                    return color[i];
                })
                .style("stroke", function (d, i) {
                    return color[i];
                })
                .style("stroke-width", "1")
                .attr("height", function (d) {
                    return 0;
                })
                .attr("y", function (d) {
                    return height;
                })
                .attr("width", categoryScale.rangeBand())
                .transition()
                .ease('bounce')
                .duration(1000)
                .attr("height", function (d) {
                    sCHeight.push(seriesScale(d.y0) - seriesScale(d.y1));
                    return (seriesScale(d.y0) - seriesScale(d.y1))
                })
                .attr("y", function (d) {
                    sCStartPoint.push(seriesScale(d.y1));
                    return seriesScale(d.y1);
                })
                .each('end', function (d) {
                    if (d.index === data.categories.length - 1 && d.seriesIndex == data.series.length - 1) {
                        this.dispatch.RenderComplete(this, data);
                    }
                }.bind(this));

            if (chartOptions.tooltip)
                this.utility.tooltip(svg, '.bar', true, false);
        }

        stackedColumn.prototype.redraw = function (data) {

            this.removeOverlap();

            var color = this.color;
            var margin = this.margin;
            var chartOptions = this.chartOptions;
            var axisRedrawThreshold = chartOptions.axisRedrawThreshold;
            var sCHeight = [];
            var sCStartPoint = [];
            this.sCHeight = sCHeight;
            this.sCStartPoint = sCStartPoint;

            var width = this.canvasWidth - margin.left - margin.right,
                height = this.canvasHeight - margin.top - margin.bottom;

            var svg = d3.select("#" + this.renderContainerId + "_svg");

            var mainGroup = d3.select("#" + this.renderContainerId + "_mainGroup");
            var axisLabelOverlap = this.utility.draw_xAxisDummy(mainGroup, data.categories, height, width, this.renderContainerId);

            var bottomMarginChanged = false;
            if (!axisLabelOverlap && this.bottomMarginSet) {
                margin.bottom /= 2;
                this.bottomMarginSet = false;
                bottomMarginChanged = true;
            } else if (axisLabelOverlap && !this.bottomMarginSet) {
                margin.bottom *= 2;
                this.bottomMarginSet = true;
                bottomMarginChanged = true;
            } else if (axisLabelOverlap && !this.bottomMarginSet) {
                margin.bottom *= 2;
                this.bottomMarginSet = true;
                bottomMarginChanged = true;
            }

            var legend = new xChart.legend(data.series, color);

            //Set options for legend here
            // legend.setOptions({});

            var legendRows = legend.drawLegend('top', mainGroup, width, margin) + 1;
            margin.top = 20 * legendRows;

            mainGroup.selectAll('.legendg').remove();

            height = this.canvasHeight - margin.top - margin.bottom;

            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            mainGroup.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg = mainGroup;

            legend.drawLegend('top', svg, width, margin);

            var si = d3.format('.2s');
            var siMod = function (val) {
                return si(val).replace(/G/, 'B')
            };

            var sumArray = [];

            for (var i = 0; i < data.categories.length; i++) {
                var sum = 0;
                for (var j = 0; j < data.series.length; j++) {
                    sum += data.series[j].data[i];
                }
                sumArray.push(sum);
            }

            //Category Axis -- Create Object-->Set Options-->Add Scale-->Draw
            this.categoryAxis = new xChart.axis(this.renderContainerId, width, height);
            var categoryAxisOptions = {};
            categoryAxisOptions.ticks = 5;
            categoryAxisOptions.orient = 'bottom';
            categoryAxisOptions.position = 'horizontal';
            this.categoryAxis.setOptions(categoryAxisOptions);
            var categoryScale = this.categoryAxis.addQualitativeScale(data.categories, 0.34, 0.2);
            this.categoryScale = categoryScale;
            var axisId;
            this.xAxis = this.categoryAxis.draw(categoryScale, {
                x: 0,
                y: height
            }, axisId, axisLabelOverlap);

            //Series Axis -- Create Object-->Set Options-->Add Scale-->Draw
            var seriesAxis = this.seriesAxis;
            var seriesScale = this.seriesAxis.scale;
            var seriesAxisOptions = {};
            seriesAxisOptions.ticks = 5;
            seriesAxisOptions.tickSize = width;
            seriesAxisOptions.orient = 'left';
            seriesAxisOptions.position = 'vertical';
            seriesAxisOptions.showPath = false;
            seriesAxisOptions.tickFormat = siMod;
            seriesAxis.setOptions(seriesAxisOptions);
            var currentMax = d3.max(sumArray);
            var previousMax = this.seriesAxis.scale.domain()[1] / (1 + this.aec);

            if (Math.abs((previousMax - currentMax) / previousMax) > axisRedrawThreshold) {
                seriesScale = seriesAxis.addQuantitativeScale(data.series, this.aec, 0, height, 0, currentMax);
                this.yAxis = seriesAxis.draw(seriesScale);
                this.seriesAxis = seriesAxis;
            } else {
                if (bottomMarginChanged) {
                    seriesScale = axisRedrawThreshold === 1 ? this.seriesAxis.addQuantitativeScale(data.series, this.aec, 0, height, this.yAxis.scale.domain()[0], previousMax) : this.seriesAxis.addQuantitativeScale(data.series, this.aec, 0, height, 0, currentMax);
                    this.yAxis = seriesAxis.draw(seriesScale);
                    this.seriesAxis = seriesAxis;
                    this.seriesAxis.scale = seriesScale;
                }
            }

            //SubCategory Scale to further category into series for each category
            this.subCategoryScale = d3.scale.ordinal()
                .domain(data.series.map(function (d) {
                    return d.value
                })).rangeBands([0, categoryScale.rangeBand()]);

            var barGroups = svg.selectAll(".outerbar")
                .data(data.categories);

            barGroups.exit().remove();

            barGroups.enter()
                .append('g')
                .attr("class", "outerbar")
                .attr("transform", function (d) {
                    return "translate(" + (categoryScale(d.value) + this.subCategoryScale.rangeBand() / 2) + ",0)";
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
                    var y0 = 0;
                    for (var x = 0; x < data.series.length; x++) {
                        rArray.push({
                            seriesName: data.series[x].name,
                            y0: y0,
                            y1: y0 + data.series[x].data[i],
                            index: i,
                            seriesIndex: x,
                            seriesLongName: data.series[x].longName,
                            seriesValue: data.series[x].value,
                            data: data.series[x].data[i],
                            fmtData: data.series[x].fmtData[i],
                            category: d,
                            categoryLongName: data.categories[i] === null ? '' : data.categories[i].longName,
                            categoryName: d.name,
                            categoryDimName: d.dimName,
                            categoryValue: d.value
                        });
                        y0 += data.series[x].data[i];
                    }
                    return rArray;
                });

            bars.exit().remove();
            //Adding rects for each data point
            bars.enter()
                .append("rect")
                .attr("class", "bar")
                .style("fill", function (d, i) {
                    return color[i];
                })
                .style("stroke", function (d, i) {
                    return color[i];
                })
                .style("stroke-width", "1")
                .attr("height", 0)
                .attr("y", function (d) {
                    return height;
                });

            bars
                .transition()
                .ease('bounce')
                .duration(1000)
                .attr("width", categoryScale.rangeBand())
                .attr("height", function (d) {
                    sCHeight.push(seriesScale(d.y0) - seriesScale(d.y1));
                    return seriesScale(d.y0) - seriesScale(d.y1);
                })
                .attr("y", function (d) {
                    sCStartPoint.push(seriesScale(d.y1));
                    return seriesScale(d.y1);
                })
                .each('end', function (d) {
                    if (d.index === data.categories.length - 1 && d.seriesIndex == data.series.length - 1) {
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
                        var y0 = 0;
                        for (var x = 0; x < data.series.length; x++) {
                            rArray.push({
                                seriesName: data.series[x].name,
                                y0: y0,
                                y1: y0 + data.series[x].data[i],
                                index: i,
                                seriesIndex: x,
                                seriesLongName: data.series[x].longName,
                                seriesValue: data.series[x].value,
                                data: data.series[x].data[i],
                                fmtData: data.series[x].fmtData[i],
                                category: d,
                                categoryLongName: data.categories[i] === null ? '' : data.categories[i].longName,
                                categoryName: d.name,
                                categoryDimName: d.dimName,
                                categoryValue: d.value
                            });
                            y0 += data.series[x].data[i];
                        }
                        return rArray;
                    });

                bars.enter()
                    .append("rect")
                    .attr("class", "bar")
                    .style("fill", function (d, i) {
                        return color[i];
                    })
                    .style("stroke", function (d, i) {
                        return color[i];
                    })
                    .style("stroke-width", "1")
                    .attr("width", categoryScale.rangeBand())
                    .attr("height", function (d) {
                        sCHeight.push(seriesScale(d.y0) - seriesScale(d.y1));
                        return seriesScale(d.y0) - seriesScale(d.y1);
                    })
                    .attr("y", function (d) {
                        sCStartPoint.push(seriesScale(d.y1));
                        return seriesScale(d.y1);
                    })
                    .each(function (d) {
                        if (d.index === (data.categories.length - 1) && d.seriesIndex == (data.series.length - 1)) {
                            that.dispatch.RenderComplete(that, data);
                        }
                    }.bind(that));

                if (chartOptions.tooltip)
                    that.utility.tooltip(svg, '.bar', true, false);
            }
        }

        stackedColumn.prototype.drawOverlap = function (overlappedData, originalData) {

            overlappedData = this.utility.overlapDataPrep(overlappedData, originalData);

            var subCategoryScale = this.subCategoryScale,
                seriesScale = this.seriesAxis.scale,
                categoryScale = this.categoryScale;

            var chartOptions = this.chartOptions;
            var sCHeight = this.sCHeight;
            var sCStartPoint = this.sCStartPoint;

            var svg = d3.select('#' + this.renderContainerId + "_mainGroup");
            // reducing the opacity
            svg.selectAll('.bar').style('opacity', 0.7);

            var b = this.subCategoryScale;

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
                    var y0 = 0;
                    for (var x = 0; x < overlappedData.overlappedSeries.length; x++) {
                        rArray.push({
                            seriesName: overlappedData.overlappedSeries[x].name,
                            y0: y0,
                            y1: y0 + overlappedData.overlappedSeries[x].data[i][0],
                            index: i,
                            seriesLongName: overlappedData.overlappedSeries[x].longName,
                            seriesValue: overlappedData.overlappedSeries[x].value,
                            data: overlappedData.overlappedSeries[x].data[i][0],
                            fmtData: overlappedData.overlappedSeries[x].fmtData[i][0],
                            category: d,
                            categoryLongName: overlappedData.categories[i] == null ? '' : overlappedData.categories[i].longName,
                            categoryName: overlappedData.categories[i].name,
                            categoryValue: overlappedData.categories[i].value,
                            categoryDimName: overlappedData.categories[i].dimName
                        });
                        y0 += overlappedData.overlappedSeries[x].data[i][0];
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
                .attr("width", categoryScale.rangeBand())
                .style("fill", "#FFC200")
                .style("opacity", 1)
                .style("stroke", 'black')
                .style('stroke-width', '0.3px');

            yi = 0;

            overlappedBars.exit().remove();

            overlappedBars.transition()
                .duration(1000)
                .ease('bounce')
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

        stackedColumn.prototype.removeOverlap = function (data) {

            var subCategoryScale = this.subCategoryScale,
                seriesScale = this.seriesAxis.scale,
                categoryScale = this.categoryScale;

            var sCHeight = this.sCHeight;
            var sCStartPoint = this.sCStartPoint;

            var svg = d3.select('#' + this.renderContainerId + "_mainGroup");

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
                .attr("width", categoryScale.rangeBand());

            yi = 0;

            overlappedBars
                .exit()
                .transition()
                .duration(1000)
                .ease('bounce')
                .attr("y", function (d) {
                    var s = (sCStartPoint[yi] + sCHeight[yi]);
                    yi++;
                    return s;
                })
                .attr("height", 0)
                .remove()
                .each('end', function () {
                    // resetting the opacity
                    svg.selectAll('.bar').style('opacity', 1);

                    var outerBars = svg.selectAll(".overlappedBar");
                    outerBars.remove();
                });
        }
        return stackedColumn;
    })();
    // tableKpi
    // PI.xChart\src\js\plots\tableKpi.js
    xChart.tableKpi = (function () {

        function tableKpi(renderContainerId, color, chartOptions) {

            //Information stored here will persist
            this.renderContainerId = renderContainerId;
            this.canvasWidth = document.getElementById(this.renderContainerId).offsetWidth;
            this.canvasHeight = document.getElementById(this.renderContainerId).offsetHeight;
            this.margin = {
                top: 5,
                right: 5,
                bottom: 5,
                left: 5
            };
            this.configuration = chartOptions.gaugeConfiguration;
            this.utility = new xChart.utility();
            this.chartOptions = chartOptions;

        };

        tableKpi.prototype.dispatch = d3.dispatch('RenderComplete');

        tableKpi.prototype.draw = function (data) {

            var chartOptions = this.chartOptions;
            var margin = this.margin;
            var renderContainerId = this.renderContainerId;
            var configuration = Object.assign({}, data.gaugeConfiguration);
            var trendValue;
            var trendData;
            if (data && data.trendValue && data.trendValue.data && !isNaN(data.trendValue.data)) {
                trendData = data.trendValue.data;
                trendValue = data.trendValue.fmtData;
            }


            var config = configuration;

            var el = document.querySelector("#" + this.renderContainerId + "_svg");
            if (el && el.parentElement)
                el.parentElement.removeChild(el);

            var w = this.canvasWidth - margin.left - margin.right,
                h = this.canvasHeight - margin.top - margin.bottom;

            var minSize = Math.min(w, h);
            config.min = undefined != configuration.min ? configuration.min : 0;
            config.max = undefined != configuration.max ? configuration.max : 100;
            config.range = config.max - config.min;

            config.actualValue = configuration.actualValue;
            config.targetValue = configuration.targetValue;
            config.fmtTarget = configuration.fmtTarget;
            config.valueFlag = configuration.valueFlag;

            config.sentiment = configuration.sentiment;

            config.greenColor = configuration.greenColor || "#109618";
            config.yellowColor = configuration.yellowColor || "#FF9900";
            config.redColor = configuration.redColor || "#DC3912";

            config.systemTarget = config.targetValue;
            config.isSystemTarget = true;

            // If no system target is there. 40% more than actual value.
            if (isNaN(config.systemTarget)) {
                config.systemTarget = config.max;
                config.targetValue = config.systemTarget;
                config.isSystemTarget = false;
            }

            if (!config.actualValue)
                config.valueFlag = false;

            var multiplier = minSize / 20;
            var bandHeight = 2 * multiplier;
            var valueBandOffset = 2 * multiplier;
            var valueBandHeight = 1.5 * bandHeight;
            var valueFontSize = multiplier * 3 < 20 ? 20 : multiplier * 3;
            var targetValueFontSize = multiplier * 2 < 15 ? 15 : multiplier * 2;
            var bandOffset = 0;
            var triangleEdgeLength = 20;
            var trendFontSize = multiplier * 2 <= 12 ? 12 : multiplier * 2;
            var triangleColor = "#1E90FF";
            var valueColor = triangleColor;
            var horizontalLineLength = multiplier * 1.5 <= 10 ? 10 : multiplier * 1.5;
            var verticalLineLength = multiplier <= 8 ? 8 : multiplier;

            // setting trend value if present
            if (typeof trendValue != 'undefined' && !isNaN(data.trendValue.data)) {
                var trendTimeRange = data.request.kpiperiodtype;
                if (trendTimeRange)
                    if (trendTimeRange === 'default')
                        trendTimeRange = 'BTD';
                    else
                        trendTimeRange = trendTimeRange.toUpperCase();

                var trendStartPoint = {},
                    trendEndPoint = {},
                    firstHop = {},
                    secondHop = {},
                    trendLineColor,
                    trendValueColor,
                    trendTriangleRotation,
                    difference;

                trendValueColor = '#000000';
                if (config.actualValue && trendData)
                    difference = config.actualValue - trendData;
                else
                    difference = 0;

                trendLineColor = "#C8C8C8";

                //color setting
                if (config.sentiment === 'up') {
                    if (difference > 0)
                        trendLineColor = config.greenColor;
                    else if (difference < 0)
                        trendLineColor = config.redColor;
                } else {
                    if (difference > 0)
                        trendLineColor = config.redColor;
                    else if (difference < 0)
                        trendLineColor = config.greenColor;
                }
                trendTriangleRotation = 30;

                trendStartPoint = {
                    x: 0,
                    y: 0
                };
                trendEndPoint = {
                    x: 1.5 * horizontalLineLength,
                    y: 0
                };

                // point setting
                if ((config.sentiment === 'down' && difference < 0) || (config.sentiment === 'up' && difference < 0)) {
                    trendRotation = 90;
                    trendGroupPosition = {
                        x: (w - 6 * multiplier),
                        y: (0.8 * multiplier)
                    }

                } else if ((config.sentiment === 'up' && difference > 0) || (config.sentiment === 'down' && difference > 0)) {
                    trendRotation = -90;
                    trendGroupPosition = {
                        x: (w - 6 * multiplier),
                        y: (4 * multiplier + 5)
                    }

                } else {
                    trendRotation = 0;
                    trendGroupPosition = {
                        x: (w - 7 * multiplier),
                        y: (2 * multiplier)
                    }
                }
            }

            var rangeScale = d3.scale.linear()
                .domain([config.min, config.max])
                .range([0, (w - triangleEdgeLength)]);

            if (config.isSystemTarget)
                valueColor = getColor(config.actualValue);

            var kpiBody = d3.select("#" + renderContainerId)
                .append("svg")
                .attr("id", renderContainerId + '_svg')
                .attr("width", w)
                .attr("height", h)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "tableKpi");

            var text = kpiBody.append('g')
                .attr('transform', "translate(" + (2 * multiplier) + "," + (h - valueBandHeight - 2 * valueBandOffset) + ")")
                .append('text');

            // Show the actual value if available
            if (config.actualValue)
                text.append('tspan')
                    .data([config.actualValue])
                    .text(config.min)
                    .attr('class', 'valueText')
                    .style('font-family', 'sans-serif')
                    .style('font-size', valueFontSize)
                    .style("fill", valueColor)
                    .transition()
                    .duration(1000)
                    .tween("text", function (d) {
                        var i = d3.interpolate(this.textContent, d);
                        var thisObj = this;
                        return function (t) {
                            this.textContent = (Math.round(i(t)));
                        };
                    })
                    .each('end', function (d) {
                        this.textContent = data.fmtValue;
                    });
            else
                text.append('tspan')
                    .text('No Value')
                    .style('font-family', 'sans-serif')
                    .style('font-size', '25');

            // Show the target value if available
            if (config.isSystemTarget && config.valueFlag)
                text.append('tspan')
                    .text(" / " + config.fmtTarget)
                    .attr('class', 'valueText')
                    .style('font-family', 'sans-serif')
                    .style('font-size', targetValueFontSize)
                    .style("fill", valueColor);

            // draw the trend according to sentiment of kpi
            if (typeof trendValue != 'undefined' && data && !isNaN(data.trendValue.data) && data.request && data.request.kpiperiodtype && data.request.kpiperiodtype !== 'default') {

                var trendGroup = kpiBody.append('g')
                    .attr('transform', 'translate(' + trendGroupPosition.x + ',' + trendGroupPosition.y + ')rotate(' + trendRotation + ')');

                // show the trend value
                kpiBody.append('text')
                    .attr('x', w - 8 * multiplier)
                    .attr('y', 3 * multiplier)
                    .text(trendValue)
                    .style("font-size", trendFontSize)
                    .attr("font-weight", "bold")
                    .attr("text-anchor", "end")
                    .style("fill", trendValueColor);

                // show the trend line
                trendGroup.append('line')
                    .attr("x1", trendStartPoint.x)
                    .attr("y1", trendStartPoint.y)
                    .attr("x2", trendEndPoint.x)
                    .attr("y2", trendEndPoint.y)
                    .attr('class', 'trendLine')
                    .style('display', 'block')
                    .style("stroke", trendLineColor)
                    .style("stroke-width", "2px");

                trendGroup.append("path")
                    .attr('class', 'trendCircle')
                    .attr("d", d3.svg.symbol().type('triangle-down').size(30))
                    .style("fill", trendLineColor)
                    .attr("transform", "translate(" + trendEndPoint.x + "," + (trendEndPoint.y + 1) + ")rotate(" + trendTriangleRotation + ")");

                // show  trend time range
                if (trendTimeRange)
                    kpiBody.append('text')
                        .attr('x', 3 * multiplier)
                        .attr('y', 3 * multiplier)
                        .text(trendTimeRange)
                        .style("font-size", trendFontSize)
                        .attr("font-weight", "bold")
                        .attr("text-anchor", "start")
                        .style("fill", trendValueColor);
            }
            // draw the RAG bands if target is there else blue band.
            var bandGroup = kpiBody.append('g').attr('transform', 'translate(' + 10 + ',' + (valueBandHeight - valueBandOffset) + ')');

            if (config.isSystemTarget) {
                for (var index in config.greenZones) {
                    drawBand(config.greenZones[index].from, config.greenZones[index].to, config.greenColor, bandHeight, bandOffset, false);
                }
                for (var index in config.yellowZones) {
                    drawBand(config.yellowZones[index].from, config.yellowZones[index].to, config.yellowColor, bandHeight, bandOffset, false);
                }
                for (var index in config.redZones) {
                    drawBand(config.redZones[index].from, config.redZones[index].to, config.redColor, bandHeight, bandOffset, false);
                }

                // draw the value and target bands.

                drawBand(config.min, config.actualValue, "#C8C8C8", valueBandHeight, valueBandOffset, true);

                drawBand(config.actualValue, config.max, "#F0F0F0", valueBandHeight, valueBandOffset, true);

            }


            // show the target with a triangle if target is present.
            if (config.isSystemTarget)
                bandGroup.append("path")
                    .data([config.systemTarget])
                    .attr('class', 'triangle')
                    .attr("d", d3.svg.symbol().type('triangle-down').size(40))
                    .style("fill", "#1E90FF")
                    .attr("transform", "translate(" + rangeScale(config.min) + ',' + (h - valueBandOffset - valueBandHeight - 3) + ")")
                    .transition()
                    .duration(1000)
                    .attr("transform", "translate(" + rangeScale(config.systemTarget) + ',' + (h - valueBandOffset - valueBandHeight) + ")");

            function drawBand(start, end, color, height, offset, transition) {
                if (0 >= end - start) return;

                var bandWidth = rangeScale(end) - rangeScale(start);
                var data = Math.round(((end - start) / config.range) * 100);

                bandGroup
                    .data([data])
                    .append('rect')
                    .attr('class', 'kpi')
                    .attr('height', height)
                    .attr('y', h - height - offset)
                    .attr('rx', '1')
                    .attr('ry', '1')
                    .style("fill", color)
                    .style('opacity', 1)
                    .attr('x', function () {
                        if (transition)
                            return 0;
                        else
                            return rangeScale(start);
                    })
                    .attr("width", function () {
                        if (transition)
                            return 0;
                        else
                            return bandWidth;
                    })
                    .transition()
                    .duration(1000)
                    .attr('width', bandWidth)
                    .attr('x', rangeScale(start));
            }

            function getColor(data) {
                var valueColor = '#1E90FF';
                if (data >= config.greenZones[0].from && data <= config.greenZones[0].to)
                    valueColor = config.greenColor;
                else if (data >= config.redZones[0].from && data <= config.redZones[0].to)
                    valueColor = config.redColor;
                else if (data >= config.yellowZones[0].from && data <= config.yellowZones[0].to)
                    valueColor = config.yellowColor;
                return valueColor;
            }

            this.utility.tooltip(bandGroup, '.kpi', false, false);
            this.utility.tooltip(kpiBody, '.triangle', false, false);
        }

        tableKpi.prototype.redraw = function (data) {
            this.draw(data);
        }

        tableKpi.prototype.drawOverlap = function (data, originalData) {
            this.draw(data);
        }

        tableKpi.prototype.removeOverlap = function (data) {
            this.draw(data);
        }

        return tableKpi;

    })();
    //xChart utility functions start
    xChart.utility = function () {
        //Adds filter defination to the svg -- 3D illusion
        this.addLinearFilter = function (svg, renderContainerId) {
            var defs = svg.append('defs');

            // append filter element
            var filter = defs.append('filter')
                .attr('id', renderContainerId + 'dropshadow') /// !!! important - define id to reference it later

            // append gaussian blur to filter
            filter.append('feGaussianBlur')
                .attr('in', 'SourceAlpha')
                .attr('stdDeviation', 1) // !!! important parameter - blur
                .attr('result', 'blur');

            // append offset filter to result of gaussion blur filter
            filter.append('feOffset')
                .attr('in', 'blur')
                .attr('dx', 0) // !!! important parameter - x-offset
                .attr('dy', 1) // !!! important parameter - y-offset
                .attr('result', 'offsetBlur');

            // merge result with original image
            var feMerge = filter.append('feMerge');

            // first layer result of blur and offset
            feMerge.append('feMergeNode')
                .attr('in", "offsetBlur')

            // original image on top
            feMerge.append('feMergeNode')
                .attr('in', 'SourceGraphic');
        }

        this.addRadialFilter = function (svg, renderContainerId) {
            var defs = svg.append('defs');

            // append filter element
            var filter = defs.append('filter')
                .attr('id', renderContainerId + 'dropshadow') /// !!! important - define id to reference it later

            filter.append("feGaussianBlur")
                .attr("in", "SourceAlpha")
                .attr("stdDeviation", 3)
                .attr("result", "blur");
            filter.append("feOffset")
                .attr("in", "blur")
                .attr("dx", 3)
                .attr("dy", 3)
                .attr("result", "offsetBlur");
            filter.append("feOffset")
                .attr("in", "SourceGraphic")
                .attr("dx", 3)
                .attr("dy", 3)
                .attr("result", "plainOffset");
            filter.append("feComposite")
                .attr("operator", "out")
                .attr("in", "SourceGraphic")
                .attr("in2", "plainOffset")
                .attr("result", "preHighlight");
            filter.append("feColorMatrix")
                .attr("type", "matrix")
                .attr("values", "0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0")
                .attr("result", "preHighlightWhite");
            filter.append("feGaussianBlur")
                .attr("stdDeviation", 3)
                .attr("result", "preHighlightBlur");
            filter.append("feComposite")
                .attr("operator", "in")
                .attr("in2", "SourceGraphic")
                .attr("result", "Highlight");
            filter.append("feComposite")
                .attr("operator", "over")
                .attr("in2", "SourceGraphic")
                .attr("result", "final");
            filter.append("feComposite")
                .attr("operator", "over")
                .attr("in2", "offsetBlur")
                .attr("result", "finalWithDrop");

        }
        //Check if chart exists - Helper used by render function of xChart.chart
        this.checkChart = function (chart, color, renderContainerId, chartOptions) {

            if (chartOptions.chartType === 'line') {
                if (chart instanceof xChart.line)
                    return chart;
                else
                    return new xChart.line(renderContainerId, color, chartOptions);
            } else if (chartOptions.chartType === 'area') {
                if (chart instanceof xChart.area)
                    return chart;
                else
                    return new xChart.area(renderContainerId, color, chartOptions);
            } else if (chartOptions.chartType === 'barKpi') {
                if (chart instanceof xChart.groupedColumn)
                    return chart;
                else
                    return new xChart.groupedColumn(renderContainerId, color, chartOptions);
            } else if (chartOptions.chartType === 'groupedColumn') {
                if (chart instanceof xChart.groupedColumn)
                    return chart;
                else
                    return new xChart.groupedColumn(renderContainerId, color, chartOptions);
            } else if (chartOptions.chartType === 'segmentedGroupedColumn') {
                if (chart instanceof xChart.segmentedGroupedColumn)
                    return chart;
                else
                    return new xChart.segmentedGroupedColumn(renderContainerId, color, chartOptions);
            } else if (chartOptions.chartType === 'stackedColumn') {
                if (chart instanceof xChart.stackedColumn)
                    return chart;
                else
                    return new xChart.stackedColumn(renderContainerId, color, chartOptions);
            } else if (chartOptions.chartType === 'groupedBar') {
                if (chart instanceof xChart.groupedBar)
                    return chart;
                else
                    return new xChart.groupedBar(renderContainerId, color, chartOptions);
            } else if (chartOptions.chartType === 'stackedBar') {
                if (chart instanceof xChart.stackedBar)
                    return chart;
                else
                    return new xChart.stackedBar(renderContainerId, color, chartOptions);
            } else if (chartOptions.chartType === 'pie') {
                if (chart instanceof xChart.pieOrDonut && chart.chartType === 'pie')
                    return chart;
                else
                    return new xChart.pieOrDonut(renderContainerId, chartOptions);
            } else if (chartOptions.chartType === 'donut') {
                if (chart instanceof xChart.pieOrDonut && chart.chartType === 'donut')
                    return chart;
                else
                    return new xChart.pieOrDonut(renderContainerId, chartOptions);
            } else if (chartOptions.chartType === 'bubble') {
                if (chart instanceof xChart.bubble)
                    return chart;
                else
                    return new xChart.bubble(renderContainerId, color, chartOptions);
            } else if (chartOptions.chartType === 'mapview') {
                if (chart instanceof xChart.map)
                    return chart;
                else
                    return new xChart.map(renderContainerId, color, chartOptions);
            } else if (chartOptions.chartType === 'kpi') {
                if (chart instanceof xChart.kpi)
                    return chart;
                else
                    return new xChart.kpi(renderContainerId, color, chartOptions);
            } else if (chartOptions.chartType === 'tablekpi') {
                if (chart instanceof xChart.tableKpi)
                    return chart;
                else
                    return new xChart.tableKpi(renderContainerId, color, chartOptions);
            } else if (chartOptions.chartType === 'gauge') {
                if (chart instanceof xChart.gauge)
                    return chart;
                else
                    return new xChart.gauge(renderContainerId, color, chartOptions);

            } else if (chartOptions.chartType === 'normalizedStackedColumn') {
                if (chart instanceof xChart.normalizedStackedColumn)
                    return chart;
                else
                    return new xChart.normalizedStackedColumn(renderContainerId, color, chartOptions);

            } else if (chartOptions.chartType === 'pareto') {
                if (chart instanceof xChart.pareto)
                    return chart;
                else
                    return new xChart.pareto(renderContainerId, color, chartOptions);
            } else {
                return chart;
            }
        };
        //Removes overlapped ticks if the and returns true if the removed ticks cross the specified threshold
        this.checkOverlapAndRemove = function (ticks, orientation) {
            var removedTickCount = 0;
            for (var j = 0; j < ticks[0].length; j++) {
                var c = ticks[0][j],
                    n = ticks[0][j + 1];
                if (!c || !n || !c.getBoundingClientRect || !n.getBoundingClientRect)
                    continue;
                if (orientation === 'vertical') {
                    while (c.getBoundingClientRect().bottom > n.getBoundingClientRect().top) {
                        d3.select(n).remove();
                        j++;
                        n = ticks[0][j + 1];
                        if (!n)
                            break;
                    }
                } else {
                    while (c.getBoundingClientRect().right > n.getBoundingClientRect().left) {
                        d3.select(n).remove();
                        removedTickCount++;
                        j++;
                        n = ticks[0][j + 1];
                        if (!n)
                            break;
                    }
                }
            }

            if ((removedTickCount / ticks[0].length) >= 0.2)
                return true;
            else
                return false;
        };
        //Segregates the data to multiple chart arrays and axis array
        //Used by groupedColumnChart for segregating line and bar series
        this.dataPrep = function (data) {
            var returnObj = {
                seriesForLineChart: [],
                seriesForChart: [],
                axesGroups: []
            }
            var count = 0;

            data.series.sort(function (a, b) {
                return a.axis - b.axis;
            });

            for (var i = 0; i < data.series.length; i++) {
                if (data.series[i].line == true) {
                    var obj = {};
                    obj.series = data.series[i];
                    obj.index = i;
                    returnObj.seriesForLineChart.push(obj);
                } else {
                    var obj = {};
                    obj.series = data.series[i];
                    obj.index = i;
                    returnObj.seriesForChart.push(obj);
                }

                if (data.series[i].axis == count + 1) {
                    if (typeof returnObj.axesGroups[count] == 'undefined')
                        returnObj.axesGroups[count] = [];
                    returnObj.axesGroups[count].push(data.series[i]);
                } else if (data.series[i].axis > count + 1) {
                    count++;
                    returnObj.axesGroups[count] = [];
                    returnObj.axesGroups[count].push(data.series[i]);
                } else {
                    if (typeof returnObj.axesGroups[0] == 'undefined')
                        returnObj.axesGroups[0] = [];
                    returnObj.axesGroups[0].push(data.series[i]);
                    data.series[i].axis = 1;
                }
            }

            return returnObj;

        }
        this.draw_xAxisDummy = function (svg, categories, height, width, renderContainerId) {

            var wrap = this.wrap;

            var x0 = d3.scale.ordinal()
                .rangeRoundBands([0, width], 0.1, 0.2);


            var names = categories.map(function (d) {
                return d.name;
            });
            var values = categories.map(function (d) {
                return d.value;
            });
            x0.domain(values);

            var xAxis = d3.svg.axis()
                .scale(x0)
                .orient("bottom");

            var ticks = '';

            d3.select("#" + renderContainerId + "_xaxis").remove();


            ticks = svg.append("g")
                .attr("class", "x axis")
                .attr("id", renderContainerId + "_xaxis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll('text')
                .text(function (d, i) {
                    return categories[i].name;
                })
                .call(wrap, x0.rangeBand());

            var overlap = this.checkOverlapAndRemove(ticks);

            svg.select('.x.axis').remove();

            return overlap;
        }
        // Prepare the data in a proper format to draw overlapped charts
        this.overlapDataPrep = function (Odata, data) {

            var overlappedData = Object.assign({}, Odata);
            var originalData = Object.assign({}, data);

            var tempCategories = [];
            for (var i = 0; i < originalData.categories.length; ++i) {
                tempCategories.push(originalData.categories[i]);
            }

            var tempSeries = [];
            for (var i = 0; i < originalData.series.length; ++i) {
                tempSeries.push(originalData.series[i]);
                for (var n = 0; n < originalData.series[i].data.length; ++n) {
                    tempSeries[i].data[n] = [0];
                    tempSeries[i].fmtData[n] = ['0'];
                }
            }

            function getOverlappedCategoryIndex(i, overlappedData, originalData) {
                for (var j = 0; j < overlappedData.categories.length; ++j) {
                    if (originalData.categories[i].value == overlappedData.categories[j].value) {
                        return j;
                    }
                }
                return -1;
            }

            function getOverlappedSeriesIndex(i, overlappedData, originalData) {
                for (var j = 0; j < overlappedData.overlappedSeries.length; ++j) {
                    if (originalData.series[i].value == overlappedData.overlappedSeries[j].value) {
                        return j;
                    }
                }
                return -1;
            }

            for (var i = 0; i < tempCategories.length; ++i) {
                for (var j = 0; j < tempSeries.length; ++j) {
                    var catIndex = getOverlappedCategoryIndex(i, overlappedData, originalData);
                    if (catIndex < 0)
                        continue;
                    var seriesIndex = getOverlappedSeriesIndex(j, overlappedData, originalData);
                    if (seriesIndex < 0)
                        continue;
                    var dataValue = overlappedData.overlappedSeries[seriesIndex].data[catIndex][0];
                    var fmtDataValue = overlappedData.overlappedSeries[seriesIndex].fmtData[catIndex][0];
                    tempSeries[j].data[i] = [dataValue];
                    tempSeries[j].fmtData[i] = [fmtDataValue];
                }
            }
            overlappedData.categories = tempCategories;
            overlappedData.overlappedSeries = tempSeries;

            return overlappedData;
        }
        //Using tipsy.js to add tooltip to chartItems
        //Default Behaviour -- No explicit options -- Feel free to add
        this.tooltip = function (svg, element, detailed, circular) {
            // if (!detailed && element == '.legend') {
            //     $(element).tipsy({
            //         gravity: 's',
            //         html: true,
            //         title: function() {
            //             var d = this.__data__;
            //             var legendName;
            //             if (typeof d.longName != 'undefined')
            //                 legendName = d.longName;
            //             else
            //                 legendName = d.categoryLongName;

            //             var borderColor = this.style.fill;
            //             return '<div style="padding: 5px; border-color: ' + borderColor + '; border-style: solid; border-width: 1px; display: inline-block; position: relative; box-shadow: 1px 1px 2px rgba(0,0,0,0.24);background: #FFF;color: #000;font-family: \'Roboto Light\' !important;font-size:11px;">' + legendName + '<br/><span style="position: absolute;left:calc(50% - 5px); bottom: -6px; background: #FFF; display: block; width: 10px; height: 10px; border-left: 1px solid ' + borderColor + '; border-bottom: 1px solid ' + borderColor + '; -moz-transform: rotate(-45deg); -webkit-transform: rotate(-45deg); -ms-transform: rotate(-45deg); box-shadow: -1px 2px 1px rgba(0,0,0,0.24); "></span></div>';
            //         }
            //     });
            // } else if (!detailed && element == '.kpi') {
            //     $(element).tipsy({
            //         gravity: 's',
            //         html: true,
            //         title: function() {
            //             var d = this.__data__;
            //             if (typeof d == 'object')
            //                 d = d.data;
            //             var borderColor = this.style.fill;
            //             return '<div style="padding: 5px; border-color: ' + borderColor + '; border-style: solid; border-width: 1px; display: inline-block; position: relative; box-shadow: 1px 1px 2px rgba(0,0,0,0.24);background: #FFF;color: #000;font-family: \'Roboto Light\' !important;font-size:11px;">' + d + '%<br/><span style="position: absolute;left:calc(50% - 5px); bottom: -6px; background: #FFF; display: block; width: 10px; height: 10px; border-left: 1px solid ' + borderColor + '; border-bottom: 1px solid ' + borderColor + '; -moz-transform: rotate(-45deg); -webkit-transform: rotate(-45deg); -ms-transform: rotate(-45deg); box-shadow: -1px 2px 1px rgba(0,0,0,0.24); "></span></div>';
            //         }
            //     });
            // } else if (detailed && element == '.paretoCircle') {
            //     $(element).tipsy({
            //         gravity: 's',
            //         html: true,
            //         title: function() {
            //             var d = this.__data__;
            //             d = d.cumulativePercentage;
            //             var borderColor = this.style.stroke;
            //             return '<div style="padding: 5px; border-color: ' + borderColor + '; border-style: solid; border-width: 1px; display: inline-block; position: relative; box-shadow: 1px 1px 2px rgba(0,0,0,0.24);background: #FFF;color: #000;font-family: \'Roboto Light\' !important;font-size:11px;">' + d + '%<br/><span style="position: absolute;left:calc(50% - 5px); bottom: -6px; background: #FFF; display: block; width: 10px; height: 10px; border-left: 1px solid ' + borderColor + '; border-bottom: 1px solid ' + borderColor + '; -moz-transform: rotate(-45deg); -webkit-transform: rotate(-45deg); -ms-transform: rotate(-45deg); box-shadow: -1px 2px 1px rgba(0,0,0,0.24); "></span></div>';
            //         }
            //     });
            // } else if (!detailed && element == '.triangle') {
            //     $(element).tipsy({
            //         gravity: 's',
            //         html: true,
            //         title: function() {
            //             var d = this.__data__;
            //             var borderColor = this.style.fill;
            //             return '<div style="padding: 5px; border-color: ' + borderColor + '; border-style: solid; border-width: 1px; display: inline-block; position: relative; box-shadow: 1px 1px 2px rgba(0,0,0,0.24);background: #FFF;color: #000;font-family: \'Roboto Light\' !important;font-size:11px;">' + d + '<br/><span style="position: absolute;left:calc(50% - 5px); bottom: -6px; background: #FFF; display: block; width: 10px; height: 10px; border-left: 1px solid ' + borderColor + '; border-bottom: 1px solid ' + borderColor + '; -moz-transform: rotate(-45deg); -webkit-transform: rotate(-45deg); -ms-transform: rotate(-45deg); box-shadow: -1px 2px 1px rgba(0,0,0,0.24); "></span></div>';
            //         }
            //     });
            // } else if (!detailed && element == '.tick') {
            //     $(element).tipsy({
            //         gravity: 's',
            //         html: true,
            //         title: function() {
            //             var d = this.__data__;
            //             var borderColor = this.style.fill;
            //             return '<div style="padding: 5px; border-color: ' + borderColor + '; border-style: solid; border-width: 1px; display: inline-block; position: relative; box-shadow: 1px 1px 2px rgba(0,0,0,0.24);background: #FFF;color: #000;font-family: \'Roboto Light\' !important;font-size:11px;">' + d + '<span style="position: absolute;left:calc(50% - 5px); bottom: -6px; background: #FFF; display: block; width: 10px; height: 10px; border-left: 1px solid ' + borderColor + '; border-bottom: 1px solid ' + borderColor + '; -moz-transform: rotate(-45deg); -webkit-transform: rotate(-45deg); -ms-transform: rotate(-45deg); box-shadow: -1px 2px 1px rgba(0,0,0,0.24); "></span></div>';
            //         }
            //     });
            // } else if (detailed && !circular) {
            //     $(element).tipsy({
            //         gravity: 's',
            //         html: true,
            //         title: function() {
            //             var d = this.__data__;
            //             var borderColor = this.style.fill;
            //             if (element === '.areacircle')
            //                 borderColor = this.style.stroke;
            //             return '<div style="padding: 5px; border-color: ' + borderColor + '; border-style: solid; border-width: 1px; display: inline-block; position: relative; box-shadow: 1px 1px 2px rgba(0,0,0,0.24);background: #FFF;color: #000;font-family: \'Roboto Light\' !important;font-size:11px;">' + d.fmtData + '<br/>' + d.seriesLongName + '<br/>' + d.categoryLongName + '<br/><span style="position: absolute;left:calc(50% - 5px); bottom: -6px; background: #FFF; display: block; width: 10px; height: 10px; border-left: 1px solid ' + borderColor + '; border-bottom: 1px solid ' + borderColor + '; -moz-transform: rotate(-45deg); -webkit-transform: rotate(-45deg); -ms-transform: rotate(-45deg); box-shadow: -1px 2px 1px rgba(0,0,0,0.24); "></span></div>';
            //         }
            //     });
            // } else if (!detailed && !circular) {
            //     $(element).tipsy({
            //         gravity: 's',
            //         html: true,
            //         title: function() {
            //             if (typeof this.__data__ != 'undefined') {
            //                 var d = this.__data__;
            //                 var borderColor = this.style.fill;
            //                 return '<div style="padding: 5px; border-color: ' + borderColor + '; border-style: solid; border-width: 1px; display: inline-block; position: relative; box-shadow: 1px 1px 2px rgba(0,0,0,0.24);background: #FFF;color: #000;font-family: \'Roboto Light\' !important;font-size:11px;">' + d + ' <br/><span style="position: absolute;left:calc(50% - 5px); bottom: -6px; background: #FFF; display: block; width: 10px; height: 10px; border-left: 1px solid ' + borderColor + '; border-bottom: 1px solid ' + borderColor + '; -moz-transform: rotate(-45deg); -webkit-transform: rotate(-45deg); -ms-transform: rotate(-45deg); box-shadow: -1px 2px 1px rgba(0,0,0,0.24); "></span></div>';
            //             }
            //         }
            //     });
            // } else if (detailed && circular) {
            //     $(element).tipsy({
            //         gravity: 's',
            //         html: true,
            //         title: function() {
            //             var d = this.__data__;
            //             var borderColor = this.style.fill;
            //             return '<div style="padding: 5px; border-color: ' + borderColor + '; border-style: solid; border-width: 1px; display: inline-block; position: relative; box-shadow: 1px 1px 2px rgba(0,0,0,0.24);background: #FFF;color: #000;font-family: \'Roboto Light\' !important;font-size:11px;">' + d.percent + '%<br/>' + d.seriesLongName + '<br/>' + d.categoryLongName + '<br/><span style="position: absolute;left:calc(50% - 5px); bottom: -6px; background: #FFF; display: block; width: 10px; height: 10px; border-left: 1px solid ' + borderColor + '; border-bottom: 1px solid ' + borderColor + '; -moz-transform: rotate(-45deg); -webkit-transform: rotate(-45deg); -ms-transform: rotate(-45deg); box-shadow: -1px 2px 1px rgba(0,0,0,0.24); "></span></div>';
            //         }
            //     });
            // }

        }
        //Wraps the text labels in the axis
        this.wrap = function wrap(axisText, avaiableWidth, axisOrientation) {

            if (axisOrientation === 'vertical')
                axisText.each(function () {
                    var text = d3.select(this);
                    var newText = text.text();
                    newText = newText.substring(0, 7).concat('...');
                    this.textContent = newText;
                })
            else
                axisText.each(function () {
                    var text = d3.select(this),
                        allWords = text.text().split(/\s+/).reverse(),
                        w,
                        lineHeight = 1.1,
                        lineNo = 0,
                        lineArr = [],
                        y = text.attr("y"),
                        dy = parseFloat(text.attr("dy")),
                        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                    while (w = allWords.pop()) {
                        if (lineNo > 0) {
                            return;
                        }
                        lineArr.push(w);
                        tspan.text(lineArr.join(" "));
                        var computedWidth; // handling IE exception
                        try {
                            computedWidth = tspan.node().getComputedTextLength();
                        } catch (eee) {
                            computedWidth = tspan.node().childNodes[0].length * 8;
                        }
                        if (computedWidth > avaiableWidth) {
                            lineArr.pop();
                            tspan.text(lineArr.join(" "));
                            lineArr = [w];
                            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNo * lineHeight + dy + "em").text(w);
                        }
                    }
                });
        };
    };

    //End of xChart utility
    return xChart;
}));

//End of closure wrapper