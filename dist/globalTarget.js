//Please include xCharts.js in the index.html
//The foleetilowing adds method to the xChart object defined in global namespace
//This augments methods to the prototype object of the respective xCharts objects

//xCharts Extension -- Not part of the library
(function(xChart, d3) {
    var chart = xChart.chart.prototype;
    var groupedColumn = xChart.groupedColumn.prototype;

    chart.setGlobalTarget = function(dataItem, targetType) {
        if (this.chartOptions.chartType === 'groupedColumn')
            this.renderedChart.setGlobalTarget(dataItem, targetType);
    }

    chart.updateGlobalTargetId = function(id, dataItem) {
        if (this.chartOptions.chartType === 'groupedColumn')
            this.renderedChart.updateGlobalTargetId(id, dataItem);
    }

    chart.showGlobalTargets = function(chartClientId, renderId) {
        if (this.chartOptions.chartType === 'groupedColumn')
            this.renderedChart.showGlobalTargets(chartClientId, renderId);
    }

    chart.updateDeleteGlobalTargetFromPanel = function(value) {
        if (this.chartOptions.chartType === 'groupedColumn')
            this.renderedChart.updateDeleteGlobalTargetFromPanel(value);
    }

    groupedColumn.dispatch.on('RenderComplete.globalTarget', function(data, seriesForChart, that) {

        var renderContainerId = that.renderContainerId;
        var color = that.color;
        var margin = that.margin;
        var width = that.canvasWidth - that.margin.left - that.margin.right,
            height = that.canvasHeight - that.margin.top - that.margin.bottom;
        var svg = d3.select('#' + renderContainerId + '_mainGroup');

        var seriesScales = that.seriesScales;
        var subCategoryScale = that.subCategoryScale;

        var targetDragEnd = that.chartOptions.globalTargetDragEnd;
        var updateTargetSentiment = that.chartOptions.updateGlobalTargetSentiment;
        var deleteTarget = that.chartOptions.deleteGlobalTarget;

        //User-Defined Targets

        var globalTargets = svg
            .selectAll('.globalTargetSvg')
            .data(function(d, i) {
                var targetAry = [];
                for (var x = 0; x < data.series.length; x++) {
                    var targetId = -1,
                        targetValue = -1,
                        sentiment = null

                    if (typeof(data.series[x].globalTargetData) != "undefined" && typeof(data.series[x].globalTargetData.sentiment) != "undefined" && typeof(data.series[x].globalTargetData.targetValue) != 'undefined' && typeof(data.series[x].globalTargetData.Id) != "undefined") {
                        targetId = data.series[x].globalTargetData.Id;
                        targetValue = data.series[x].globalTargetData.targetValue;
                        sentiment = data.series[x].globalTargetData.sentiment;
                    }
                    targetAry.push({
                        renderId: x,
                        sentiment: sentiment,
                        targetId: targetId,
                        targetValue: targetValue,
                        renderContainerId: renderContainerId,
                        seriesName: data.series[x].name,
                        seriesLongName: data.series[x].longName,
                        seriesValue: data.series[x].value,
                        axis: data.series[x].axis,
                        seriesIndex: x,
                        dimension: data.categories[0].dimName,
                        isSystemTarget: typeof(contextType) != 'undefined'
                    });
                }
                return targetAry;
            });

        var foreignObject = globalTargets
            .enter()
            .append('foreignObject')
            .attr("class", "globalTargetForeignObj")
            .attr('id', function(d) {
                return 'gt_' + renderContainerId + "_" + d.renderId + '_foreignObj';
            })
            .style('display', 'none')
            .attr("height", "55")
            .attr("width", "125")
            .attr("x", 0)
            .attr('y', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetId > 0 && d.targetValue > 0) {
                    var h = scale(d.targetValue);
                    if (h < 0)
                        return 10;
                    else if (h < 50)
                        return scale(d.targetValue) + 10;
                    else
                        return scale(d.targetValue) - 70;
                } else {
                    return scale(0) - 70;
                }
            })
            .append('xhtml:div')
            .html(function(d) {
                return '<div style="width: 120px; height: 50px; box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.2); background-color: rgba(246, 246, 246, 0.9); "><div style="margin: 0px 10px; height: 25px; min-width: 75px; border-bottom: 1px solid #eee;"><div style="float: left;display: block !important;padding-top: 5px;"></div><div style="display: block !important; float: right; padding-top: 5px;"><svg class="delete" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer; fill: #838383"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /><path d="M0 0h24v24H0z" fill="none" /></svg><svg class="cancel" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer; fill: #838383"><path d="M0 0h24v24H0z" fill="none" /><path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg></div></div><div style="margin: 0px 10px; height: 25px; min-width: 75px;"><input id="' + renderContainerId + '_ut_foreignObj' + d.renderId + '_textbox class="chart-target" value="' + d.targetValue + '" style="width: 100%; border: 0px; text-align: right; font-size: 14px; color: #838383; background-color: rgba(246, 246, 246, 0.9); outline: 0px;"/></div></div>';
            });

        var globalTargetSvg = globalTargets
            .enter()
            .append('svg')
            .attr('class', 'globalTargetSvg')
            .attr("targetId", function(d) {
                return d.targetId;
            })
            .attr('id', function(d, i) {
                return 'gt_' + renderContainerId + '_' + d.renderId + '_svg';
            })
            .attr('x', function(d) {
                return -margin.left / 2;
            })
            .attr('y', function(d) {
                return height - 10;
            })
            .attr('width', width + margin.left / 2 + margin.right / 2)
            .attr('height', 22)
            .style('display', 'none')
            .call(onDrag(dragstart, dragmove, dragend));


        var globalTargetGroups = globalTargetSvg
            .append('g')
            .attr('class', 'globalTargetGrp');

        globalTargetGroups.append('rect')
            .attr('class', 'globalTargetRect')
            .attr('x', 0)
            .attr('y', 10)
            .attr('width', width + margin.left / 2 + margin.right / 2)
            .attr("height", 2)
            .style('stroke', '#fff')
            .style('stroke-width', 0.5)
            .attr('cursor', 'row-resize')
            .style('fill', function(d) {
                return color[d.seriesIndex];
            });

        globalTargetGroups.append('circle')
            .attr('cx', 5)
            .attr('cy', 11)
            .attr('r', 5)
            .style('fill', function(d) {
                return color[d.seriesIndex];
            })
            .on('click', function(d) {
                var foreignObj = d3.select('#gt_' + renderContainerId + "_" + d.renderId + '_foreignObj');
                foreignObj
                    .style("display", function() {
                        if (foreignObj.style('display') != '' && foreignObj.style('display') != 'block')
                            return 'block';
                        else
                            return 'none';
                    })
                foreignObj.select('input')
                    .style('width', '90');
            });

        var upTriangle = globalTargetGroups.append('g')
            .attr('class', 'globalTargetUp')
            .attr('cursor', 'pointer')
            .attr("transform", "translate(" + margin.left / 2 + "," + 0 + ")")

        var downTriangle = globalTargetGroups.append('g')
            .attr('class', 'globalTargetDown')
            .attr('cursor', 'pointer')
            .attr("transform", "translate(" + margin.left / 2 + "," + 16 + ")")

        upTriangle.append('polygon')
            .attr('class', 'globalTargetUpTriangle')
            .attr('points', '0,6, 12,6, 6,0')
            .style('fill', function(d) {
                return 'green';
            });

        downTriangle.append('polygon')
            .attr('class', 'globalTargetDownTriangle')
            .attr('points', '0,0, 12,0, 6,6')
            .style('fill', function(d) {
                return 'red';
            });

        // //Input Box Text Change Event -- Bound to input box at drag start
        // function onTargetValueChange(element, d, event, renderContainerId) {

        //     var currentValue = parseFloat(element.value);

        //     var foreignObj = d3.select('#ut_' + renderContainerId + "_" + d.renderId + '_foreignObj');
        //     var gradientRect = d3.select('#ut_' + renderContainerId + '_' + d.renderId + '_rect');
        //     var targetSvg = d3.select('#ut_' + renderContainerId + '_' + d.renderId + '_svg');

        //     var scale = seriesScales[d.axis - 1];

        //     if (currentValue < 0) {
        //         console.log('Target value entered is greater/lesser than allowed range');
        //         return;
        //     }

        //     foreignObj.style("display", 'none');

        //     targetSvg
        //     .transition()
        //     .duration(500)
        //     .attr('y', function () {
        //         if (scale(currentValue) < 0)
        //             return 0;
        //         else
        //             return scale(currentValue) - 5;
        //     });


        //     gradientRect
        //     .transition()
        //     .duration(500)
        //     .attr('y', function () {
        //         if (scale(currentValue) < 0)
        //             return 0;
        //         else
        //             return scale(currentValue);
        //     })
        //     .attr('height', function () {
        //         if (scale(currentValue) < 0)
        //             return scale(0);
        //         else
        //             return Math.abs(scale(currentValue) - scale(0));
        //     });


        //     foreignObj
        //     .transition()
        //     .duration(500)
        //     .attr('y', function () {
        //         if (currentValue > 0) {
        //             var h = scale(currentValue);
        //             if (h < 50)
        //                 return scale(currentValue) + 10;
        //             else
        //                 return scale(currentValue) - 70;
        //         } 
        //         else {
        //             return scale(0) - 70;
        //         }
        //     });



        //     //Setting the targetValue and calling dragend event
        //     d.targetValue = currentValue;
        //     targetDragEnd(d);

        // }



        //On Drag Method

        function onDrag(dragstart, dragmove, dragend) {
            var drag = d3.behavior.drag();
            drag.on("dragstart", dragstart)
                .on("drag", dragmove)
                .on("dragend", dragend);

            return drag;
        }


        function dragstart(d) {
            d3.event.sourceEvent.stopPropagation();
            var scale = seriesScales[d.axis - 1];
            var foreignObj = d3.select('#gt_' + renderContainerId + "_" + d.renderId + '_foreignObj');
            var globalTargetSvg = d3.select('#gt_' + renderContainerId + '_' + d.renderId + '_svg');

            globalTargetSvg
                .select('.globalTargetUp')
                .on('click', function() {
                    globalTargetSvg.select('.globalTargetUpTriangle')
                        .style('fill', 'green');
                    globalTargetSvg.select('.globalTargetDownTriangle')
                        .style('fill', 'red');
                    updateTargetSentiment(d, 'UP');
                });

            globalTargetSvg
                .select('.globalTargetDown')
                .on('click', function() {
                    globalTargetSvg.select('.globalTargetDownTriangle')
                        .style('fill', 'green');
                    globalTargetSvg.select('.globalTargetUpTriangle')
                        .style('fill', 'red');
                    updateTargetSentiment(d, 'DOWN');
                })


            // foreignObj
            //     .style('display', '')
            //     .select('input')
            //     .style('width', '90')
            //     .on('change', function() {
            //         onTargetValueChange(this, d, d3.event, renderContainerId);
            //     });


            foreignObj
                .select('.delete')
                .on('click', function() {

                    //deleteTarget(d);

                    d.targetValue = -1;
                    d.targetId = -1;

                    targetSvg
                        .attr('y', scale(0) - 5)
                        .style('display', 'none');

                    foreignObj
                        .attr('y', scale(0) - 70)
                        .style('display', 'none');
                });

            foreignObj
                .select('.cancel')
                .on('click', function() {
                    foreignObj
                        .style('display', 'none');
                });
        }

        function dragmove(d) {

            var scale = seriesScales[d.axis - 1];

            var domainValue = parseFloat((scale.invert(d3.event.y)).toFixed(2));

            if (d3.event.y < 0 || domainValue < 0) {
                return;
            }


            var y = parseInt(d3.select(this).attr('y')) + d3.event.dy;
            d3.select(this).attr('y', y);

            d.targetValue = domainValue;

            var foreignObj = d3.select('#gt_' + renderContainerId + "_" + d.renderId + '_foreignObj');
            foreignObj
                .style('display', '')
                .attr('y', function() {
                    if (d3.event.y < 50)
                        return d3.event.y + 10;
                    else
                        return d3.event.y - 70;
                })
                .select('input')
                .style('width', '90')
                .attr('value', domainValue);
        }


        function dragend(d) {
            targetDragEnd(d);
        }

    });


    groupedColumn.setGlobalTarget = function(dataItem, targetType) {
        if (this.chartOptions.chartType === 'groupedColumn')
            this.renderedChart.setGlobalTarget(dataItem, targetType);
    }

    groupedColumn.updateGlobalTargetId = function(id, dataItem) {
        if (this.chartOptions.chartType === 'groupedColumn')
            this.renderedChart.updateGlobalTargetId(id, dataItem);
    }

    groupedColumn.showGlobalTargets = function(chartClientId, renderId) {
        if (d3.select('#gt_' + chartClientId + '_' + renderId + '_svg').style('display') === 'none') {
            d3.select('#gt_' + chartClientId + '_' + renderId + '_svg').style('display', 'block');
        } else {
            d3.select('#gt_' + chartClientId + '_' + renderId + '_svg').style('display', 'none');
            d3.select('#gt_' + chartClientId + '_' + renderId + '_foreignObj').style('display', 'none');
        }
    }

    groupedColumn.updateDeleteGlobalTargetFromPanel = function(value) {
        if (this.chartOptions.chartType === 'groupedColumn')
            this.renderedChart.updateDeleteGlobalTargetFromPanel(value);
    }

})(xChart, d3);