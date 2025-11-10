const path = require('path');

exports.config = {
  allScriptsTimeout: 11000,


  specs: [
    //'./src/**/*.e2e-spec.ts', 
    './src/login.e2e-spec.ts',
    './src/dashboard.e2e-spec.ts',
    './src/sources.e2e-spec.ts',
    './src/backGroundJobHistory.e2e-spec.ts',
    './src/medicalHistory.e2e-spec.ts',
    './src/users.e2e-spec.ts',
    './src/labs.e2e-spec.ts'
  ],

  capabilities: {
    browserName: 'chrome',
    args: ['--headless=new', '--disable-notifications', '--disable-dev-shm-usage'],

    chromeOptions: {
      args: [
        //'--headless',              
        '--disable-infobars',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--log-level=3'
      ],
      excludeSwitches: ['enable-logging'],

      prefs: {
        'download.default_directory': path.resolve(__dirname, 'downloads'),
        'download.prompt_for_download': false,
        'download.directory_upgrade': true,
        'plugins.always_open_pdf_externally': true
      }
    }
  },

  chromeDriver: '../chromedriver-win64/chromedriver.exe',

  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () { }
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json')
    });
    const { SpecReporter } = require('jasmine-spec-reporter');
    jasmine.getEnv().addReporter(new SpecReporter());
  }
};
