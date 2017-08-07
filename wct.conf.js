/* ©2015-2016 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
The Program may contain/reference third party or open source components, the rights to which continue to 
remain with the applicable third party licensors or the open source community as the case may be and nothing 
here transfers the rights to the third party and open source components, except as expressly permitted. 
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program,or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law. */
module.exports = {
  testTimeout: 60 * 1000,
  plugins: {
    sauce: {
      disabled: true
    },
    local: {
      browsers: ['chrome']
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
        '/test/**/*.html',
        '/test/**/*.js',
        '/countries/*.js'
      ]
      // ,
      // thresholds: {
      // global: {
      // lines: 40,
      // statements: 40,
      // functions: 40,
      // branches: 40
      // }
      // }
    }
  }
}