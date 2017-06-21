//* ©2015 EdgeVerve Systems Limited, Bangalore, India. All Rights Reserved.
//The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. The Program may contain / reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted. Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.



//Please include xCharts.js in the index.html
//The following adds method to the xChart object defined in global namespace
//This augments methods to the prototype object of the respective xCharts objects
//xCharts Extension -- Not part of the library
(function(xChart, d3) {

    var chart = xChart.chart.prototype;

    var groupedColumn = xChart.groupedColumn.prototype;
    var groupedBar = xChart.groupedBar.prototype;
    var stackedBar = xChart.stackedBar.prototype;
    var stackedColumn = xChart.stackedColumn.prototype;
    var pieOrDonut = xChart.pieOrDonut.prototype;
    var line = xChart.line.prototype;
    var bubble = xChart.bubble.prototype;
    var area = xChart.area.prototype;
    var segmentedGroupedColumn = xChart.segmentedGroupedColumn.prototype;
    var normalizedStackedColumn = xChart.normalizedStackedColumn.prototype;
    var pareto = xChart.pareto.prototype;

    chart.setAnnotation = function(dataItem, annotationId) {
        if (this.chartOptions.chartType === 'groupedColumn')
            this.renderedChart.setAnnotation(dataItem, annotationId);
        else if (this.chartOptions.chartType === 'groupedBar')
            this.renderedChart.setAnnotation(dataItem, annotationId);
        else if (this.chartOptions.chartType === 'stackedColumn')
            this.renderedChart.setAnnotation(dataItem, annotationId);
        else if (this.chartOptions.chartType === 'stackedBar')
            this.renderedChart.setAnnotation(dataItem, annotationId);
        else if (this.chartOptions.chartType === 'line')
            this.renderedChart.setAnnotation(dataItem, annotationId);
        else if (this.chartOptions.chartType === 'pie' || this.chartOptions.chartType === 'donut')
            this.renderedChart.setAnnotation(dataItem, annotationId);
        else if (this.chartOptions.chartType === 'bubble')
            this.renderedChart.setAnnotation(dataItem, annotationId);
        else if (this.chartOptions.chartType === 'area')
            this.renderedChart.setAnnotation(dataItem, annotationId);
        else if (this.chartOptions.chartType === 'segmentedGroupedColumn')
            this.renderedChart.setAnnotation(dataItem, annotationId);
        else if (this.chartOptions.chartType === 'pareto')
            this.renderedChart.setAnnotation(dataItem, annotationId);
        else if (this.chartOptions.chartType === 'normalizedStackedColumn')
            this.renderedChart.setAnnotation(dataItem, annotationId);
    }

    chart.CheckAnnotation = function(dataItem) {
        var annotationId = -1;
        var svg = d3.select("#" + this.renderContainerId + "_svg");
        svg.selectAll('.annotationImage')
            .attr('annotationId', function(d) {
                if (typeof d != "undefined" && (dataItem.seriesIndex == d.seriesIndex && dataItem.categoryIndex == d.categoryIndex)) {
                    annotationId = d.annotationId;
                    return d.annotationId;
                }
            });
        return annotationId;
    }
    chart.deleteAnnotation = function(annotationId) {
        var svg = d3.select("#" + this.renderContainerId + "_svg");
        svg.selectAll('.annotationImage')
            .attr('annotationId', function(d) {
                if (typeof d != "undefined" && (d.annotationId == annotationId)) {
                    this.remove();
                }
            });
    }

    chart.showAnnotations = function(value) {
        var svg = d3.select("#" + this.renderContainerId + "_svg");
        svg.selectAll('.annotationImage')
            .style('display', function(d, i) {
                if (value == true)
                    return '';
                else
                    return 'none';
            });
        return;
    }

    groupedColumn.dispatch.on('RenderComplete.annotation', function(that, data, seriesForChart) {

        if (typeof that.chartOptions.annotation !== 'undefined' && that.chartOptions.annotation === false)
            return;
        //to remove existing annotations
        var svg = d3.select("#" + that.renderContainerId + "_svg");
        svg.selectAll('.annotationImage').remove();

        var renderContainerId = that.renderContainerId;
        var color = that.color;
        var svg = d3.select('#' + renderContainerId + '_mainGroup');
        var outerGroup = svg.selectAll('.outerBar');
        var categoryScale = that.categoryAxis.scale;
        var subCategoryScale = that.subCategoryScale;
        var seriesScales = that.seriesScales;


        var img = outerGroup
            .selectAll('.annotationImage')
            .data(function(d, i) {
                var imgArray = [];
                for (var x = 0; x < seriesForChart.length; x++) {
                    if (typeof(seriesForChart[x].series.annData) == "undefined")
                        continue;
                    if (typeof(seriesForChart[x].series.annData[i]) != "undefined" && typeof data.series[x].annData[i].Id != "undefined" && data.series[x].annData[i].Id != -1) {
                        imgArray.push({
                            annotationId: seriesForChart[x].series.annData[i].Id,
                            name: seriesForChart[x].series.name,
                            data: seriesForChart[x].series.data[i],
                            axis: seriesForChart[x].series.axis,
                            seriesIndex: seriesForChart[x].index,
                            categoryIndex: i
                        });
                    }
                }
                return imgArray;
            });
        img = img
            .enter()
            .append('image')
            .attr("xlink:href", "img/annotation.png")
            .attr("class", "annotationImage")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("annotationId", function(d, i) {
                return d.annotationId;
            })
            .attr("x", function(d) {
                return subCategoryScale(d.name) + subCategoryScale.rangeBand() - 18;
            })
            .attr('y', function(d) {
                var yScale = seriesScales[d.axis - 1];
                return yScale(d.data) - 16;
            })
            .style('display', '');
    });

    groupedColumn.setAnnotation = function(dataItem, annotationId) {
        var newData = {
            annotationId: annotationId,
            name: dataItem.seriesName,
            categoryName: dataItem.categoryName,
            data: dataItem.data,
            axis: dataItem.axis,
            seriesIndex: dataItem.seriesIndex,
            categoryIndex: dataItem.categoryIndex
        };

        var g = d3.select(dataItem.event.srcElement.parentElement);
        var data = [];
        var images = g.selectAll('.annotationImage');
        images.each(function(d) {
            if (typeof d != "undefined")
                data.push(d);
        });
        data.push(newData);

        var categoryScale = this.categoryAxis.scale;
        var subCategoryScale = this.subCategoryScale;
        var seriesScales = this.seriesScales;


        var img = g.selectAll('.annotationImage')
            .data(data)
            .enter()
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("class", "annotationImage")
            .attr("annotationId", function(d) {
                return d.annotationId;
            })
            .style('display', '')
            .attr("x", function(d) {
                return subCategoryScale(d.name) + subCategoryScale.rangeBand() - 18;
            })
            .attr('y', function(d) {
                var yScale = seriesScales[d.axis - 1];
                return yScale(d.data) - 16;
            });
    }

    pareto.dispatch.on('RenderComplete.annotation', function(that, data) {

        if (typeof that.chartOptions.annotation !== 'undefined' && that.chartOptions.annotation === false)
            return;
        //to remove existing annotations
        var svg = d3.select("#" + that.renderContainerId + "_svg");
        svg.selectAll('.annotationImage').remove();

        var renderContainerId = that.renderContainerId;
        var color = that.color;
        var svg = d3.select('#' + renderContainerId + '_mainGroup');
        var outerGroup = svg.selectAll('.bar');
        var categoryScale = that.categoryScale;
        var seriesScale = that.seriesScale;


        var img = svg
            .selectAll('.annotationImage')
            .data(function(d) {
                var rArray = [];
                for (var i = 0; i < data.categories.length; i++) {
                    if (typeof(data.series[0].annData) != "undefined" && typeof(data.series[0].annData[i]) != "undefined" && typeof(data.series[0].annData[i].Id) != "undefined" && data.series[0].annData[i].Id != -1) {
                        rArray.push({
                            annotationId: data.series[0].annData[i].Id,
                            categoryName: data.categories[i].name,
                            categoryValue: data.categories[i].value,
                            categoryLongName: data.categories[i].longName,
                            categoryDimName: data.categories[i].dimName,
                            data: data.series[0].data[i],
                            seriesName: data.series[0].name,
                            seriesName: data.series[0].value,
                            seriesIndex: 0,
                            categoryIndex: i
                        });
                    }
                }
                return rArray;

            });
        img = img
            .enter()
            .append('image')
            .attr("xlink:href", "img/annotation.png")
            .attr("class", "annotationImage")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("annotationId", function(d, i) {
                return d.annotationId;
            })
            .attr("x", function(d) {
                return categoryScale(d.categoryValue) + categoryScale.rangeBand() - 18;
            })
            .attr('y', function(d) {
                return seriesScale(d.data) - 16;
            })
            .style('display', '');
    });

    pareto.setAnnotation = function(dataItem, annotationId) {
        var newData = {
            annotationId: annotationId,
            name: dataItem.seriesName,
            categoryName: dataItem.categoryName,
            categoryValue: dataItem.categoryValue,
            data: dataItem.data,
            seriesIndex: 0,
            categoryIndex: dataItem.i
        };

        var g = d3.select(dataItem.event.srcElement.parentElement);
        var data = [];
        var images = g.selectAll('.annotationImage');
        images.each(function(d) {
            if (typeof d != "undefined")
                data.push(d);
        });
        data.push(newData);

        var categoryScale = this.categoryScale;
        var seriesScale = this.seriesScale;

        var img = g.selectAll('.annotationImage')
            .data(data)
            .enter()
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("class", "annotationImage")
            .attr("annotationId", function(d) {
                return d.annotationId;
            })
            .style('display', '')
            .attr("x", function(d) {
                return categoryScale(d.categoryValue) + categoryScale.rangeBand() - 18;
            })
            .attr('y', function(d) {
                return seriesScale(d.data) - 16;
            });
    }

    groupedBar.dispatch.on('RenderComplete.annotation', function(that, data) {

        if (typeof that.chartOptions.annotation !== 'undefined' && that.chartOptions.annotation === false)
            return;
        //to remove existing annotations
        var svg = d3.select("#" + that.renderContainerId + "_svg");
        svg.selectAll('.annotationImage').remove();

        var renderContainerId = that.renderContainerId;
        var color = that.color;
        var svg = d3.select('#' + renderContainerId + '_mainGroup');
        var outerGroup = svg.selectAll('.group');
        var categoryScale = that.categoryAxis.scale;
        var subCategoryScale = that.subCategoryScale;
        var seriesScales = that.seriesAxis.scale;

        var img = outerGroup
            .selectAll('.annotationImage')
            .data(function(d, i) {
                var imgArray = [];
                for (var x = 0; x < data.series.length; x++) {
                    if (typeof(data.series[x].annData) == "undefined")
                        continue;
                    if (typeof(data.series[x].annData[i]) != "undefined" && typeof(data.series[x].annData[i].Id) != "undefined" && data.series[x].annData[i].Id != -1) {
                        imgArray.push({
                            annotationId: data.series[x].annData[i].Id,
                            categoryName: d.name,
                            categoryValue: d.value,
                            categoryLongName: d.LongName,
                            categoryDimName: d.dimName,
                            data: data.series[x].data[i],
                            axis: data.series[x].axis,
                            seriesName: data.series[x].name,
                            seriesName: data.series[x].value,
                            seriesIndex: x,
                            categoryIndex: i
                        });
                    }
                }
                return imgArray;
            });

        img = img
            .enter()
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("class", "annotationImage")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("annotationId", function(d, i) {
                return d.annotationId
            })
            .attr("x", function(d) {
                return seriesScales(d.data) - 15;
            })
            .attr('y', function(d) {
                return that.subCategoryScale(d.seriesName) - 7;
            })
            .style('display', 'block')
    });

    groupedBar.setAnnotation = function(dataItem, annotationId) {
        var newData = {
            annotationId: annotationId,
            seriesName: dataItem.seriesName,
            categoryName: dataItem.categoryName,
            data: dataItem.data,
            axis: dataItem.axis,
            seriesIndex: dataItem.seriesIndex,
            categoryIndex: dataItem.categoryIndex
        };

        var g = d3.select(dataItem.event.srcElement.parentElement);
        var data = [];
        var images = g.selectAll('.annotationImage');
        images.each(function(d) {
            if (typeof d != "undefined")
                data.push(d);
        });
        data.push(newData);

        var categoryScale = this.categoryAxis.scale;
        var subCategoryScale = this.subCategoryScale;
        var seriesScales = this.seriesAxis.scale;


        var img = g.selectAll('.annotationImage')
            .data(data)
            .enter()
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("class", "annotationImage")
            .attr("annotationId", annotationId)
            .style('display', '')
            .attr("x", function(d) {
                return seriesScales(d.data) - 15;
            })
            .attr('y', function(d) {
                return subCategoryScale(d.seriesName) - 7;
            });
    }

    stackedBar.dispatch.on('RenderComplete.annotation', function(that, data) {

        if (typeof that.chartOptions.annotation !== 'undefined' && that.chartOptions.annotation === false)
            return;
        //to remove existing annotations
        var svg = d3.select("#" + that.renderContainerId + "_svg");
        svg.selectAll('.annotationImage').remove();

        var renderContainerId = that.renderContainerId;
        var color = that.color;
        var svg = d3.select('#' + renderContainerId + '_mainGroup');
        var outerGroup = svg.selectAll('.group');
        var categoryScale = that.categoryAxis.scale;
        var subCategoryScale = that.subCategoryScale;
        var seriesScales = that.seriesAxis.scale;

        var img = outerGroup
            .selectAll('.annotationImage')
            .data(function(d, x) {
                var imgArray = [];
                for (var i = 0; i < d.length; ++i) {
                    if (typeof(data.series[x].annData) == "undefined")
                        continue;
                    if (typeof(data.series[x].annData[i]) != "undefined" && typeof(data.series[x].annData[i].Id) != "undefined" && data.series[x].annData[i].Id != -1) {
                        imgArray.push({
                            annotationId: data.series[x].annData[i].Id,
                            categoryName: d.name,
                            categoryValue: d.value,
                            categoryLongName: d.LongName,
                            categoryDimName: d.dimName,
                            data: data.series[x].data[i],
                            axis: data.series[x].axis,
                            seriesName: data.series[x].name,
                            seriesName: data.series[x].value,
                            seriesIndex: x,
                            categoryIndex: i,
                            x: d[i].x,
                            x0: d[i].x0,
                            y: d[i].y
                        });
                    }
                }
                return imgArray;
            });

        img = img
            .enter()
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("class", "annotationImage")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("annotationId", function(d, i) {
                return d.annotationId
            })
            .attr('x', function(d, i, j) {
                return seriesScales(d.x0) + seriesScales(d.x) - 8;
            })
            .attr('y', function(d) {
                return categoryScale(d.y) - 15;
            })
            .style('display', '');

    });

    stackedBar.setAnnotation = function(dataItem, annotationId) {

        var newData = dataItem;
        newData.annotationId = annotationId;

        var g = d3.select(dataItem.event.srcElement.parentElement);
        var data = [];
        var images = g.selectAll('.annotationImage');
        images.each(function(d) {
            if (typeof d != "undefined")
                data.push(d);
        });
        data.push(newData);


        var categoryScale = this.categoryAxis.scale;
        var seriesScales = this.seriesAxis.scale;


        var img = g.selectAll('.annotationImage')
            .data(data)
            .enter()
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("class", "annotationImage")
            .attr("annotationId", annotationId)
            .style('display', '')
            .attr("x", function(d) {
                return seriesScales(d.x0) + seriesScales(d.x) - 8;
            })
            .attr('y', function(d) {
                return categoryScale(d.y) - 15;
            })
            .style('display', '');
    }

    stackedColumn.dispatch.on('RenderComplete.annotation', function(that, data) {

        if (typeof that.chartOptions.annotation !== 'undefined' && that.chartOptions.annotation === false)
            return;
        //to remove existing annotations
        var svg = d3.select("#" + that.renderContainerId + "_svg");
        svg.selectAll('.annotationImage').remove();

        var renderContainerId = that.renderContainerId;
        var color = that.color;
        var svg = d3.select('#' + renderContainerId + '_mainGroup');
        var outerGroup = svg.selectAll('.outerbar');
        var categoryScale = that.categoryScale;
        var subCategoryScale = that.subCategoryScale;
        var seriesScales = that.seriesScales;

        var img = outerGroup
            .selectAll('.annotationImage')
            .data(function(d, i) {
                var rArray = [];
                var y0 = 0;
                for (var x = 0; x < data.series.length; x++) {
                    if (typeof(data.series[x].annData) == "undefined")
                        continue;
                    if (typeof(data.series[x].annData[i]) != "undefined" && typeof(data.series[x].annData[i].Id) != "undefined" && data.series[x].annData[i].Id != -1) {
                        var annotationId = data.series[x].annData[i].Id;
                        rArray.push({
                            annotationId: annotationId,
                            name: data.series[x].name,
                            y0: y0,
                            y1: y0 + data.series[x].data[i],
                            index: i,
                            seriesLongName: data.series[x].longName,
                            seriesValue: data.series[x].value,
                            data: data.series[x].data[i],
                            fmtData: data.series[x].fmtData[i],
                            categoryLongName: data.categories[i] == null ? '' : data.categories[i].longName,
                            category: d,
                            seriesIndex: x,
                            categoryIndex: i
                        });
                    }
                    y0 += data.series[x].data[i];
                }
                return rArray;
            });

        var seriesScales = that.seriesAxis.scale;
        var subCategoryScale = that.subCategoryScale;

        img = img
            .enter()
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("class", "annotationImage")
            .attr("annotationId", function(d, i) {
                return d.annotationId;
            })
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("annotationId", function(d, i) {
                return d.annotationId
            })
            .attr("y", function(d) {
                return seriesScales(d.y1) - 14;
            })
            .attr("x", categoryScale.rangeBand() - 10)
            .style('display', '');
    });

    stackedColumn.setAnnotation = function(dataItem, annotationId) {
        var newData = {
            annotationId: annotationId,
            name: dataItem.seriesName,
            categoryName: dataItem.categoryName,
            data: dataItem.data,
            axis: dataItem.axis,
            seriesIndex: dataItem.seriesIndex,
            categoryIndex: dataItem.categoryIndex,
            y1: dataItem.y1,
            y0: dataItem.y0
        };

        var g = d3.select(dataItem.event.srcElement.parentElement);
        var data = [];
        var images = g.selectAll('.annotationImage');
        images.each(function(d) {
            if (typeof d != "undefined")
                data.push(d);
        });
        data.push(newData);

        var subCategoryScale = this.subCategoryScale;
        var seriesScales = this.seriesAxis.scale;
        var categoryScale = this.categoryScale;

        var img = g.selectAll('.annotationImage')
            .data(data)
            .enter()
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("class", "annotationImage")
            .attr("annotationId", annotationId)
            .style('display', '')
            .attr("x", categoryScale.rangeBand() - 10)
            .attr('y', function(d) {
                return seriesScales(d.y1) - 14;
            });
    }

    normalizedStackedColumn.dispatch.on('RenderComplete.annotation', function(that, data, stackData) {

        if (typeof that.chartOptions.annotation !== 'undefined' && that.chartOptions.annotation === false)
            return;
        //to remove existing annotations
        var svg = d3.select("#" + that.renderContainerId + "_svg");
        svg.selectAll('.annotationImage').remove();

        var renderContainerId = that.renderContainerId;
        var color = that.color;
        var svg = d3.select('#' + renderContainerId + '_mainGroup');
        var outerGroup = svg.selectAll('.outerbar');
        var categoryScale = that.categoryScale;
        var seriesScales = that.seriesScale;
        var stack = d3.layout.stack()
            .values(function(d) {
                return d.values;
            });
        var img = outerGroup
            .selectAll('.annotationImage')
            .data(function(d, i) {
                var rArray = [];
                var y0 = 0;
                for (var x = 0; x < data.series.length; x++) {
                    if (typeof(data.series[x].annData) == "undefined")
                        continue;
                    if (typeof(data.series[x].annData[i]) != "undefined" && typeof(data.series[x].annData[i].Id) != "undefined" && data.series[x].annData[i].Id != -1) {
                        var annotationId = data.series[x].annData[i].Id;
                        rArray.push({
                            annotationId: annotationId,
                            y0: stack(stackData)[x].values[i].y0,
                            y1: stack(stackData)[x].values[i].y0 + stack(stackData)[x].values[i].y,
                            name: stack(stackData)[x].values[i].seriesName,
                            index: i,
                            seriesIndex: x,
                            categoryIndex: i,
                            seriesLongName: stack(stackData)[x].values[i].seriesLongName,
                            seriesValue: stack(stackData)[x].values[i].seriesValue,
                            data: data.series[x].data[i],
                            fmtData: data.series[x].fmtData[i],
                            categoryLongName: data.categories[i] === null ? '' : data.categories[i].longName,
                            category: data.categories[i]
                        });
                    }
                }
                return rArray;
            });


        img = img
            .enter()
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("class", "annotationImage")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("annotationId", function(d, i) {
                return d.annotationId
            })
            .attr("y", function(d) {
                return seriesScales(d.y1) - 14;
            })
            .attr("x", categoryScale.rangeBand() - 10)
            .style('display', '');
    });

    normalizedStackedColumn.setAnnotation = function(dataItem, annotationId) {
        var newData = {
            annotationId: annotationId,
            name: dataItem.seriesName,
            categoryName: dataItem.categoryName,
            data: dataItem.data,
            axis: dataItem.axis,
            seriesIndex: dataItem.seriesIndex,
            categoryIndex: dataItem.categoryIndex,
            y1: dataItem.y1,
            y0: dataItem.y0
        };

        var g = d3.select(dataItem.event.srcElement.parentElement);
        var data = [];
        var images = g.selectAll('.annotationImage');
        images.each(function(d) {
            if (typeof d != "undefined")
                data.push(d);
        });
        data.push(newData);

        var categoryScale = this.categoryScale;
        var seriesScales = this.seriesScale;

        var img = g.selectAll('.annotationImage')
            .data(data)
            .enter()
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("class", "annotationImage")
            .attr("annotationId", annotationId)
            .style('display', '')
            .attr("x", categoryScale.rangeBand() - 10)
            .attr('y', function(d) {
                return seriesScales(d.y1) - 14;
            });
    }


    pieOrDonut.dispatch.on('RenderComplete.annotation', function(that, data) {

        if (typeof that.chartOptions.annotation !== 'undefined' && that.chartOptions.annotation === false)
            return;
        //to remove existing annotations
        var svg = d3.select("#" + that.renderContainerId + "_svg");
        svg.selectAll('.annotationImage').remove();

        var annotationPointers = [];
        var renderContainerId = that.renderContainerId;
        var index;
        for (var j = 0.; j < that.data.series.length; ++j) {
            if (data[0].seriesValue == that.data.series[j].value) {
                index = j;
                break;
            }
        }
        for (var i = 0; data.length && i < data.length; ++i) {
            for (var j = 0; j < that.data.categories.length; ++j) {
                if (data[i].categoryValue == that.data.categories[j].value) {
                    var annotationId = (typeof(that.data.series[index].annData) != "undefined" && typeof(that.data.series[index].annData[j]) != "undefined" && typeof(that.data.series[index].annData[j].Id) != "undefined") ? that.data.series[index].annData[j].Id : undefined;
                    if (typeof(annotationId) != 'undefined' && annotationId != -1) {
                        data[i].annotationId = annotationId;
                        annotationPointers.push(data[i]);
                    }
                }
            }
        }

        var svg = d3.select('#' + renderContainerId + '_svg');
        var arcs = svg.selectAll("g.arc");
        var outerRadius = that.outerRadius;

        arcs
            .filter(function(d) {
                if (typeof(d.annotationId) == 'undefined')
                    return false;
                return true;
            })
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("class", "annotationImage")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("annotationId", function(d, i) {
                return d.annotationId
            })
            .attr("transform", function(d) {
                var offset = outerRadius; ///2;
                var angle = (d.startAngle + d.endAngle) / 2;
                var xOff = Math.sin(angle) * offset;
                var yOff = -Math.cos(angle) * offset;
                xOff -= 12;
                yOff -= 7;
                return "translate(" + [xOff, yOff] + ")";
            })
            .attr("annotationId", function(d, i) {
                return d.annotationId
            })
            .attr('class', 'annotationImage')
            .style('display', '');
    });

    pieOrDonut.setAnnotation = function(dataItem, annotationId) {
        var newData = {
            annotationId: annotationId,
            name: dataItem.seriesName,
            categoryName: dataItem.categoryName,
            data: dataItem.data,
            endAngle: dataItem.endAngle,
            startAngle: dataItem.startAngle
        };

        var g = d3.select(dataItem.event.srcElement.parentElement);
        var data = [];
        var images = g.selectAll('.annotationImage');
        images.each(function(d) {
            if (typeof d != "undefined")
                data.push(d);
        });
        data.push(newData);
        var outerRadius = this.outerRadius;

        var img = g.selectAll('.annotationImage')
            .data(data)
            .enter()
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("class", "annotationImage")
            .attr("annotationId", annotationId)
            .attr("transform", function(d) {
                var offset = outerRadius; ///2;
                var angle = (d.startAngle + d.endAngle) / 2;
                var xOff = Math.sin(angle) * offset;
                var yOff = -Math.cos(angle) * offset;
                xOff -= 12;
                yOff -= 7;
                return "translate(" + [xOff, yOff] + ")";
            })
            .style('display', '');
    }

    line.dispatch.on('RenderComplete.annotation', function(that, data) {

        if (typeof that.chartOptions.annotation !== 'undefined' && that.chartOptions.annotation === false)
            return;
        //to remove existing annotations
        var svg = d3.select("#" + that.renderContainerId + "_mainGroup");
        svg.selectAll('.annotationImage').remove();

        var categoryScale = that.categoryAxis.scale;
        var subCategoryScale = that.subCategoryScale;
        var seriesScale = that.seriesAxis.scale;

        for (var i = 0; i < data.series.length; i++) {
            var dataValues = data.series[i].data;
            var fmtDataValues = data.series[i].fmtData;

            var lineData = data.categories.map(function(d, j) {
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
                    fmtData: fmtDataValues[j],
                    annotationId: (typeof(data.series[i].annData) != "undefined" && typeof(data.series[i].annData[j]) != "undefined" && typeof(data.series[i].annData[j].Id) != "undefined") ? data.series[i].annData[j].Id : undefined
                }
            });

            var annotationPointers = [];
            for (var mm = 0; mm < lineData.length; ++mm) {
                if (typeof(lineData[mm].annotationId) != 'undefined' && lineData[mm].annotationId != -1)
                    annotationPointers.push(lineData[mm]);
            }
            //svg.selectAll('.annotationImage' + i)
            var imageSelection = "image[anotherClass='class" + i.toString() + "']";

            svg.selectAll(imageSelection)
                .data(annotationPointers)
                .enter()
                .append('image')
                .attr("xlink:href", "./img/annotation.png")
                .attr("class", 'annotationImage')
                .attr("anotherClass", 'class' + i.toString())
                .attr("annotationId", function(d, i) {
                    return d.annotationId
                })
                .attr("width", "25px")
                .attr("height", "15px")
                .style('display', '')
                .attr("annotationId", function(d, i) {
                    return d.annotationId
                })
                .attr("x", function(d) {
                    return subCategoryScale(d.categoryName) + (subCategoryScale.rangeBand() / 2) - 12;
                })
                .attr("y", function(d) {
                    return seriesScale(d.data) - 12;
                });
        }

    });

    line.setAnnotation = function(dataItem, annotationId) {
        var newData = dataItem;
        newData.annotationId = annotationId;

        var g = d3.select(dataItem.event.srcElement.parentElement);
        var data = [];
        var images = g.selectAll('.annotationImage');
        images.each(function(d) {
            if (typeof d != "undefined")
                data.push(d);
        });
        data.push(newData);
        var CategoryScale = this.categoryAxis.scale;
        var seriesScale = this.seriesAxis.scale;

        var img = g.selectAll('.annotationImage')
            .data(data)
            .enter()
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("class", "annotationImage")
            .attr("annotationId", function(d) {
                return d.annotationId;
            })
            .style('display', '')
            .attr("x", function(d) {
                return CategoryScale(d.categoryName) + (CategoryScale.rangeBand() / 2) - 12;
            })
            .attr("y", function(d) {
                return seriesScale(d.data) - 12;
            });
    }

    bubble.dispatch.on('RenderComplete.annotation', function(that, data) {

        if (typeof that.chartOptions.annotation !== 'undefined' && that.chartOptions.annotation === false)
            return;
        //to remove existing annotations
        var svg = d3.select("#" + that.renderContainerId + "_svg");
        svg.selectAll('.annotationImage').remove();

        var renderContainerId = that.renderContainerId;
        var color = that.color;
        var mainGroup = d3.select('#' + renderContainerId + '_mainGroup');
        var outerGroup = mainGroup.selectAll('.bubble');

        var categoryScale = that.categoryAxis.scale;
        var rScale = that.rScale;
        var seriesScales = that.seriesAxis.scale;
        //if single series radius of bubble based on same data else on the 2nd series
        var rseriesIndex = 0;
        if (data.series.length > 1) {
            rseriesIndex = 1;
        }

        var rArray = [];
        for (var j = 0; j < data.categories.length; j++) {
            if (typeof data.series[0].annData != "undefined") {
                if (typeof data.series[0].annData[j] != "undefined" && typeof data.series[0].annData[j].Id != "undefined" && data.series[0].annData[j].Id != -1) {

                    rArray.push({
                        annotationId: data.series[0].annData[j].Id,
                        categoryName: data.categories[j].name,
                        data: data.series[0].data[j],
                        rdata: data.series[rseriesIndex].data[j],
                        categoryIndex: j,
                        index: j,
                        seriesIndex: 0,
                    });
                }
            }
        }
        //svg.selectAll('.annotationImage' + i)
        var img = mainGroup.selectAll('.annotationImage')
            .data(rArray);

        img = img
            .enter()
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("class", "annotationImage")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("annotationId", function(d, i) {
                return d.annotationId
            })
            .attr("y", function(d) {
                return seriesScales(d.data) - rScale(d.rdata);
            })
            .attr("x", function(d) {
                return categoryScale(d.categoryName) + (categoryScale.rangeBand() / 2);
            })
            .style('display', '')

    });

    bubble.setAnnotation = function(dataItem, annotationId) {

        var newData = {
            annotationId: annotationId,
            seriesIndex: dataItem.seriesIndex,
            categoryIndex: dataItem[0].index,
            seriesName: dataItem[0].seriesName,
            categoryName: dataItem[0].categoryName,
            seriesdata: dataItem[0].data,
            radiusData: dataItem[1].data
        };

        var g = d3.select(dataItem.event.srcElement.parentElement);
        var data = [];
        var images = g.selectAll('.annotationImage');
        images.each(function(d) {
            if (typeof d != "undefined")
                data.push(d);
        });
        data.push(newData);

        var categoryScale = this.categoryAxis.scale;
        var rScale = this.rScale;
        var seriesScales = this.seriesAxis.scale;

        var img = g.selectAll('.annotationImage')
            .data(data)
            .enter()
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("class", "annotationImage")
            .attr("annotationId", annotationId)
            .style('display', '')
            .attr("y", function(d) {
                return seriesScales(d.seriesdata) - rScale(d.radiusData);
            })
            .attr("x", function(d) {
                return categoryScale(d.categoryName) + (categoryScale.rangeBand() / 2);
            });
    }

    area.dispatch.on('RenderComplete.annotation', function(that, data, areaData) {

        if (typeof that.chartOptions.annotation !== 'undefined' && that.chartOptions.annotation === false)
            return;
        //to remove existing annotations
        var svg = d3.select("#" + that.renderContainerId + "_svg");
        svg.selectAll('.annotationImage').remove();

        var renderContainerId = that.renderContainerId;
        var color = that.color;
        var mainGroup = d3.select('#' + renderContainerId + '_mainGroup');
        var areaCircle = mainGroup.selectAll('.circle');

        var categoryScale = that.categoryAxis.scale;
        var seriesScales = that.seriesAxis.scale;

        var rArray = [];
        for (var j = 0; j < data.categories.length; j++)
            for (var i = 0; i < data.series.length; i++) {
                if (typeof(data.series[i].annData) == "undefined")
                    continue;
                if (typeof(data.series[i].annData[j]) != "undefined" && typeof data.series[i].annData[j].Id != "undefined" && data.series[i].annData[j].Id != -1) {
                    rArray.push({
                        annotationId: data.series[i].annData[j].Id,
                        categoryName: data.categories[j].name,
                        y: areaData[i].values[j].y,
                        y0: areaData[i].values[j].y0,
                        categoryIndex: j,
                        index: i,
                        seriesIndex: i
                    });
                }
            }


        var img = mainGroup.selectAll('.annotationImage')
            .data(rArray);

        img = img
            .enter()
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("class", "annotationImage")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("annotationId", function(d, i) {
                return d.annotationId
            })
            .attr("y", function(d) {
                return seriesScales(d.y + d.y0) - 12;
            })
            .attr("x", function(d) {
                return categoryScale(d.categoryName) + categoryScale.rangeBand() / 2 - 10;
            })
            .style('display', '');
    });

    area.setAnnotation = function(dataItem, annotationId) {

        var newData = {
            annotationId: annotationId,
            name: dataItem.seriesName,
            categoryName: dataItem.categoryName,
            seriesIndex: dataItem.seriesIndex,
            categoryIndex: dataItem.categoryIndex,
            y: dataItem.y,
            y0: dataItem.y0
        };

        var g = d3.select(dataItem.event.srcElement.parentElement);
        var data = [];
        var images = g.selectAll('.annotationImage');
        images.each(function(d) {
            if (typeof d != "undefined")
                data.push(d);
        });
        data.push(newData);

        var categoryScale = this.categoryAxis.scale;
        var seriesScales = this.seriesAxis.scale;


        var img = g.selectAll('.annotationImage')
            .data(data)
            .enter()
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("class", "annotationImage")
            .attr("annotationId", function(d, i) {
                return d.annotationId
            })
            .attr("y", function(d) {
                return seriesScales(d.y + d.y0) - 12;
            })
            .attr("x", function(d) {
                return categoryScale(d.categoryName) + categoryScale.rangeBand() / 2 - 10;
            })
            .style('display', '');

    }

    segmentedGroupedColumn.dispatch.on('RenderComplete.annotation', function(that, data) {

        if (typeof that.chartOptions.annotation !== 'undefined' && that.chartOptions.annotation === false)
            return;

        //to remove existing annotations
        var svg = d3.select("#" + that.renderContainerId + "_svg");
        svg.selectAll('.annotationImage').remove();

        var renderContainerId = that.renderContainerId;

        var svg = d3.select('#' + renderContainerId + '_mainGroup');
        var bars = svg.selectAll('.bar');
        //  var categoryScale = that.categoryAxis.scale;
        var subCategoryScale = that.subCategoryScale;
        var seriesScales = that.seriesAxis.scale;
        var xWidth = that.xWidth;

        var img = svg
            .selectAll('.annotationImage')
            .data(function(d) {
                var imgArray = [];
                for (var x = 0; x < data.categories.length; x++) {
                    for (var i = 0; i < data.series[x].value.length; i++) {
                        if (typeof(data.series[x].annData) == "undefined")
                            continue;
                        if (typeof(data.series[x].annData[i]) != "undefined" && typeof data.series[x].annData[i].Id != "undefined" && data.series[x].annData[i].Id != -1) {
                            imgArray.push({
                                annotationId: data.series[x].annData[i].Id,
                                name: data.series[x].name[i],
                                data: data.series[x].data[i],
                                seriesIndex: i,
                                categoryIndex: x,
                                seriesLongName: data.series[x].longName[i]
                            });
                        }
                    }
                }
                return imgArray;
            });


        img = img
            .enter()
            .append('image')
            .attr("xlink:href", "img/annotation.png")
            .attr("class", "annotationImage")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("annotationId", function(d, i) {
                return d.annotationId;
            })
            .attr("x", function(d) {
                return xWidth[d.categoryIndex] + subCategoryScale[d.categoryIndex](d.seriesLongName) + 10;
            })
            .attr('y', function(d) {
                return seriesScales(d.data) - 10;
            })
            .style('display', '');

    });

    segmentedGroupedColumn.setAnnotation = function(dataItem, annotationId) {
        var newData = {
            annotationId: annotationId,
            name: dataItem.seriesName,
            categoryName: dataItem.categoryName,
            data: dataItem.data,
            seriesIndex: dataItem.seriesIndex,
            categoryIndex: dataItem.categoryIndex,
            seriesLongName: dataItem.seriesLongName
        };

        var svg = d3.select(dataItem.event.srcElement.parentElement);
        var data = [];
        var images = svg.selectAll('.annotationImage');
        images.each(function(d) {
            if (typeof d != "undefined")
                data.push(d);
        });
        data.push(newData);

        var subCategoryScale = this.subCategoryScale;
        var seriesScales = this.seriesAxis.scale;
        var xWidth = this.xWidth;

        var img = svg.selectAll('.annotationImage')
            .data(data)
            .enter()
            .append('image')
            .attr("xlink:href", "./img/annotation.png")
            .attr("width", "25px")
            .attr("height", "15px")
            .attr("class", "annotationImage")
            .attr("annotationId", function(d) {
                return d.annotationId;
            })
            .style('display', '')
            .attr("x", function(d) {
                return xWidth[d.categoryIndex] + subCategoryScale[d.categoryIndex](d.seriesLongName) + 10;
            })
            .attr('y', function(d) {
                return seriesScales(d.data) - 10;
            });

    }


})(this.xChart, d3);