(function () {
  'use strict';

  angular
    .module('<%=angularAppName%>')
    .controller('CiStatusController', CiStatusController);

  CiStatusController.$inject = ['$interval', 'CiStatusService'];

  function CiStatusController($interval, CiStatusService) {
    var vm = this;

    getStatus('master');

    // if the status is running
    // check every minute if the build is finished
    var intervalRunning = $interval(buildStatus, 60000);

    function buildStatus() {
      if (vm.status === undefined || angular.equals(vm.status, "running")) {
        getStatus('master');
      } else {
        $interval.cancel(intervalRunning);
      }
    }

    // get build status for the last commit
    function getStatus(branch) {
      //  get the current/ last commit
      CiStatusService.getLastCommit(branch).then(function (lastCommitSha) {
        // the found commit sha use to retrieve it buildStatus
        CiStatusService.getStatus(lastCommitSha).then(function (status) {
          vm.status = status;
        });
      });
    }
  }
})();
