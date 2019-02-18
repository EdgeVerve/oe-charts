/* ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to 
remain with the applicable third party licensors or the open source community as the case may be and nothing 
here transfers the rights to the third party and open source components, except as expressly permitted. 
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program,or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law. */

let browser = process.env.BROWSER || 'chrome';
let browsers = [];
browsers.push(browser);

module.exports = {
  verbose: true,
  testTimeout: 2 * 60 * 1000,
  plugins: {
    sauce: {
      disabled: true
    },
    local: {
      browsers: browsers
    },
    istanbul: {
      dir: './coverage',
      reporters: ['text-summary', 'lcov'],
      include: [
        '/**/*.js',
        '/**/*.html'
      ],
      exclude: [
        '/bower_components/**/*.html',
        '/bower_components/**/*.js',
        '/coverage/**/*.html',
        '/coverage/**/*.js',
        '/node_modules/**/*.html',
        '/node_modules/**/*.js',
        '/test/**/*.html',
        '/test/**/*.js',
        '/scripts/*.js'
      ],
      thresholds: {
        global: {
          statements: 80
        }
      }
    }
  }
};
