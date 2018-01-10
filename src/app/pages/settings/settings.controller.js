(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('SettingsController', SettingsController);

  /** @ngInject */
  function SettingsController(firebase, $firebaseObject, toastr) {
    var vm = this;

    // General database variable
    var ref = firebase.database().ref();
    vm.settings = $firebaseObject(ref.child('settings'));
    //////////////////////////// *General database variable

    vm.save = function(){
      vm.settings.$save().then(function(){
        toastr.success('Settings has been updated.', 'Settings Saved!');
      });
    };

  }

})();
