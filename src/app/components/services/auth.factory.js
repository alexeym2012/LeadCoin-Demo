(function() {
  'use strict';

  angular
    .module('minotaur')
    .factory('Auth', Auth);

  /** @ngInject */
  function Auth($firebaseAuth) {
    return $firebaseAuth();
  }

})();
