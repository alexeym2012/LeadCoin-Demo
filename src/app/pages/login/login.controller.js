(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController(currentAuth, Auth, $log, $state, toastr) {
    var vm = this;

    toastr.success('demo@tattek.sk, pass: minotaur', 'Login default data!', {progressBar: true, timeOut: '15000'});

    vm.currentAuth = currentAuth;

    //redirect if user is logged in
    if (vm.currentAuth) {
      $state.go('dashboard', {}, {reload: true});
    }

    vm.login = function() {
      vm.error = null;
      Auth.$signInWithEmailAndPassword(vm.email, vm.password)
        .then(function(authData) {
          $log.log("Authenticated successfully with payload:", authData);
          $state.go('dashboard', {}, {reload: true});
        }, function(err) {
          vm.err = err;
          toastr.error(vm.err.message, 'Login Failed!');
          $log.log("Login Failed!", err);
        });
    };
  }

})();
