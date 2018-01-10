(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($translate, Auth, $firebaseObject, firebase) {
    var vm = this;

    vm.auth = Auth;

    // any time auth state changes, add the user data to scope
    vm.auth.$onAuthStateChanged(function(firebaseUser) {
      if (firebaseUser) {
        vm.settings = $firebaseObject(firebase.database().ref().child('settings'));
        vm.currentUser = $firebaseObject(firebase.database().ref().child('users').child(firebaseUser.uid));
      }
      vm.firebaseUser = firebaseUser;
    });



    vm.changeLanguage = function (langKey) {
      $translate.use(langKey);
      vm.currentLanguage = langKey;
    };
    vm.currentLanguage = $translate.proposedLanguage() || $translate.use();
  }
})();
