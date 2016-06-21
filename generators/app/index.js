'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
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
      this.log(yosay('Welcome to the ' + chalk.red('JHipster Continuous Integration Status') + ' Generator! ' + chalk.yellow('v' + packageJson.version + '\n')))
    }
  },
  prompting: function () {
    var done = this.async();

    //TODO: Check if JHipster application contains the gitlab-ci file

    var prompts = [{
      type: 'confirm',
      name: 'confirm',
      message: 'Would you like to enable Gitlab Status?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;
      this.confirm = props.confirm;
      done();
    }.bind(this));
  },
  writing: function () {
    var done = this.async();
  }
});


