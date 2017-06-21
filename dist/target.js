//* ©2015 EdgeVerve Systems Limited, Bangalore, India. All Rights Reserved.
//The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. The Program may contain / reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted. Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.


//Please include xCharts.js in the index.html
//The following adds method to the xChart object defined in global namespace
//This augments methods to the prototype object of the respective xCharts objects

//xCharts Extension -- Not part of the library
(function(xChart, d3) {
    var chart = xChart.chart.prototype;
    var groupedColumn = xChart.groupedColumn.prototype;

    chart.setTarget = function(dataItem, targetType) {
        if (this.chartOptions.chartType === 'groupedColumn')
            this.renderedChart.setTarget(dataItem, targetType);
    }

    chart.updateTargetId = function(id, dataItem) {
        if (this.chartOptions.chartType === 'groupedColumn')
            this.renderedChart.updateTargetId(id, dataItem);
    }

    chart.showTargets = function(value) {
        if (this.chartOptions.chartType === 'groupedColumn')
            this.renderedChart.showTargets(value);
    }

    chart.updateDeleteTargetFromPanel = function(value) {
        if (this.chartOptions.chartType === 'groupedColumn')
            this.renderedChart.updateDeleteTargetFromPanel(value);
    }

    groupedColumn.dispatch.on('RenderComplete.target', function(that, data, seriesForChart) {

        if (typeof that.chartOptions.target !== 'undefined' && that.chartOptions.target === false)
            return;

        var renderContainerId = that.renderContainerId;
        var color = that.color;
        var width = that.canvasWidth - that.margin.left - that.margin.right,
            height = that.canvasHeight - that.margin.top - that.margin.bottom;
        var svg = d3.select('#' + renderContainerId + '_mainGroup');


        svg.selectAll('.userTargetBarGradient').remove();
        svg.selectAll('.userTargetForeignObj').remove();
        svg.selectAll('.userTargetSvg').remove();

        svg.selectAll('.systemTargetBarGradient').remove();
        svg.selectAll('.systemTargetForeignObj').remove();
        svg.selectAll('.systemTargetSvg').remove();

        var outerGroup = svg.selectAll('.outerBar');
        var categoryScale = that.categoryAxis.scale;
        var seriesScales = that.seriesScales;
        var subCategoryScale = that.subCategoryScale;

        var targetDragEnd = that.chartOptions.targetDragEnd;
        var updateTargetSentiment = that.chartOptions.updateTargetSentiment;
        var deleteTarget = that.chartOptions.deleteTarget;



        //System-Defined Targets

        var systemTargets = outerGroup
            .selectAll('.systemTargetSvg')
            .data(function(d, i) {
                var targetAry = [];
                for (var x = 0; x < seriesForChart.length; x++) {
                    var targetId = -1,
                        targetValue = -1,
                        sentiment = null
                    if (typeof(seriesForChart[x].series.systemTargetData) != "undefined" && typeof(seriesForChart[x].series.systemTargetData[i]) != "undefined" && typeof(seriesForChart[x].series.systemTargetData[i][0]) != 'undefined' && typeof(seriesForChart[x].series.systemTargetData[i][0].Id) != "undefined") {
                        targetId = seriesForChart[x].series.systemTargetData[i][0].Id;
                        targetValue = seriesForChart[x].series.systemTargetData[i][0].targetValue;
                        sentiment = seriesForChart[x].series.systemTargetData[i][0].sentiment;
                    }
                    targetAry.push({
                        renderId: i + '_' + seriesForChart[x].index,
                        sentiment: sentiment,
                        targetId: targetId,
                        targetValue: targetValue,
                        renderContainerId: renderContainerId,
                        name: seriesForChart[x].series.name,
                        data: seriesForChart[x].series.data[i],
                        axis: seriesForChart[x].series.axis,
                        seriesIndex: seriesForChart[x].index,
                        fmtData: seriesForChart[x].series.fmtData[i],
                        categoryIndex: i,
                        seriesLongName: seriesForChart[x].series.longName,
                        seriesValue: seriesForChart[x].series.value,
                        categoryLongName: d.longName,
                        category: d
                    });
                }
                return targetAry;
            });

        var systemTargetRect = systemTargets
            .enter()
            .append('rect')
            .attr('id', function(d) {
                return 'st_' + renderContainerId + '_' + d.renderId + '_rect';
            })
            .attr('x', function(d) {
                return d.seriesIndex * subCategoryScale.rangeBand();
            })
            .attr('y', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0 && d.targetId > 0) {
                    if (scale(d.targetValue) < 0)
                        return 0;
                    else
                        return scale(d.targetValue);
                } else {
                    return scale(0);
                }
            })
            .attr('width', subCategoryScale.rangeBand())
            .attr('height', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0 && d.targetId > 0) {
                    if (scale(d.targetValue) < 0)
                        return scale(0);
                    else
                        return Math.abs(scale(d.targetValue) - scale(0));
                } else {
                    return 0;
                }
            })
            .attr('class', 'systemTargetBarGradient')
            .style('display', 'none')
            .style('fill', function(d) {
                return d3.rgb(color[d.seriesIndex]).brighter(0.5);
            })
            .style('opacity', 0.1)
            .style('border-style', 'dashed');



        var systemTargetForeignObject = systemTargets
            .enter()
            .append('foreignObject')
            .attr("class", "systemTargetForeignObj")
            .attr('id', function(d) {
                return 'st_' + renderContainerId + "_" + d.renderId + '_foreignObj';
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
                if (d.sentiment === 'DOWN')
                    return '<div style="width: 120px; height: 50px; box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.2); background-color: rgba(246, 246, 246, 0.9); "><div style="margin: 0px 10px; height: 25px; min-width: 75px; border-bottom: 1px solid #eee;"><div style="float: left;display: block !important;padding-top: 5px;"><svg class="up up-active" cursor fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(90deg); display:none;border-radius: 50%;position:fixed; border: 1px solid #54d154; fill: #fff; background-color:#54d154"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg><svg class="up-inactive down-active" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(90deg);position:fixed; border-radius: 50%; border: 1px solid #f00; fill: #fff; background-color:#f00;"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg><svg class="down down-active" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(-90deg) translateY(20px); border-radius: 50%;position:fixed; border: 1px solid #54d154; fill: #fff; background-color:#54d154"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg><svg class="down-inactive up-active" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="display:none;transform: rotate(-90deg) translateY(20px); border-radius: 50%; position:fixed; border: 1px solid #f00; fill: #fff; background-color:#f00;"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg></div><div style="display: block !important; float: right; padding-top: 5px;"><svg class="cancel" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="fill: #838383"><path d="M0 0h24v24H0z" fill="none" /><path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg></div></div><div style="margin: 0px 10px; height: 25px; min-width: 75px;"><input readonly="true" id="' + renderContainerId + '_ut_foreignObj' + d.renderId + '_textbox class="chart-target" value="' + d.targetValue + '" style="width: 100%; border: 0px; text-align: right; font-size: 14px; color: #838383; background-color: rgba(246, 246, 246, 0.9); outline: 0px;"/></div></div>';
                else
                    return '<div style="width: 120px; height: 50px; box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.2); background-color: rgba(246, 246, 246, 0.9); "><div style="margin: 0px 10px; height: 25px; min-width: 75px; border-bottom: 1px solid #eee;"><div style="float: left;display: block !important;padding-top: 5px;"><svg class="up up-active" cursor fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(90deg); border-radius: 50%;position:fixed; border: 1px solid #54d154; fill: #fff; background-color:#54d154"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg><svg class="up-inactive down-active" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="display:none;transform: rotate(90deg);position:fixed; border-radius: 50%; border: 1px solid #f00; fill: #fff; background-color:#f00;"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg><svg class="down down-active" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(-90deg) translateY(20px);display:none; border-radius: 50%;position:fixed; border: 1px solid #54d154; fill: #fff; background-color:#54d154"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg><svg class="down-inactive up-active" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(-90deg) translateY(20px); border-radius: 50%; position:fixed; border: 1px solid #f00; fill: #fff; background-color:#f00;"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg></div><div style="display: block !important; float: right; padding-top: 5px;"><svg class="cancel" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="fill: #838383"><path d="M0 0h24v24H0z" fill="none" /><path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg></div></div><div style="margin: 0px 10px; height: 25px; min-width: 75px;"><input readonly="true" id="' + renderContainerId + '_ut_foreignObj' + d.renderId + '_textbox class="chart-target" value="' + d.targetValue + '" style="width: 100%; border: 0px; text-align: right; font-size: 14px; color: #838383; background-color: rgba(246, 246, 246, 0.9); outline: 0px;"/></div></div>';
            });



        var systemTargetSvg = systemTargets
            .enter()
            .append('svg')
            .attr('class', 'systemTargetSvg')
            .attr("targetId", function(d) {
                return d.targetId;
            })
            .attr('id', function(d, i) {
                return 'st_' + renderContainerId + '_' + d.renderId + '_svg';
            })
            .attr('x', function(d) {
                return d.seriesIndex * subCategoryScale.rangeBand();
            })
            .attr('y', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0)
                        return -5;
                    else
                        return scale(d.targetValue) - 5;
                } else {
                    return scale(0) - 5;
                }
            })
            .attr('width', subCategoryScale.rangeBand())
            .attr('height', 14)
            .style('display', 'none');


        var systemTargetGroups = systemTargetSvg
            .append('g')
            .attr('class', 'systemTargetGrp');

        systemTargetGroups.append('rect')
            .attr('class', 'systemtargetrect')
            .attr('y', 6)
            .attr('x', 0)
            .attr('height', 2)
            .attr("width", subCategoryScale.rangeBand())
            .style('fill', '#fff');

        systemTargetGroups.append('rect')
            .attr('class', 'systemtargetrect')
            .attr('y', 5)
            .attr('x', 0)
            .style('stroke', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0)
                        return '#fff';
                    else
                        return '';
                }
            })
            .attr('stroke-dasharray', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0)
                        return '2,2';
                    else
                        return '';
                }
            })
            .attr('height', 1)
            .attr("width", subCategoryScale.rangeBand())
            .style("fill", 'red');

        systemTargetGroups.append('rect')
            .attr('class', 'systemtargetrect')
            .attr('y', 8)
            .attr('x', 0)
            .style('stroke', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0)
                        return '#fff';
                    else
                        return '';
                }
            })
            .attr('stroke-dasharray', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0)
                        return '2,2';
                    else
                        return '';
                }
            })
            .attr('height', 1)
            .attr("width", subCategoryScale.rangeBand())
            .style("fill", 'red');


        systemTargetGroups
            .append('circle')
            .attr('class', 'bigCircle')
            .attr("cursor", "pointer")
            .attr('cx', subCategoryScale.rangeBand() / 2)
            .attr('cy', 7)
            .attr('r', 7)
            .style('fill', '#000')
            .style('opacity', 0.2)
            .style('display', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0 && d.targetId !== -1)
                        return 'none';
                    else
                        return 'block';
                } else {
                    return 'block';
                }
            });

        systemTargetGroups
            .append('circle')
            .attr("cursor", "pointer")
            .attr('cx', subCategoryScale.rangeBand() / 2)
            .attr('cy', 7)
            .attr('r', 3)
            .style('opacity', 1)
            .style("fill", 'red')
            .style('display', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0 && d.targetId !== -1)
                        return 'none';
                    else
                        return 'block';
                } else {
                    return 'block';
                }
            })
            .on('click', function(d) {
                var foreignObj = d3.select('#st_' + renderContainerId + "_" + d.renderId + '_foreignObj');
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


        systemTargetGroups
            .append('text')
            .attr('class', 'approx')
            .attr('x', subCategoryScale.rangeBand() / 2 - 8)
            .attr('y', 14)
            .attr("font-family", "sans-serif")
            .attr("font-size", "25px")
            .style('display', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0)
                        return 'block';
                    else
                        return 'none';
                } else {
                    return 'none';
                }
            })
            .style("fill", function(d) {
                if (d.isSystemTarget)
                    return 'red';
                else
                    return 'blue';
            })
            .text('~')
            .style('cursor', 'pointer')
            .on('click', function(d) {

                var foreignObj = d3.select('#st_' + renderContainerId + "_" + d.renderId + '_foreignObj');
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


        systemTargetGroups
            .append('text')
            .attr('class', 'approx')
            .attr('x', subCategoryScale.rangeBand() / 2 - 8)
            .attr('y', 19)
            .attr("font-family", "sans-serif")
            .attr("font-size", "25px")
            .style('display', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0)
                        return 'block';
                    else
                        return 'none';
                } else {
                    return 'none';
                }
            })
            .style("fill", function(d) {
                if (d.isSystemTarget)
                    return 'red';
                else
                    return 'blue';
            })
            .text('~')
            .style('cursor', 'pointer')
            .on('click', function(d) {

                var foreignObj = d3.select('#st_' + renderContainerId + "_" + d.renderId + '_foreignObj');
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



        //User-Defined Targets

        var userTargets = outerGroup
            .selectAll('.usertargetSvg')
            .data(function(d, i) {
                var targetAry = [];
                for (var x = 0; x < seriesForChart.length; x++) {
                    var targetId = -1,
                        targetValue = -1,
                        sentiment = null
                    var contextType = seriesForChart[x].series.systemTargetFlag;
                    if (typeof(seriesForChart[x].series.targetData) != "undefined" && typeof(seriesForChart[x].series.targetData[i]) != "undefined" && typeof(seriesForChart[x].series.targetData[i][0]) != 'undefined' && typeof(seriesForChart[x].series.targetData[i][0].Id) != "undefined") {
                        targetId = seriesForChart[x].series.targetData[i][0].Id;
                        targetValue = seriesForChart[x].series.targetData[i][0].targetValue;
                        sentiment = seriesForChart[x].series.targetData[i][0].sentiment;
                    }
                    targetAry.push({
                        renderId: i + '_' + seriesForChart[x].index,
                        sentiment: sentiment,
                        targetId: targetId,
                        targetValue: targetValue,
                        renderContainerId: renderContainerId,
                        name: seriesForChart[x].series.name,
                        data: seriesForChart[x].series.data[i],
                        axis: seriesForChart[x].series.axis,
                        seriesIndex: seriesForChart[x].index,
                        fmtData: seriesForChart[x].series.fmtData[i],
                        categoryIndex: i,
                        seriesLongName: seriesForChart[x].series.longName,
                        seriesValue: seriesForChart[x].series.value,
                        categoryLongName: d.longName,
                        category: d,
                        isSystemTarget: typeof(contextType) != 'undefined'
                    });
                }
                return targetAry;
            });

        var userTargetRect = userTargets
            .enter()
            .append('rect')
            .attr('id', function(d) {
                return 'ut_' + renderContainerId + '_' + d.renderId + '_rect';
            })
            .attr('x', function(d) {
                return d.seriesIndex * subCategoryScale.rangeBand();
            })
            .attr('y', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0 && d.targetId > 0) {
                    if (scale(d.targetValue) < 0)
                        return 0;
                    else
                        return scale(d.targetValue);
                } else {
                    return scale(0);
                }
            })
            .attr('width', subCategoryScale.rangeBand())
            .attr('height', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0 && d.targetId > 0) {
                    if (scale(d.targetValue) < 0)
                        return scale(0);
                    else
                        return Math.abs(scale(d.targetValue) - scale(0));
                } else {
                    return 0;
                }
            })
            .attr('class', 'userTargetBarGradient')
            .style('display', 'none')
            .style('fill', function(d) {
                return d3.rgb(color[d.seriesIndex]).brighter(0.5);
            })
            .style('opacity', 0.1)
            .style('border-style', 'dashed');



        var userTargetForeignObject = userTargets
            .enter()
            .append('foreignObject')
            .attr("class", "userTargetForeignObj")
            .attr('id', function(d) {
                return 'ut_' + renderContainerId + "_" + d.renderId + '_foreignObj';
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
                if (d.sentiment === 'DOWN')
                    return '<div style="width: 120px; height: 50px; box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.2); background-color: rgba(246, 246, 246, 0.9); "><div style="margin: 0px 10px; height: 25px; min-width: 75px; border-bottom: 1px solid #eee;"><div style="float: left;display: block !important;padding-top: 5px;"><svg class="up up-active" cursor fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(90deg); display:none;border-radius: 50%;position:fixed; border: 1px solid #54d154; fill: #fff; background-color:#54d154"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg><svg class="up-inactive down-active" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer; transform: rotate(90deg);position:fixed; border-radius: 50%; border: 1px solid #f00; fill: #fff; background-color:#f00;"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg><svg class="down down-active" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(-90deg) translateY(20px); border-radius: 50%;position:fixed; border: 1px solid #54d154; fill: #fff; background-color:#54d154"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg><svg class="down-inactive up-active" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="display:none;cursor:pointer; transform: rotate(-90deg) translateY(20px); border-radius: 50%; position:fixed; border: 1px solid #f00; fill: #fff; background-color:#f00;"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg></div><div style="display: block !important; float: right; padding-top: 5px;"><svg class="delete" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer; fill: #838383"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /><path d="M0 0h24v24H0z" fill="none" /></svg><svg class="cancel" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer; fill: #838383"><path d="M0 0h24v24H0z" fill="none" /><path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg></div></div><div style="margin: 0px 10px; height: 25px; min-width: 75px;"><input id="' + renderContainerId + '_ut_foreignObj' + d.renderId + '_textbox class="chart-target" value="' + d.targetValue + '" style="width: 100%; border: 0px; text-align: right; font-size: 14px; color: #838383; background-color: rgba(246, 246, 246, 0.9); outline: 0px;"/></div></div>';
                else
                    return '<div style="width: 120px; height: 50px; box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.2); background-color: rgba(246, 246, 246, 0.9); "><div style="margin: 0px 10px; height: 25px; min-width: 75px; border-bottom: 1px solid #eee;"><div style="float: left;display: block !important;padding-top: 5px;"><svg class="up up-active" cursor fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(90deg); border-radius: 50%;position:fixed; border: 1px solid #54d154; fill: #fff; background-color:#54d154"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg><svg class="up-inactive down-active" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="display:none;cursor:pointer; transform: rotate(90deg);position:fixed; border-radius: 50%; border: 1px solid #f00; fill: #fff; background-color:#f00;"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg><svg class="down down-active" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(-90deg) translateY(20px);display:none; border-radius: 50%;position:fixed; border: 1px solid #54d154; fill: #fff; background-color:#54d154"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg><svg class="down-inactive up-active" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer; transform: rotate(-90deg) translateY(20px); border-radius: 50%; position:fixed; border: 1px solid #f00; fill: #fff; background-color:#f00;"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg></div><div style="display: block !important; float: right; padding-top: 5px;"><svg class="delete" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer; fill: #838383"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /><path d="M0 0h24v24H0z" fill="none" /></svg><svg class="cancel" fill="#000000" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer; fill: #838383"><path d="M0 0h24v24H0z" fill="none" /><path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg></div></div><div style="margin: 0px 10px; height: 25px; min-width: 75px;"><input id="' + renderContainerId + '_ut_foreignObj' + d.renderId + '_textbox class="chart-target" value="' + d.targetValue + '" style="width: 100%; border: 0px; text-align: right; font-size: 14px; color: #838383; background-color: rgba(246, 246, 246, 0.9); outline: 0px;"/></div></div>';
            });



        var userTargetSvg = userTargets
            .enter()
            .append('svg')
            .attr('class', 'userTargetSvg')
            .attr("targetId", function(d) {
                return d.targetId;
            })
            .attr('id', function(d, i) {
                return 'ut_' + renderContainerId + '_' + d.renderId + '_svg';
            })
            .attr('x', function(d) {
                return d.seriesIndex * subCategoryScale.rangeBand();
            })
            .attr('y', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0)
                        return -5;
                    else
                        return scale(d.targetValue) - 5;
                } else {
                    return scale(0) - 5;
                }
            })
            .attr('width', subCategoryScale.rangeBand())
            .attr('height', 14)
            .attr('cursor', 'row-resize')
            .style('display', 'none')
            .call(onDrag(dragstart, dragmove, dragend));


        var userTargetGroups = userTargetSvg
            .append('g')
            .attr('class', 'userTargetGrp');

        userTargetGroups.append('rect')
            .attr('class', 'usertargetrect')
            .attr('y', 6)
            .attr('x', 0)
            .attr('height', 2)
            .attr("width", subCategoryScale.rangeBand())
            .style('fill', '#fff');

        userTargetGroups.append('rect')
            .attr('class', 'usertargetrect')
            .attr('y', 5)
            .attr('x', 0)
            .style('stroke', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0)
                        return '#fff';
                    else
                        return '';
                }
            })
            .attr('stroke-dasharray', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0)
                        return '2,2';
                    else
                        return '';
                }
            })
            .attr('height', 1)
            .attr("width", subCategoryScale.rangeBand())
            .style("fill", function(d) {
                if (d.isSystemTarget)
                    return 'red';
                else
                    return 'blue';
            });

        userTargetGroups.append('rect')
            .attr('class', 'usertargetrect')
            .attr('y', 8)
            .attr('x', 0)
            .style('stroke', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0)
                        return '#fff';
                    else
                        return '';
                }
            })
            .attr('stroke-dasharray', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0)
                        return '2,2';
                    else
                        return '';
                }
            })
            .attr('height', 1)
            .attr("width", subCategoryScale.rangeBand())
            .style("fill", function(d) {
                if (d.isSystemTarget)
                    return 'red';
                else
                    return 'blue';
            });


        userTargetGroups
            .append('circle')
            .attr('class', 'bigCircle')
            .attr("cursor", "pointer")
            .attr('cx', subCategoryScale.rangeBand() / 2)
            .attr('cy', 7)
            .attr('r', 7)
            .style('fill', '#000')
            .style('opacity', 0.2)
            .style('display', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0 && d.targetId !== -1)
                        return 'none';
                    else
                        return 'block';
                } else {
                    return 'block';
                }
            });

        userTargetGroups
            .append('circle')
            .attr('class', 'smallCircle')
            .attr("cursor", "pointer")
            .attr('cx', subCategoryScale.rangeBand() / 2)
            .attr('cy', 7)
            .attr('r', 3)
            .style('opacity', 1)
            .style('display', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0 && d.targetId !== -1)
                        return 'none';
                    else
                        return 'block';
                } else {
                    return 'block';
                }
            })
            .style("fill", function(d) {
                if (d.isSystemTarget)
                    return 'red';
                else
                    return 'blue';
            })
            .on('click', function(d) {

                var foreignObj = d3.select('#ut_' + renderContainerId + "_" + d.renderId + '_foreignObj');
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


        userTargetGroups
            .append('text')
            .attr('class', 'approx')
            .attr('x', subCategoryScale.rangeBand() / 2 - 8)
            .attr('y', 14)
            .attr("font-family", "sans-serif")
            .attr("font-size", "25px")
            .style('display', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0)
                        return 'block';
                    else
                        return 'none';
                } else {
                    return 'none';
                }
            })
            .style("fill", function(d) {
                if (d.isSystemTarget)
                    return 'red';
                else
                    return 'blue';
            })
            .text('~')
            .style('cursor', 'pointer')
            .on('click', function(d) {

                var foreignObj = d3.select('#ut_' + renderContainerId + "_" + d.renderId + '_foreignObj');
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


        userTargetGroups
            .append('text')
            .attr('class', 'approx')
            .attr('x', subCategoryScale.rangeBand() / 2 - 8)
            .attr('y', 19)
            .attr("font-family", "sans-serif")
            .attr("font-size", "25px")
            .style('display', function(d) {
                var scale = seriesScales[d.axis - 1];
                if (d.targetValue > 0) {
                    if (scale(d.targetValue) < 0)
                        return 'block';
                    else
                        return 'none';
                } else {
                    return 'none';
                }
            })
            .style("fill", function(d) {
                if (d.isSystemTarget)
                    return 'red';
                else
                    return 'blue';
            })
            .text('~')
            .style('cursor', 'pointer')
            .on('click', function(d) {

                var foreignObj = d3.select('#ut_' + renderContainerId + "_" + d.renderId + '_foreignObj');
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


        //Input Box Text Change Event -- Bound to input box at drag start
        function onTargetValueChange(element, d, event, renderContainerId) {

            var currentValue = parseFloat(element.value);

            var foreignObj = d3.select('#ut_' + renderContainerId + "_" + d.renderId + '_foreignObj');
            var gradientRect = d3.select('#ut_' + renderContainerId + '_' + d.renderId + '_rect');
            var targetSvg = d3.select('#ut_' + renderContainerId + '_' + d.renderId + '_svg');

            var scale = seriesScales[d.axis - 1];

            if (currentValue < 0) {
                console.log('Target value entered is greater/lesser than allowed range');
                return;
            }

            foreignObj.style("display", 'none');

            targetSvg
                .transition()
                .duration(500)
                .attr('y', function() {
                    if (scale(currentValue) < 0)
                        return -10;
                    else
                        return scale(currentValue) - 5;
                });


            gradientRect
                .transition()
                .duration(500)
                .attr('y', function() {
                    if (scale(currentValue) < 0)
                        return 0;
                    else
                        return scale(currentValue);
                })
                .attr('height', function() {
                    if (scale(currentValue) < 0)
                        return scale(0);
                    else
                        return Math.abs(scale(currentValue) - scale(0));
                });


            foreignObj
                .transition()
                .duration(500)
                .attr('y', function() {
                    if (currentValue > 0) {
                        var h = scale(currentValue);
                        if (h < 0)
                            return 10;
                        else if (h < 50)
                            return scale(currentValue) + 10;
                        else
                            return scale(currentValue) - 70;
                    } else {
                        return scale(0) - 70;
                    }
                });



            if (scale(currentValue) < 0) {

                foreignObj
                    .attr('y', 10);

                targetSvg
                    .selectAll('rect')
                    .style('stroke', '#fff')
                    .attr('stroke-dasharray', '2,2');

                targetSvg
                    .selectAll('circle')
                    .style('display', 'none');

                targetSvg
                    .selectAll('.approx')
                    .style('display', 'block');

            } else {
                targetSvg
                    .selectAll('rect')
                    .style('stroke', '')
                    .attr('stroke-dasharray', '');

                targetSvg
                    .selectAll('circle')
                    .style('display', 'block');

                targetSvg
                    .selectAll('.approx')
                    .style('display', 'none');
            }


            //Setting the targetValue and calling dragend event
            d.targetValue = currentValue;
            targetDragEnd(d);

        }



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
            var foreignObj = d3.select('#ut_' + renderContainerId + "_" + d.renderId + '_foreignObj');
            var gradientRect = d3.select('#ut_' + renderContainerId + '_' + d.renderId + '_rect');
            var targetSvg = d3.select('#ut_' + renderContainerId + '_' + d.renderId + '_svg');


            foreignObj
                .style('display', '')
                .select('input')
                .style('width', '90')
                .on('change', function() {
                    onTargetValueChange(this, d, d3.event, renderContainerId);
                });

            foreignObj
                .select('.up-inactive')
                .on('click', function() {
                    foreignObj
                        .selectAll('.down-active')
                        .style('display', 'none');

                    foreignObj
                        .selectAll('.up-active')
                        .style('display', 'inline-block');

                    updateTargetSentiment(d, 'UP');
                });

            foreignObj
                .select('.down-inactive')
                .on('click', function() {
                    foreignObj
                        .selectAll('.up-active')
                        .style('display', 'none');

                    foreignObj
                        .selectAll('.down-active')
                        .style('display', 'inline-block');

                    updateTargetSentiment(d, 'DOWN');
                });


            foreignObj
                .select('.delete')
                .on('click', function() {

                    deleteTarget(d);

                    d.targetValue = -1;
                    d.targetId = -1;

                    targetSvg
                        .attr('y', scale(0) - 5)
                        .style('display', 'none');

                    foreignObj
                        .style('display', 'none');

                    gradientRect
                        .attr('height', 0)
                        .attr('y', scale(0))
                        .style('display', 'none');
                })

            foreignObj
                .select('.cancel')
                .on('click', function() {
                    foreignObj
                        .style('display', 'none');
                })
        }

        function dragmove(d) {

            var targetSvg = d3.select('#ut_' + renderContainerId + '_' + d.renderId + '_svg');

            targetSvg
                .selectAll('rect')
                .style('stroke', '')
                .attr('stroke-dasharray', '');

            targetSvg
                .selectAll('.approx')
                .style('display', 'none');

            targetSvg.selectAll('circle')
                .style('display', 'block');

            var targetGroup = targetSvg.select('g');

            var scale = seriesScales[d.axis - 1];

            var domainValue = parseFloat((scale.invert(d3.event.y)).toFixed(2));

            if (d3.event.y < 0 || domainValue < 0) {
                return;
            }


            var y = parseInt(d3.select(this).attr('y')) + d3.event.dy;
            d3.select(this).attr('y', y);

            d.targetValue = domainValue;

            var foreignObj = d3.select('#ut_' + renderContainerId + "_" + d.renderId + '_foreignObj');
            foreignObj
                .style('display', '')
                .attr('y', function() {
                    if (d3.event.y < 50)
                        return d3.event.y + 10;
                    else
                        return d3.event.y - 70;
                })

            foreignObj
                .select('input')
                .attr('value', domainValue)
                .style('width', '90');

            if (domainValue > d.data) {
                var scale = seriesScales[d.axis - 1];
                var y1 = scale(d.targetValue);
                d3.select('#ut_' + renderContainerId + '_' + d.renderId + '_rect')
                    .attr('y', y1)
                    .attr('height', Math.abs(y1 - scale(0)))
                    .style('display', '');
            } else {
                d3.select('#ut_' + renderContainerId + '_' + d.renderId + '_rect')
                    .attr('height', '')
                    .style('display', 'none');
            }

        }


        function dragend(d) {
            targetDragEnd(d);
        }

    });

    groupedColumn.updateDeleteTargetFromPanel = function(value) {

        if (typeof this.chartOptions.target !== 'undefined' && this.chartOptions.target === false)
            return;

        var renderContainerId = this.renderContainerId;
        var seriesScales = this.seriesScales;
        var svg = d3.select("#" + renderContainerId + "_svg");

        var userTargetSvg = svg.selectAll('.userTargetSvg');

        if (userTargetSvg.length > 0) {
            userTargetSvg[0].forEach(function(d) {
                value.deletedTargetList.forEach(function(e) {
                    if (parseInt(d3.select(d).attr('targetId')) === e.targetId) {

                        var targetSvg = d3.select(d);
                        var foreignObj = d3.select('#ut_' + renderContainerId + "_" + targetSvg.data()[0].renderId + '_foreignObj');
                        var gradientRect = d3.select('#ut_' + renderContainerId + '_' + targetSvg.data()[0].renderId + '_rect');

                        targetSvg.attr('targetValue', function(d) {
                                d.targetValue = -1;
                                return -1;
                            })
                            .attr('targetValue', function(d) {
                                d.targetId = -1;
                                return -1;
                            })
                            .attr('y', function(d) {
                                var scale = seriesScales[d.axis - 1];
                                return scale(0) - 5;
                            })
                            .style('display', 'none');

                        foreignObj
                            .attr('y', function(d) {
                                var scale = seriesScales[d.axis - 1];
                                return scale(0) - 70;
                            })
                            .style('display', 'none');

                        gradientRect
                            .attr('height', 0)
                            .attr('y', function(d) {
                                var scale = seriesScales[d.axis - 1];
                                return scale(0);
                            })
                            .style('display', 'none');

                    }
                })

                value.updatedTargetList.forEach(function(f) {
                    if (parseInt(d3.select(d).attr('targetId')) === f.targetId) {

                        var sentiment = f.sentiment;
                        var targetValue = f.targetValue;


                        var targetSvg = d3.select(d);
                        var scale = seriesScales[targetSvg.data()[0].axis - 1];
                        var foreignObj = d3.select('#ut_' + renderContainerId + "_" + targetSvg.data()[0].renderId + '_foreignObj');
                        var gradientRect = d3.select('#ut_' + renderContainerId + '_' + targetSvg.data()[0].renderId + '_rect');

                        if (scale(targetValue) < 0) {

                            foreignObj
                                .attr('y', 10);

                            targetSvg
                                .selectAll('rect')
                                .style('stroke', '#fff')
                                .attr('stroke-dasharray', '2,2');

                            targetSvg
                                .selectAll('circle')
                                .style('display', 'none');

                            targetSvg
                                .selectAll('.approx')
                                .style('display', 'block');

                        } else {
                            targetSvg
                                .selectAll('rect')
                                .style('stroke', '')
                                .attr('stroke-dasharray', '');

                            targetSvg
                                .selectAll('circle')
                                .style('display', 'block');

                            targetSvg
                                .selectAll('.approx')
                                .style('display', 'none');
                        }



                        targetSvg.attr('targetValue', function(d) {
                                d.targetValue = targetValue;
                                return targetValue;
                            })
                            .transition()
                            .duration(1000)
                            .attr('y', function() {
                                if (scale(targetValue) < 0)
                                    return -10;
                                else
                                    return scale(targetValue) - 5;
                            });


                        foreignObj
                            .transition()
                            .duration(1000)
                            .attr('y', function() {
                                if (targetValue > 0) {
                                    var h = scale(targetValue);
                                    if (h < 0)
                                        return 10;
                                    else if (h < 50)
                                        return scale(targetValue) + 10;
                                    else
                                        return scale(targetValue) - 70;
                                } else {
                                    return scale(0) - 70;
                                }
                            })
                            .select('input')
                            .style('width', '90')
                            .attr('value', targetValue);

                        gradientRect
                            .transition()
                            .duration(1000)
                            .attr('y', function() {
                                if (scale(targetValue) < 0)
                                    return 0;
                                else
                                    return scale(targetValue);
                            })
                            .attr('height', function() {
                                if (scale(targetValue) < 0)
                                    return scale(0);
                                else
                                    return Math.abs(scale(targetValue) - scale(0));
                            });
                    }
                })
            })
        }
    }

    groupedColumn.updateTargetId = function(id, dataItem) {

        if (typeof this.chartOptions.target !== 'undefined' && this.chartOptions.target === false)
            return;

        if (!dataItem)
            return;
        var svg = d3.select("#" + this.renderContainerId + "_svg");


        svg.selectAll('.userTargetSvg')
            .attr('targetId', function(d) {
                if (dataItem.seriesIndex == d.seriesIndex && dataItem.categoryIndex == d.categoryIndex && d.targetId < 0) {
                    d.targetId = id;
                    return id;
                } else
                    return d.targetId;
            });
    }

    groupedColumn.setTarget = function(dataItem, targetType) {
        if (typeof this.chartOptions.target !== 'undefined' && this.chartOptions.target === false)
            return;

        var svg = d3.select("#" + this.renderContainerId + "_svg");
        svg.selectAll('.userTargetBarGradient')
            .style('display', function(d) {
                if ((dataItem.seriesIndex == d.seriesIndex && dataItem.categoryIndex == d.categoryIndex) || d.targetId > 0 || d.targetValue > 0)
                    return '';
                else return 'none';
            });

        svg.selectAll('.userTargetSvg')
            .style('display', function(d) {
                if ((dataItem.seriesIndex == d.seriesIndex && dataItem.categoryIndex == d.categoryIndex) || d.targetId > 0 || d.targetValue > 0)
                    return '';
                else return 'none';
            });


        svg.selectAll('.systemTargetBarGradient')
            .style('display', function(d) {
                if (d.targetId > 0)
                    return '';
                else return 'none';
            });

        svg.selectAll('.systemTargetSvg')
            .style('display', function(d) {
                if (d.targetId > 0)
                    return '';
                else return 'none';
            });
    }

    groupedColumn.showTargets = function(value) {

        if (typeof this.chartOptions.target !== 'undefined' && this.chartOptions.target === false)
            return;

        var svg = d3.select("#" + this.renderContainerId + "_svg");
        svg.selectAll('.userTargetBarGradient')
            .style('display', function(d) {
                if (value == true && d.targetId > 0 && d.targetValue > 0) {
                    return '';
                } else {
                    return 'none';
                }
            });

        svg.selectAll('.userTargetSvg')
            .style('display', function(d) {
                if (value == true && d.targetId > 0 && d.targetValue > 0) {
                    return '';
                } else {
                    return 'none';
                }
            });

        svg.selectAll('.userTargetForeignObj')
            .style('display', 'none');

        svg.selectAll('.systemTargetBarGradient')
            .style('display', function(d) {
                if (value == true && d.targetId > 0 && d.targetValue > 0) {
                    return '';
                } else {
                    return 'none';
                }
            });

        svg.selectAll('.systemTargetSvg')
            .style('display', function(d) {
                if (value == true && d.targetId > 0 && d.targetValue > 0) {
                    return '';
                } else {
                    return 'none';
                }
            });

        svg.selectAll('.systemTargetForeignObj')
            .style('display', 'none');


        return;
    }

})(xChart, d3);