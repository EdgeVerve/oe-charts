/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";
import { OEAjaxMixin } from "oe-mixins/oe-ajax-mixin.js";
import { XChart } from "./charts-lib/x-chart.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "async/lib/async.js";

/**
 * `oe-chart`
 *  `<oe-chart>` is a charting library which provides polymer based charting components.
 *  
 * 
 * ### Styling
 * 
 * The following custom properties and mixins are available for styling:
 * 
 * CSS Variable | Description | Default
 * ----------------|-------------|----------
 * `--custom-variable-1` | Description of variable | `default value` 
 * `--custom-mixin-1` | Description of mixin | {}
 * 
 * 
 * @customElement
 * @polymer
 * @appliesMixin OECommonMixin
 * @demo demo/index.html
 */
class OeChart extends OECommonMixin(PolymerElement) {

  static get is() { return 'oe-chart'; }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          position: relative;
          height: 100%;
        }

        .chartContainer.emptyState:before {
          content: attr(message);
          position: absolute;
          top: 43%;
          left: 0;
          text-align: center;
          width: 100%;
          font-size: 18px;
          color: var(--nodata-message-color, --secondary-text-color);
        }

        #errorIcon {
          color: red;
          --iron-icon-width: 20px;
          --iron-icon-height: 20px;
        }

        .error-info {
          position: absolute;
          top: 16px;
          left: 16px;
        }

        .error-info .error-container {
          display: none;
          position: absolute;
          font-size: 12px;
          top: 0px;
          left: 20px;
          color: #FFF;
          background: rgba(0, 0, 0, 0.48);
          padding: 8px;
          white-space: nowrap;
          border-radius: 2px;
          flex-direction: column;
        }

        .error-info:hover .error-container {
          display: flex;
        }

        .error-container .error-msg {
          margin: 2px 0px;
          letter-spacing: 0.5px;
        }

        .chartContainer {
          display: inline-block;
          position: relative;
          width: 100%;
          height: 100%;
          vertical-align: top;
          overflow: hidden;
        }
      </style>
      <div id="[[_renderContainerId]]" message$="[[noDataMessage]]" class$="chartContainer [[_calcClass(data,series,category,hasDataFromSeries)]]">
        <template is="dom-if" if="[[_showErrors(_errors.*)]]">
          <div class="error-info">
            <iron-icon icon="error" id="errorIcon"></iron-icon>
            <div class="error-container">
              <template is="dom-repeat" items="[[_errors]]">
                <label class="error-msg">[[item]]</label>
              </template>
            </div>
          </div>
        </template>
      </div>
    `;
  }

  static get properties() {
    return {

      /**
       * Rendered chart's type.
       * Supported chart types :
       * area, bubble, groupedbar, line, pareto, pie, donut, normalizedstackedcolumn, stackedbar, stackedcolumn, groupedcolumn, and mapview
       * 
       */
      chartType: {
        type: String,
        value: "groupedColumn"
      },

      _renderContainerId: {
        type: String,
        value: function () {
          return 'chart-' + this._getGUID();
        },
        readOnly: true
      },

      /**
       * Data used to render the chart , if dataUrl is provided this property is not needed.
       */
      data: {
        type: Array,
        value: function () {
          return [];
        }
      },
      /**
       * Used to define the x-axis in chart.
       * It accepts a property name from individual elements of provided data.
       */
      category: {
        type: String,
        value: ""
      },

      /**
       * Option for the type of aggregation to be done on the category when the values are of 'date'.
       * Values to be provided are : "year" , "quarter" , "month" or any DateUtil format like 'DD','MM',etc.
       * 
       */
      categoryAggregator: {
        type: String,
        value: function () {
          return null;
        }
      },

      /**
       * Prefix for the label of x-axis
       */
      categorylabelFormat: {
        type: String,
        value: function () {
          return "";
        }
      },

      /**
       * Array of objects specifing how the data is rendered across category.
       * The objects should be of the below structure.
       * 
       * ```
       * {
       *  'property':'country',   //Property of the data to plot
       *  'aggregation':'sum',    //Aggregation done on data for the property
       *  'color':'red'           //Color of the portion of chart representing this data
       * }
       * ```
       * 
       */
      series: {
        type: Array,
        value: function () {
          return [];
        }
      },

      /**
       * Url to be used to fetch the data for the charts.
       */
      dataUrl: {
        type: String,
        value: function () {
          return "";
        },
        observer: '_dataUrlChanged'
      },
      _changeStreamUrl: {
        type: String,
        value: function () {
          return "";
        },
        observer: '_registerChangeStream'
      },

      /**
       * Empty state message when no data is found.
       */
      noDataMessage: {
        type: String,
        value: function () {
          return "No Data Found";
        }
      },
      _drawNew: {
        type: Boolean,
        value: function () {
          return true;
        }
      }
    };
  }

  static get observers() {
    return ['_seriesChanged(series.*)', '_parameterChanged(category,categoryAggregator,chartType)', '_dataChanged(data.*)'];
  }

  connectedCallback() {
    super.connectedCallback();
    this._init();
    this.hasDataFromSeries = false;
  }


  /**
   * Map of aggregation functions for different aggregation types like sum,average,etc
   * @return {Object} Aggregation function map
   */
  get aggregateFunctions() {
    return {
      'sum': function (data) {
        return data.reduce(function (a, b) {
          return a + b;
        });
      },
      'average': function (data) {
        var sum = data.reduce(function (a, b) {
          return a + b;
        });
        return sum / data.length;
      },
      'count': function (data) {
        return data.length;
      }
    };
  }

  /**
   *  Getter to get the chart Type mappings
   *  @return {Object} Chart type map object
   */
  get chartTypes() {
    return {
      'area': 'area',
      'bubble': 'bubble',
      'groupedbar': 'groupedBar',
      'groupedcolumn': 'groupedColumn',
      'line': 'line',
      'normalizedstackedcolumn': 'normalizedStackedColumn',
      'pareto': 'pareto',
      'pie': 'pie',
      'donut': 'donut',
      'stackedbar': 'stackedBar',
      'stackedcolumn': 'stackedColumn',
      'mapview': 'mapview',
    };
  }

  /**
   * Generates a random GUID used to unqiuely identify the chart container
   * @return {string} GUID string
   */
  _getGUID() {
    var randoms = (window.crypto || window.msCrypto).getRandomValues(new Uint32Array(2)); // eslint-disable-line no-undef
    return randoms[0].toString(36).substring(2, 15) +
      randoms[1].toString(36).substring(2, 15);
  }


  _init() {
    this._parameterChanged();
    this._errors = [];
  }

  /**
   * Checks if the chart is to be rendered from 'data' property or fetched from 'series' object,
   * and calls checkrender function.
   */
  _parameterChanged() {
    this.set('_drawNew', true);
    if (this.hasDataFromSeries) {
      this._checkAndRender(this.validSeriesData);
    } else {
      this._checkAndRender(this.data);
    }
  }

  /**
   * Checks for valid data and renders the chart after it is structured for chart.
   * @param {Array} data list of objects to render the chart.
   */
  _checkAndRender(data) {
    if (Array.isArray(data) && data.length === 0 && !this.hasDataFromSeries) {
      return;
    }
    if (this._isDataStructured(data))
      this._render(data);
    else {
      this._render(this._restructureData(data, this.category, this.series));
    }
  }

  /**
   * Validates if the data is a chart configuration.
   * @param {Object} chartData object containing information to render the chart
   */
  _isDataStructured(chartData) {
    if (typeof chartData === 'object') {
      if (chartData.categories && chartData.series && Array.isArray(chartData.categories) && Array.isArray(chartData.series))
        return true;
    }
    return false;
  }

  /**
   * Computes series data from the data and series.
   * @param {array} data list of data to draw chart
   * @param {string} series column to get from row
   * @param {function} aggregation aggregation function applied
   * @return {array} list of computed data after aggregation.
   */
  _getSeriesData(data, series, aggregation) {
    if (!Array.isArray(data)) {
      return Object.keys(data).map(function (k) {
        return data[k];
      }).map(function (d) {
        return d.map(function (e) {
          return parseFloat(e[series]);
        });
      }).map(function (k) {
        return aggregation(k);
      });
    } else {
      return data.map(function (d) {
        return d.map(function (e) {
          return parseFloat(e[series]);
        });
      }).map(function (k) {
        return aggregation(k);
      });
    }

  }

  /**
   * Computes the groups from the list of data
   * @param {array} data array of data to group
   * @param {string} category property to group the data on
   * @param {string} categoryAggregator Aggregator to categorize data.
   * @return {Object} grouped data.
   */
  _getGroups(data, category, categoryAggregator) {
    if (categoryAggregator) {
      var categoryFunction;
      switch (categoryAggregator.toLowerCase()) {
        case 'year':
          categoryFunction = function (rec) {
            return (new Date(rec[category])).getFullYear();
          };
          break;
        case 'quarter':
          categoryFunction = function (rec) {
            return Math.ceil(((new Date(rec[category])).getMonth() + 1) / 3);
          };
          break;
        case 'month':
          categoryFunction = function (rec) {
            return (new Date(rec[category])).getMonth();
          };
          break;
        default:
          categoryFunction = function (rec) {
            return window.OEUtils.dateUtils.format(new Date(rec[category]), categoryAggregator);
          };
          break;
      }
      return this.__groupArray(data, categoryFunction);
    } else {
      return this.__groupArray(data, category);
    }
  }

  /**
   * Groups a array of objects
   * @param {Array} arr array of objects to be grouped
   * @param {string|function} groupCategory property or a function to determine grouping
   * @return {Object} grouped object
   */
  __groupArray(arr, groupCategory) {
    var groupedData = {};
    var groupFn;
    if (typeof groupCategory == "function") {
      groupFn = groupCategory;
    } else {
      groupFn = function (rec) {
        return rec[groupCategory];
      };
    }

    arr.forEach(function (data) {
      var groupedVal = groupFn(data);
      if (!groupedData[groupedVal]) {
        groupedData[groupedVal] = [];
      }
      groupedData[groupedVal].push(data);
    });
    return groupedData;
  }

  /**
   * Executes callback function for every record.
   * @param {array} arr array to repeat items
   * @param {function} cb Function to execute on all rows
   */
  __forEach(arr, cb) {
    if (Array.isArray(arr)) {
      arr.forEach(cb);
    } else if (typeof arr === "object") {
      Object.keys(arr).forEach(function (key) {
        var val = arr[key];
        cb(val, key);
      });
    }
  }

  /**
   * Computes a chart readble format of data.
   * @param {array} data data to be charted
   * @param {Object} category category to calssify
   * @param {array} series array of series information
   * @return {Object} formatted chart information to render.
   */
  _restructureData(data, category, series) {
    if (!data || !category || !series || series.length === 0)
      return;
    var categorylabelFormat = this.categorylabelFormat;
    var groups = this._getGroups(data, category, this.categoryAggregator);
    var categoryData = Object.keys(groups).map(function (d) {
      return {
        "longName": d,
        "name": categorylabelFormat + d,
        "value": d,
        'dimName': d
      };
    });
    var seriesData = series.map(function (d) {
      d.aggregation = d.aggregation || 'sum';
      var aggFunc = this.aggregateFunctions[d.aggregation];
      var newgroup = Object.assign({}, d._dataGroup || groups);
      //newgroup=groups;
      if (d.filter && d.filter !== null) {
        this.__forEach(newgroup, function (value, key) {
          newgroup[key] = newgroup[key].filter(function (data) {
            return data[d.property] === d.filter;
          });
        });
      }
      var data = this._getSeriesData(newgroup, d.property, aggFunc);
      var fmtData = data.map(function (d) {
        return d.toString();
      });
      return {
        "longName": d.longName || d.property,
        "name": d.name || d.property,
        "value": d.name || d.property,
        "data": data,
        "fmtData": fmtData,
        "minValue": {},
        "maxValue": {},
        "axis": null,
        "color": d.color
      };
    }.bind(this));
    var formattedData = {
      categories: categoryData,
      series: seriesData
    };
    return formattedData;
  }

  /**
   * Observer on 'series' to redraw based on series property.
   * If a series object has 'dataUrl' property , fetches data and uses it to render the chart.
   */
  _seriesChanged() {
    if (this.series && this.series.length !== 0) {
      var multiUrl = this.series.every(function (s) {
        return s.dataUrl;
      });
      var self = this;
      if (multiUrl) {
        var validSeries = [];
        this.set('_errors', []);
        var tasks = this.series.map(function (s) {
          var fetchData = function (cb) {
            self.makeAjaxCall(s.dataUrl, 'get', null, null, null, null, function (err, resp) {
              if (resp) {
                s._dataGroup = self._getGroups(resp, s.categoryId || self.category, self.categoryAggregator);
                validSeries.push(s);
                cb(null, { data: resp });
              } else {
                var errorMsg = s.property + ' : ' + self.resolveError(err);
                self.push('_errors', errorMsg);
                cb(null, { err: errorMsg });
              }
            });
          };
          return fetchData;
        });
        var async = window.async;
        async.parallel(tasks, function callback(err, result) {
          if (validSeries.length !== 0) {
            var validResult = result.find(function (d) {
              return d.data;
            });
            self.set('hasDataFromSeries', true);
            self.set('_drawNew', true);
            self.set('validSeriesData', validResult.data);
            setTimeout(function () {
              var data = self._restructureData(validResult.data, self.category, validSeries);
              self._render(data);
            }, 300);
          }
        });
      } else {
        self._parameterChanged();
      }
    }
  }

  /**
   * Observer to render chart when data changes
   */
  _dataChanged() {
    this._checkAndRender(this.data);
  }

  /**
   * Checks if error message should be displayed
   * @return {boolean} flag to display error message
   */
  _showErrors() {
    return (this._errors && this._errors.length !== 0);
  }

  /**
   * Registers a data stream to update the data
   */
  _registerChangeStream() {
    if (!this._changeStreamUrl)
      return;
    var src = new EventSource(this._changeStreamUrl);
    src.addEventListener('data', function (msg) {
      var data = JSON.parse(msg.data);
      data = data.data;
      if (data)
        this.push('data', data);
    }.bind(this));
  }



  /**
   * Renders chart inside the chart container using xCharts
   * @param {Object} data chart information to render
   */
  _render(data) {
    if (!this._isDataStructured(data)) {
      return;
    }
    var container = this.shadowRoot.querySelector('#' + this._renderContainerId);

    var chartOptions = {
      chartClientId: this._renderContainerId,
      chartType: this.chartTypes[this.chartType.toLowerCase()],
      overlap: false,
      chartHost: this.shadowRoot
    };

    if (this._drawNew) {
      this.chart = new XChart(this._renderContainerId, chartOptions);
      this._drawNew = false;
    } else {
      this.chart.setOptions(chartOptions);
    }


    if (container.offsetHeight !== 0 && container.offsetWidth !== 0) {
      this.chart.render(data);
    }
  }

  /**
   * Observer on 'dataUrl' to fetch new data when the property is changed.
   */
  _dataUrlChanged() {
    if (!this.dataUrl)
      return;
    this.makeAjaxCall(this.dataUrl, 'get', null, null, null, null, function (err, resp) {
      if (resp) {
        this.set('data', resp);
      } else {
        var errMsg = this.resolveError(err);
        this.set('_errors', [errMsg]);
      }
    }.bind(this));
  }

  /**
   * Computes the CSS class name for chart container.
   * @param {array} data data to render chart
   * @param {array} series data to group the chart data
   * @param {string} category property to classify chart data
   * @param {boolean} hasDataFromSeries flag denoting to get data from series.
   * @return {string} class name for chart container
   */
  _calcClass(data, series, category, hasDataFromSeries) {
    if (data && data.length === 0 && !hasDataFromSeries) {
      return "emptyState";
    } else if (!category || !series) {
      this.noDataMessage = "Category/Series not found";
      return "emptyState";
    }
    return "";
  }
}

window.customElements.define(OeChart.is, OEAjaxMixin(OeChart));