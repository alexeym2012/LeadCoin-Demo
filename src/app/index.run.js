(function() {
  'use strict';

  angular
    .module('minotaur')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    var unregisterSuccess = $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      event.targetScope.$watch('$viewContentLoaded', function () {
        angular.element('html, body, #content').animate({ scrollTop: 0 }, 200);
      });
      $rootScope.$state.current = toState;
      $rootScope.specialClass = toState.specialClass;
    });
    $rootScope.$on('$destroy', unregisterSuccess);

    var unregisterError = $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireSignIn promise is rejected
      // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
        $state.go("core.login");
      }
    });
    $rootScope.$on('$destroy', unregisterError);
  }

})();
