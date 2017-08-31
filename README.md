# OE-Charts

oe-charts is a charting library which provides polymer based charting components. This library exposes a single component named as "oe-charts". Following are the properties of oe-charts : - 

property |type | required | default| description
-|-|-|-|-
chartType | string| no | groupedColumn| Following are the supported chartTypes  - `area`, `line`, `pie`, `donut`, `groupedcolumn`, `groupedbar`, `stackedcolumn`, `stackedbar`,`bubble`. 
dataUrl |  string|no (if `data` property is provided) | |`dataUrl` should be passed incase the data for the chart is linked with any end point url. Like `/api/ChartData`.  This url is supposed to provide data in a format of array.
category |  string|yes ||`category` property is used to define the x-axis in chart. It accepts a property name from the individual element of from data.
series | array |yes || series accepts an array where each element is an object. Properties of each element can be any among `property` , `aggregation`, `color` ,`dataUrl` and `categoryId`. A sample series element can be as - ```{"property":"age","aggregation":"sum","color":"#f5f5f5"}```. `dataUrl` is provided when the data to be fetched is from a different URL for each series. `categoryId` provided along with `dataUrl` helps to specify the category field for the data fetched from the respective `dataUrl`. Aggregation value can be `sum`, `count`  or `average`. Charts can be of multiple series. So multiple values can be provided via array.
data |  array| no ( if `dataUrl` property is set ) | | `data` property is required to render the data. it should be an array of objects.  If `dataUrl` property is set then `data` is not required. 
noDataMessage | string| no | No Data Found |`noDataMessage` for the chart is an empty state message, when there is no data. The message is displayed as Category/Series Not Found, incase there is data but Category or series data  does not exist 
  

# How to run oe-charts as an app - 

oe-charts has an index.html file which renders all type of charts.

To run this project, follow the steps - 
1. Clone the repository and cd into the directory
2. run `bower install`
3. if you have `polymer-cli` node module installed globally then run `polymer serve -p 8000` else run `npm install -g polymer-cli` first.

# Following are some sample demos  - 

### 1. oe-charts with data property

``` html
<oe-charts id="chart" chart-type="groupedcolumn" category="country"  series='[{"property":"population","aggregation":"sum","color":"red"},{"property":"area","aggregation":"sum","color":"green"}]' data='[{"country":"USA","state":"california","population":288950.4078628451,"area":976257.3366356717},{"country":"USA","state":"florida","population":739066.8476955806,"area":597380.4224191846},{"country":"USA","state":"alaska","population":29323.139490312176,"area":123479.56945088212},{"country":"USA","state":"texas","population":353004.1292396642,"area":98773.49371218936},{"country":"india","state":"mumbai","population":537506.6114266327,"area":582206.1173899507},{"country":"india","state":"delhi","population":667620.5530462395,"area":347218.18391567696}]'></oe-charts>
```
### 2. oe-charts with data-url property

``` html
<oe-charts id="chart" chart-type="pie" category="country" series='[{"property":"population","aggregation":"sum","color":"red"},{"property":"area","aggregation":"sum","color":"green"}]' data-url="/data.json"></oe-charts>
```

### 3. oe-charts with multiple dataUrl per series

There can be scenarios where the data has to fetched from different sources(different api's) for each series of the graph. This can be achieved by adding dataUrl property of oe-charts to each series item.
Below is an example of an oe-chart where the travel expenses and stationary expenses for a company are fetched from different api's.
``` html
<oe-charts id="chart" chart-type="groupedBar" category="billDate" category-aggregator="year" series='[{"property":"travelExpense","aggregation":"sum","color":"red","dataUrl":"/api/travelInvoices"},{"property":"stationaryExpense","aggregation":"sum","color":"green","dataUrl":"/api/stationaryInvoices"}]'></oe-charts>
``` 


