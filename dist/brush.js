//* ©2015 EdgeVerve Systems Limited, Bangalore, India. All Rights Reserved.
//The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. The Program may contain / reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted. Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.


//Please include xCharts.js in the index.html
//The following adds method to the xChart object defined in global namespace
//This augments methods to the prototype object of the respective xCharts objects

//xCharts Plugin -- Not part of the library
(function(xChart, d3) {
    //var chart = xChart.chart.prototype;

    var groupedColumn = xChart.groupedColumn.prototype;
    var groupedBar = xChart.groupedBar.prototype;
    var bubble = xChart.bubble.prototype;
    var pareto = xChart.pareto.prototype;
    var stackedColumn = xChart.stackedColumn.prototype;
    var normalizedStackedColumn = xChart.normalizedStackedColumn.prototype;
    var stackedBar = xChart.stackedBar.prototype;
    // var area=xChart.area.prototype;
    // var line=xChart.line.prototype;   

    groupedColumn.dispatch.on('RenderComplete.brush', function(that, data, seriesForChart) {

        if (typeof that.chartOptions.brush !== 'undefined' && that.chartOptions.brush === false)
            return;

        var renderContainerId = that.renderContainerId;
        var color = that.color;
        var width = that.canvasWidth - that.margin.left - that.margin.right,
            height = that.canvasHeight - that.margin.top - that.margin.bottom;
        var svg = d3.select('#' + renderContainerId + '_mainGroup');

        var categoryScale = that.categoryAxis.scale;

        var brush = svg.append("g")
            .attr("class", "brush")
            .call(d3.svg.brush().x(categoryScale)
                .on("brushstart", brushstart)
                .on("brush", brushmove)
                .on("brushend", brushend.bind(that)))

        var rect = brush.selectAll("rect")
            .attr("height", height)
            .style({
                "fill": "grey",
                "fill-opacity": "0.2"
            });

        function brushstart() {
            svg.classed("selecting", true);
        }

        function brushmove() {
            var s = d3.event.target.extent();
            svg.selectAll('.bar').classed("selected", function(d) {
                return s[0] <= (d = categoryScale(d.categoryValue) + categoryScale.rangeBand() / 2) && d <= s[1];
            });
        }

        function brushend() {
            svg.classed("selecting", !d3.event.target.empty());

            var selectedCategories = [];
            var selectedRect = d3.selectAll('.selected')[0];
            selectedRect.forEach(function(d) {
                if (selectedCategories.indexOf(d.__data__.categoryName) === -1)
                    selectedCategories.push(d.__data__.categoryName);
            });

            var brushDragEnd = new CustomEvent("brushDragEnd");
            brushDragEnd.data = {
                data: selectedCategories,
                chart: this
            };
            document.body.dispatchEvent(brushDragEnd);
        }


    });


    groupedBar.dispatch.on('RenderComplete.brush', function(that, data) {
        if (typeof that.chartOptions.brush !== 'undefined' && that.chartOptions.brush === false)
            return;

        var renderContainerId = that.renderContainerId;
        var color = that.color;
        var width = that.canvasWidth - that.margin.left - that.margin.right,
            height = that.canvasHeight - that.margin.top - that.margin.bottom;
        var svg = d3.select('#' + renderContainerId + '_mainGroup');

        var categoryScale = that.categoryAxis.scale;

        var brush = svg.append("g")
            .attr("class", "brush")
            .call(d3.svg.brush().y(categoryScale)
                .on("brushstart", brushstart)
                .on("brush", brushmove)
                .on("brushend", brushend.bind(that)))

        var rect = brush.selectAll("rect")
            .attr("width", width)
            .style({
                "fill": "grey",
                "fill-opacity": "0.2"
            });

        function brushstart() {
            svg.classed("selecting", true);
        }

        function brushmove() {
            var s = d3.event.target.extent();
            svg.selectAll('.bar').classed("selected", function(d) {
                return s[0] <= (d = categoryScale(d.categoryValue) + categoryScale.rangeBand() / 2) && d <= s[1];
            });
        }

        function brushend() {
            svg.classed("selecting", !d3.event.target.empty());

            var selectedCategories = [];
            var selectedRect = d3.selectAll('.selected')[0];
            selectedRect.forEach(function(d) {
                if (selectedCategories.indexOf(d.__data__.categoryName) === -1)
                    selectedCategories.push(d.__data__.categoryName);
            });

            var brushDragEnd = new CustomEvent("brushDragEnd");
            brushDragEnd.data = {
                data: selectedCategories,
                chart: this
            };
            document.body.dispatchEvent(brushDragEnd);
        }
    });

    pareto.dispatch.on('RenderComplete.brush', function(that, data) {
        if (typeof that.chartOptions.brush !== 'undefined' && that.chartOptions.brush === false)
            return;

        var renderContainerId = that.renderContainerId;
        var color = that.color;
        var width = that.canvasWidth - that.margin.left - that.margin.right,
            height = that.canvasHeight - that.margin.top - that.margin.bottom;
        var svg = d3.select('#' + renderContainerId + '_mainGroup');

        var categoryScale = that.categoryScale;

        var brush = svg.append("g")
            .attr("class", "brush")
            .call(d3.svg.brush().x(categoryScale)
                .on("brushstart", brushstart)
                .on("brush", brushmove)
                .on("brushend", brushend.bind(that)))

        var rect = brush.selectAll("rect")
            .attr("height", height)
            .style({
                "fill": "grey",
                "fill-opacity": "0.2"
            });

        function brushstart() {
            svg.classed("selecting", true);
        }

        function brushmove() {
            var s = d3.event.target.extent();
            svg.selectAll('.bar').classed("selected", function(d) {
                return s[0] <= (d = categoryScale(d.categoryValue) + categoryScale.rangeBand() / 2) && d <= s[1];
            });
        }

        function brushend() {
            svg.classed("selecting", !d3.event.target.empty());

            var selectedCategories = [];
            var selectedRect = d3.selectAll('.selected')[0];
            selectedRect.forEach(function(d) {
                if (selectedCategories.indexOf(d.__data__.categoryName) === -1)
                    selectedCategories.push(d.__data__.categoryName);
            });

            var brushDragEnd = new CustomEvent("brushDragEnd");
            brushDragEnd.data = {
                data: selectedCategories,
                chart: this
            };
            document.body.dispatchEvent(brushDragEnd);
        }
    });

    stackedBar.dispatch.on('RenderComplete.brush', function(that, data) {
        if (typeof that.chartOptions.brush !== 'undefined' && that.chartOptions.brush === false)
            return;

        var renderContainerId = that.renderContainerId;
        var color = that.color;
        var width = that.canvasWidth - that.margin.left - that.margin.right,
            height = that.canvasHeight - that.margin.top - that.margin.bottom;
        var svg = d3.select('#' + renderContainerId + '_mainGroup');

        var categoryScale = that.categoryAxis.scale;

        var brush = svg.append("g")
            .attr("class", "brush")
            .call(d3.svg.brush().y(categoryScale)
                .on("brushstart", brushstart)
                .on("brush", brushmove)
                .on("brushend", brushend.bind(that)))

        var rect = brush.selectAll("rect")
            .attr("width", width)
            .style({
                "fill": "grey",
                "fill-opacity": "0.2"
            });

        function brushstart() {
            svg.classed("selecting", true);
        }

        function brushmove() {
            var s = d3.event.target.extent();
            svg.selectAll('.bar').classed("selected", function(d) {
                return s[0] <= (d = categoryScale(d.categoryValue) + categoryScale.rangeBand() / 2) && d <= s[1];
            });
        }

        function brushend() {
            svg.classed("selecting", !d3.event.target.empty());

            var selectedCategories = [];
            var selectedRect = d3.selectAll('.selected')[0];
            selectedRect.forEach(function(d) {
                if (selectedCategories.indexOf(d.__data__.categoryName) === -1)
                    selectedCategories.push(d.__data__.categoryName);
            });

            var brushDragEnd = new CustomEvent("brushDragEnd");
            brushDragEnd.data = {
                data: selectedCategories,
                chart: this
            };
            document.body.dispatchEvent(brushDragEnd);
        }
    });

    stackedColumn.dispatch.on('RenderComplete.brush', function(that, data) {
        if (typeof that.chartOptions.brush !== 'undefined' && that.chartOptions.brush === false)
            return;

        var renderContainerId = that.renderContainerId;
        var color = that.color;
        var width = that.canvasWidth - that.margin.left - that.margin.right,
            height = that.canvasHeight - that.margin.top - that.margin.bottom;
        var svg = d3.select('#' + renderContainerId + '_mainGroup');

        var categoryScale = that.categoryScale;

        var brush = svg.append("g")
            .attr("class", "brush")
            .call(d3.svg.brush().x(categoryScale)
                .on("brushstart", brushstart)
                .on("brush", brushmove)
                .on("brushend", brushend.bind(that)))

        var rect = brush.selectAll("rect")
            .attr("height", height)
            .style({
                "fill": "grey",
                "fill-opacity": "0.2"
            });

        function brushstart() {
            svg.classed("selecting", true);
        }

        function brushmove() {
            var s = d3.event.target.extent();
            svg.selectAll('.bar').classed("selected", function(d) {
                return s[0] <= (d = categoryScale(d.categoryValue) + categoryScale.rangeBand() / 2) && d <= s[1];
            });
        }

        function brushend() {
            svg.classed("selecting", !d3.event.target.empty());

            var selectedCategories = [];
            var selectedRect = d3.selectAll('.selected')[0];
            selectedRect.forEach(function(d) {
                if (selectedCategories.indexOf(d.__data__.categoryName) === -1)
                    selectedCategories.push(d.__data__.categoryName);
            });

            var brushDragEnd = new CustomEvent("brushDragEnd");
            brushDragEnd.data = {
                data: selectedCategories,
                chart: this
            };
            document.body.dispatchEvent(brushDragEnd);
        }
    });

    normalizedStackedColumn.dispatch.on('RenderComplete.brush', function(that, data) {
        if (typeof that.chartOptions.brush !== 'undefined' && that.chartOptions.brush === false)
            return;

        var renderContainerId = that.renderContainerId;
        var color = that.color;
        var width = that.canvasWidth - that.margin.left - that.margin.right,
            height = that.canvasHeight - that.margin.top - that.margin.bottom;
        var svg = d3.select('#' + renderContainerId + '_mainGroup');

        var categoryScale = that.categoryScale;

        var brush = svg.append("g")
            .attr("class", "brush")
            .call(d3.svg.brush().x(categoryScale)
                .on("brushstart", brushstart)
                .on("brush", brushmove)
                .on("brushend", brushend.bind(that)))

        var rect = brush.selectAll("rect")
            .attr("height", height)
            .style({
                "fill": "grey",
                "fill-opacity": "0.2"
            });

        function brushstart() {
            svg.classed("selecting", true);
        }

        function brushmove() {
            var s = d3.event.target.extent();
            svg.selectAll('.bar').classed("selected", function(d) {
                return s[0] <= (d = categoryScale(d.categoryValue) + categoryScale.rangeBand() / 2) && d <= s[1];
            });
        }

        function brushend() {
            svg.classed("selecting", !d3.event.target.empty());

            var selectedCategories = [];
            var selectedRect = d3.selectAll('.selected')[0];
            selectedRect.forEach(function(d) {
                if (selectedCategories.indexOf(d.__data__.categoryName) === -1)
                    selectedCategories.push(d.__data__.categoryName);
            });

            var brushDragEnd = new CustomEvent("brushDragEnd");
            brushDragEnd.data = {
                data: selectedCategories,
                chart: this
            };
            document.body.dispatchEvent(brushDragEnd);
        }
    });


    bubble.dispatch.on('RenderComplete.brush', function(that, data) {
        if (typeof that.chartOptions.brush !== 'undefined' && that.chartOptions.brush === false)
            return;

        var renderContainerId = that.renderContainerId;
        var color = that.color;
        var width = that.canvasWidth - that.margin.left - that.margin.right,
            height = that.canvasHeight - that.margin.top - that.margin.bottom;
        var svg = d3.select('#' + renderContainerId + '_mainGroup');

        var categoryScale = that.categoryAxis.scale;

        var brush = svg.append("g")
            .attr("class", "brush")
            .call(d3.svg.brush().x(categoryScale)
                .on("brushstart", brushstart)
                .on("brush", brushmove)
                .on("brushend", brushend.bind(that)))

        var rect = brush.selectAll("rect")
            .attr("height", height)
            .style({
                "fill": "grey",
                "fill-opacity": "0.2"
            });

        function brushstart() {
            svg.classed("selecting", true);
        }

        function brushmove() {
            var s = d3.event.target.extent();
            svg.selectAll('.bubble').classed("selected", function(d) {
                return s[0] <= (d = categoryScale(d.categoryValue) + categoryScale.rangeBand() / 2) && d <= s[1];
            });
        }

        function brushend() {
            svg.classed("selecting", !d3.event.target.empty());

            var selectedCategories = [];
            var selectedRect = d3.selectAll('.selected')[0];
            selectedRect.forEach(function(d) {
                if (selectedCategories.indexOf(d.__data__.categoryName) === -1)
                    selectedCategories.push(d.__data__.categoryName);
            });

            var brushDragEnd = new CustomEvent("brushDragEnd");
            brushDragEnd.data = {
                data: selectedCategories,
                chart: this
            };
            document.body.dispatchEvent(brushDragEnd);
        }
    });



})(xChart, d3);