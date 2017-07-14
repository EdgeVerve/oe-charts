# OE-Charts

oe-charts is a charting library which provides polymer based charting components. This library exposes a single component named as "oe-charts". Following are the properties of oe-charts : - 

property |type | required | default| description
-|-|-|-|-
chartType | string| no | groupedColumn| Following are the supported chartTypes  - `area`, `line`, `pie`, `donut`, `groupedcolumn`, `groupedbar`, `stackedcolumn`, `stackedbar`. 
dataUrl |  string|no (if `data` property is provided) | |`dataUrl` should be passed incase the data for the chart is linked with any end point url. Like `/api/ChartData`.  This url is supposed to provide data in a format of array.
category |  string|yes ||`category` property is used to define the x-axis in chart. It accepts a property name from the individual element of from data.
series | array |yes || series accepts an array where each element is an object. Proeperties of each element can be  any among `property` ,   `aggregation`, `color`. A sample series element can be as - ```{"property":"age","aggregation":"sum","color":"#f5f5f5"}```. Aggregation value can be `sum`, `count`  or `average`. Charts can be of multiple series. So multiple values can be provided via array.
data |  array| no ( if `dataUrl` property is set ) | | `data` property is required to render the data. it should be an array of objects.  If `dataUrl` property is set then `data` is not required. 
chartWidth | number| no | 300px|`chartWidth` can be provided to set the width of the container of the chart.
chartHeight | number|no | 300px| `chartHeight` can be provided to set the height of the container of the chart.
inheritParentDimension |  string| no | false | It can be set to true in case of chart container is suppsed to get the dimension on its parent container. If this property is given and if the parent is resized, in that case the chart will get redrawn occupying the new dimension. 
  
# How to run this project - 
To run this project, follow the steps - 
1. `git clone git@10.73.97.24:oecloud.io/oe-charts.git`
2. `cd oe-charts`
3. run `bower install`
4. if you have `polyserve` node module installed globally then run `polyserve -p 8000` else run `npm install polyserve -g` then run `polyserve -p 8000`

