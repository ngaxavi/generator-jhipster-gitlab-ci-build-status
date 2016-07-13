(function () {
  'use strict';

  angular
    .module('<%=angularAppName%>')
    .factory('CiStatusInterceptor', ciStatusInterceptor);

  function ciStatusInterceptor() {
    var service = {
      request: request
    };

    return service;

    function request(config) {
      config.headers = config.headers || {};
      // exclude gitlab url
      if (config.url.indexOf('gitlab.com/api') !== -1) {
      <%if (authenticationType === 'oauth2') {%>
          delete config.headers['Authorization'];
        <%}%>
      <%if (authenticationType === 'xauth') { %>
          delete config.headers['x-auth-token'];
        <%}%>
      <%if (authenticationType === 'jwt') { %>
          delete config.headers.Authorization;
        <%}%>
      }
      return config;
    }
  }
})();
