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
      this.log(yosay('Welcome to the ' + chalk.red('JHipster Continuous Integration Status') + ' Generator! ' + chalk.yellow('v' + packageJson.version + '\n')))
    }
  },
  prompting: function () {
    var done = this.async();

    //TODO: Check if JHipster application contains the gitlab-ci file

    var prompts = [
      {
      type: 'confirm',
      name: 'confirm',
      message: 'Would you like to enable Gitlab Status?',
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
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;
      this.confirm = props.confirm;
      this.gitLabName = props.gitLabName;
      done();
    }.bind(this));
  },
  writing: function () {
    var done = this.async();
    this.baseName = jhipsterVar.baseName;
    this.webappDir = jhipsterVar.webappDir;

    var html = this.fs.read(this.webappDir + '/layouts/navbar/navbar.html');

    var $ = cheerio.load(html);

    var navbar = $('ul.nav.navbar-nav.navbar-right');

    navbar.append(  "<li>\n" +
                        " <a href=\"https://gitlab.com/" +this.gitLabName + "/" + this.baseName + "/commits/master\">\n" +
                            " <img alt=\"build status\" src=\"https://gitlab.com/" + this.gitLabName +"/" + this.baseName + "/badges/master/build.svg\"/> \n" +
                        "</a>\n" +
                    " </li> \n" +
                  "            ");

    this.fs.write(this.webappDir + '/layouts/navbar/navbar.html', $.html());
  }

});


