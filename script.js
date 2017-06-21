var chart = new xChart.chart('chart');
chart.setOptions({
	chartClientId: 'chart_1',
	noOfPieSlices: 5,
	chartType: 'pie',
	overlap: false
});

/// var itemArray = [];
// chart.addEventHandler('click', 'dataitems', function() {
// 	if (event.ctrlKey) {
// 		itemArray.push(this);
// 	} else {
// 		itemArray = [];
// 		itemArray.push(this);
// 	}
// }, false);


// chart.addEventHandler('mouseover','bar',function(){
// 	console.log('Custom mouseover');
// });
chart.render(data);

function overlap() {
	chart.setOptions({
		overlap: true
	});
	chart.renderOverlap(Odata);
}

function remove1() {
	document.getElementById("test").value = "Overlap";
	chart.removeOverlap();
}

function changeData() {
	document.getElementById("test").value = "Change data";
	chart.renderOverlap(Odata1);
}

function redraw() {
	chart.setOptions({
		overlap: false
	});
	chart.render(Rdata);
}

function reset1() {
	chart.setOptions({
		overlap: false
	});
	chart.render(data);
}

function change() {
	var selection = document.getElementById("ctype");
	var ctype = selection.options[selection.selectedIndex].value;
	chart.setOptions({
		chartType: ctype
	});
	chart.render(data);

}

function set() {
	var ctp = chart.renderedChart.chartType;
	var selElement = document.getElementById("ctype");

	for (var i = 0; i < selElement.options.length; i++) {
		if (selElement.options[i].value == ctp) {
			selElement.options[i].outerHTML = '<option value="' + ctp + '" selected="selected">' + ctp + '</option>';

		}

	}
}