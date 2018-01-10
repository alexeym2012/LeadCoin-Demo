(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('ForgotpassController', ForgotpassController);

  /** @ngInject */
  function ForgotpassController(currentAuth, Auth, $log, $state, toastr) {
    var vm = this;

    vm.currentAuth = currentAuth;

    //redirect if user is logged in
    if (vm.currentAuth) {
      $state.go('dashboard', {}, {reload: true});
    }

    vm.submit = function() {
      Auth.$sendPasswordResetEmail(vm.email)
        .then(function() {
          $log.log("Password reset email sent successfully");
          toastr.success('Your password has been reseted, check your email', 'Password reset!');
          $state.go('core.login', {}, {reload: true});
        }, function(error) {
          $log.log("Error sending password reset email:", error);
          toastr.error(error.code, 'Reset Error!');
        });
    };
  }

})();
