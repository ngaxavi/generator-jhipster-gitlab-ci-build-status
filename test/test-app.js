'use strict';
var path = require('path');
var fse = require('fs-extra');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

var deps = [
  [helpers.createDummyGenerator(), 'jhipster:modules']
];

describe('JHipster generator gitlab-ci-build-status', function () {
  describe('simple test', function () {
    before(function (done) {
      helpers
        .run(path.join( __dirname, '../generators/app'))
        .inTmpDir(function (dir) {
          fse.copySync(path.join(__dirname, '../test/templates/default'), dir)
        })
        .withOptions({
          testmode: true
        })
        .withPrompts({
          projectName: 'projectTest',
          gitLabName: 'ngaxavi',
          gitLabProjectId:  '6464616',
          gitLabPrivateToken:  'JGukj7wbp-496sUcscG'
        })
        .withGenerators(deps)
        .on('end', done);
    });

    it('generate  file', function () {
      assert.file([
        'ci-status.controller.js',
        'ci-status.service.js',
        'main.css',
        'index.html'
      ]);
    });
  });
});
