'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var cheerio = require('cheerio');
var packageJson = require(__dirname + '/../../package.json');

// stores JHipster variables
var jhipsterVar = {moduleName: 'ciStatus'};

// stores JHipster functions
var jhipsterFunc = {};

module.exports = yeoman.Base.extend({
  initializing: {
    templates: function (args) {
      this.composeWith('jhipster:modules', {
        options: {
          jhipsterVar: jhipsterVar,
          jhipsterFunc: jhipsterFunc
        }
      });
    },
    displayLogo: function () {
      this.log(yosay('Welcome to the ' + chalk.red('JHipster Build Status in GitLab') + ' Generator! ' + chalk.yellow('v' + packageJson.version + '\n')))
    }
  },
  prompting: function () {
    var done = this.async();

    //TODO: Check if JHipster application contains the gitlab-ci file

    var prompts = [
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Would you like to enable GitLab\'s build status into your application?',
        default: true
      },
      {
        type: 'input',
        name: 'gitLabName',
        validate: function (input) {
          if (/^([a-zA-Z0-9_]*)$/.test(input) && input != '') return true;
          return 'Your username is mandatory, cannot contain special characters or a blank space';
        },
        store: true,
        message: 'What is your GitLab username?'
      },
      {
        type: 'input',
        name: 'gitLabProjectId',
        validate: function (input) {
          if (/^([0-9]*)$/.test(input) && input != '') return true;
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

      done();
    }.bind(this));
  },
  writing: function () {
    var done = this.async();
    this.baseName = jhipsterVar.baseName;
    this.webappDir = jhipsterVar.webappDir;
    this.angularAppName = jhipsterVar.angularAppName;

    this.confirm = this.props.confirm;
    this.gitLabName = this.props.gitLabName;
    this.gitLabProjectId = this.props.gitLabProjectId;
    this.gitLabPrivateToken = this.props.gitLabPrivateToken;

    this.template('src/main/webapp/app/ci-status/_ci-status.service.js', this.webappDir + '/app/ci-status/ci-status.service.js');
    jhipsterFunc.addJavaScriptToIndex('app/ci-status/ci-status.service.js');
    this.template('src/main/webapp/app/ci-status/_ci-status.controller.js', this.webappDir + '/app/ci-status/ci-status.controller.js');
    jhipsterFunc.addJavaScriptToIndex('app/ci-status/ci-status.controller.js');


    // style for ci
    var ciStatusStyle = '.status-circle {\n' +
      '   display: inline-block;\n' +
      '   height: 11px;\n' +
      '   width: 11px;\n' +
      '   text-indent: -9999px;\n'+
      '   margin-right: 5px;\n'+
      '   border-radius: 100px;\n'+
      '   vertical-align: middle;\n'+
      '}\n\n'+

      '#ci-status {\n'+
      '   position: relative;\n'+
      '   float: right;\n'+
      '   bottom: 35px;\n'+
      '}\n\n'+

      '.status-circle {\n' +
      '   &.success {\n'+
      '     background: #39aa56;\n'+
      '   }\n'+
      '   &.running {\n'+
      '     background: #e75e40;\n'+
      '   }\n'+
      '   &.failed {\n'+
      '     background: #d22852;\n'+
      '   }\n'+
      '}\n\n' +

    '.ci-link {\n'+
    '   display: inline-block;\n'+
    '   vertical-align: middle;\n'+
    '   color: #666;\n'+
    '   text-decoration: none;\n'+
    '}\n\n'+

    '.ci-content {\n'+
    '   padding: 0;\n'+
    '   margin: 0;\n'+
    '   list-style: none;\n'+
    '}';

    jhipsterFunc.addMainCSSStyle(true, ciStatusStyle, 'Add sign in style for build status');


    var html = this.fs.read(this.webappDir + '/index.html');
    var $ = cheerio.load(html);
    var footer = $('.footer');
    if(footer.find('#ci-status').length == 0) {
      footer.append("    <div ng-controller=\"CiStatusController as vm\" id=\"ci-status\">\n" +
        "                    <div class=\"ci-name\">GitLab CI Status</div>\n" +
        "                         <ul class=\"ci-content\">\n" +
        "                             <div class=\"status-circle\" ng-class=\"vm.status\">\n" +
        "                                   <a class=\"ci-link\" href=\"http://gitlab.com/" + this.gitLabName +  "/" + this.baseName + "\">GitLab CI</a>\n" +
        "                             </div>\n" +
        "                         </ul>\n" +
        "                </div>\n" +
        "            ");
    }

    this.fs.write(this.webappDir + '/index.html', $.html());

    done();
  },
  install: function () {
    var injectJsFilesToIndex = function () {
      this.log('\n' + chalk.bold.green('Running gulp Inject to add javascript to index\n'));
      this.spawnCommand('gulp', ['inject']);
    };
    if (!this.options['skip-install'] && !this.skipClient) {
      injectJsFilesToIndex.call(this);
    }
  }
});


