var ChartData = {
	"categories": [{
		"longName": "9792709578",
		"name": "9792709578",
		"value": "9792709578",
		"dimName": "SUPPLIER.SUPPLIERCODE"
	}, {
		"longName": "9790712970",
		"name": "9790712970",
		"value": "9790712970",
		"dimName": "SUPPLIER.SUPPLIERCODE"
	}, {
		"longName": "9793147216",
		"name": "9793147216",
		"value": "9793147216",
		"dimName": "SUPPLIER.SUPPLIERCODE"
	}, {
		"longName": "9592710123",
		"name": "9592710123",
		"value": "9592710123",
		"dimName": "SUPPLIER.SUPPLIERCODE"
	}, {
		"longName": "9592721047",
		"name": "9592721047",
		"value": "9592721047",
		"dimName": "SUPPLIER.SUPPLIERCODE"
	}, {
		"longName": "9792700254",
		"name": "9792700254",
		"value": "9792700254",
		"dimName": "SUPPLIER.SUPPLIERCODE"
	}, {
		"longName": "CITY APARTMENTS LTD",
		"name": "CITY APARTMENTS LTD",
		"value": "CITY APARTMENTS LTD",
		"dimName": "SUPPLIER.SUPPLIERCODE"
	}, {
		"longName": "9793142506",
		"name": "9793142506",
		"value": "9793142506",
		"dimName": "SUPPLIER.SUPPLIERCODE"
	}, {
		"longName": "9792714958",
		"name": "9792714958",
		"value": "9792714958",
		"dimName": "SUPPLIER.SUPPLIERCODE"
	}, {
		"longName": "9796720274",
		"name": "9796720274",
		"value": "9796720274",
		"dimName": "SUPPLIER.SUPPLIERCODE"
	}],
	"series": [{
		"longName": "INVOICED AMOUNT",
		"name": "INVOICED AMOUNT",
		"value": "INVOICED AMOUNT",
		"data": [
			45591.63,
			14080,
			13153,
			12780.08,
			10428.16,
			8320.28,
			7618.48,
			6879.8,
			6406.4,
			4660
		],
		"fmtData": ["45591.63", "14080.0", "13153.0", "12780.08", "10428.16", "8320.28", "7618.48", "6879.8", "6406.4", "4660.0"],
		"minValue": {
			"data": "3.1",
			"fmtData": "3.1"
		},
		"maxValue": {
			"data": "14080.0",
			"fmtData": "14080.0"
		},
		"axis": null,
		"color": ""
	}, {
		"longName": "SPEND UNDER MANAGEMENT PO ONLY",
		"name": "SPEND UNDER MANAGEMENT PO ONLY",
		"value": "SPEND UNDER MANAGEMENT PO ONLY",
		"data": [28212.08, 14080, 8260, 0, 7733.02, 8320.28, 5254.36, 5257.3, 3203.2, 2330],
		"fmtData": ["28212.08", "14080.0", "8260.0", "0.0", "7733.02", "8320.28", "5254.36", "5257.3", "3203.2", "2330.0"],
		"minValue": {
			"data": "0.0",
			"fmtData": "0.0"
		},
		"maxValue": {
			"data": "14080.0",
			"fmtData": "14080.0"
		},
		"axis": null,
		"color": ""
	}],
	"columnMetas": [{
		"isNullable": 1,
		"displaySize": 15,
		"label": "INVOICED AMOUNT",
		"name": "INVOICED AMOUNT",
		"schemaName": null,
		"catelogName": null,
		"tableName": null,
		"precision": 15,
		"scale": 0,
		"columnType": 8,
		"columnTypeName": "DOUBLE",
		"autoIncrement": false,
		"caseSensitive": true,
		"searchable": false,
		"currency": false,
		"signed": true,
		"definitelyWritable": false,
		"readOnly": true,
		"writable": false
	}, {
		"isNullable": 1,
		"displaySize": 15,
		"label": "SPEND UNDER MANAGEMENT PO ONLY",
		"name": "SPEND UNDER MANAGEMENT PO ONLY",
		"schemaName": null,
		"catelogName": null,
		"tableName": null,
		"precision": 15,
		"scale": 0,
		"columnType": 8,
		"columnTypeName": "DOUBLE",
		"autoIncrement": false,
		"caseSensitive": true,
		"searchable": false,
		"currency": false,
		"signed": true,
		"definitelyWritable": false,
		"readOnly": true,
		"writable": false
	}, {
		"isNullable": 1,
		"displaySize": 256,
		"label": "SUPPLIERCODE",
		"name": "SUPPLIERCODE",
		"schemaName": null,
		"catelogName": null,
		"tableName": null,
		"precision": 256,
		"scale": 0,
		"columnType": 12,
		"columnTypeName": "VARCHAR(256)",
		"autoIncrement": false,
		"caseSensitive": true,
		"searchable": false,
		"currency": false,
		"signed": true,
		"definitelyWritable": false,
		"readOnly": true,
		"writable": false
	}],
	"ChartClientId": "chart-1",
	"chartType": "area",
	"request": {
		"chartClientId": "chart-1",
		"customData": {
			"cubename": "PIMACSpendAnalysis"
		},
		"measures": ["INVOICED AMOUNT", "SPEND UNDER MANAGEMENT PO ONLY"],
		"dimensions": ["SUPPLIER"],
		"sort": {
			"measureName": "INVOICED AMOUNT",
			"order": "desc",
			"ColumnName": "INVOICEDAMOUNT",
			"TableName": "PIMAC_FCTINVOICELINE",
			"MeasureName": "INVOICED AMOUNT"
		},
		"chartType": "area",
		"chartName": "C1",
		"kpis": [],
		"pageSize": 101,
		"offset": 0,
		"measureObjs": [{
			"name": "Invoiced Amount",
			"value": "INVOICED AMOUNT",
			"isCollapsed": true,
			"color": ""
		}, {
			"name": "Spend Under Management Po Only",
			"value": "SPEND UNDER MANAGEMENT PO ONLY",
			"isCollapsed": true,
			"color": ""
		}]
	}
};