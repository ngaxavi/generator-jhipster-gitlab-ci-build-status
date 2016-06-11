"use strict";

var yeoman = require("yeoman-generator");
var chalk = require("chalk");
var yosay = require("yosay");

module.exports = yeoman.Base.extend({
    templates: function(args) {
        this.composeWith('jhipster:modules', {
            options: {
                jhipsterVar: jhipsterVar,
                jhipsterFunc: jhipsterFunc
            }
        });
    },
    prompting: function () {
        var done = this.async();

        this.log(yosay("Welcome to the " + chalk.red('JHipster CI Gitlab Status') + "generator!"))
    }
});


