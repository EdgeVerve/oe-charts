# \<oe-chart\>

A template element , used to create oe-ui Polymer 3 elements

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

The below command generates a JSON file that polymer reads to create documentation. This JSON is created based on the JSDoc comments present in the file provided.

```
$polymer analyze oe-chart.js > analysis.json
```

Once analysis.json is created run the below command to serve the file. Optional parameter `--open` to launch browser.
```
$ polymer serve [--open]
```

## Running Tests
Once the files are served using `polymer serve` navigating to `\test` runs the test files

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
