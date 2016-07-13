(function () {

  'use strict';

  angular
    .module('<%=angularAppName%>')
    .factory('CiStatusService', CiStatusService);

  CiStatusService.$inject = ['$http'];

  function CiStatusService($http) {
    return {
      getStatus: getStatus,
      getLastCommit: getLastCommit
    };

    function getStatus(branch) {
      return $http.get('http://gitlab.com/api/v3/projects/<%=gitLabProjectId%>/repository/commits/' +
        branch + '?private_token=<%=gitLabPrivateToken%>')
        .then(function (response) {
          return response.data.status;
        });
    }

    function getLastCommit(branch) {
      return $http.get('http://gitlab.com/api/v3/projects/<%=gitLabProjectId%>/repository/commits?' +
        'private_token=<%=gitLabPrivateToken%>&ref=' + branch)
        .then(function (response) {
          return response.data[0].short_id;
        });
    }
  }
})();
