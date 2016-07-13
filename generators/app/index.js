'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var cheerio = require('cheerio');
var yosay = require('yosay');
var packagejs = require(__dirname + '/../../package.json');

// Stores JHipster variables
var jhipsterVar = {moduleName: 'gitlab-ci-build-status'};

// Stores JHipster functions
var jhipsterFunc = {};

module.exports = yeoman.Base.extend({

  initializing: {
    compose: function (args) {
      this.composeWith('jhipster:modules',
        {
          options: {
            jhipsterVar: jhipsterVar,
            jhipsterFunc: jhipsterFunc
          }
        }
      );
    },
    displayLogo: function () {
      this.log(yosay('Welcome to the ' + chalk.red('JHipster build status in GitLab') + ' generator! ' + chalk.yellow('v' + packagejs.version + '\n')));
    }
  },

  prompting: function () {
    var done = this.async();
    var prompts = [
      {
        type: 'input',
        name: 'gitLabName',
        validate: function (input) {
          if (/^([a-zA-Z0-9_]*)$/.test(input) && input !== '') return true;
          return 'Your username is mandatory, cannot contain special characters or a blank space';
        },
        store: true,
        message: 'What is your GitLab\'s username?'
      },
      {
        type: 'input',
        name: 'gitLabProjectId',
        validate: function (input) {
          if (/^([0-9]*)$/.test(input) && input !== '') return true;
          return 'Your Project\'s id is mandatory, cannot contain characters, special characters or a blank space';
        },
        message: 'What is your Project\'s id in GitLab?'
      },
      {
        type: 'input',
        name: 'gitLabPrivateToken',
        store: true,
        message: 'What is your GitLab private Token?'
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      this.gitLabName = props.gitLabName;
      this.gitLabProjectId = props.gitLabProjectId;
      this.gitLabPrivateToken = props.gitLabPrivateToken;
      done();
    }.bind(this));
  },

  writing: {
    setupGlobalVar: function () {
      this.webappDir = jhipsterVar.webappDir;
      this.angularAppName = jhipsterVar.angularAppName;
      this.authenticationType = jhipsterVar.authenticationType;
      this.useSass = jhipsterVar.useSass;

      this.baseName = jhipsterVar.baseName;
      // if the name contains special characters
      // this can occur when the repository firstly was created
      if (path.basename(process.cwd()) !== jhipsterVar.baseName) {
        this.baseName = path.basename(process.cwd());
      }

    },

    writeClientFiles: function () {
      this.template('src/main/webapp/app/components/ci-status/_ci-status.service.js', this.webappDir + '/app/components/ci-status/ci-status.service.js', this, {});
      this.template('src/main/webapp/app/components/ci-status/_ci-status.controller.js', this.webappDir + '/app/components/ci-status/ci-status.controller.js', this, {});

      if(this.authenticationType === 'oauth2' || this.authenticationType === 'jwt') {
        this.template('src/main/webapp/app/blocks/interceptor/_ci-status.interceptor.js', this.webappDir + '/app/blocks/interceptor/ci-status.interceptor.js', this, {});
      }
    },

    updateClientFiles: function () {
      if(this.authenticationType === 'oauth2' || jhipsterVar.authenticationType === 'jwt'){
        jhipsterFunc.addAngularJsInterceptor('CiStatusInterceptor');
      }

      // style for ci
      var ciStatusStyle = '.status-circle {\n' +
        '   display: inline-block;\n' +
        '   height: 11px;\n' +
        '   width: 11px;\n' +
        '   text-indent: -9999px;\n' +
        '   margin-right: 5px;\n' +
        '   border-radius: 100px;\n' +
        '   vertical-align: middle;\n' +
        '}\n\n' +

        '#ci-status {\n' +
        '   position: relative;\n' +
        '   float: right;\n' +
        '   bottom: 35px;\n' +
        '}\n\n' +

        '.status-circle.success {\n' +
        '     background: #39aa56;\n' +
        '}\n\n' +

        '.status-circle.running {\n' +
        '     background: #e75e40;\n' +
        '}\n\n' +

        '.status-circle.failed {\n' +
        ' background: #d22852;\n' +
        '}\n\n' +

        '.ci-link {\n' +
        '   display: inline-block;\n' +
        '   vertical-align: middle;\n' +
        '   color: #666;\n' +
        '   text-decoration: none;\n' +
        '}\n\n' +

        '.ci-content {\n' +
        '   padding: 0;\n' +
        '   margin: 0;\n' +
        '   list-style: none;\n' +
        '}';

      jhipsterFunc.addMainCSSStyle(this.useSass, ciStatusStyle, 'Add sign in style for build status');

      var html = this.fs.read(this.webappDir + '/index.html');
      var $ = cheerio.load(html);
      var footer = $('.footer');
      if (footer.find('#ci-status').length === 0) {
        footer.append("    <div ng-controller=\"CiStatusController as vm\" id=\"ci-status\">\n" +
          "                    <div class=\"ci-name\">GitLab CI Status</div>\n" +
          "                         <ul class=\"ci-content\">\n" +
          "                             <div class=\"status-circle\" ng-class=\"vm.status\"></div>\n" +
          "                             <a class=\"ci-link\" href=\"http://gitlab.com/" + this.gitLabName + "/" + this.baseName + "\">GitLab CI</a>\n" +
          "                         </ul>\n" +
          "                </div>\n" +
          "            ");
      }

      this.fs.write(this.webappDir + '/index.html', $.html());
    }
  },

  install: function () {
    var injectJsFilesToIndex = function () {
      this.log('\n' + chalk.bold.green('Running gulp Inject to add javascript to index\n'));
      this.spawnCommand('gulp', ['inject']);
    };
    if (!this.options['skip-install'] && !this.skipClient) {
      injectJsFilesToIndex.call(this);
    }
  },

  end: function () {
    this.log(yosay('Yo!! you can see the build status on your application. \n' +
                  'When pushing your code just reload the page to see the current build status'));
  }
});
