var locationdata = {
    "categories": [{
        "longName": "ANZ",
        "name": "ANZ",
        "value": "ANZ",
        "dimName": "LOCATION.REGIONNAME"
    }, {
        "longName": "AMERICAS",
        "name": "AMERICAS",
        "value": "AMERICAS",
        "dimName": "LOCATION.REGIONNAME"
    }, {
        "longName": "EMEA",
        "name": "EMEA",
        "value": "EMEA",
        "dimName": "LOCATION.REGIONNAME"
    }, {
        "longName": "United States",
        "name": "United States",
        "value": "United States",
        "dimName": "LOCATION.REGIONNAME"
    }, {
        "longName": "China",
        "name": "China",
        "value": "China",
        "dimName": "LOCATION.REGIONNAME"
    }, {
        "longName": "India",
        "name": "India",
        "value": "India",
        "dimName": "LOCATION.REGIONNAME"
    }],
    "series": [{
        "longName": "INVOICED AMOUNT",
        "name": "INVOICED AMOUNT",
        "value": "INVOICED AMOUNT",
        "data": [242999.84, 2812.07, 769.58, 6798.098, 5000, 6000, 5900.09],
        "fmtData": ["242999.84", "2812.07", "769.58", "6798.098", "5000", "6000", "5000.09"],
        "minValue": {
            "data": "769.58",
            "fmtData": "769.58"
        },
        "maxValue": {
            "data": "242999.84",
            "fmtData": "242999.84"
        },
        "annData": [{
            "Id": 78,
            "contextId": 78,
            "contextType": "ANNOTATION",
            "targetValue": 0,
            "chartId": "chart-1",
            "dashboardId": 101
        }, null, null],
        "axis": null,
        "aggregation": "sum",
        "color": "red"
    }, {
        "longName": "INVOICED AMOUNT",
        "name": "INVOICED AMOUNT",
        "value": "INVOICED AMOUNT",
        "data": [242999.84, 2812.07, 769.58, 6798.098, 5000, 6000, 5900.09],
        "fmtData": ["242999.84", "2812.07", "769.58", "6798.098", "5000", "6000", "5000.09"],
        "minValue": {
            "data": "769.58",
            "fmtData": "769.58"
        },
        "maxValue": {
            "data": "242999.84",
            "fmtData": "242999.84"
        },
        "annData": [{
            "Id": 78,
            "contextId": 78,
            "contextType": "ANNOTATION",
            "targetValue": 0,
            "chartId": "chart-1",
            "dashboardId": 101
        }, null, null],
        "axis": null,
        "aggregation": "count",
        "color": "green"
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
        "displaySize": 256,
        "label": "REGIONNAME",
        "name": "REGIONNAME",
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
    "chartType": "",
    "request": {
        "chartClientId": "chart-1",
        "customData": {
            "cubename": "PIMACSpendAnalysis"
        },
        "measures": ["INVOICED AMOUNT"],
        "dimensions": ["LOCATION"],
        "sort": {
            "measureName": "INVOICED AMOUNT",
            "order": "desc",
            "ColumnName": "INVOICEDAMOUNT",
            "TableName": "PIMAC_FCTINVOICELINE",
            "MeasureName": "INVOICED AMOUNT"
        },
        "gFilters": [],
        "chartType": "",
        "chartName": "Spend By location",
        "kpis": [],
        "pageSize": 101,
        "offset": 0,
        "measureObjs": [{
            "name": "Invoiced Amount",
            "value": "INVOICED AMOUNT",
            "isCollapsed": true
        }]
    }
};

/*var locationdata = {
    "categories": [
        {
            "longName": "Afghanistan",
            "name": "Afghanistan",
            "value": "Afghanistan",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Angola",
            "name": "Angola",
            "value": "Angola",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Albania",
            "name": "Albania",
            "value": "Albania",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Aland",
            "name": "Aland",
            "value": "Aland",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Andorra",
            "name": "Andorra",
            "value": "Andorra",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "United Arab Emirates",
            "name": "United Arab Emirates",
            "value": "United Arab Emirates",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Argentina",
            "name": "Argentina",
            "value": "Argentina",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Armenia",
            "name": "Armenia",
            "value": "Armenia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Fr. S. Antarctic Lands",
            "name": "Fr. S. Antarctic Lands",
            "value": "Fr. S. Antarctic Lands",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Australia",
            "name": "Australia",
            "value": "Australia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Austria",
            "name": "Austria",
            "value": "Austria",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Azerbaijan",
            "name": "Azerbaijan",
            "value": "Azerbaijan",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Burundi",
            "name": "Burundi",
            "value": "Burundi",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Belgium",
            "name": "Belgium",
            "value": "Belgium",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Benin",
            "name": "Benin",
            "value": "Benin",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Burkina Faso",
            "name": "Burkina Faso",
            "value": "Burkina Faso",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Bangladesh",
            "name": "Bangladesh",
            "value": "Bangladesh",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Bulgaria",
            "name": "Bulgaria",
            "value": "Bulgaria",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Bahamas",
            "name": "Bahamas",
            "value": "Bahamas",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Bosnia and Herz.",
            "name": "Bosnia and Herz.",
            "value": "Bosnia and Herz.",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Belarus",
            "name": "Belarus",
            "value": "Belarus",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Belize",
            "name": "Belize",
            "value": "Belize",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Bolivia",
            "name": "Bolivia",
            "value": "Bolivia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Brazil",
            "name": "Brazil",
            "value": "Brazil",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Brunei",
            "name": "Brunei",
            "value": "Brunei",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Bhutan",
            "name": "Bhutan",
            "value": "Bhutan",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Botswana",
            "name": "Botswana",
            "value": "Botswana",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Central African Rep.",
            "name": "Central African Rep.",
            "value": "Central African Rep.",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Canada",
            "name": "Canada",
            "value": "Canada",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Switzerland",
            "name": "Switzerland",
            "value": "Switzerland",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Chile",
            "name": "Chile",
            "value": "Chile",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "China",
            "name": "China",
            "value": "China",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "CÃ´te d'Ivoire",
            "name": "CÃ´te d'Ivoire",
            "value": "CÃ´te d'Ivoire",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Cameroon",
            "name": "Cameroon",
            "value": "Cameroon",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Cyprus U.N. Buffer Zone",
            "name": "Cyprus U.N. Buffer Zone",
            "value": "Cyprus U.N. Buffer Zone",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Dem. Rep. Congo",
            "name": "Dem. Rep. Congo",
            "value": "Dem. Rep. Congo",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Congo",
            "name": "Congo",
            "value": "Congo",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Colombia",
            "name": "Colombia",
            "value": "Colombia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Comoros",
            "name": "Comoros",
            "value": "Comoros",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Cape Verde",
            "name": "Cape Verde",
            "value": "Cape Verde",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Costa Rica",
            "name": "Costa Rica",
            "value": "Costa Rica",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Cuba",
            "name": "Cuba",
            "value": "Cuba",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "N. Cyprus",
            "name": "N. Cyprus",
            "value": "N. Cyprus",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Cyprus",
            "name": "Cyprus",
            "value": "Cyprus",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Czech Rep.",
            "name": "Czech Rep.",
            "value": "Czech Rep.",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Germany",
            "name": "Germany",
            "value": "Germany",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Djibouti",
            "name": "Djibouti",
            "value": "Djibouti",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Dominica",
            "name": "Dominica",
            "value": "Dominica",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Denmark",
            "name": "Denmark",
            "value": "Denmark",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Dominican Rep.",
            "name": "Dominican Rep.",
            "value": "Dominican Rep.",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Algeria",
            "name": "Algeria",
            "value": "Algeria",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Ecuador",
            "name": "Ecuador",
            "value": "Ecuador",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Egypt",
            "name": "Egypt",
            "value": "Egypt",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Eritrea",
            "name": "Eritrea",
            "value": "Eritrea",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Dhekelia",
            "name": "Dhekelia",
            "value": "Dhekelia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Spain",
            "name": "Spain",
            "value": "Spain",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Estonia",
            "name": "Estonia",
            "value": "Estonia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Ethiopia",
            "name": "Ethiopia",
            "value": "Ethiopia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Finland",
            "name": "Finland",
            "value": "Finland",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Fiji",
            "name": "Fiji",
            "value": "Fiji",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Falkland Is.",
            "name": "Falkland Is.",
            "value": "Falkland Is.",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "France",
            "name": "France",
            "value": "France",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Gabon",
            "name": "Gabon",
            "value": "Gabon",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "United Kingdom",
            "name": "United Kingdom",
            "value": "United Kingdom",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Georgia",
            "name": "Georgia",
            "value": "Georgia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Ghana",
            "name": "Ghana",
            "value": "Ghana",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Guinea",
            "name": "Guinea",
            "value": "Guinea",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Gambia",
            "name": "Gambia",
            "value": "Gambia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Guinea-Bissau",
            "name": "Guinea-Bissau",
            "value": "Guinea-Bissau",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Eq. Guinea",
            "name": "Eq. Guinea",
            "value": "Eq. Guinea",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Greece",
            "name": "Greece",
            "value": "Greece",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Greenland",
            "name": "Greenland",
            "value": "Greenland",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Guatemala",
            "name": "Guatemala",
            "value": "Guatemala",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Guyana",
            "name": "Guyana",
            "value": "Guyana",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Hong Kong",
            "name": "Hong Kong",
            "value": "Hong Kong",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Honduras",
            "name": "Honduras",
            "value": "Honduras",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Croatia",
            "name": "Croatia",
            "value": "Croatia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Haiti",
            "name": "Haiti",
            "value": "Haiti",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Hungary",
            "name": "Hungary",
            "value": "Hungary",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Indonesia",
            "name": "Indonesia",
            "value": "Indonesia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Isle of Man",
            "name": "Isle of Man",
            "value": "Isle of Man",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "India",
            "name": "India",
            "value": "India",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Ireland",
            "name": "Ireland",
            "value": "Ireland",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Iran",
            "name": "Iran",
            "value": "Iran",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Iraq",
            "name": "Iraq",
            "value": "Iraq",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Iceland",
            "name": "Iceland",
            "value": "Iceland",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Israel",
            "name": "Israel",
            "value": "Israel",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Italy",
            "name": "Italy",
            "value": "Italy",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Jamaica",
            "name": "Jamaica",
            "value": "Jamaica",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Jordan",
            "name": "Jordan",
            "value": "Jordan",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Japan",
            "name": "Japan",
            "value": "Japan",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Baikonur",
            "name": "Baikonur",
            "value": "Baikonur",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Siachen Glacier",
            "name": "Siachen Glacier",
            "value": "Siachen Glacier",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Kazakhstan",
            "name": "Kazakhstan",
            "value": "Kazakhstan",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Kenya",
            "name": "Kenya",
            "value": "Kenya",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Kyrgyzstan",
            "name": "Kyrgyzstan",
            "value": "Kyrgyzstan",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Cambodia",
            "name": "Cambodia",
            "value": "Cambodia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Korea",
            "name": "Korea",
            "value": "Korea",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Kosovo",
            "name": "Kosovo",
            "value": "Kosovo",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Kuwait",
            "name": "Kuwait",
            "value": "Kuwait",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Lao PDR",
            "name": "Lao PDR",
            "value": "Lao PDR",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Lebanon",
            "name": "Lebanon",
            "value": "Lebanon",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Liberia",
            "name": "Liberia",
            "value": "Liberia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Libya",
            "name": "Libya",
            "value": "Libya",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Sri Lanka",
            "name": "Sri Lanka",
            "value": "Sri Lanka",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Lesotho",
            "name": "Lesotho",
            "value": "Lesotho",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Lithuania",
            "name": "Lithuania",
            "value": "Lithuania",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Luxembourg",
            "name": "Luxembourg",
            "value": "Luxembourg",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Latvia",
            "name": "Latvia",
            "value": "Latvia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Morocco",
            "name": "Morocco",
            "value": "Morocco",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Moldova",
            "name": "Moldova",
            "value": "Moldova",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Madagascar",
            "name": "Madagascar",
            "value": "Madagascar",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Mexico",
            "name": "Mexico",
            "value": "Mexico",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Macedonia",
            "name": "Macedonia",
            "value": "Macedonia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Mali",
            "name": "Mali",
            "value": "Mali",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Myanmar",
            "name": "Myanmar",
            "value": "Myanmar",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Montenegro",
            "name": "Montenegro",
            "value": "Montenegro",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Mongolia",
            "name": "Mongolia",
            "value": "Mongolia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Mozambique",
            "name": "Mozambique",
            "value": "Mozambique",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Mauritania",
            "name": "Mauritania",
            "value": "Mauritania",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Mauritius",
            "name": "Mauritius",
            "value": "Mauritius",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Malawi",
            "name": "Malawi",
            "value": "Malawi",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Malaysia",
            "name": "Malaysia",
            "value": "Malaysia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Namibia",
            "name": "Namibia",
            "value": "Namibia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "New Caledonia",
            "name": "New Caledonia",
            "value": "New Caledonia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Niger",
            "name": "Niger",
            "value": "Niger",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Nigeria",
            "name": "Nigeria",
            "value": "Nigeria",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Nicaragua",
            "name": "Nicaragua",
            "value": "Nicaragua",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Netherlands",
            "name": "Netherlands",
            "value": "Netherlands",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Norway",
            "name": "Norway",
            "value": "Norway",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Nepal",
            "name": "Nepal",
            "value": "Nepal",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "New Zealand",
            "name": "New Zealand",
            "value": "New Zealand",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Oman",
            "name": "Oman",
            "value": "Oman",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Pakistan",
            "name": "Pakistan",
            "value": "Pakistan",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Panama",
            "name": "Panama",
            "value": "Panama",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Peru",
            "name": "Peru",
            "value": "Peru",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Philippines",
            "name": "Philippines",
            "value": "Philippines",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Papua New Guinea",
            "name": "Papua New Guinea",
            "value": "Papua New Guinea",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Poland",
            "name": "Poland",
            "value": "Poland",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Puerto Rico",
            "name": "Puerto Rico",
            "value": "Puerto Rico",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Dem. Rep. Korea",
            "name": "Dem. Rep. Korea",
            "value": "Dem. Rep. Korea",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Portugal",
            "name": "Portugal",
            "value": "Portugal",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Paraguay",
            "name": "Paraguay",
            "value": "Paraguay",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Palestine",
            "name": "Palestine",
            "value": "Palestine",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Fr. Polynesia",
            "name": "Fr. Polynesia",
            "value": "Fr. Polynesia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Qatar",
            "name": "Qatar",
            "value": "Qatar",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Romania",
            "name": "Romania",
            "value": "Romania",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Russia",
            "name": "Russia",
            "value": "Russia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Rwanda",
            "name": "Rwanda",
            "value": "Rwanda",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "W. Sahara",
            "name": "W. Sahara",
            "value": "W. Sahara",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Saudi Arabia",
            "name": "Saudi Arabia",
            "value": "Saudi Arabia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Sudan",
            "name": "Sudan",
            "value": "Sudan",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "S. Sudan",
            "name": "S. Sudan",
            "value": "S. Sudan",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Senegal",
            "name": "Senegal",
            "value": "Senegal",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "S. Geo. and S. Sandw. Is.",
            "name": "S. Geo. and S. Sandw. Is.",
            "value": "S. Geo. and S. Sandw. Is.",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Solomon Is.",
            "name": "Solomon Is.",
            "value": "Solomon Is.",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Sierra Leone",
            "name": "Sierra Leone",
            "value": "Sierra Leone",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "El Salvador",
            "name": "El Salvador",
            "value": "El Salvador",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Somaliland",
            "name": "Somaliland",
            "value": "Somaliland",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Somalia",
            "name": "Somalia",
            "value": "Somalia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Serbia",
            "name": "Serbia",
            "value": "Serbia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "SÃ£o TomÃ© and Principe",
            "name": "SÃ£o TomÃ© and Principe",
            "value": "SÃ£o TomÃ© and Principe",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Suriname",
            "name": "Suriname",
            "value": "Suriname",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Slovakia",
            "name": "Slovakia",
            "value": "Slovakia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Slovenia",
            "name": "Slovenia",
            "value": "Slovenia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Sweden",
            "name": "Sweden",
            "value": "Sweden",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Swaziland",
            "name": "Swaziland",
            "value": "Swaziland",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Syria",
            "name": "Syria",
            "value": "Syria",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Chad",
            "name": "Chad",
            "value": "Chad",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Togo",
            "name": "Togo",
            "value": "Togo",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Thailand",
            "name": "Thailand",
            "value": "Thailand",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Tajikistan",
            "name": "Tajikistan",
            "value": "Tajikistan",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Turkmenistan",
            "name": "Turkmenistan",
            "value": "Turkmenistan",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Timor-Leste",
            "name": "Timor-Leste",
            "value": "Timor-Leste",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Trinidad and Tobago",
            "name": "Trinidad and Tobago",
            "value": "Trinidad and Tobago",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Tunisia",
            "name": "Tunisia",
            "value": "Tunisia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Turkey",
            "name": "Turkey",
            "value": "Turkey",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Taiwan",
            "name": "Taiwan",
            "value": "Taiwan",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Tanzania",
            "name": "Tanzania",
            "value": "Tanzania",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Uganda",
            "name": "Uganda",
            "value": "Uganda",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Ukraine",
            "name": "Ukraine",
            "value": "Ukraine",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Uruguay",
            "name": "Uruguay",
            "value": "Uruguay",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "United States",
            "name": "United States",
            "value": "United States",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Uzbekistan",
            "name": "Uzbekistan",
            "value": "Uzbekistan",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Venezuela",
            "name": "Venezuela",
            "value": "Venezuela",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Vietnam",
            "name": "Vietnam",
            "value": "Vietnam",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Vanuatu",
            "name": "Vanuatu",
            "value": "Vanuatu",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Samoa",
            "name": "Samoa",
            "value": "Samoa",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Yemen",
            "name": "Yemen",
            "value": "Yemen",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "South Africa",
            "name": "South Africa",
            "value": "South Africa",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Zambia",
            "name": "Zambia",
            "value": "Zambia",
            "dimName": "LOCATION.REGIONNAME"
        },
        {
            "longName": "Zimbabwe",
            "name": "Zimbabwe",
            "value": "Zimbabwe",
            "dimName": "LOCATION.REGIONNAME"
        }
    ],
    "series": [{
        "longName": "INVOICED AMOUNT",
        "name": "INVOICED AMOUNT",
        "value": "INVOICED AMOUNT",
        "data": [
            6052.566616376378,
            9462.806758628802,
            6153.126067244576,
            1783.8150446380996,
            4284.14310643201,
            4921.209319793036,
            1729.961143759633,
            9889.003253188466,
            1849.3981800557412,
            5749.121123951389,
            3241.6620112001683,
            4145.669174837232,
            6439.682774210138,
            4838.972982786531,
            4213.319311221208,
            6491.2395532541,
            1854.2849400005546,
            5841.163465143511,
            7018.618223771827,
            8559.525928295669,
            7770.0229090604125,
            5466.166575583627,
            6815.244127708722,
            9763.20469600791,
            9845.423735629138,
            5453.84309481536,
            3268.3101614643474,
            6816.657754732673,
            3388.2105820708343,
            6618.434205963799,
            370.0884887104694,
            48.60090820396845,
            2467.627217530517,
            8768.319335562323,
            1965.2672786562487,
            3438.6445178193317,
            6224.688992033034,
            7692.645221937136,
            4027.5147297037784,
            1665.5819882259416,
            3464.1795251155495,
            3933.884127357845,
            8645.15208530484,
            6491.9478276980835,
            2910.9328796133814,
            3990.6224611360353,
            1515.1869769222292,
            2582.1477522459736,
            5046.818369185226,
            9658.443040576954,
            6495.5642070948015,
            2471.4558808115994,
            4330.286595360611,
            4279.809903829164,
            8484.798551275126,
            5763.997617995286,
            9723.2642585857,
            1717.8774158772203,
            3826.0022964822847,
            1283.6075382244094,
            1637.9732514452705,
            1537.8082128995297,
            6375.627837677713,
            9359.689391800672,
            6875.683809994435,
            3011.9315287126637,
            111.7162082912615,
            4162.121086987178,
            3230.345154172971,
            6016.21635555448,
            8503.66067103011,
            485.62993359445585,
            7167.194474557102,
            2534.971065035947,
            762.2610963530695,
            5613.241020785378,
            1140.9993524563045,
            1773.64902515184,
            9460.46578426466,
            1403.381070597871,
            4663.044492387816,
            8601.565838289267,
            299.06575032848883,
            8230.117742523693,
            241.12191022672036,
            7536.4119491607125,
            1620.0821920095177,
            2399.9286512609074,
            2718.6349878465776,
            237.2277003436185,
            183.2458764508549,
            2645.6794531469272,
            708.9790442501198,
            4717.86069727806,
            4297.419826409008,
            7543.264273842265,
            9361.81235006652,
            1867.0523190031151,
            8660.068080820047,
            1147.2622386960163,
            3578.6999728084525,
            3114.5807176835683,
            2723.9201235054256,
            9318.062125079166,
            8794.152996319383,
            3046.8191437851488,
            2473.5099764872402,
            4546.452129140302,
            6240.077811190316,
            2813.162964627689,
            7907.629360695399,
            4562.050020790242,
            4603.749726794946,
            1813.2708341977998,
            309.955260130943,
            7855.901807154757,
            5052.332607811832,
            6655.254464788545,
            4925.637647195007,
            5577.219989515241,
            9929.487592172265,
            9045.092452027156,
            7484.500815928094,
            4945.992680088744,
            3101.3233572300237,
            5841.784193677655,
            4108.729495408501,
            2065.3541561363654,
            1649.434128608951,
            1473.847848538814,
            9073.108185945857,
            5963.067071394168,
            4663.516605604245,
            6751.540655415755,
            781.9752277415271,
            3276.8491515503715,
            2450.3099730229815,
            7383.598857040412,
            4835.352888836608,
            9404.382489381946,
            272.5987692269527,
            4361.156628900951,
            9657.58836564954,
            7913.748671129084,
            4021.6870040564067,
            2866.3649406580125,
            1463.4701952510466,
            2180.5186074326534,
            3604.202431187109,
            7038.166756213666,
            6589.609614988123,
            7514.019977190889,
            6078.04711278692,
            1854.1547126171708,
            2893.7019807619936,
            3095.1860102156093,
            2940.1490053196076,
            657.2253335309242,
            3346.994581482383,
            7694.253330139062,
            2779.1121218281824,
            9339.477509280829,
            2703.028184211356,
            372.9244236851503,
            8726.596978333047,
            3981.281166489248,
            5852.934345621834,
            6271.675727669996,
            5909.9920904155215,
            4624.4365265413735,
            4449.773368177678,
            3425.065132713667,
            9707.527246201756,
            1369.4578500544608,
            6387.465952749764,
            5264.956912246308,
            8781.837172234498,
            6884.536316719629,
            209.8311788390972,
            1950.8482309234564,
            5288.289332919029,
            3655.7090673829416,
            6479.517149758835,
            7772.187573941392,
            3976.449104299333,
            4201.600477621492,
            7622.809724233257,
            3771.7199726785598,
            9641.223421838495,
            2072.012567542825,
            3909.2327784696067,
            388.03329424727195
        ],
        "fmtData": [
            "6052.566616376378",
            "9462.806758628802",
            "6153.126067244576",
            "1783.8150446380996",
            "4284.14310643201",
            "4921.209319793036",
            "1729.961143759633",
            "9889.003253188466",
            "1849.3981800557412",
            "5749.121123951389",
            "3241.6620112001683",
            "4145.669174837232",
            "6439.682774210138",
            "4838.972982786531",
            "4213.319311221208",
            "6491.2395532541",
            "1854.2849400005546",
            "5841.163465143511",
            "7018.618223771827",
            "8559.525928295669",
            "7770.0229090604125",
            "5466.166575583627",
            "6815.244127708722",
            "9763.20469600791",
            "9845.423735629138",
            "5453.84309481536",
            "3268.3101614643474",
            "6816.657754732673",
            "3388.2105820708343",
            "6618.434205963799",
            "370.0884887104694",
            "48.60090820396845",
            "2467.627217530517",
            "8768.319335562323",
            "1965.2672786562487",
            "3438.6445178193317",
            "6224.688992033034",
            "7692.645221937136",
            "4027.5147297037784",
            "1665.5819882259416",
            "3464.1795251155495",
            "3933.884127357845",
            "8645.15208530484",
            "6491.9478276980835",
            "2910.9328796133814",
            "3990.6224611360353",
            "1515.1869769222292",
            "2582.1477522459736",
            "5046.818369185226",
            "9658.443040576954",
            "6495.5642070948015",
            "2471.4558808115994",
            "4330.286595360611",
            "4279.809903829164",
            "8484.798551275126",
            "5763.997617995286",
            "9723.2642585857",
            "1717.8774158772203",
            "3826.0022964822847",
            "1283.6075382244094",
            "1637.9732514452705",
            "1537.8082128995297",
            "6375.627837677713",
            "9359.689391800672",
            "6875.683809994435",
            "3011.9315287126637",
            "111.7162082912615",
            "4162.121086987178",
            "3230.345154172971",
            "6016.21635555448",
            "8503.66067103011",
            "485.62993359445585",
            "7167.194474557102",
            "2534.971065035947",
            "762.2610963530695",
            "5613.241020785378",
            "1140.9993524563045",
            "1773.64902515184",
            "9460.46578426466",
            "1403.381070597871",
            "4663.044492387816",
            "8601.565838289267",
            "299.06575032848883",
            "8230.117742523693",
            "241.12191022672036",
            "7536.4119491607125",
            "1620.0821920095177",
            "2399.9286512609074",
            "2718.6349878465776",
            "237.2277003436185",
            "183.2458764508549",
            "2645.6794531469272",
            "708.9790442501198",
            "4717.86069727806",
            "4297.419826409008",
            "7543.264273842265",
            "9361.81235006652",
            "1867.0523190031151",
            "8660.068080820047",
            "1147.2622386960163",
            "3578.6999728084525",
            "3114.5807176835683",
            "2723.9201235054256",
            "9318.062125079166",
            "8794.152996319383",
            "3046.8191437851488",
            "2473.5099764872402",
            "4546.452129140302",
            "6240.077811190316",
            "2813.162964627689",
            "7907.629360695399",
            "4562.050020790242",
            "4603.749726794946",
            "1813.2708341977998",
            "309.955260130943",
            "7855.901807154757",
            "5052.332607811832",
            "6655.254464788545",
            "4925.637647195007",
            "5577.219989515241",
            "9929.487592172265",
            "9045.092452027156",
            "7484.500815928094",
            "4945.992680088744",
            "3101.3233572300237",
            "5841.784193677655",
            "4108.729495408501",
            "2065.3541561363654",
            "1649.434128608951",
            "1473.847848538814",
            "9073.108185945857",
            "5963.067071394168",
            "4663.516605604245",
            "6751.540655415755",
            "781.9752277415271",
            "3276.8491515503715",
            "2450.3099730229815",
            "7383.598857040412",
            "4835.352888836608",
            "9404.382489381946",
            "272.5987692269527",
            "4361.156628900951",
            "9657.58836564954",
            "7913.748671129084",
            "4021.6870040564067",
            "2866.3649406580125",
            "1463.4701952510466",
            "2180.5186074326534",
            "3604.202431187109",
            "7038.166756213666",
            "6589.609614988123",
            "7514.019977190889",
            "6078.04711278692",
            "1854.1547126171708",
            "2893.7019807619936",
            "3095.1860102156093",
            "2940.1490053196076",
            "657.2253335309242",
            "3346.994581482383",
            "7694.253330139062",
            "2779.1121218281824",
            "9339.477509280829",
            "2703.028184211356",
            "372.9244236851503",
            "8726.596978333047",
            "3981.281166489248",
            "5852.934345621834",
            "6271.675727669996",
            "5909.9920904155215",
            "4624.4365265413735",
            "4449.773368177678",
            "3425.065132713667",
            "9707.527246201756",
            "1369.4578500544608",
            "6387.465952749764",
            "5264.956912246308",
            "8781.837172234498",
            "6884.536316719629",
            "209.8311788390972",
            "1950.8482309234564",
            "5288.289332919029",
            "3655.7090673829416",
            "6479.517149758835",
            "7772.187573941392",
            "3976.449104299333",
            "4201.600477621492",
            "7622.809724233257",
            "3771.7199726785598",
            "9641.223421838495",
            "2072.012567542825",
            "3909.2327784696067",
            "388.03329424727195"
        ],
        "minValue": {
            "data": "769.58",
            "fmtData": "769.58"
        },
        "maxValue": {
            "data": "242999.84",
            "fmtData": "242999.84"
        },
        "annData": [{
            "Id": 78,
            "contextId": 78,
            "contextType": "ANNOTATION",
            "targetValue": 0,
            "chartId": "chart-1",
            "dashboardId": 101
        }, null, null],
        "axis": null
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
        "displaySize": 256,
        "label": "REGIONNAME",
        "name": "REGIONNAME",
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
    "chartType": "",
    "request": {
        "chartClientId": "chart-1",
        "customData": {
            "cubename": "PIMACSpendAnalysis"
        },
        "measures": ["INVOICED AMOUNT"],
        "dimensions": ["LOCATION"],
        "sort": {
            "measureName": "INVOICED AMOUNT",
            "order": "desc",
            "ColumnName": "INVOICEDAMOUNT",
            "TableName": "PIMAC_FCTINVOICELINE",
            "MeasureName": "INVOICED AMOUNT"
        },
        "gFilters": [],
        "chartType": "",
        "chartName": "Spend By location",
        "kpis": [],
        "pageSize": 101,
        "offset": 0,
        "measureObjs": [{
            "name": "Invoiced Amount",
            "value": "INVOICED AMOUNT",
            "isCollapsed": true
        }]
    }
};
*/